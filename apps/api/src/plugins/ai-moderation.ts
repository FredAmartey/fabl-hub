import fp from 'fastify-plugin'
import { FastifyPluginAsync } from 'fastify'
import { AIModerationService } from '../services/ai-moderation'

declare module 'fastify' {
  interface FastifyInstance {
    aiModeration: AIModerationService
  }
}

const aiModerationPlugin: FastifyPluginAsync = async (fastify) => {
  const moderationService = new AIModerationService(fastify, {
    // Configuration can be overridden via environment variables
    aiDetectionThreshold: process.env.AI_DETECTION_THRESHOLD 
      ? parseFloat(process.env.AI_DETECTION_THRESHOLD) 
      : 0.3,
    nsfwThreshold: process.env.NSFW_THRESHOLD 
      ? parseFloat(process.env.NSFW_THRESHOLD) 
      : 0.8,
    violenceThreshold: process.env.VIOLENCE_THRESHOLD 
      ? parseFloat(process.env.VIOLENCE_THRESHOLD) 
      : 0.8,
    hateThreshold: process.env.HATE_THRESHOLD 
      ? parseFloat(process.env.HATE_THRESHOLD) 
      : 0.9,
    selfHarmThreshold: process.env.SELF_HARM_THRESHOLD 
      ? parseFloat(process.env.SELF_HARM_THRESHOLD) 
      : 0.9,
  })

  fastify.decorate('aiModeration', moderationService)
  
  fastify.log.info('AI Moderation service initialized')
}

export default fp(aiModerationPlugin, {
  name: 'ai-moderation',
  dependencies: ['db', 'cache'],
})