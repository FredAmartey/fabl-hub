import { FastifyPluginAsync } from 'fastify'
import { Type } from '@sinclair/typebox'

const videoRoutes: FastifyPluginAsync = async (fastify) => {
  // Get videos with pagination and filters
  fastify.get('/', {
    schema: {
      querystring: Type.Object({
        page: Type.Optional(Type.String({ pattern: '^[0-9]+$' })),
        limit: Type.Optional(Type.String({ pattern: '^[0-9]+$' })),
        status: Type.Optional(Type.String()),
        creatorId: Type.Optional(Type.String())
      }),
      response: {
        200: Type.Object({
          videos: Type.Array(Type.Object({
            id: Type.String(),
            title: Type.String(),
            description: Type.Optional(Type.String()),
            thumbnailUrl: Type.Optional(Type.String()),
            duration: Type.Number(),
            views: Type.Number(),
            createdAt: Type.String(),
            publishedAt: Type.Optional(Type.String()),
            creator: Type.Object({
              id: Type.String(),
              name: Type.String(),
              username: Type.String(),
              avatarUrl: Type.Optional(Type.String())
            })
          })),
          pagination: Type.Object({
            page: Type.Number(),
            limit: Type.Number(),
            total: Type.Number(),
            totalPages: Type.Number()
          })
        })
      }
    }
  }, async (request) => {
    const page = parseInt(request.query.page || '1', 10)
    const limit = Math.min(parseInt(request.query.limit || '20', 10), 100)
    const skip = (page - 1) * limit

    const where: any = {
      status: 'PUBLISHED', // Only show published videos by default
      isApproved: true
    }

    if (request.query.creatorId) {
      where.creatorId = request.query.creatorId
      delete where.status // Allow creator to see all their videos
      delete where.isApproved
    }

    const [videos, total] = await Promise.all([
      fastify.db.video.findMany({
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
      fastify.db.video.count({ where })
    ])

    return {
      videos: videos.map(video => ({
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
  })

  // Get single video
  fastify.get('/:id', {
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
          status: Type.String(),
          createdAt: Type.String(),
          publishedAt: Type.Optional(Type.String()),
          creator: Type.Object({
            id: Type.String(),
            name: Type.String(),
            username: Type.String(),
            avatarUrl: Type.Optional(Type.String()),
            subscriberCount: Type.Number()
          })
        })
      }
    }
  }, async (request, reply) => {
    const { id } = request.params

    const video = await fastify.db.video.findUnique({
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
      return reply.status(404).send({ error: 'Video not found' })
    }

    // Increment view count (in background)
    fastify.db.video.update({
      where: { id },
      data: { views: { increment: 1 } }
    }).catch(err => fastify.log.error({ err, videoId: id }, 'Failed to increment view count'))

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
  })

  // Create video
  fastify.post('/', {
    schema: {
      body: Type.Object({
        title: Type.String({ minLength: 1, maxLength: 200 }),
        description: Type.Optional(Type.String({ maxLength: 5000 })),
        videoUrl: Type.String(),
        muxAssetId: Type.Optional(Type.String()),
        muxPlaybackId: Type.Optional(Type.String()),
        duration: Type.Optional(Type.Number()),
        thumbnailUrl: Type.Optional(Type.String())
      }),
      response: {
        201: Type.Object({
          id: Type.String(),
          title: Type.String(),
          status: Type.String(),
          createdAt: Type.String()
        })
      }
    }
  }, async (request, reply) => {
    const userId = (fastify as any).requireAuth(request)
    const videoData = request.body

    const video = await fastify.db.video.create({
      data: {
        ...videoData,
        creatorId: userId,
        duration: videoData.duration || 0
      }
    })

    reply.status(201)
    return {
      id: video.id,
      title: video.title,
      status: video.status,
      createdAt: video.createdAt.toISOString()
    }
  })

  // Update video
  fastify.put('/:id', {
    schema: {
      params: Type.Object({
        id: Type.String()
      }),
      body: Type.Object({
        title: Type.Optional(Type.String({ minLength: 1, maxLength: 200 })),
        description: Type.Optional(Type.String({ maxLength: 5000 })),
        thumbnailUrl: Type.Optional(Type.String()),
        status: Type.Optional(Type.String())
      })
    }
  }, async (request, reply) => {
    const userId = (fastify as any).requireAuth(request)
    const { id } = request.params

    // Verify ownership
    const existingVideo = await fastify.db.video.findUnique({
      where: { id },
      select: { creatorId: true }
    })

    if (!existingVideo) {
      return reply.status(404).send({ error: 'Video not found' })
    }

    if (existingVideo.creatorId !== userId) {
      return reply.status(403).send({ error: 'Not authorized to update this video' })
    }

    const video = await fastify.db.video.update({
      where: { id },
      data: {
        ...request.body,
        ...(request.body.status === 'PUBLISHED' && { publishedAt: new Date() })
      }
    })

    return {
      id: video.id,
      title: video.title,
      status: video.status,
      updatedAt: video.updatedAt.toISOString()
    }
  })
}

export default videoRoutes