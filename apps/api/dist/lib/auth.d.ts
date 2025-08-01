import { FastifyPluginAsync } from 'fastify';
declare module 'fastify' {
    interface FastifyRequest {
        userAuth: {
            userId: string | null;
            sessionId: string | null;
            orgId: string | null;
            orgRole: string | null;
            orgSlug: string | null;
        };
    }
    interface FastifyInstance {
        requireAuth: (request: FastifyRequest) => string;
    }
}
declare const authPlugin: FastifyPluginAsync;
export { authPlugin };
