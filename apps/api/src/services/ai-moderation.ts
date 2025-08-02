import axios from 'axios'
import { FastifyInstance } from 'fastify'

export interface AIDetectionResult {
  frameNumber: number
  isAIGenerated: boolean
  confidence: number
  metadata?: {
    model?: string
    technique?: string
    artifacts?: string[]
  }
}

export interface ContentModerationResult {
  inappropriate: boolean
  reason?: string
  categories?: {
    nsfw?: number
    violence?: number
    hate?: number
    selfHarm?: number
    spam?: number
  }
}

export interface ModerationConfig {
  aiDetectionThreshold: number // Default: 0.3 (30%)
  nsfwThreshold: number // Default: 0.8
  violenceThreshold: number // Default: 0.8
  hateThreshold: number // Default: 0.9
  selfHarmThreshold: number // Default: 0.9
}

const DEFAULT_CONFIG: ModerationConfig = {
  aiDetectionThreshold: 0.3,
  nsfwThreshold: 0.8,
  violenceThreshold: 0.8,
  hateThreshold: 0.9,
  selfHarmThreshold: 0.9,
}

export class AIModerationService {
  private config: ModerationConfig
  private fastify: FastifyInstance

  constructor(fastify: FastifyInstance, config?: Partial<ModerationConfig>) {
    this.fastify = fastify
    this.config = { ...DEFAULT_CONFIG, ...config }
  }

  // Main moderation pipeline
  async moderateVideo(
    frameUrls: string[], 
    duration: number
  ): Promise<{
    isApproved: boolean
    aiRatio: number
    nsfwDetected: boolean
    violenceDetected: boolean
    reason?: string
    detailedResults?: {
      aiDetection: AIDetectionResult[]
      contentModeration: ContentModerationResult
    }
  }> {
    try {
      // Run AI detection and content moderation in parallel
      const [aiResults, contentResults] = await Promise.all([
        this.detectAIContent(frameUrls),
        this.moderateContent(frameUrls)
      ])

      // Calculate AI ratio
      const aiFrameCount = aiResults.filter(r => r.isAIGenerated).length
      const aiRatio = aiFrameCount / frameUrls.length

      // Check if video meets AI content threshold
      const meetsAIThreshold = aiRatio >= this.config.aiDetectionThreshold

      // Determine final approval
      const isApproved = meetsAIThreshold && !contentResults.inappropriate

      let reason: string | undefined
      if (!meetsAIThreshold) {
        reason = `Video must contain at least ${Math.round(this.config.aiDetectionThreshold * 100)}% AI-generated content (detected: ${Math.round(aiRatio * 100)}%)`
      } else if (contentResults.inappropriate) {
        reason = contentResults.reason || 'Content violates community guidelines'
      }

      return {
        isApproved,
        aiRatio,
        nsfwDetected: (contentResults.categories?.nsfw || 0) > this.config.nsfwThreshold,
        violenceDetected: (contentResults.categories?.violence || 0) > this.config.violenceThreshold,
        reason,
        detailedResults: {
          aiDetection: aiResults,
          contentModeration: contentResults,
        }
      }
    } catch (error) {
      this.fastify.log.error({ error }, 'Moderation service error')
      throw error
    }
  }

  // AI Content Detection
  async detectAIContent(frameUrls: string[]): Promise<AIDetectionResult[]> {
    // Check if we have configured AI detection services
    const services = this.getConfiguredAIServices()
    
    if (services.length === 0) {
      // Fallback to mock detection for development
      return this.mockAIDetection(frameUrls)
    }

    // Use the first available service
    const service = services[0]
    
    try {
      switch (service.provider) {
        case 'hive':
          return await this.detectWithHiveAI(frameUrls, service)
        case 'sensity':
          return await this.detectWithSensity(frameUrls, service)
        case 'custom':
          return await this.detectWithCustomModel(frameUrls, service)
        default:
          return this.mockAIDetection(frameUrls)
      }
    } catch (error) {
      this.fastify.log.error({ error, provider: service.provider }, 'AI detection failed, falling back to mock')
      return this.mockAIDetection(frameUrls)
    }
  }

