import { FastifyPluginAsync } from 'fastify'
import { Type } from '@sinclair/typebox'

declare module 'fastify' {
  interface FastifyRequest {
    user?: {
      id: string
      email?: string
    }
  }
}

const moderationRoutes: FastifyPluginAsync = async (fastify) => {
  // Get moderation status for a video
  fastify.get<{
    Params: { videoId: string }
  }>('/api/videos/:videoId/moderation', {
    schema: {
      params: Type.Object({
        videoId: Type.String()
      }),
      response: {
        200: Type.Object({
          videoId: Type.String(),
          status: Type.String(),
          aiRatio: Type.Number(),
          isApproved: Type.Boolean(),
          logs: Type.Array(Type.Object({
            id: Type.String(),
            status: Type.String(),
            reason: Type.Optional(Type.String()),
            aiScore: Type.Number(),
            createdAt: Type.String()
          }))
        }),
        404: Type.Object({
          error: Type.String()
        })
      }
    },
    preHandler: [fastify.requireAuth]
  }, async (request, reply) => {
    const { videoId } = request.params
    const userId = request.user?.id

    // Verify the user owns the video
    const video = await fastify.db.video.findFirst({
      where: {
        id: videoId,
        creatorId: userId
      },
      include: {
        moderationLogs: {
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!video) {
      return reply.code(404).send({ error: 'Video not found' })
    }

    return {
      videoId: video.id,
      status: video.status,
      aiRatio: video.aiRatio || 0,
      isApproved: video.isApproved,
      logs: video.moderationLogs.map(log => ({
        id: log.id,
        status: log.status,
        reason: log.reason || undefined,
        aiScore: log.aiScore || 0,
        createdAt: log.createdAt.toISOString()
      }))
    }
  })

  // Manually trigger re-moderation (admin only or limited usage)
  fastify.post<{
    Params: { videoId: string }
  }>('/api/videos/:videoId/moderate', {
    schema: {
      params: Type.Object({
        videoId: Type.String()
      }),
      response: {
        200: Type.Object({
          message: Type.String(),
          jobId: Type.String()
        }),
        404: Type.Object({
          error: Type.String()
        }),
        429: Type.Object({
          error: Type.String()
        })
      }
    },
    preHandler: [fastify.requireAuth]
  }, async (request, reply) => {
    const { videoId } = request.params
    const userId = request.user?.id

    // Check rate limit for re-moderation (1 per video per hour)
    const cacheKey = `remoderation:${videoId}`
    const recentRemoderation = await fastify.cache.get(cacheKey)
    
    if (recentRemoderation) {
      return reply.code(429).send({ 
        error: 'Video was recently moderated. Please wait before trying again.' 
      })
    }

    // Verify the user owns the video
    const video = await fastify.db.video.findFirst({
      where: {
        id: videoId,
        creatorId: userId
      },
      select: {
        id: true,
        muxAssetId: true,
        muxPlaybackId: true,
        duration: true,
        creatorId: true
      }
    })

    if (!video) {
      return reply.code(404).send({ error: 'Video not found' })
    }

    if (!video.muxAssetId || !video.muxPlaybackId) {
      return reply.code(400).send({ error: 'Video processing not complete' })
    }

    // Add to moderation queue
    const job = await fastify.queues.moderation.add('moderate-video', {
      videoId: video.id,
      muxAssetId: video.muxAssetId,
      muxPlaybackId: video.muxPlaybackId,
      duration: video.duration,
      creatorId: video.creatorId,
      isRemoderation: true
    })

    // Set rate limit
    await fastify.cache.set(cacheKey, Date.now(), { ttl: 3600 }) // 1 hour

    return {
      message: 'Video queued for re-moderation',
      jobId: job.id || 'pending'
    }
  })

  // Get AI moderation configuration (public)
  fastify.get('/api/moderation/config', {
    schema: {
      response: {
        200: Type.Object({
          aiDetectionThreshold: Type.Number(),
          supportedServices: Type.Array(Type.String()),
          guidelines: Type.Object({
            aiContent: Type.String(),
            prohibited: Type.Array(Type.String())
          })
        })
      }
    }
  }, async (_request, _reply) => {
    const threshold = process.env.AI_DETECTION_THRESHOLD 
      ? parseFloat(process.env.AI_DETECTION_THRESHOLD) 
      : 0.3

    const services = []
    if (process.env.HIVE_API_KEY) services.push('hive')
    if (process.env.SENSITY_API_KEY) services.push('sensity')
    if (process.env.SIGHTENGINE_API_KEY) services.push('sightengine')
    if (process.env.AI_DETECTION_API_KEY) services.push('custom')
    
    // If no services configured, we're using mock detection
    if (services.length === 0) services.push('mock-development')

    return {
      aiDetectionThreshold: threshold,
      supportedServices: services,
      guidelines: {
        aiContent: `Videos must contain at least ${Math.round(threshold * 100)}% AI-generated content`,
        prohibited: [
          'NSFW content',
          'Violence or gore',
          'Hate speech',
          'Self-harm content',
          'Spam or misleading content'
        ]
      }
    }
  })
}

export default moderationRoutes