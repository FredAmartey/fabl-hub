import { Worker } from 'bullmq';
import { FastifyInstance } from 'fastify';
export declare function notificationWorker(fastify: FastifyInstance): Promise<Worker>;
declare module 'fastify' {
    interface FastifyInstance {
        websocket?: {
            sendToUser: (userId: string, data: any) => Promise<void>;
        };
    }
}
