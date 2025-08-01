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
            // Try to get cached stats first
            const cacheKey = `dashboard:stats:${userId}`;
            const cachedStats = await fastify.cache.get(cacheKey, {
                prefix: 'dashboard',
                ttl: 60 // Cache for 1 minute since dashboard stats change frequently
            });
            if (cachedStats) {
                return reply.send(cachedStats);
            }
            // Constants for calculations
            const COMPARISON_PERIOD_DAYS = 30;
            const AVERAGE_WATCH_TIME_MINUTES = 3;
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - COMPARISON_PERIOD_DAYS);
            // Get current date for analytics
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            // Single optimized query to get all user stats
            const userStats = await fastify.db.user.findUnique({
                where: { id: userId },
                select: {
                    subscriberCount: true,
                    videos: {
                        select: {
                            views: true,
                            createdAt: true,
                            _count: {
                                select: { comments: true }
                            }
                        }
                    },
                    subscribers: {
                        where: { createdAt: { gte: thirtyDaysAgo } },
                        select: { id: true }
                    },
                    analytics: {
                        where: { date: { gte: thirtyDaysAgo } },
                        select: {
                            date: true,
                            views: true,
                            watchTimeMinutes: true,
                            subscribersGained: true,
                            subscribersLost: true,
                            estimatedRevenue: true
                        }
                    },
                    transactions: {
                        where: {
                            createdAt: { gte: thirtyDaysAgo },
                            status: 'PAID'
                        },
                        select: {
                            amount: true,
                            type: true
                        }
                    }
                }
            });
            if (!userStats) {
                return reply.status(404).send({ error: 'User not found' });
            }
            // Calculate aggregated stats from analytics data
            const currentPeriodViews = userStats.analytics.reduce((sum, day) => sum + day.views, 0);
            const currentPeriodWatchTime = userStats.analytics.reduce((sum, day) => sum + day.watchTimeMinutes, 0);
            const subscribersGained = userStats.analytics.reduce((sum, day) => sum + day.subscribersGained, 0);
            const subscribersLost = userStats.analytics.reduce((sum, day) => sum + day.subscribersLost, 0);
            // Calculate revenue from transactions
            const revenueByType = userStats.transactions.reduce((acc, transaction) => {
                acc[transaction.type] = (acc[transaction.type] || 0) + transaction.amount;
                acc.total += transaction.amount;
                return acc;
            }, { total: 0, AD_REVENUE: 0, SUBSCRIPTION: 0, TIP: 0, MERCHANDISE: 0, PREMIUM_CONTENT: 0 });
            // Get previous period data for comparison
            const sixtyDaysAgo = new Date();
            sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - COMPARISON_PERIOD_DAYS * 2);
            const previousPeriodAnalytics = await fastify.db.analyticsSnapshot.findMany({
                where: {
                    creatorId: userId,
                    date: {
                        gte: sixtyDaysAgo,
                        lt: thirtyDaysAgo
                    }
                },
                select: {
                    views: true,
                    watchTimeMinutes: true,
                    subscribersGained: true,
                    subscribersLost: true,
                    estimatedRevenue: true
                }
            });
            const prevPeriodViews = previousPeriodAnalytics.reduce((sum, day) => sum + day.views, 0);
            const prevPeriodWatchTime = previousPeriodAnalytics.reduce((sum, day) => sum + day.watchTimeMinutes, 0);
            const prevPeriodRevenue = previousPeriodAnalytics.reduce((sum, day) => sum + day.estimatedRevenue, 0);
            // Calculate percentage changes with safe division
            const calculateChange = (current, previous) => {
                if (previous === 0)
                    return current > 0 ? 100 : 0;
                return Math.round(((current - previous) / previous) * 100 * 100) / 100;
            };
            const currentSubs = userStats.subscriberCount;
            const netSubsChange = subscribersGained - subscribersLost;
            const prevSubs = currentSubs - netSubsChange;
            const viewsChange = calculateChange(currentPeriodViews, prevPeriodViews);
            const subsChange = calculateChange(currentSubs, prevSubs);
            const watchTimeChange = calculateChange(currentPeriodWatchTime, prevPeriodWatchTime);
            const revenueChange = calculateChange(revenueByType.total, prevPeriodRevenue);
            const statsResponse = {
                subscribers: {
                    current: currentSubs,
                    change: subsChange,
                    period: `${COMPARISON_PERIOD_DAYS} days`
                },
                views: {
                    total: currentPeriodViews,
                    change: viewsChange,
                    period: `${COMPARISON_PERIOD_DAYS} days`
                },
                watchTime: {
                    hours: Math.round(currentPeriodWatchTime / 60),
                    change: watchTimeChange,
                    period: `${COMPARISON_PERIOD_DAYS} days`
                },
                revenue: {
                    total: revenueByType.total,
                    change: revenueChange,
                    breakdown: {
                        ads: revenueByType.AD_REVENUE,
                        memberships: revenueByType.SUBSCRIPTION,
                        other: revenueByType.TIP + revenueByType.MERCHANDISE + revenueByType.PREMIUM_CONTENT
                    }
                }
            };
            // Cache the response
            await fastify.cache.set(cacheKey, statsResponse, {
                prefix: 'dashboard',
                ttl: 60 // Cache for 1 minute
            });
            return statsResponse;
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
