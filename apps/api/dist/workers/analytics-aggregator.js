"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyticsAggregator = analyticsAggregator;
const bullmq_1 = require("bullmq");
const types_1 = require("./types");
const queue_1 = require("../lib/queue");
async function analyticsAggregator(fastify) {
    const worker = new bullmq_1.Worker(queue_1.QUEUES.ANALYTICS, async (job) => {
        const { type, videoId, userId, data, timestamp } = job.data;
        try {
            fastify.log.info({ type, videoId, userId }, 'Processing analytics event');
            switch (type) {
                case 'view':
                    await processViewEvent(fastify, { videoId, userId, data, timestamp });
                    break;
                case 'engagement':
                    await processEngagementEvent(fastify, { videoId, userId, data, timestamp });
                    break;
                case 'retention':
                    await processRetentionEvent(fastify, { videoId, data, timestamp });
                    break;
                default:
                    throw new Error(`Unknown analytics event type: ${type}`);
            }
            return {
                status: types_1.JobStatus.COMPLETED,
                data: { type, videoId, timestamp },
            };
        }
        catch (error) {
            fastify.log.error({ error, type, videoId }, 'Analytics processing failed');
            throw error;
        }
    }, {
        connection: {
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT || '6379', 10),
            password: process.env.REDIS_PASSWORD,
        },
        concurrency: 10,
    });
    // Also run periodic aggregation jobs
    setInterval(async () => {
        await aggregateDailyStats(fastify);
    }, 60 * 60 * 1000); // Every hour
    return worker;
}
async function processViewEvent(fastify, event) {
    if (!event.videoId)
        return;
    // Record view event
    await fastify.db.viewEvent.create({
        data: {
            videoId: event.videoId,
            userId: event.userId,
            watchTime: event.data.watchTime || 0,
            completed: event.data.completed || false,
        },
    });
    // Update video view count
    await fastify.db.video.update({
        where: { id: event.videoId },
        data: { views: { increment: 1 } },
    });
    // Update daily analytics
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    await fastify.db.videoAnalytics.upsert({
        where: {
            videoId_date: {
                videoId: event.videoId,
                date: today,
            },
        },
        create: {
            videoId: event.videoId,
            date: today,
            views: 1,
            watchTimeMinutes: Math.round((event.data.watchTime || 0) / 60),
            avgViewDuration: event.data.watchTime || 0,
            likes: 0,
            comments: 0,
            shares: 0,
        },
        update: {
            views: { increment: 1 },
            watchTimeMinutes: { increment: Math.round((event.data.watchTime || 0) / 60) },
        },
    });
}
async function processEngagementEvent(fastify, event) {
    if (!event.videoId)
        return;
    const { action } = event.data;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const updateData = {};
    switch (action) {
        case 'like':
            updateData.likes = { increment: 1 };
            break;
        case 'comment':
            updateData.comments = { increment: 1 };
            break;
        case 'share':
            updateData.shares = { increment: 1 };
            break;
    }
    if (Object.keys(updateData).length > 0) {
        await fastify.db.videoAnalytics.upsert({
            where: {
                videoId_date: {
                    videoId: event.videoId,
                    date: today,
                },
            },
            create: {
                videoId: event.videoId,
                date: today,
                views: 0,
                watchTimeMinutes: 0,
                avgViewDuration: 0,
                likes: action === 'like' ? 1 : 0,
                comments: action === 'comment' ? 1 : 0,
                shares: action === 'share' ? 1 : 0,
            },
            update: updateData,
        });
    }
}
async function processRetentionEvent(fastify, event) {
    if (!event.videoId || !event.data.retentionData)
        return;
    // Store retention data in a separate table or cache
    // This would be used to generate retention curves
    const cacheKey = `retention:${event.videoId}:${event.timestamp.toISOString().split('T')[0]}`;
    await fastify.cache.set(cacheKey, event.data.retentionData, {
        ttl: 7 * 24 * 60 * 60, // Keep for 7 days
    });
}
async function aggregateDailyStats(fastify) {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        // Aggregate creator stats
        const creators = await fastify.db.user.findMany({
            where: {
                videos: {
                    some: {
                        status: 'PUBLISHED',
                    },
                },
            },
            select: {
                id: true,
                subscriberCount: true,
                videos: {
                    where: {
                        status: 'PUBLISHED',
                    },
                    select: {
                        id: true,
                        views: true,
                        _count: {
                            select: {
                                viewEvents: {
                                    where: {
                                        createdAt: {
                                            gte: today,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                subscriptions: {
                    where: {
                        createdAt: {
                            gte: today,
                        },
                    },
                    select: {
                        id: true,
                    },
                },
            },
        });
        for (const creator of creators) {
            const dailyViews = creator.videos.reduce((sum, video) => sum + video._count.viewEvents, 0);
            const totalViews = creator.videos.reduce((sum, video) => sum + video.views, 0);
            const subscribersGained = creator.subscriptions.length;
            // Calculate estimated watch time (average 3 minutes per view)
            const estimatedWatchTime = dailyViews * 3;
            // Calculate estimated revenue (simplified)
            const estimatedRevenue = (dailyViews * 0.003) + (subscribersGained * 0.10); // $0.003 per view + $0.10 per subscriber
            await fastify.db.analyticsSnapshot.upsert({
                where: {
                    creatorId_date: {
                        creatorId: creator.id,
                        date: today,
                    },
                },
                create: {
                    creatorId: creator.id,
                    date: today,
                    views: dailyViews,
                    watchTimeMinutes: estimatedWatchTime,
                    subscribersGained,
                    subscribersLost: 0, // Would need unsubscribe tracking
                    estimatedRevenue,
                    impressions: dailyViews * 10, // Rough estimate
                    clickThroughRate: 0.1, // 10% CTR estimate
                },
                update: {
                    views: dailyViews,
                    watchTimeMinutes: estimatedWatchTime,
                    subscribersGained,
                    estimatedRevenue,
                },
            });
        }
        fastify.log.info('Daily analytics aggregation completed');
    }
    catch (error) {
        fastify.log.error({ error }, 'Failed to aggregate daily stats');
    }
}
