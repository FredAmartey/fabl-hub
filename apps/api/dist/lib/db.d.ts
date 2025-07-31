import { FastifyPluginAsync } from 'fastify';
import { PrismaClient } from '@fabl/db';
declare module 'fastify' {
    interface FastifyInstance {
        db: PrismaClient;
    }
}
declare const dbPlugin: FastifyPluginAsync;
export { dbPlugin };
