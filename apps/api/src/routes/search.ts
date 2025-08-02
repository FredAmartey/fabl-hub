import { FastifyPluginAsync } from 'fastify'
import { Type } from '@sinclair/typebox'

const searchRoutes: FastifyPluginAsync = async (fastify) => {
  // Search videos - simplified version without search indexing service
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
      // Simple database search
      const whereConditions: any = {
        status: 'PUBLISHED',
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } }
        ]
      }
      
      if (category) {
        whereConditions.category = category
      }
      
      const orderBy: any = sortBy === 'views' ? { views: 'desc' } :
                          sortBy === 'recent' ? { publishedAt: 'desc' } :
                          { createdAt: 'desc' }
      
      const [videos, total] = await Promise.all([
        fastify.db.video.findMany({
          where: whereConditions,
          include: {
            creator: {
              select: {
                id: true,
                name: true,
                username: true,
                avatarUrl: true
              }
            }
          },
          orderBy,
          skip: parseInt(offset),
          take: Math.min(parseInt(limit), 50)
        }),
        fastify.db.video.count({ where: whereConditions })
      ])

      const response = {
        success: true,
        data: {
          videos: videos.map((video: any) => ({
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
          suggestions: [], // No suggestions in simplified mode
          totalResults: total
        }
      }

      reply.send(response)
    } catch (error) {
      fastify.log.error(error)
      reply.status(500).send({
        success: false,
        message: 'Search failed'
      })
    }
  })

  // Get popular/trending searches - simplified fallback version
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
      // Fallback to default searches since we don't have trending data yet
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

      reply.send({
        success: true,
        data: fallbackSearches
      })
    } catch (error) {
      fastify.log.error(error)
      reply.status(500).send({
        success: false,
        message: 'Failed to get popular searches'
      })
    }
  })
}

export default searchRoutes