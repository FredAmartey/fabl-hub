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
}
declare const authPlugin: FastifyPluginAsync;
export { authPlugin };
