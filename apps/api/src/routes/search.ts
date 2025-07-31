import { FastifyPluginAsync } from 'fastify'
import { Type } from '@sinclair/typebox'
import { SearchIndexingService } from '../services/search-indexing'
import { IndexProgressTracker } from '../services/index-progress-tracker'

const searchRoutes: FastifyPluginAsync = async (fastify) => {
  // Initialize progress tracker with Redis if available
  const progressTracker = fastify.cache?.getRedis() 
    ? new IndexProgressTracker(fastify.cache.getRedis())
    : null
    
  const searchService = new SearchIndexingService(fastify.db, progressTracker)

  // Search videos with enhanced indexing
  fastify.get('/', {
    schema: {
      querystring: Type.Object({
        q: Type.String({ minLength: 1 }),
        limit: Type.Optional(Type.String({ pattern: '^[0-9]+$' })),
        offset: Type.Optional(Type.String({ pattern: '^[0-9]+$' })),
        category: Type.Optional(Type.String()),
        sortBy: Type.Optional(Type.Union([Type.Literal('relevance'), Type.Literal('views'), Type.Literal('recent')]))
      }),
      response: {
        200: Type.Object({
          success: Type.Boolean(),
          data: Type.Object({
            videos: Type.Array(Type.Object({
              id: Type.String(),
              title: Type.String(),
              description: Type.Optional(Type.String()),
              thumbnailUrl: Type.Optional(Type.String()),
              muxPlaybackId: Type.Optional(Type.String()),
              duration: Type.Number(),
              views: Type.Number(),
              createdAt: Type.String(),
              creator: Type.Object({
                id: Type.String(),
                name: Type.String(),
                username: Type.String(),
                avatarUrl: Type.Optional(Type.String())
              })
            })),
            suggestions: Type.Array(Type.String()),
            totalResults: Type.Number()
          })
        })
      }
    }
  }, async (request, reply) => {
    const { 
      q: query, 
      limit = '20', 
      offset = '0',
      category,
      sortBy = 'relevance'
    } = request.query as { 
      q: string
      limit?: string
      offset?: string
      category?: string
      sortBy?: 'relevance' | 'views' | 'recent'
    }

    try {
      // Generate cache key based on search parameters
      const cacheKey = `search:${query}:${limit}:${offset}:${category || 'all'}:${sortBy}`
      
      // Try to get cached results
      const cachedResult = await fastify.cache.get<any>(cacheKey, { 
        prefix: 'search',
        ttl: 300 // Cache for 5 minutes
      })
      
      if (cachedResult) {
        return reply.send(cachedResult)
      }
      
      // If not cached, perform search
      const result = await searchService.searchVideos(query, {
        limit: Math.min(parseInt(limit), 50),
        offset: parseInt(offset),
        category,
        sortBy
      })

      const response = {
        success: true,
        data: {
          videos: result.videos.map((video: any) => ({
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
      }
      
      // Cache the response
      await fastify.cache.set(cacheKey, response, { 
        prefix: 'search',
        ttl: 300 // Cache for 5 minutes
      })

      reply.send(response)
    } catch (error) {
      fastify.log.error(error)
      reply.status(500).send({
        success: false,
        message: 'Search failed'
      })
    }
  })

  // Get popular/trending searches
  fastify.get('/popular', {
    schema: {
      response: {
        200: Type.Object({
          success: Type.Boolean(),
          data: Type.Array(Type.String())
        })
      }
    }
  }, async (request, reply) => {
    try {
      // Get trending search terms from the search service
      const trendingTerms = await searchService.getTrendingSearchTerms(10)
      
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
      ]

      const popularSearches = trendingTerms.length > 0 ? trendingTerms : fallbackSearches

      reply.send({
        success: true,
        data: popularSearches
      })
    } catch (error) {
      fastify.log.error(error)
      reply.status(500).send({
        success: false,
        message: 'Failed to get popular searches'
      })
    }
  })

  // Search suggestions/autocomplete
  fastify.get('/suggestions', {
    schema: {
      querystring: Type.Object({
        q: Type.String({ minLength: 1 })
      }),
      response: {
        200: Type.Object({
          success: Type.Boolean(),
          data: Type.Array(Type.String())
        })
      }
    }
  }, async (request, reply) => {
    const { q: query } = request.query as { q: string }

    try {
      // Use the search service to get enhanced suggestions
      const result = await searchService.searchVideos(query, { limit: 10 })
      
      // Extract suggestions from the result
      const suggestions = result.suggestions.slice(0, 8)

      reply.send({
        success: true,
        data: suggestions
      })
    } catch (error) {
      fastify.log.error(error)
      reply.status(500).send({
        success: false,
        message: 'Failed to get search suggestions'
      })
    }
  })

  // Admin endpoint to rebuild search index
  fastify.post('/rebuild-index', {
    preHandler: [
      // Add admin auth check here if needed
      // For now, we'll leave it open but log the action
    ],
    schema: {
      response: {
        200: Type.Object({
          success: Type.Boolean(),
          message: Type.String(),
          data: Type.Object({
            indexed: Type.Number(),
            errors: Type.Number(),
            totalProcessed: Type.Number(),
            progressId: Type.String()
          })
        })
      }
    }
  }, async (request, reply) => {
    try {
      fastify.log.info('Starting search index rebuild...')
      
      const result = await searchService.rebuildSearchIndex({
        logger: fastify.log
      })
      
      fastify.log.info(`Search index rebuild completed. Indexed: ${result.indexed}, Errors: ${result.errors}`)
      
      reply.send({
        success: true,
        message: 'Search index rebuild successfully',
        data: result
      })
    } catch (error) {
      fastify.log.error('Search index rebuild failed:', error)
      reply.status(500).send({
        success: false,
        message: 'Failed to rebuild search index'
      })
    }
  })

  // Get search index rebuild progress
  fastify.get('/rebuild-progress/:id', {
    schema: {
      params: Type.Object({
        id: Type.String()
      }),
      response: {
        200: Type.Object({
          id: Type.String(),
          status: Type.Union([
            Type.Literal('pending'),
            Type.Literal('running'),
            Type.Literal('completed'),
            Type.Literal('failed')
          ]),
          totalItems: Type.Number(),
          processedItems: Type.Number(),
          successfulItems: Type.Number(),
          failedItems: Type.Number(),
          startedAt: Type.Optional(Type.String()),
          completedAt: Type.Optional(Type.String()),
          error: Type.Optional(Type.String()),
          lastUpdatedAt: Type.String()
        })
      }
    }
  }, async (request, reply) => {
    const { id } = request.params as { id: string }
    
    if (!progressTracker) {
      return reply.status(501).send({ 
        error: 'Progress tracking not available (Redis not configured)' 
      })
    }
    
    const progress = await progressTracker.get(id)
    
    if (!progress) {
      return reply.status(404).send({ error: 'Progress not found' })
    }
    
    reply.send({
      ...progress,
      startedAt: progress.startedAt?.toISOString(),
      completedAt: progress.completedAt?.toISOString(),
      lastUpdatedAt: progress.lastUpdatedAt.toISOString()
    })
  })

  // List all search index rebuild jobs
  fastify.get('/rebuild-progress', {
    schema: {
      response: {
        200: Type.Array(Type.Object({
          id: Type.String(),
          status: Type.String(),
          totalItems: Type.Number(),
          processedItems: Type.Number(),
          successfulItems: Type.Number(),
          failedItems: Type.Number(),
          lastUpdatedAt: Type.String()
        }))
      }
    }
  }, async (request, reply) => {
    if (!progressTracker) {
      return reply.status(501).send({ 
        error: 'Progress tracking not available (Redis not configured)' 
      })
    }
    
    const progressList = await progressTracker.list()
    
    reply.send(progressList.map(progress => ({
      ...progress,
      startedAt: progress.startedAt?.toISOString(),
      completedAt: progress.completedAt?.toISOString(),
      lastUpdatedAt: progress.lastUpdatedAt.toISOString()
    })))
  })
}

export default searchRoutes