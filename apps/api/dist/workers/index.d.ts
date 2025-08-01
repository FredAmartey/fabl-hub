import { Worker } from 'bullmq';
import { FastifyInstance } from 'fastify';
export interface WorkerContext {
    fastify: FastifyInstance;
    workerId: string;
}
export declare function startWorkers(fastify: FastifyInstance): Promise<Worker<any, any, string>[]>;
export * from './types';
