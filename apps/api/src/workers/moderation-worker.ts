import { Worker, Job } from 'bullmq'
import { FastifyInstance } from 'fastify'
import { ModerationJob, JobStatus } from './types'
import { QUEUES } from '../lib/queue'
import { AIModerationService } from '../services/ai-moderation'


export async function moderationWorker(fastify: FastifyInstance): Promise<Worker> {
  // Initialize moderation service
  const moderationService = new AIModerationService(fastify)
  
  const worker = new Worker<ModerationJob>(
    QUEUES.MODERATION,
    async (job: Job<ModerationJob>) => {
      const { videoId, muxAssetId, muxPlaybackId, duration, creatorId } = job.data
      
      try {
        fastify.log.info({ videoId, muxAssetId }, 'Starting video moderation')
        
        // Step 1: Extract frames for AI detection (1 fps)
        const frameCount = Math.min(duration, 300) // Max 300 frames (5 minutes)
        const frameUrls: string[] = []
        
        for (let i = 0; i < frameCount; i++) {
          frameUrls.push(
            `https://image.mux.com/${muxPlaybackId}/thumbnail.jpg?width=640&height=360&time=${i}`
          )
        }
        
        // Step 2: Run moderation pipeline
        const moderationResult = await moderationService.moderateVideo(frameUrls, duration)
        const { isApproved, aiRatio, reason } = moderationResult
        const moderationStatus = isApproved ? 'APPROVED' : 'REJECTED'
        
        // Step 3: Update video status
        await fastify.db.video.update({
          where: { id: videoId },
          data: {
            aiRatio,
            isApproved,
            status: isApproved ? 'PUBLISHED' : 'DRAFT',
            publishedAt: isApproved ? new Date() : null,
          },
        })
        
        // Step 4: Create moderation log with detailed results
        await fastify.db.moderationLog.create({
          data: {
            videoId,
            status: moderationStatus,
            reason: reason || null,
            aiScore: aiRatio,
          },
        })
        
        // Step 5: Send notification
        const notificationType = isApproved ? 'video_ready' : 'video_failed'
        const notificationMessage = isApproved
          ? 'Your video has been approved and is now live!'
          : reason || 'Video did not meet approval criteria'
        
        await fastify.queues.notifications.add('send-notification', {
          type: notificationType,
          userId: creatorId,
          data: {
            title: isApproved ? 'Video Published!' : 'Video Not Approved',
            message: notificationMessage,
            entityId: videoId,
            entityType: 'video',
          },
        })
        
        fastify.log.info({ videoId, isApproved, aiRatio }, 'Video moderation completed')
        
        return {
          status: JobStatus.COMPLETED,
          data: {
            videoId,
            isApproved,
            aiRatio,
            moderationStatus,
            reason: reason || undefined,
          },
        }
      } catch (error) {
        fastify.log.error({ error, videoId }, 'Video moderation failed')
        
        // Update video status to need review
        await fastify.db.video.update({
          where: { id: videoId },
          data: { status: 'DRAFT' },
        })
        
        throw error
      }
    },
    {
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
        password: process.env.REDIS_PASSWORD,
      },
      concurrency: 3, // Limit concurrent moderation jobs
    }
  )

  worker.on('completed', (job) => {
    fastify.log.info({ jobId: job.id, videoId: job.data.videoId }, 'Moderation job completed')
  })

  worker.on('failed', (job, err) => {
    fastify.log.error({ jobId: job?.id, error: err }, 'Moderation job failed')
  })

  return worker
}

