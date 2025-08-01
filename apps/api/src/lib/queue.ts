import { Queue, QueueOptions, ConnectionOptions } from 'bullmq'
import { FastifyInstance } from 'fastify'

export interface QueueConfig {
  name: string
  options?: QueueOptions
}

const connection: ConnectionOptions = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  password: process.env.REDIS_PASSWORD,
}

// Define all queues
export const QUEUES = {
  VIDEO_PROCESSING: 'video-processing',
  MODERATION: 'moderation',
  ANALYTICS: 'analytics',
  NOTIFICATIONS: 'notifications',
} as const

export type QueueName = typeof QUEUES[keyof typeof QUEUES]

class QueueManager {
  private queues: Map<string, Queue> = new Map()
  
  getQueue<T = any>(name: QueueName): Queue<T> {
    if (!this.queues.has(name)) {
      const queue = new Queue<T>(name, {
        connection,
        defaultJobOptions: {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 2000,
          },
          removeOnComplete: {
            age: 3600, // Keep completed jobs for 1 hour
            count: 100, // Keep last 100 completed jobs
          },
          removeOnFail: {
            age: 24 * 3600, // Keep failed jobs for 24 hours
          },
        },
      })
      this.queues.set(name, queue)
    }
    return this.queues.get(name)!
  }
  
  async closeAll() {
    await Promise.all(
      Array.from(this.queues.values()).map(queue => queue.close())
    )
  }
}

export const queueManager = new QueueManager()

// Fastify plugin
export const queuePlugin = async (fastify: FastifyInstance) => {
  fastify.decorate('queues', {
    videoProcessing: queueManager.getQueue(QUEUES.VIDEO_PROCESSING),
    moderation: queueManager.getQueue(QUEUES.MODERATION),
    analytics: queueManager.getQueue(QUEUES.ANALYTICS),
    notifications: queueManager.getQueue(QUEUES.NOTIFICATIONS),
  })
  
  fastify.addHook('onClose', async () => {
    await queueManager.closeAll()
  })
}

// TypeScript module augmentation
declare module 'fastify' {
  interface FastifyInstance {
    queues: {
      videoProcessing: Queue
      moderation: Queue
      analytics: Queue
      notifications: Queue
    }
  }
}