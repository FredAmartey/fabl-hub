import { Worker, Job } from 'bullmq'
import { FastifyInstance } from 'fastify'
import { NotificationJob, JobStatus } from './types'
import { QUEUES } from '../lib/queue'
import { NotificationType, EntityType } from '@fabl/types'

export async function notificationWorker(fastify: FastifyInstance): Promise<Worker> {
  const worker = new Worker<NotificationJob>(
    QUEUES.NOTIFICATIONS,
    async (job: Job<NotificationJob>) => {
      const { type, userId, data } = job.data
      
      try {
        fastify.log.info({ type, userId }, 'Processing notification')
        
        // Map job type to notification type
        let notificationType: NotificationType
        switch (type) {
          case 'video_ready':
            notificationType = NotificationType.UPLOAD
            break
          case 'video_failed':
            notificationType = NotificationType.UPLOAD
            break
          case 'new_comment':
            notificationType = NotificationType.COMMENT
            break
          case 'new_subscriber':
            notificationType = NotificationType.SUBSCRIBE
            break
          default:  
            notificationType = NotificationType.UPLOAD
        }
        
        // Create notification in database
        const notification = await fastify.db.notification.create({
          data: {
            userId,
            type: notificationType,
            actorId: data.actorId || userId,
            entityId: data.entityId || '',
            entityType: (data.entityType?.toUpperCase() || 'VIDEO') as EntityType,
            message: data.message,
            read: false,
          },
        })
        
        // Send real-time notification via WebSocket if available
        // This would integrate with a WebSocket server
        if (fastify.websocket) {
          await fastify.websocket.sendToUser(userId, {
            type: 'notification',
            data: {
              id: notification.id,
              type: notification.type,
              message: notification.message,
              createdAt: notification.createdAt,
              entityId: notification.entityId,
              entityType: notification.entityType,
            },
          })
        }
        
        // Send push notification if user has enabled them
        // This would integrate with a push notification service
        if (process.env.PUSH_NOTIFICATION_SERVICE) {
          await sendPushNotification(userId, {
            title: data.title || 'Fabl Notification',
            body: data.message,
            data: {
              notificationId: notification.id,
              entityId: data.entityId,
              entityType: data.entityType,
            },
          })
        }
        
        // Send email notification for important events
        if (shouldSendEmail(type)) {
          await fastify.queues.notifications.add(
            'send-email',
            {
              userId,
              subject: data.title || 'Fabl Notification',
              template: getEmailTemplate(type),
              data: {
                message: data.message,
                entityId: data.entityId,
                entityType: data.entityType,
              },
            },
            {
              delay: 5000, // Delay email by 5 seconds
              priority: 2,
            }
          )
        }
        
        fastify.log.info({ notificationId: notification.id }, 'Notification created')
        
        return {
          status: JobStatus.COMPLETED,
          data: { notificationId: notification.id },
        }
      } catch (error) {
        fastify.log.error({ error, type, userId }, 'Notification processing failed')
        throw error
      }
    },
    {
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
        password: process.env.REDIS_PASSWORD,
      },
      concurrency: 20,
    }
  )

  // Handle email sending as a separate job type
  worker.on('completed', (job) => {
    if (job.name === 'send-email') {
      fastify.log.info({ jobId: job.id }, 'Email notification sent')
    }
  })

  return worker
}

function shouldSendEmail(type: string): boolean {
  // Only send emails for important notifications
  return ['video_ready', 'video_failed', 'moderation_complete'].includes(type)
}

function getEmailTemplate(type: string): string {
  const templates: Record<string, string> = {
    video_ready: 'video-published',
    video_failed: 'video-failed',
    moderation_complete: 'moderation-result',
    new_subscriber: 'new-subscriber',
  }
  return templates[type] || 'default-notification'
}

async function sendPushNotification(
  userId: string,
  notification: { title: string; body: string; data?: any }
): Promise<void> {
  // Placeholder for push notification service integration
  // This would integrate with services like Firebase Cloud Messaging or OneSignal
  
  if (process.env.FCM_SERVER_KEY) {
    try {
      // const userTokens = await getUserPushTokens(userId)
      // await fcm.sendMulticast({
      //   tokens: userTokens,
      //   notification: {
      //     title: notification.title,
      //     body: notification.body,
      //   },
      //   data: notification.data,
      // })
    } catch (error) {
      console.error('Push notification failed:', error)
    }
  }
}

// Add WebSocket support to Fastify (placeholder)
declare module 'fastify' {
  interface FastifyInstance {
    websocket?: {
      sendToUser: (userId: string, data: any) => Promise<void>
    }
  }
}