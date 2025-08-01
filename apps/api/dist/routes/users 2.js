"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typebox_1 = require("@sinclair/typebox");
const userRoutes = async (fastify) => {
    // Get current user profile
    fastify.get('/me', {
        schema: {
            response: {
                200: typebox_1.Type.Object({
                    id: typebox_1.Type.String(),
                    email: typebox_1.Type.String(),
                    name: typebox_1.Type.String(),
                    username: typebox_1.Type.String(),
                    avatarUrl: typebox_1.Type.Optional(typebox_1.Type.String()),
                    channelName: typebox_1.Type.Optional(typebox_1.Type.String()),
                    subscriberCount: typebox_1.Type.Number(),
                    isVerified: typebox_1.Type.Boolean(),
                    createdAt: typebox_1.Type.String(),
                    updatedAt: typebox_1.Type.String()
                })
            }
        }
    }, async (request, reply) => {
        const userId = fastify.requireAuth(request);
        const user = await fastify.db.user.findUnique({
            where: { id: userId }
        });
        if (!user) {
            return reply.status(404).send({ error: 'User not found' });
        }
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            username: user.username,
            avatarUrl: user.avatarUrl,
            channelName: user.channelName,
            subscriberCount: user.subscriberCount,
            isVerified: user.isVerified,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString()
        };
    });
    // Update user profile
    fastify.put('/me', {
        schema: {
            body: typebox_1.Type.Object({
                name: typebox_1.Type.Optional(typebox_1.Type.String()),
                channelName: typebox_1.Type.Optional(typebox_1.Type.String())
            }),
            response: {
                200: typebox_1.Type.Object({
                    id: typebox_1.Type.String(),
                    email: typebox_1.Type.String(),
                    name: typebox_1.Type.String(),
                    username: typebox_1.Type.String(),
                    avatarUrl: typebox_1.Type.Optional(typebox_1.Type.String()),
                    channelName: typebox_1.Type.Optional(typebox_1.Type.String()),
                    subscriberCount: typebox_1.Type.Number(),
                    isVerified: typebox_1.Type.Boolean(),
                    createdAt: typebox_1.Type.String(),
                    updatedAt: typebox_1.Type.String()
                })
            }
        }
    }, async (request, reply) => {
        const userId = fastify.requireAuth(request);
        const { name, channelName } = request.body;
        const user = await fastify.db.user.update({
            where: { id: userId },
            data: {
                ...(name && { name }),
                ...(channelName && { channelName })
            }
        });
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            username: user.username,
            avatarUrl: user.avatarUrl,
            channelName: user.channelName,
            subscriberCount: user.subscriberCount,
            isVerified: user.isVerified,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString()
        };
    });
    // Get user by username/id
    fastify.get('/:identifier', {
        schema: {
            params: typebox_1.Type.Object({
                identifier: typebox_1.Type.String()
            }),
            response: {
                200: typebox_1.Type.Object({
                    id: typebox_1.Type.String(),
                    name: typebox_1.Type.String(),
                    username: typebox_1.Type.String(),
                    avatarUrl: typebox_1.Type.Optional(typebox_1.Type.String()),
                    channelName: typebox_1.Type.Optional(typebox_1.Type.String()),
                    subscriberCount: typebox_1.Type.Number(),
                    isVerified: typebox_1.Type.Boolean(),
                    createdAt: typebox_1.Type.String()
                })
            }
        }
    }, async (request, reply) => {
        const { identifier } = request.params;
        const user = await fastify.db.user.findFirst({
            where: {
                OR: [
                    { id: identifier },
                    { username: identifier }
                ]
            },
            select: {
                id: true,
                name: true,
                username: true,
                avatarUrl: true,
                channelName: true,
                subscriberCount: true,
                isVerified: true,
                createdAt: true
            }
        });
        if (!user) {
            return reply.status(404).send({ error: 'User not found' });
        }
        return {
            id: user.id,
            name: user.name,
            username: user.username,
            avatarUrl: user.avatarUrl,
            channelName: user.channelName,
            subscriberCount: user.subscriberCount,
            isVerified: user.isVerified,
            createdAt: user.createdAt.toISOString()
        };
    });
};
exports.default = userRoutes;
