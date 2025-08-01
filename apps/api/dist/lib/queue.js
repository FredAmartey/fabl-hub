"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queuePlugin = exports.queueManager = exports.QUEUES = void 0;
const bullmq_1 = require("bullmq");
const connection = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD,
};
// Define all queues
exports.QUEUES = {
    VIDEO_PROCESSING: 'video-processing',
    MODERATION: 'moderation',
    ANALYTICS: 'analytics',
    NOTIFICATIONS: 'notifications',
};
class QueueManager {
    constructor() {
        this.queues = new Map();
    }
    getQueue(name) {
        if (!this.queues.has(name)) {
            const queue = new bullmq_1.Queue(name, {
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
            });
            this.queues.set(name, queue);
        }
        return this.queues.get(name);
    }
    async closeAll() {
        await Promise.all(Array.from(this.queues.values()).map(queue => queue.close()));
    }
}
exports.queueManager = new QueueManager();
// Fastify plugin
const queuePlugin = async (fastify) => {
    fastify.decorate('queues', {
        videoProcessing: exports.queueManager.getQueue(exports.QUEUES.VIDEO_PROCESSING),
        moderation: exports.queueManager.getQueue(exports.QUEUES.MODERATION),
        analytics: exports.queueManager.getQueue(exports.QUEUES.ANALYTICS),
        notifications: exports.queueManager.getQueue(exports.QUEUES.NOTIFICATIONS),
    });
    fastify.addHook('onClose', async () => {
        await exports.queueManager.closeAll();
    });
};
exports.queuePlugin = queuePlugin;
