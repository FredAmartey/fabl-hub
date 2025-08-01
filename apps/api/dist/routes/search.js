"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typebox_1 = require("@sinclair/typebox");
const search_indexing_1 = require("../services/search-indexing");
const index_progress_tracker_1 = require("../services/index-progress-tracker");
const searchRoutes = async (fastify) => {
    // Initialize progress tracker with Redis if available
    const progressTracker = fastify.cache?.getRedis()
        ? new index_progress_tracker_1.IndexProgressTracker(fastify.cache.getRedis())
        : undefined;
    const searchService = new search_indexing_1.SearchIndexingService(fastify.db, progressTracker);
    // Search videos with enhanced indexing
    fastify.get('/', {
        schema: {
            querystring: typebox_1.Type.Object({
                q: typebox_1.Type.String({ minLength: 1 }),
                limit: typebox_1.Type.Optional(typebox_1.Type.String({ pattern: '^[0-9]+$' })),
                offset: typebox_1.Type.Optional(typebox_1.Type.String({ pattern: '^[0-9]+$' })),
                category: typebox_1.Type.Optional(typebox_1.Type.String()),
                sortBy: typebox_1.Type.Optional(typebox_1.Type.Union([typebox_1.Type.Literal('relevance'), typebox_1.Type.Literal('views'), typebox_1.Type.Literal('recent')]))
            }),
            response: {
                200: typebox_1.Type.Object({
                    success: typebox_1.Type.Boolean(),
                    data: typebox_1.Type.Object({
                        videos: typebox_1.Type.Array(typebox_1.Type.Object({
                            id: typebox_1.Type.String(),
                            title: typebox_1.Type.String(),
                            description: typebox_1.Type.Optional(typebox_1.Type.String()),
                            thumbnailUrl: typebox_1.Type.Optional(typebox_1.Type.String()),
                            muxPlaybackId: typebox_1.Type.Optional(typebox_1.Type.String()),
                            duration: typebox_1.Type.Number(),
                            views: typebox_1.Type.Number(),
                            createdAt: typebox_1.Type.String(),
                            creator: typebox_1.Type.Object({
                                id: typebox_1.Type.String(),
                                name: typebox_1.Type.String(),
                                username: typebox_1.Type.String(),
                                avatarUrl: typebox_1.Type.Optional(typebox_1.Type.String())
                            })
                        })),
                        suggestions: typebox_1.Type.Array(typebox_1.Type.String()),
                        totalResults: typebox_1.Type.Number()
                    })
                })
            }
        }
    }, async (request, reply) => {
        const { q: query, limit = '20', offset = '0', category, sortBy = 'relevance' } = request.query;
        try {
            // Generate cache key based on search parameters
            const cacheKey = `search:${query}:${limit}:${offset}:${category || 'all'}:${sortBy}`;
            // Try to get cached results
            const cachedResult = await fastify.cache.get(cacheKey, {
                prefix: 'search',
                ttl: 300 // Cache for 5 minutes
            });
            if (cachedResult) {
                return reply.send(cachedResult);
            }
            // If not cached, perform search
            const result = await searchService.searchVideos(query, {
                limit: Math.min(parseInt(limit), 50),
                offset: parseInt(offset),
                category,
                sortBy
            });
            const response = {
                success: true,
                data: {
                    videos: result.videos.map((video) => ({
                        id: video.id,
                        title: video.title,
                        description: video.description,
                        thumbnailUrl: video.thumbnailUrl,
                        muxPlaybackId: video.muxPlaybackId,
                        duration: video.duration,
                        views: video.views,
                        createdAt: video.createdAt.toISOString(),
                        creator: video.creator
                    })),
                    suggestions: result.suggestions,
                    totalResults: result.total
                }
            };
            // Cache the response
            await fastify.cache.set(cacheKey, response, {
                prefix: 'search',
                ttl: 300 // Cache for 5 minutes
            });
            reply.send(response);
        }
        catch (error) {
            fastify.log.error(error);
            reply.status(500).send({
                success: false,
                message: 'Search failed'
            });
        }
    });
    // Get popular/trending searches
    fastify.get('/popular', {
        schema: {
            response: {
                200: typebox_1.Type.Object({
                    success: typebox_1.Type.Boolean(),
                    data: typebox_1.Type.Array(typebox_1.Type.String())
                })
            }
        }
    }, async (request, reply) => {
        try {
            // Get trending search terms from the search service
            const trendingTerms = await searchService.getTrendingSearchTerms(10);
            // Fallback to default searches if no trending terms
            const fallbackSearches = [
                "AI music generation",
                "Neural art creation",
                "Machine learning tutorial",
                "AI video editing",
                "Synthetic voices",
                "Digital storytelling",
                "AI animation",
                "Deep learning basics",
                "Computer vision",
                "Natural language processing"
            ];
            const popularSearches = trendingTerms.length > 0 ? trendingTerms : fallbackSearches;
            reply.send({
                success: true,
                data: popularSearches
            });
        }
        catch (error) {
            fastify.log.error(error);
            reply.status(500).send({
                success: false,
                message: 'Failed to get popular searches'
            });
        }
    });
    // Search suggestions/autocomplete
    fastify.get('/suggestions', {
        schema: {
            querystring: typebox_1.Type.Object({
                q: typebox_1.Type.String({ minLength: 1 })
            }),
            response: {
                200: typebox_1.Type.Object({
                    success: typebox_1.Type.Boolean(),
                    data: typebox_1.Type.Array(typebox_1.Type.String())
                })
            }
        }
    }, async (request, reply) => {
        const { q: query } = request.query;
        try {
            // Use the search service to get enhanced suggestions
            const result = await searchService.searchVideos(query, { limit: 10 });
            // Extract suggestions from the result
            const suggestions = result.suggestions.slice(0, 8);
            reply.send({
                success: true,
                data: suggestions
            });
        }
        catch (error) {
            fastify.log.error(error);
            reply.status(500).send({
                success: false,
                message: 'Failed to get search suggestions'
            });
        }
    });
    // Admin endpoint to rebuild search index
    fastify.post('/rebuild-index', {
        preHandler: [
        // Add admin auth check here if needed
        // For now, we'll leave it open but log the action
        ],
        schema: {
            response: {
                200: typebox_1.Type.Object({
                    success: typebox_1.Type.Boolean(),
                    message: typebox_1.Type.String(),
                    data: typebox_1.Type.Object({
                        indexed: typebox_1.Type.Number(),
                        errors: typebox_1.Type.Number(),
                        totalProcessed: typebox_1.Type.Number(),
                        progressId: typebox_1.Type.String()
                    })
                })
            }
        }
    }, async (request, reply) => {
        try {
            fastify.log.info('Starting search index rebuild...');
            const result = await searchService.rebuildSearchIndex({
                logger: fastify.log
            });
            fastify.log.info(`Search index rebuild completed. Indexed: ${result.indexed}, Errors: ${result.errors}`);
            reply.send({
                success: true,
                message: 'Search index rebuild successfully',
                data: result
            });
        }
        catch (error) {
            fastify.log.error('Search index rebuild failed:', error);
            reply.status(500).send({
                success: false,
                message: 'Failed to rebuild search index'
            });
        }
    });
    // Get search index rebuild progress
    fastify.get('/rebuild-progress/:id', {
        schema: {
            params: typebox_1.Type.Object({
                id: typebox_1.Type.String()
            }),
            response: {
                200: typebox_1.Type.Object({
                    id: typebox_1.Type.String(),
                    status: typebox_1.Type.Union([
                        typebox_1.Type.Literal('pending'),
                        typebox_1.Type.Literal('running'),
                        typebox_1.Type.Literal('completed'),
                        typebox_1.Type.Literal('failed')
                    ]),
                    totalItems: typebox_1.Type.Number(),
                    processedItems: typebox_1.Type.Number(),
                    successfulItems: typebox_1.Type.Number(),
                    failedItems: typebox_1.Type.Number(),
                    startedAt: typebox_1.Type.Optional(typebox_1.Type.String()),
                    completedAt: typebox_1.Type.Optional(typebox_1.Type.String()),
                    error: typebox_1.Type.Optional(typebox_1.Type.String()),
                    lastUpdatedAt: typebox_1.Type.String()
                })
            }
        }
    }, async (request, reply) => {
        const { id } = request.params;
        if (!progressTracker) {
            return reply.status(501).send({
                error: 'Progress tracking not available (Redis not configured)'
            });
        }
        const progress = await progressTracker.get(id);
        if (!progress) {
            return reply.status(404).send({ error: 'Progress not found' });
        }
        reply.send({
            ...progress,
            startedAt: progress.startedAt?.toISOString(),
            completedAt: progress.completedAt?.toISOString(),
            lastUpdatedAt: progress.lastUpdatedAt.toISOString()
        });
    });
    // List all search index rebuild jobs
    fastify.get('/rebuild-progress', {
        schema: {
            response: {
                200: typebox_1.Type.Array(typebox_1.Type.Object({
                    id: typebox_1.Type.String(),
                    status: typebox_1.Type.String(),
                    totalItems: typebox_1.Type.Number(),
                    processedItems: typebox_1.Type.Number(),
                    successfulItems: typebox_1.Type.Number(),
                    failedItems: typebox_1.Type.Number(),
                    lastUpdatedAt: typebox_1.Type.String()
                }))
            }
        }
    }, async (request, reply) => {
        if (!progressTracker) {
            return reply.status(501).send({
                error: 'Progress tracking not available (Redis not configured)'
            });
        }
        const progressList = await progressTracker.list();
        reply.send(progressList.map(progress => ({
            ...progress,
            startedAt: progress.startedAt?.toISOString(),
            completedAt: progress.completedAt?.toISOString(),
            lastUpdatedAt: progress.lastUpdatedAt.toISOString()
        })));
    });
};
exports.default = searchRoutes;