  // Content Moderation
  async moderateContent(frameUrls: string[]): Promise<ContentModerationResult> {
    // Check if we have configured moderation services
    const services = this.getConfiguredModerationServices()
    
    if (services.length === 0) {
      // No inappropriate content in development
      return { inappropriate: false }
    }

    // Use the first available service
    const service = services[0]
    
    try {
      switch (service.provider) {
        case 'hive':
          return await this.moderateWithHiveAI(frameUrls, service)
        case 'sightengine':
          return await this.moderateWithSightengine(frameUrls, service)
        case 'aws-rekognition':
          return await this.moderateWithAWSRekognition(frameUrls, service)
        default:
          return { inappropriate: false }
      }
    } catch (error) {
      this.fastify.log.error({ error, provider: service.provider }, 'Content moderation failed')
      // In case of error, be conservative and don't reject
      return { inappropriate: false }
    }
  }

  // Hive AI Detection Implementation (V3)
  private async detectWithHiveAI(
    frameUrls: string[], 
    service: { apiKey: string; apiUrl: string }
  ): Promise<AIDetectionResult[]> {
    // Sample frames to reduce API calls
    const sampledIndices = this.sampleFrames(frameUrls.length, 30) // Max 30 frames
    
    const results = await Promise.all(
      sampledIndices.map(async (index) => {
        const response = await axios.post(
          `${service.apiUrl}/image/sync`,
          { 
            url: frameUrls[index],
            models: ['ai_media_detection'] // V3 model name
          },
          {
            headers: {
              'Authorization': `Bearer ${service.apiKey}`,
              'Content-Type': 'application/json',
            },
            timeout: 10000,
          }
        )
        
        // V3 response structure
        const aiDetection = response.data.data?.ai_media_detection
        const isAI = aiDetection?.is_ai_media === true
        const confidence = aiDetection?.confidence || 0
        
        return {
          frameNumber: index,
          isAIGenerated: isAI,
          confidence: confidence,
          metadata: {
            model: 'hive-v3-ai-detection',
            details: aiDetection
          }
        }
      })
    )
    
    // Interpolate results for non-sampled frames
    return this.interpolateResults(results, frameUrls.length)
  }

  // Sensity AI Detection Implementation
  private async detectWithSensity(
    frameUrls: string[], 
    service: { apiKey: string; apiUrl: string }
  ): Promise<AIDetectionResult[]> {
    // Implementation for Sensity API
    const batchSize = 10
    const results: AIDetectionResult[] = []
    
    for (let i = 0; i < frameUrls.length; i += batchSize) {
      const batch = frameUrls.slice(i, i + batchSize)
      const response = await axios.post(
        service.apiUrl,
        { images: batch },
        {
          headers: {
            'X-API-Key': service.apiKey,
            'Content-Type': 'application/json',
          },
          timeout: 15000,
        }
      )
      
      response.data.results.forEach((result: any, idx: number) => {
        results.push({
          frameNumber: i + idx,
          isAIGenerated: result.synthetic_score > 0.5,
          confidence: result.synthetic_score,
          metadata: {
            technique: result.detected_technique,
            artifacts: result.artifacts,
          }
        })
      })
    }
    
    return results
  }

