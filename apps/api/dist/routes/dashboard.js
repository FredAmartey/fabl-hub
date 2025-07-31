"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typebox_1 = require("@sinclair/typebox");
const dashboardRoutes = async (fastify) => {
    // Get dashboard stats
    fastify.get('/stats', {
        schema: {
            response: {
                200: typebox_1.Type.Object({
                    subscribers: typebox_1.Type.Object({
                        current: typebox_1.Type.Number(),
                        change: typebox_1.Type.Number(),
                        period: typebox_1.Type.String()
                    }),
                    views: typebox_1.Type.Object({
                        total: typebox_1.Type.Number(),
                        change: typebox_1.Type.Number(),
                        period: typebox_1.Type.String()
                    }),
                    watchTime: typebox_1.Type.Object({
                        hours: typebox_1.Type.Number(),
                        change: typebox_1.Type.Number(),
                        period: typebox_1.Type.String()
                    }),
                    revenue: typebox_1.Type.Object({
                        total: typebox_1.Type.Number(),
                        change: typebox_1.Type.Number(),
                        breakdown: typebox_1.Type.Object({
                            ads: typebox_1.Type.Number(),
                            memberships: typebox_1.Type.Number(),
                            other: typebox_1.Type.Number()
                        })
                    })
                })
            }
        }
    }, async (request, reply) => {
        const userId = fastify.requireAuth(request);
        try {
            // Get current stats
            const [totalViews, subscriberCount, videoCount, totalComments] = await Promise.all([
                // Total views for user's videos
                fastify.db.video.aggregate({
                    where: { creatorId: userId },
                    _sum: { views: true }
                }),
                // Current subscriber count
                fastify.db.subscription.count({
                    where: { channelId: userId }
                }),
                // Total video count
                fastify.db.video.count({
                    where: { creatorId: userId }
                }),
                // Total comments on user's videos
                fastify.db.comment.count({
                    where: {
                        video: { creatorId: userId }
                    }
                })
            ]);
            // Calculate 30 days ago for comparison
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            // Get previous period stats for comparison
            const [previousViews, previousSubscribers] = await Promise.all([
                // Views from videos published before 30 days ago
                fastify.db.video.aggregate({
                    where: {
                        creatorId: userId,
                        createdAt: { lt: thirtyDaysAgo }
                    },
                    _sum: { views: true }
                }),
                // Subscribers from before 30 days ago
                fastify.db.subscription.count({
                    where: {
                        channelId: userId,
                        createdAt: { lt: thirtyDaysAgo }
                    }
                })
            ]);
            const currentViews = totalViews._sum.views || 0;
            const prevViews = previousViews._sum.views || 0;
            const viewsChange = prevViews > 0 ? ((currentViews - prevViews) / prevViews) * 100 : 100;
            const currentSubs = subscriberCount;
            const prevSubs = previousSubscribers;
            const subsChange = prevSubs > 0 ? ((currentSubs - prevSubs) / prevSubs) * 100 : 100;
            // Calculate watch time (assuming average 3-minute watch per view)
            const estimatedWatchTimeHours = Math.round((currentViews * 3) / 60);
            const prevWatchTimeHours = Math.round((prevViews * 3) / 60);
            const watchTimeChange = prevWatchTimeHours > 0 ? ((estimatedWatchTimeHours - prevWatchTimeHours) / prevWatchTimeHours) * 100 : 100;
            return {
                subscribers: {
                    current: currentSubs,
                    change: Math.round(subsChange * 100) / 100,
                    period: '30 days'
                },
                views: {
                    total: currentViews,
                    change: Math.round(viewsChange * 100) / 100,
                    period: '30 days'
                },
                watchTime: {
                    hours: estimatedWatchTimeHours,
                    change: Math.round(watchTimeChange * 100) / 100,
                    period: '30 days'
                },
                revenue: {
                    total: 0, // TODO: Implement revenue tracking
                    change: 0,
                    breakdown: {
                        ads: 0,
                        memberships: 0,
                        other: 0
                    }
                }
            };
        }
        catch (error) {
            fastify.log.error(error);
            return reply.status(500).send({ error: 'Failed to get dashboard stats' });
        }
    });
    // Get top performing videos
    fastify.get('/top-videos', {
        schema: {
            response: {
                200: typebox_1.Type.Array(typebox_1.Type.Object({
                    id: typebox_1.Type.String(),
                    title: typebox_1.Type.String(),
                    views: typebox_1.Type.Number(),
                    engagement: typebox_1.Type.String(),
                    rank: typebox_1.Type.Number()
                }))
            }
        }
    }, async (request, reply) => {
        const userId = fastify.requireAuth(request);
        try {
            const topVideos = await fastify.db.video.findMany({
                where: {
                    creatorId: userId,
                    status: 'PUBLISHED'
                },
                select: {
                    id: true,
                    title: true,
                    views: true,
                    _count: {
                        select: {
                            likes: true,
                            comments: true
                        }
                    }
                },
                orderBy: { views: 'desc' },
                take: 10
            });
            return topVideos.map((video, index) => ({
                id: video.id,
                title: video.title,
                views: video.views,
                engagement: `${video._count.likes + video._count.comments} interactions`,
                rank: index + 1
            }));
        }
        catch (error) {
            fastify.log.error(error);
            return reply.status(500).send({ error: 'Failed to get top videos' });
        }
    });
    // Get recent subscribers
    fastify.get('/recent-subscribers', {
        schema: {
            response: {
                200: typebox_1.Type.Array(typebox_1.Type.Object({
                    id: typebox_1.Type.String(),
                    name: typebox_1.Type.String(),
                    subscriberCount: typebox_1.Type.Number(),
                    avatar: typebox_1.Type.Optional(typebox_1.Type.String()),
                    subscribedAt: typebox_1.Type.String()
                }))
            }
        }
    }, async (request, reply) => {
        const userId = fastify.requireAuth(request);
        try {
            const recentSubscriptions = await fastify.db.subscription.findMany({
                where: { channelId: userId },
                include: {
                    subscriber: {
                        select: {
                            id: true,
                            name: true,
                            avatarUrl: true,
                            subscriberCount: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' },
                take: 20
            });
            return recentSubscriptions.map((sub) => ({
                id: sub.subscriber.id,
                name: sub.subscriber.name,
                subscriberCount: sub.subscriber.subscriberCount,
                avatar: sub.subscriber.avatarUrl,
                subscribedAt: sub.createdAt.toISOString()
            }));
        }
        catch (error) {
            fastify.log.error(error);
            return reply.status(500).send({ error: 'Failed to get recent subscribers' });
        }
    });
    // Get recent comments on user's videos
    fastify.get('/recent-comments', {
        schema: {
            response: {
                200: typebox_1.Type.Array(typebox_1.Type.Object({
                    id: typebox_1.Type.String(),
                    user: typebox_1.Type.String(),
                    content: typebox_1.Type.String(),
                    createdAt: typebox_1.Type.String(),
                    videoId: typebox_1.Type.String(),
                    avatar: typebox_1.Type.Optional(typebox_1.Type.String())
                }))
            }
        }
    }, async (request, reply) => {
        const userId = fastify.requireAuth(request);
        try {
            const recentComments = await fastify.db.comment.findMany({
                where: {
                    video: { creatorId: userId }
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            avatarUrl: true
                        }
                    },
                    video: {
                        select: {
                            id: true,
                            title: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' },
                take: 20
            });
            return recentComments.map((comment) => ({
                id: comment.id,
                user: comment.user.name,
                content: comment.content,
                createdAt: comment.createdAt.toISOString(),
                videoId: comment.videoId,
                avatar: comment.user.avatarUrl
            }));
        }
        catch (error) {
            fastify.log.error(error);
            return reply.status(500).send({ error: 'Failed to get recent comments' });
        }
    });
};
exports.default = dashboardRoutes;
