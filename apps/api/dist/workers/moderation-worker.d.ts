import { Worker } from 'bullmq';
import { FastifyInstance } from 'fastify';
export declare function moderationWorker(fastify: FastifyInstance): Promise<Worker>;
