import { FastifyPluginAsync } from 'fastify'
import { Type } from '@sinclair/typebox'

const studioRoutes: FastifyPluginAsync = async (fastify) => {
  // Get creator's videos with filters
  fastify.get('/videos', {
    schema: {
      querystring: Type.Object({
        page: Type.Optional(Type.String({ pattern: '^[0-9]+$' })),
        limit: Type.Optional(Type.String({ pattern: '^[0-9]+$' })),
        status: Type.Optional(Type.String()),
        search: Type.Optional(Type.String()),
        orderBy: Type.Optional(Type.String()),
        order: Type.Optional(Type.String())
      }),
      response: {
        200: Type.Object({
          data: Type.Array(Type.Object({
            id: Type.String(),
            title: Type.String(),
            description: Type.Optional(Type.String()),
            thumbnailUrl: Type.Optional(Type.String()),
            duration: Type.Number(),
            views: Type.Number(),
            likes: Type.Number(),
            comments: Type.Number(),
            status: Type.String(),
            monetizationEnabled: Type.Boolean(),
            publishedAt: Type.Optional(Type.String()),
            createdAt: Type.String(),
            analytics: Type.Optional(Type.Object({
              impressions: Type.Number(),
              clickThroughRate: Type.Number(),
              avgViewDuration: Type.Number()
            }))
          })),
          meta: Type.Object({
            page: Type.Number(),
            limit: Type.Number(),
            total: Type.Number(),
            totalPages: Type.Number(),
            hasMore: Type.Boolean()
          })
        })
      }
    }
  }, async (request) => {
    const userId = (fastify as any).requireAuth(request)
    const query = request.query as any
    const page = parseInt(query.page || '1', 10)
    const limit = Math.min(parseInt(query.limit || '20', 10), 100)
    const skip = (page - 1) * limit
    const { status, search, orderBy = 'createdAt', order = 'desc' } = query

    const where: any = { creatorId: userId }
    
    if (status && status !== 'all') {
      where.status = status.toUpperCase()
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
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
    ])

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
    }
  })

  // Get single video details
  fastify.get('/videos/:id', {
    schema: {
      params: Type.Object({
        id: Type.String()
      }),
      response: {
        200: Type.Object({
          id: Type.String(),
          title: Type.String(),
          description: Type.Optional(Type.String()),
          thumbnailUrl: Type.Optional(Type.String()),
          videoUrl: Type.String(),
          muxPlaybackId: Type.Optional(Type.String()),
          duration: Type.Number(),
          views: Type.Number(),
          likes: Type.Number(),
          comments: Type.Number(),
          status: Type.String(),
          monetizationEnabled: Type.Boolean(),
          aiRatio: Type.Optional(Type.Number()),
          isApproved: Type.Boolean(),
          publishedAt: Type.Optional(Type.String()),
          createdAt: Type.String(),
          tags: Type.Array(Type.String()),
          moderationLog: Type.Optional(Type.Object({
            status: Type.String(),
            reason: Type.Optional(Type.String()),
            aiScore: Type.Optional(Type.Number()),
            createdAt: Type.String()
          }))
        })
      }
    }
  }, async (request, reply) => {
    const userId = (fastify as any).requireAuth(request)
    const { id } = request.params as { id: string }

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
    })

    if (!video) {
      return reply.status(404).send({ error: 'Video not found' })
    }

    if (video.creatorId !== userId) {
      return reply.status(403).send({ error: 'Not authorized' })
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
      tags: video.tags || [],
      moderationLog: video.moderationLogs[0] ? {
        status: video.moderationLogs[0].status,
        reason: video.moderationLogs[0].reason,
        aiScore: video.moderationLogs[0].aiScore,
        createdAt: video.moderationLogs[0].createdAt.toISOString()
      } : undefined
    }
  })

  // Update video metadata
  fastify.put('/videos/:id', {
    schema: {
      params: Type.Object({
        id: Type.String()
      }),
      body: Type.Object({
        title: Type.Optional(Type.String({ minLength: 1, maxLength: 200 })),
        description: Type.Optional(Type.String({ maxLength: 5000 })),
        tags: Type.Optional(Type.Array(Type.String())),
        monetizationEnabled: Type.Optional(Type.Boolean()),
        status: Type.Optional(Type.String())
      }),
      response: {
        200: Type.Object({
          success: Type.Boolean(),
          video: Type.Object({
            id: Type.String(),
            title: Type.String(),
            status: Type.String(),
            updatedAt: Type.String()
          })
        })
      }
    }
  }, async (request, reply) => {
    const userId = (fastify as any).requireAuth(request)
    const { id } = request.params as { id: string }
    const updates = request.body as any

    const video = await fastify.db.video.findUnique({
      where: { id },
      select: { creatorId: true, status: true }
    })

    if (!video) {
      return reply.status(404).send({ error: 'Video not found' })
    }

    if (video.creatorId !== userId) {
      return reply.status(403).send({ error: 'Not authorized' })
    }

    // Handle status changes
    const updateData: any = { ...(updates as Record<string, any>) }
    if (updates.status === 'PUBLISHED' && video.status !== 'PUBLISHED') {
      updateData.publishedAt = new Date()
    }

    const updatedVideo = await fastify.db.video.update({
      where: { id },
      data: updateData
    })

    // Invalidate caches
    await Promise.all([
      fastify.cache.flush('search'),
      fastify.cache.delete(`dashboard:stats:${userId}`, { prefix: 'dashboard' })
    ])

    return {
      success: true,
      video: {
        id: updatedVideo.id,
        title: updatedVideo.title,
        status: updatedVideo.status,
        updatedAt: updatedVideo.updatedAt.toISOString()
      }
    }
  })

  // Delete video
  fastify.delete('/videos/:id', {
    schema: {
      params: Type.Object({
        id: Type.String()
      }),
      response: {
        200: Type.Object({
          success: Type.Boolean(),
          message: Type.String()
        })
      }
    }
  }, async (request, reply) => {
    const userId = (fastify as any).requireAuth(request)
    const { id } = request.params as { id: string }

    const video = await fastify.db.video.findUnique({
      where: { id },
      select: { creatorId: true }
    })

    if (!video) {
      return reply.status(404).send({ error: 'Video not found' })
    }

    if (video.creatorId !== userId) {
      return reply.status(403).send({ error: 'Not authorized' })
    }

    await fastify.db.video.delete({ where: { id } })

    // Invalidate caches
    await Promise.all([
      fastify.cache.flush('search'),
      fastify.cache.delete(`dashboard:stats:${userId}`, { prefix: 'dashboard' })
    ])

    return {
      success: true,
      message: 'Video deleted successfully'
    }
  })

  // Bulk operations
  fastify.post('/videos/bulk', {
    schema: {
      body: Type.Object({
        action: Type.Union([
          Type.Literal('publish'),
          Type.Literal('unpublish'),
          Type.Literal('delete'),
          Type.Literal('monetize'),
          Type.Literal('demonetize')
        ]),
        videoIds: Type.Array(Type.String(), { minItems: 1, maxItems: 100 })
      }),
      response: {
        200: Type.Object({
          success: Type.Boolean(),
          affected: Type.Number(),
          errors: Type.Array(Type.Object({
            videoId: Type.String(),
            error: Type.String()
          }))
        })
      }
    }
  }, async (request, reply) => {
    const userId = (fastify as any).requireAuth(request)
    const { action, videoIds } = request.body as { action: string; videoIds: string[] }

    // Verify ownership of all videos
    const videos = await fastify.db.video.findMany({
      where: {
        id: { in: videoIds },
        creatorId: userId
      },
      select: { id: true, status: true }
    })

    const ownedVideoIds = videos.map(v => v.id)
    const errors = videoIds
      .filter(id => !ownedVideoIds.includes(id))
      .map(id => ({ videoId: id, error: 'Video not found or not authorized' }))

    let affected = 0

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
        })
        affected = result.count
        break

      case 'unpublish':
        affected = (await fastify.db.video.updateMany({
          where: { id: { in: ownedVideoIds } },
          data: { status: 'UNLISTED' }
        })).count
        break

      case 'delete':
        affected = (await fastify.db.video.deleteMany({
          where: { id: { in: ownedVideoIds } }
        })).count
        break

      case 'monetize':
        affected = (await fastify.db.video.updateMany({
          where: { id: { in: ownedVideoIds } },
          data: { monetizationEnabled: true }
        })).count
        break

      case 'demonetize':
        affected = (await fastify.db.video.updateMany({
          where: { id: { in: ownedVideoIds } },
          data: { monetizationEnabled: false }
        })).count
        break
    }

    // Invalidate caches
    await Promise.all([
      fastify.cache.flush('search'),
      fastify.cache.delete(`dashboard:stats:${userId}`, { prefix: 'dashboard' })
    ])

    return {
      success: true,
      affected,
      errors
    }
  })
}

export default studioRoutes