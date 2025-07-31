"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typebox_1 = require("@sinclair/typebox");
const search_indexing_1 = require("../services/search-indexing");
const searchRoutes = async (fastify) => {
    const searchService = new search_indexing_1.SearchIndexingService(fastify.db);
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
            const result = await searchService.searchVideos(query, {
                limit: Math.min(parseInt(limit), 50),
                offset: parseInt(offset),
                category,
                sortBy
            });
            reply.send({
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
            });
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
        ]
    }, async (request, reply) => {
        try {
            fastify.log.info('Starting search index rebuild...');
            const result = await searchService.rebuildSearchIndex();
            fastify.log.info(`Search index rebuild completed. Indexed: ${result.indexed}, Errors: ${result.errors}`);
            reply.send({
                success: true,
                message: 'Search index rebuilt successfully',
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
};
exports.default = searchRoutes;
