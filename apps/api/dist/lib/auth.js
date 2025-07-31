"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authPlugin = void 0;
const fastify_1 = require("@clerk/fastify");
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const authPlugin = (0, fastify_plugin_1.default)(async (fastify) => {
    // Register Clerk plugin
    await fastify.register(fastify_1.clerkPlugin, {
        secretKey: fastify.config.CLERK_SECRET_KEY,
        publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
    });
    // Add userAuth decorator to request
    fastify.decorateRequest('userAuth', null);
    // Pre-handler to extract auth from Clerk
    fastify.addHook('preHandler', async (request) => {
        const auth = (0, fastify_1.getAuth)(request);
        request.userAuth = {
            userId: auth.userId,
            sessionId: auth.sessionId,
            orgId: auth.orgId,
            orgRole: auth.orgRole,
            orgSlug: auth.orgSlug
        };
    });
    // Helper to require authentication
    fastify.decorate('requireAuth', (request) => {
        if (!request.userAuth.userId) {
            throw fastify.httpErrors.unauthorized('Authentication required');
        }
        return request.userAuth.userId;
    });
});
exports.authPlugin = authPlugin;
