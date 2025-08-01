"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typebox_1 = require("@sinclair/typebox");
const studioRoutes = async (fastify) => {
    // Get creator's videos with filters
    fastify.get('/videos', {
        schema: {
            querystring: typebox_1.Type.Object({
                page: typebox_1.Type.Optional(typebox_1.Type.String({ pattern: '^[0-9]+$' })),
                limit: typebox_1.Type.Optional(typebox_1.Type.String({ pattern: '^[0-9]+$' })),
                status: typebox_1.Type.Optional(typebox_1.Type.String()),
                search: typebox_1.Type.Optional(typebox_1.Type.String()),
                orderBy: typebox_1.Type.Optional(typebox_1.Type.String()),
                order: typebox_1.Type.Optional(typebox_1.Type.String())
            }),
            response: {
                200: typebox_1.Type.Object({
                    data: typebox_1.Type.Array(typebox_1.Type.Object({
                        id: typebox_1.Type.String(),
                        title: typebox_1.Type.String(),
                        description: typebox_1.Type.Optional(typebox_1.Type.String()),
                        thumbnailUrl: typebox_1.Type.Optional(typebox_1.Type.String()),
                        duration: typebox_1.Type.Number(),
                        views: typebox_1.Type.Number(),
                        likes: typebox_1.Type.Number(),
                        comments: typebox_1.Type.Number(),
                        status: typebox_1.Type.String(),
                        monetizationEnabled: typebox_1.Type.Boolean(),
                        publishedAt: typebox_1.Type.Optional(typebox_1.Type.String()),
                        createdAt: typebox_1.Type.String(),
                        analytics: typebox_1.Type.Optional(typebox_1.Type.Object({
                            impressions: typebox_1.Type.Number(),
                            clickThroughRate: typebox_1.Type.Number(),
                            avgViewDuration: typebox_1.Type.Number()
                        }))
                    })),
                    meta: typebox_1.Type.Object({
                        page: typebox_1.Type.Number(),
                        limit: typebox_1.Type.Number(),
                        total: typebox_1.Type.Number(),
                        totalPages: typebox_1.Type.Number(),
                        hasMore: typebox_1.Type.Boolean()
                    })
                })
            }
        }
    }, async (request) => {
        const userId = fastify.requireAuth(request);
        const query = request.query;
        const page = parseInt(query.page || '1', 10);
        const limit = Math.min(parseInt(query.limit || '20', 10), 100);
        const skip = (page - 1) * limit;
        const { status, search, orderBy = 'createdAt', order = 'desc' } = query;
        const where = { creatorId: userId };
        if (status && status !== 'all') {
            where.status = status.toUpperCase();
        }
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
            ];
        }
        const [videos, total] = await Promise.all([
            fastify.db.video.findMany({
                where,
                include: {
                    _count: {
                        select: {
                            likes: true,
                            comments: true
                        }
                    },
                    analytics: {
                        orderBy: { date: 'desc' },
                        take: 1
                    }
                },
                orderBy: { [orderBy]: order },
                skip,
                take: limit
            }),
            fastify.db.video.count({ where })
        ]);
        return {
            data: videos.map(video => ({
                id: video.id,
                title: video.title,
                description: video.description,
                thumbnailUrl: video.thumbnailUrl,
                duration: video.duration,
                views: video.views,
                likes: video._count.likes,
                comments: video._count.comments,
                status: video.status,
                monetizationEnabled: video.monetizationEnabled,
                publishedAt: video.publishedAt?.toISOString(),
                createdAt: video.createdAt.toISOString(),
                analytics: video.analytics[0] ? {
                    impressions: video.analytics[0].views * 10, // Estimate
                    clickThroughRate: 0.1, // 10% CTR estimate
                    avgViewDuration: video.analytics[0].avgViewDuration
                } : undefined
            })),
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasMore: page * limit < total
            }
        };
    });
    // Get single video details
    fastify.get('/videos/:id', {
        schema: {
            params: typebox_1.Type.Object({
                id: typebox_1.Type.String()
            }),
            response: {
                200: typebox_1.Type.Object({
                    id: typebox_1.Type.String(),
                    title: typebox_1.Type.String(),
                    description: typebox_1.Type.Optional(typebox_1.Type.String()),
                    thumbnailUrl: typebox_1.Type.Optional(typebox_1.Type.String()),
                    videoUrl: typebox_1.Type.String(),
                    muxPlaybackId: typebox_1.Type.Optional(typebox_1.Type.String()),
                    duration: typebox_1.Type.Number(),
                    views: typebox_1.Type.Number(),
                    likes: typebox_1.Type.Number(),
                    comments: typebox_1.Type.Number(),
                    status: typebox_1.Type.String(),
                    monetizationEnabled: typebox_1.Type.Boolean(),
                    aiRatio: typebox_1.Type.Optional(typebox_1.Type.Number()),
                    isApproved: typebox_1.Type.Boolean(),
                    publishedAt: typebox_1.Type.Optional(typebox_1.Type.String()),
                    createdAt: typebox_1.Type.String(),
                    tags: typebox_1.Type.Optional(typebox_1.Type.Array(typebox_1.Type.String())),
                    moderationLog: typebox_1.Type.Optional(typebox_1.Type.Object({
                        status: typebox_1.Type.String(),
                        reason: typebox_1.Type.Optional(typebox_1.Type.String()),
                        aiScore: typebox_1.Type.Optional(typebox_1.Type.Number()),
                        createdAt: typebox_1.Type.String()
                    }))
                })
            }
        }
    }, async (request, reply) => {
        const userId = fastify.requireAuth(request);
        const { id } = request.params;
        const video = await fastify.db.video.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        likes: true,
                        comments: true
                    }
                },
                moderationLogs: {
                    orderBy: { createdAt: 'desc' },
                    take: 1
                }
            }
        });
        if (!video) {
            return reply.status(404).send({ error: 'Video not found' });
        }
        if (video.creatorId !== userId) {
            return reply.status(403).send({ error: 'Not authorized' });
        }
        return {
            id: video.id,
            title: video.title,
            description: video.description,
            thumbnailUrl: video.thumbnailUrl,
            videoUrl: video.videoUrl,
            muxPlaybackId: video.muxPlaybackId,
            duration: video.duration,
            views: video.views,
            likes: video._count.likes,
            comments: video._count.comments,
            status: video.status,
            monetizationEnabled: video.monetizationEnabled,
            aiRatio: video.aiRatio,
            isApproved: video.isApproved,
            publishedAt: video.publishedAt?.toISOString(),
            createdAt: video.createdAt.toISOString(),
            tags: [],
            moderationLog: video.moderationLogs[0] ? {
                status: video.moderationLogs[0].status,
                reason: video.moderationLogs[0].reason,
                aiScore: video.moderationLogs[0].aiScore,
                createdAt: video.moderationLogs[0].createdAt.toISOString()
            } : undefined
        };
    });
    // Update video metadata
    fastify.put('/videos/:id', {
        schema: {
            params: typebox_1.Type.Object({
                id: typebox_1.Type.String()
            }),
            body: typebox_1.Type.Object({
                title: typebox_1.Type.Optional(typebox_1.Type.String({ minLength: 1, maxLength: 200 })),
                description: typebox_1.Type.Optional(typebox_1.Type.String({ maxLength: 5000 })),
                tags: typebox_1.Type.Optional(typebox_1.Type.Array(typebox_1.Type.String())),
                monetizationEnabled: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
                status: typebox_1.Type.Optional(typebox_1.Type.String())
            }),
            response: {
                200: typebox_1.Type.Object({
                    success: typebox_1.Type.Boolean(),
                    video: typebox_1.Type.Object({
                        id: typebox_1.Type.String(),
                        title: typebox_1.Type.String(),
                        status: typebox_1.Type.String(),
                        updatedAt: typebox_1.Type.String()
                    })
                })
            }
        }
    }, async (request, reply) => {
        const userId = fastify.requireAuth(request);
        const { id } = request.params;
        const updates = request.body;
        const video = await fastify.db.video.findUnique({
            where: { id },
            select: { creatorId: true, status: true }
        });
        if (!video) {
            return reply.status(404).send({ error: 'Video not found' });
        }
        if (video.creatorId !== userId) {
            return reply.status(403).send({ error: 'Not authorized' });
        }
        // Handle status changes
        const updateData = { ...updates };
        if (updates.status === 'PUBLISHED' && video.status !== 'PUBLISHED') {
            updateData.publishedAt = new Date();
        }
        const updatedVideo = await fastify.db.video.update({
            where: { id },
            data: updateData
        });
        // Invalidate caches
        await Promise.all([
            fastify.cache.flush('search'),
            fastify.cache.delete(`dashboard:stats:${userId}`, { prefix: 'dashboard' })
        ]);
        return {
            success: true,
            video: {
                id: updatedVideo.id,
                title: updatedVideo.title,
                status: updatedVideo.status,
                updatedAt: updatedVideo.updatedAt.toISOString()
            }
        };
    });
    // Delete video
    fastify.delete('/videos/:id', {
        schema: {
            params: typebox_1.Type.Object({
                id: typebox_1.Type.String()
            }),
            response: {
                200: typebox_1.Type.Object({
                    success: typebox_1.Type.Boolean(),
                    message: typebox_1.Type.String()
                })
            }
        }
    }, async (request, reply) => {
        const userId = fastify.requireAuth(request);
        const { id } = request.params;
        const video = await fastify.db.video.findUnique({
            where: { id },
            select: { creatorId: true }
        });
        if (!video) {
            return reply.status(404).send({ error: 'Video not found' });
        }
        if (video.creatorId !== userId) {
            return reply.status(403).send({ error: 'Not authorized' });
        }
        await fastify.db.video.delete({ where: { id } });
        // Invalidate caches
        await Promise.all([
            fastify.cache.flush('search'),
            fastify.cache.delete(`dashboard:stats:${userId}`, { prefix: 'dashboard' })
        ]);
        return {
            success: true,
            message: 'Video deleted successfully'
        };
    });
    // Bulk operations
    fastify.post('/videos/bulk', {
        schema: {
            body: typebox_1.Type.Object({
                action: typebox_1.Type.Union([
                    typebox_1.Type.Literal('publish'),
                    typebox_1.Type.Literal('unpublish'),
                    typebox_1.Type.Literal('delete'),
                    typebox_1.Type.Literal('monetize'),
                    typebox_1.Type.Literal('demonetize')
                ]),
                videoIds: typebox_1.Type.Array(typebox_1.Type.String(), { minItems: 1, maxItems: 100 })
            }),
            response: {
                200: typebox_1.Type.Object({
                    success: typebox_1.Type.Boolean(),
                    affected: typebox_1.Type.Number(),
                    errors: typebox_1.Type.Array(typebox_1.Type.Object({
                        videoId: typebox_1.Type.String(),
                        error: typebox_1.Type.String()
                    }))
                })
            }
        }
    }, async (request, reply) => {
        const userId = fastify.requireAuth(request);
        const { action, videoIds } = request.body;
        // Verify ownership of all videos
        const videos = await fastify.db.video.findMany({
            where: {
                id: { in: videoIds },
                creatorId: userId
            },
            select: { id: true, status: true }
        });
        const ownedVideoIds = videos.map(v => v.id);
        const errors = videoIds
            .filter(id => !ownedVideoIds.includes(id))
            .map(id => ({ videoId: id, error: 'Video not found or not authorized' }));
        let affected = 0;
        switch (action) {
            case 'publish':
                const result = await fastify.db.video.updateMany({
                    where: {
                        id: { in: ownedVideoIds },
                        status: { not: 'PUBLISHED' },
                        isApproved: true
                    },
                    data: {
                        status: 'PUBLISHED',
                        publishedAt: new Date()
                    }
                });
                affected = result.count;
                break;
            case 'unpublish':
                affected = (await fastify.db.video.updateMany({
                    where: { id: { in: ownedVideoIds } },
                    data: { status: 'UNLISTED' }
                })).count;
                break;
            case 'delete':
                affected = (await fastify.db.video.deleteMany({
                    where: { id: { in: ownedVideoIds } }
                })).count;
                break;
            case 'monetize':
                affected = (await fastify.db.video.updateMany({
                    where: { id: { in: ownedVideoIds } },
                    data: { monetizationEnabled: true }
                })).count;
                break;
            case 'demonetize':
                affected = (await fastify.db.video.updateMany({
                    where: { id: { in: ownedVideoIds } },
                    data: { monetizationEnabled: false }
                })).count;
                break;
        }
        // Invalidate caches
        await Promise.all([
            fastify.cache.flush('search'),
            fastify.cache.delete(`dashboard:stats:${userId}`, { prefix: 'dashboard' })
        ]);
        return {
            success: true,
            affected,
            errors
        };
    });
};
exports.default = studioRoutes;
