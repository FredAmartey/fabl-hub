import { Queue, QueueOptions } from 'bullmq';
import { FastifyInstance } from 'fastify';
export interface QueueConfig {
    name: string;
    options?: QueueOptions;
}
export declare const QUEUES: {
    readonly VIDEO_PROCESSING: "video-processing";
    readonly MODERATION: "moderation";
    readonly ANALYTICS: "analytics";
    readonly NOTIFICATIONS: "notifications";
};
export type QueueName = typeof QUEUES[keyof typeof QUEUES];
declare class QueueManager {
    private queues;
    getQueue<T = any>(name: QueueName): Queue<T>;
    closeAll(): Promise<void>;
}
export declare const queueManager: QueueManager;
export declare const queuePlugin: (fastify: FastifyInstance) => Promise<void>;
declare module 'fastify' {
    interface FastifyInstance {
        queues: {
            videoProcessing: Queue;
            moderation: Queue;
            analytics: Queue;
            notifications: Queue;
        };
    }
}
export {};
