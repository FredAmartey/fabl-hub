import { Worker } from 'bullmq'
import { FastifyInstance } from 'fastify'
import { videoProcessor } from './video-processor'
import { moderationWorker } from './moderation-worker'
import { analyticsAggregator } from './analytics-aggregator'
import { notificationWorker } from './notification-worker'

export interface WorkerContext {
  fastify: FastifyInstance
  workerId: string
}

export async function startWorkers(fastify: FastifyInstance) {
  const workers: Worker[] = []
  
  // Video Processing Worker
  workers.push(await videoProcessor(fastify))
  
  // Moderation Worker
  workers.push(await moderationWorker(fastify))
  
  // Analytics Aggregator
  workers.push(await analyticsAggregator(fastify))
  
  // Notification Worker
  workers.push(await notificationWorker(fastify))
  
  fastify.log.info(`Started ${workers.length} workers`)
  
  // Graceful shutdown
  process.on('SIGTERM', async () => {
    fastify.log.info('Shutting down workers...')
    await Promise.all(workers.map(worker => worker.close()))
  })
  
  return workers
}

export * from './types'