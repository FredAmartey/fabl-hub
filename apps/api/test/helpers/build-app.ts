import fastify, { FastifyInstance } from 'fastify'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { vi } from 'vitest'

// Mock implementations for testing
const mockDb = {
  video: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    count: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn()
  },
  user: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn()
  },
  $queryRaw: vi.fn()
}

const mockCache = {
  get: vi.fn(),
  set: vi.fn(),
  delete: vi.fn(),
  flush: vi.fn(),
  wrap: vi.fn(),
  health: vi.fn(),
  getStats: vi.fn(),
  resetStats: vi.fn(),
  isAvailable: vi.fn().mockReturnValue(true)
}

export function build(): FastifyInstance {
  const app = fastify({
    logger: false // Disable logging in tests
  }).withTypeProvider<TypeBoxTypeProvider>()

  // Mock plugins
  app.decorate('db', mockDb)
  app.decorate('cache', mockCache)

  // Set up cache.wrap to execute the function by default
  mockCache.wrap.mockImplementation(async (key: string, fn: () => Promise<any>, options?: any) => {
    return await fn()
  })

  // Register actual routes
  // Note: In a real test, you'd import and register the actual route files
  // For this example, we'll just add the essential route structure
  
  app.get('/api/videos', async (request, reply) => {
    // This would be the actual route handler
    // For testing, we'll simulate the refactored behavior
    const query = request.query as any
    const page = parseInt(query.page || '1', 10)
    const limit = Math.min(parseInt(query.limit || '20', 10), 100)
    const skip = (page - 1) * limit

    const where: any = {
      status: 'PUBLISHED',
      isApproved: true
    }

    if (query.creatorId) {
      where.creatorId = query.creatorId
      delete where.status
      delete where.isApproved
    }

    // Use cache.wrap
    const result = await app.cache.wrap(
      `videos:list:${JSON.stringify({ ...query, page, limit })}`,
      async () => {
        const [videos, total] = await Promise.all([
          app.db.video.findMany({
            where,
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
            orderBy: { publishedAt: 'desc' },
            skip,
            take: limit
          }),
          app.db.video.count({ where })
        ])

        return {
          videos: videos.map((video: any) => ({
            id: video.id,
            title: video.title,
            description: video.description,
            thumbnailUrl: video.thumbnailUrl,
            duration: video.duration,
            views: video.views,
            createdAt: video.createdAt.toISOString(),
            publishedAt: video.publishedAt?.toISOString(),
            creator: video.creator
          })),
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
          }
        }
      },
      { prefix: 'api', ttl: 60 }
    )

    return result
  })

  app.get('/api/videos/:id', async (request, reply) => {
    const { id } = request.params as { id: string }

    const result = await app.cache.wrap(
      `videos:detail:${id}`,
      async () => {
        const video = await app.db.video.findUnique({
          where: { id },
          include: {
            creator: {
              select: {
                id: true,
                name: true,
                username: true,
                avatarUrl: true,
                subscriberCount: true
              }
            },
            _count: {
              select: {
                likes: true
              }
            }
          }
        })

        if (!video) {
          throw new Error('Video not found')
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
          status: video.status,
          createdAt: video.createdAt.toISOString(),
          publishedAt: video.publishedAt?.toISOString(),
          creator: video.creator
        }
      },
      { prefix: 'api', ttl: 300 }
    )

    // Increment view count in background
    app.db.video.update({
      where: { id },
      data: { views: { increment: 1 } }
    }).catch(() => {
      // Ignore errors for view count increment in tests
    })

    return result
  })

  // Error handler for video not found
  app.setErrorHandler((error, request, reply) => {
    if (error.message === 'Video not found') {
      reply.status(404).send({ error: 'Video not found' })
      return
    }
    
    reply.status(500).send({ error: 'Internal server error' })
  })

  return app
}

// Reset all mocks between tests
export function resetMocks() {
  Object.values(mockDb).forEach(mock => {
    if (typeof mock === 'object') {
      Object.values(mock).forEach(method => {
        if (vi.isMockFunction(method)) {
          method.mockReset()
        }
      })
    } else if (vi.isMockFunction(mock)) {
      mock.mockReset()
    }
  })

  Object.values(mockCache).forEach(mock => {
    if (vi.isMockFunction(mock)) {
      mock.mockReset()
    }
  })

  // Reset cache.wrap default behavior
  mockCache.wrap.mockImplementation(async (key: string, fn: () => Promise<any>, options?: any) => {
    return await fn()
  })
}