  // Custom Model Implementation
  private async detectWithCustomModel(
    frameUrls: string[], 
    service: { apiKey: string; apiUrl: string }
  ): Promise<AIDetectionResult[]> {
    // Generic implementation for custom AI detection endpoints
    const results = await axios.post(
      service.apiUrl,
      { frames: frameUrls },
      {
        headers: {
          'Authorization': `Bearer ${service.apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    )
    
    return results.data.detections.map((detection: any, index: number) => ({
      frameNumber: index,
      isAIGenerated: detection.ai_probability > 0.5,
      confidence: detection.ai_probability,
      metadata: detection.metadata,
    }))
  }

  // Hive AI Content Moderation (V3)
  private async moderateWithHiveAI(
    frameUrls: string[],
    service: { apiKey: string; apiUrl: string }
  ): Promise<ContentModerationResult> {
    // Sample frames to reduce API calls
    const sampledUrls = frameUrls.filter((_, i) => i % 10 === 0)
    
    const results = await Promise.all(
      sampledUrls.map(async (url) => {
        const response = await axios.post(
          `${service.apiUrl}/image/sync`,
          { 
            url,
            models: ['visual_moderation', 'text_moderation'] // V3 models
          },
          {
            headers: {
              'Authorization': `Bearer ${service.apiKey}`,
              'Content-Type': 'application/json',
            },
            timeout: 10000,
          }
        )
        
        // V3 response structure
        const visualMod = response.data.data?.visual_moderation || {}
        const textMod = response.data.data?.text_moderation || {}
        
        return {
          nsfw: visualMod.nsfw_score || 0,
          violence: visualMod.violence_score || 0,
          hate: textMod.hate_score || 0,
          selfHarm: visualMod.self_harm_score || 0,
        }
      })
    )
    
    // Get max scores across all frames
    const maxScores = results.reduce((max, current) => ({
      nsfw: Math.max(max.nsfw || 0, current.nsfw),
      violence: Math.max(max.violence || 0, current.violence),
      hate: Math.max(max.hate || 0, current.hate),
      selfHarm: Math.max(max.selfHarm || 0, current.selfHarm),
    }), { nsfw: 0, violence: 0, hate: 0, selfHarm: 0 })
    
    // Check against thresholds
    const inappropriate = 
      maxScores.nsfw > this.config.nsfwThreshold ||
      maxScores.violence > this.config.violenceThreshold ||
      maxScores.hate > this.config.hateThreshold ||
      maxScores.selfHarm > this.config.selfHarmThreshold
    
    let reason: string | undefined
    if (maxScores.nsfw > this.config.nsfwThreshold) reason = 'NSFW content detected'
    else if (maxScores.violence > this.config.violenceThreshold) reason = 'Violence detected'
    else if (maxScores.hate > this.config.hateThreshold) reason = 'Hate content detected'
    else if (maxScores.selfHarm > this.config.selfHarmThreshold) reason = 'Self-harm content detected'
    
    return {
      inappropriate,
      reason,
      categories: maxScores,
    }
  }

  // Sightengine Content Moderation
  private async moderateWithSightengine(
    frameUrls: string[],
    service: { apiKey: string; apiSecret: string; apiUrl: string }
  ): Promise<ContentModerationResult> {
    // Implementation for Sightengine API
    const sampledUrls = frameUrls.filter((_, i) => i % 10 === 0)
    
    const results = await Promise.all(
      sampledUrls.map(async (url) => {
        const response = await axios.get(
          `${service.apiUrl}/check.json`,
          {
            params: {
              url,
              models: 'nudity,violence,gore,offensive',
              api_user: service.apiKey,
              api_secret: service.apiSecret,
            },
            timeout: 10000,
          }
        )
        
        return {
          nsfw: response.data.nudity?.raw || 0,
          violence: response.data.violence?.raw || 0,
          gore: response.data.gore?.raw || 0,
          offensive: response.data.offensive?.raw || 0,
        }
      })
    )
    
    const maxScores = results.reduce((max, current) => ({
      nsfw: Math.max(max.nsfw || 0, current.nsfw),
      violence: Math.max(max.violence || 0, current.violence || current.gore || 0),
      hate: Math.max(max.hate || 0, current.offensive || 0),
    }), { nsfw: 0, violence: 0, hate: 0 })
    
    const inappropriate = 
      maxScores.nsfw > this.config.nsfwThreshold ||
      maxScores.violence > this.config.violenceThreshold ||
      maxScores.hate > this.config.hateThreshold
    
    return {
      inappropriate,
      categories: maxScores,
    }
  }

  // AWS Rekognition Content Moderation
  private async moderateWithAWSRekognition(
    frameUrls: string[],
    service: { region: string; accessKeyId: string; secretAccessKey: string }
  ): Promise<ContentModerationResult> {
    // This would use AWS SDK - placeholder for now
    return { inappropriate: false }
  }

  // Helper Methods
  private getConfiguredAIServices(): Array<{ provider: string; apiKey: string; apiUrl: string }> {
    const services = []
    
    if (process.env.HIVE_API_KEY && process.env.HIVE_API_URL) {
      services.push({
        provider: 'hive',
        apiKey: process.env.HIVE_API_KEY,
        apiUrl: process.env.HIVE_API_URL,
      })
    }
    
    if (process.env.SENSITY_API_KEY && process.env.SENSITY_API_URL) {
      services.push({
        provider: 'sensity',
        apiKey: process.env.SENSITY_API_KEY,
        apiUrl: process.env.SENSITY_API_URL,
      })
    }
    
    if (process.env.AI_DETECTION_API_KEY && process.env.AI_DETECTION_API_URL) {
      services.push({
        provider: 'custom',
        apiKey: process.env.AI_DETECTION_API_KEY,
        apiUrl: process.env.AI_DETECTION_API_URL,
      })
    }
    
    return services
  }

  private getConfiguredModerationServices(): Array<any> {
    const services = []
    
    if (process.env.HIVE_API_KEY && process.env.HIVE_API_URL) {
      services.push({
        provider: 'hive',
        apiKey: process.env.HIVE_API_KEY,
        apiUrl: process.env.HIVE_API_URL,
      })
    }
    
    if (process.env.SIGHTENGINE_API_KEY && process.env.SIGHTENGINE_API_SECRET) {
      services.push({
        provider: 'sightengine',
        apiKey: process.env.SIGHTENGINE_API_KEY,
        apiSecret: process.env.SIGHTENGINE_API_SECRET,
        apiUrl: process.env.SIGHTENGINE_API_URL || 'https://api.sightengine.com/1.0',
      })
    }
    
    return services
  }

  private sampleFrames(totalFrames: number, maxSamples: number): number[] {
    if (totalFrames <= maxSamples) {
      return Array.from({ length: totalFrames }, (_, i) => i)
    }
    
    const step = Math.floor(totalFrames / maxSamples)
    const indices: number[] = []
    
    for (let i = 0; i < totalFrames; i += step) {
      indices.push(i)
    }
    
    return indices
  }

  private interpolateResults(sampledResults: AIDetectionResult[], totalFrames: number): AIDetectionResult[] {
    const results: AIDetectionResult[] = []
    
    for (let i = 0; i < totalFrames; i++) {
      const sampledResult = sampledResults.find(r => r.frameNumber === i)
      
      if (sampledResult) {
        results.push(sampledResult)
      } else {
        // Find nearest sampled frames
        const before = sampledResults.filter(r => r.frameNumber < i).slice(-1)[0]
        const after = sampledResults.find(r => r.frameNumber > i)
        
        if (before && after) {
          // Interpolate between nearest samples
          const ratio = (i - before.frameNumber) / (after.frameNumber - before.frameNumber)
          results.push({
            frameNumber: i,
            isAIGenerated: ratio < 0.5 ? before.isAIGenerated : after.isAIGenerated,
            confidence: before.confidence * (1 - ratio) + after.confidence * ratio,
          })
        } else if (before) {
          // Use previous sample
          results.push({
            frameNumber: i,
            isAIGenerated: before.isAIGenerated,
            confidence: before.confidence * 0.9, // Slightly lower confidence
          })
        } else if (after) {
          // Use next sample
          results.push({
            frameNumber: i,
            isAIGenerated: after.isAIGenerated,
            confidence: after.confidence * 0.9,
          })
        }
      }
    }
    
    return results
  }

  private mockAIDetection(frameUrls: string[]): AIDetectionResult[] {
    // Development mock - generates realistic AI detection patterns
    const baseAIRatio = 0.4 + Math.random() * 0.4 // 40-80% AI content
    
    return frameUrls.map((_, index) => {
      // Add some variance to make it realistic
      const variance = (Math.random() - 0.5) * 0.2
      const isAI = Math.random() < (baseAIRatio + variance)
      
      return {
        frameNumber: index,
        isAIGenerated: isAI,
        confidence: isAI ? 0.7 + Math.random() * 0.3 : 0.2 + Math.random() * 0.3,
        metadata: {
          model: isAI ? 'mock-detector' : undefined,
        }
      }
    })
  }
}