import { Worker } from 'bullmq';
import { FastifyInstance } from 'fastify';
export declare function videoProcessor(fastify: FastifyInstance): Promise<Worker>;
