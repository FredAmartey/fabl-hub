import { Worker } from 'bullmq';
import { FastifyInstance } from 'fastify';
export declare function analyticsAggregator(fastify: FastifyInstance): Promise<Worker>;
