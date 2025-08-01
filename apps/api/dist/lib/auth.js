"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authPlugin = void 0;
const error_1 = __importDefault(require("@fastify/error"));
const fastify_1 = require("@clerk/fastify");
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const authPlugin = (0, fastify_plugin_1.default)(async (fastify) => {
    // Register Clerk plugin
    await fastify.register(fastify_1.clerkPlugin, {
        secretKey: process.env.CLERK_SECRET_KEY || '',
        publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || ''
    });
    // Add userAuth decorator to request
    fastify.decorateRequest('userAuth', null);
    // Pre-handler to extract auth from Clerk
    fastify.addHook('preHandler', async (request) => {
        const auth = (0, fastify_1.getAuth)(request);
        request.userAuth = {
            userId: auth.userId || null,
            sessionId: auth.sessionId || null,
            orgId: auth.orgId || null,
            orgRole: auth.orgRole || null,
            orgSlug: auth.orgSlug || null
        };
        // Add userId to request for logging
        if (auth.userId) {
            request.userId = auth.userId;
        }
    });
    // Helper to require authentication
    fastify.decorate('requireAuth', (request) => {
        if (!request.userAuth.userId) {
            const UnauthorizedError = (0, error_1.default)('UNAUTHORIZED', 'Authentication required', 401);
            throw new UnauthorizedError();
        }
        return request.userAuth.userId;
    });
});
exports.authPlugin = authPlugin;
