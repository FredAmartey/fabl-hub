"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationWorker = notificationWorker;
const bullmq_1 = require("bullmq");
const types_1 = require("./types");
const queue_1 = require("../lib/queue");
const types_2 = require("@fabl/types");
async function notificationWorker(fastify) {
    const worker = new bullmq_1.Worker(queue_1.QUEUES.NOTIFICATIONS, async (job) => {
        const { type, userId, data } = job.data;
        try {
            fastify.log.info({ type, userId }, 'Processing notification');
            // Map job type to notification type
            let notificationType;
            switch (type) {
                case 'video_ready':
                    notificationType = types_2.NotificationType.UPLOAD;
                    break;
                case 'video_failed':
                    notificationType = types_2.NotificationType.UPLOAD;
                    break;
                case 'new_comment':
                    notificationType = types_2.NotificationType.COMMENT;
                    break;
                case 'new_subscriber':
                    notificationType = types_2.NotificationType.SUBSCRIBE;
                    break;
                default:
                    notificationType = types_2.NotificationType.UPLOAD;
            }
            // Create notification in database
            const notification = await fastify.db.notification.create({
                data: {
                    userId,
                    type: notificationType,
                    actorId: data.actorId || userId,
                    entityId: data.entityId || '',
                    entityType: (data.entityType?.toUpperCase() || 'VIDEO'),
                    message: data.message,
                    read: false,
                },
            });
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
                });
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
                });
            }
            // Send email notification for important events
            if (shouldSendEmail(type)) {
                await fastify.queues.notifications.add('send-email', {
                    userId,
                    subject: data.title || 'Fabl Notification',
                    template: getEmailTemplate(type),
                    data: {
                        message: data.message,
                        entityId: data.entityId,
                        entityType: data.entityType,
                    },
                }, {
                    delay: 5000, // Delay email by 5 seconds
                    priority: 2,
                });
            }
            fastify.log.info({ notificationId: notification.id }, 'Notification created');
            return {
                status: types_1.JobStatus.COMPLETED,
                data: { notificationId: notification.id },
            };
        }
        catch (error) {
            fastify.log.error({ error, type, userId }, 'Notification processing failed');
            throw error;
        }
    }, {
        connection: {
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT || '6379', 10),
            password: process.env.REDIS_PASSWORD,
        },
        concurrency: 20,
    });
    // Handle email sending as a separate job type
    worker.on('completed', (job) => {
        if (job.name === 'send-email') {
            fastify.log.info({ jobId: job.id }, 'Email notification sent');
        }
    });
    return worker;
}
function shouldSendEmail(type) {
    // Only send emails for important notifications
    return ['video_ready', 'video_failed', 'moderation_complete'].includes(type);
}
function getEmailTemplate(type) {
    const templates = {
        video_ready: 'video-published',
        video_failed: 'video-failed',
        moderation_complete: 'moderation-result',
        new_subscriber: 'new-subscriber',
    };
    return templates[type] || 'default-notification';
}
async function sendPushNotification(userId, notification) {
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
        }
        catch (error) {
            console.error('Push notification failed:', error);
        }
    }
}
