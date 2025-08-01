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

    // Invalidate caches for new video
    await Promise.all([
      // Invalidate dashboard cache for the creator
      fastify.cache.delete(`dashboard:stats:${userId}`, { prefix: 'dashboard' }),
      // Invalidate search cache if video is published
      video.status === 'PUBLISHED' && fastify.cache.flush('search')
    ].filter(Boolean))

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

    // Invalidate caches related to this video
    await Promise.all([
      // Invalidate search cache (flush all search results as they might contain this video)
      fastify.cache.flush('search'),
      // Invalidate dashboard cache for the video owner
      fastify.cache.delete(`dashboard:stats:${existingVideo.creatorId}`, { prefix: 'dashboard' }),
      // Invalidate specific video cache if we had one
      fastify.cache.delete(`video:${id}`, { prefix: 'videos' })
    ])

    return {
      id: video.id,
      title: video.title,
      status: video.status,
      updatedAt: video.updatedAt.toISOString()
    }
  })

  // Delete video
  fastify.delete('/:id', {
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
      return reply.status(403).send({ error: 'Not authorized to delete this video' })
    }

    await fastify.db.video.delete({
      where: { id }
    })

    // Invalidate caches after deletion
    await Promise.all([
      // Invalidate search cache
      fastify.cache.flush('search'),
      // Invalidate dashboard cache for the video owner
      fastify.cache.delete(`dashboard:stats:${existingVideo.creatorId}`, { prefix: 'dashboard' }),
      // Invalidate specific video cache
      fastify.cache.delete(`video:${id}`, { prefix: 'videos' })
    ])

    return {
      success: true,
      message: 'Video deleted successfully'
    }
  })

  // Track view (enhanced version)
  fastify.post('/:id/view', {
    schema: {
      params: Type.Object({
        id: Type.String()
      }),
      body: Type.Optional(Type.Object({
        watchTime: Type.Optional(Type.Number()),
        userId: Type.Optional(Type.String())
      })),
      response: {
        200: Type.Object({
          success: Type.Boolean(),
          views: Type.Number()
        })
      }
    }
  }, async (request, reply) => {
    const { id } = request.params
    const { watchTime, userId } = request.body || {}

    try {
      // Check if video exists
      const video = await fastify.db.video.findUnique({
        where: { id },
        select: { id: true, views: true }
      })

      if (!video) {
        return reply.status(404).send({ error: 'Video not found' })
      }

      // TODO: Implement view deduplication logic here
      // For now, just increment the view count
      const updatedVideo = await fastify.db.video.update({
        where: { id },
        data: { views: { increment: 1 } }
      })

      // TODO: Store view analytics data
      // This could include watch time, user ID, timestamp, etc.

      return {
        success: true,
        views: updatedVideo.views
      }
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Failed to track view' })
    }
  })

  // Like video
  fastify.post('/:id/like', {
    schema: {
      params: Type.Object({
        id: Type.String()
      }),
      response: {
        200: Type.Object({
          success: Type.Boolean(),
          liked: Type.Boolean(),
          likes: Type.Number()
        })
      }
    }
  }, async (request, reply) => {
    const userId = (fastify as any).requireAuth(request)
    const { id } = request.params

    try {
      // Check if video exists
      const video = await fastify.db.video.findUnique({
        where: { id },
        select: { id: true }
      })

      if (!video) {
        return reply.status(404).send({ error: 'Video not found' })
      }

      // Check if user already liked this video
      const existingLike = await fastify.db.like.findUnique({
        where: {
          userId_videoId: {
            userId,
            videoId: id
          }
        }
      })

      let liked: boolean
      if (existingLike) {
        // Unlike the video
        await fastify.db.like.delete({
          where: { id: existingLike.id }
        })
        liked = false
      } else {
        // Like the video
        await fastify.db.like.create({
          data: {
            userId,
            videoId: id
          }
        })
        liked = true
      }

      // Get updated like count
      const likeCount = await fastify.db.like.count({
        where: { videoId: id }
      })

      return {
        success: true,
        liked,
        likes: likeCount
      }
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Failed to like/unlike video' })
    }
  })

  // Get video comments
  fastify.get('/:id/comments', {
    schema: {
      params: Type.Object({
        id: Type.String()
      }),
      querystring: Type.Object({
        page: Type.Optional(Type.String({ pattern: '^[0-9]+$' })),
        limit: Type.Optional(Type.String({ pattern: '^[0-9]+$' }))
      }),
      response: {
        200: Type.Object({
          success: Type.Boolean(),
          data: Type.Array(Type.Object({
            id: Type.String(),
            content: Type.String(),
            likes: Type.Number(),
            createdAt: Type.String(),
            user: Type.Object({
              id: Type.String(),
              name: Type.String(),
              avatarUrl: Type.Optional(Type.String())
            }),
            parentId: Type.Optional(Type.String()),
            replies: Type.Optional(Type.Array(Type.Any()))
          })),
          meta: Type.Object({
            page: Type.Number(),
            limit: Type.Number(),
            total: Type.Number(),
            hasMore: Type.Boolean()
          })
        })
      }
    }
  }, async (request, reply) => {
    const { id } = request.params
    const page = parseInt(request.query.page || '1', 10)
    const limit = Math.min(parseInt(request.query.limit || '20', 10), 50)
    const skip = (page - 1) * limit

    try {
      // Check if video exists
      const video = await fastify.db.video.findUnique({
        where: { id },
        select: { id: true }
      })

      if (!video) {
        return reply.status(404).send({ error: 'Video not found' })
      }

      // Get comments
      const [comments, total] = await Promise.all([
        fastify.db.comment.findMany({
          where: { 
            videoId: id,
            parentId: null // Only top-level comments
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatarUrl: true
              }
            },
            replies: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    avatarUrl: true
                  }
                }
              },
              orderBy: { createdAt: 'asc' },
              take: 5 // Limit replies per comment
            }
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit
        }),
        fastify.db.comment.count({
          where: { 
            videoId: id,
            parentId: null
          }
        })
      ])

      return {
        success: true,
        data: comments.map(comment => ({
          id: comment.id,
          content: comment.content,
          likes: comment.likes,
          createdAt: comment.createdAt.toISOString(),
          user: comment.user,
          parentId: comment.parentId,
          replies: comment.replies.map(reply => ({
            id: reply.id,
            content: reply.content,
            likes: reply.likes,
            createdAt: reply.createdAt.toISOString(),
            user: reply.user,
            parentId: reply.parentId
          }))
        })),
        meta: {
          page,
          limit,
          total,
          hasMore: page * limit < total
        }
      }
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Failed to get comments' })
    }
  })

  // Add comment to video
  fastify.post('/:id/comments', {
    schema: {
      params: Type.Object({
        id: Type.String()
      }),
      body: Type.Object({
        content: Type.String({ minLength: 1, maxLength: 1000 }),
        parentId: Type.Optional(Type.String())
      }),
      response: {
        201: Type.Object({
          success: Type.Boolean(),
          data: Type.Object({
            id: Type.String(),
            content: Type.String(),
            createdAt: Type.String(),
            user: Type.Object({
              id: Type.String(),
              name: Type.String(),
              avatarUrl: Type.Optional(Type.String())
            })
          })
        })
      }
    }
  }, async (request, reply) => {
    const userId = (fastify as any).requireAuth(request)
    const { id } = request.params
    const { content, parentId } = request.body

    try {
      // Check if video exists
      const video = await fastify.db.video.findUnique({
        where: { id },
        select: { id: true }
      })

      if (!video) {
        return reply.status(404).send({ error: 'Video not found' })
      }

      // Create comment
      const comment = await fastify.db.comment.create({
        data: {
          content,
          videoId: id,
          userId,
          parentId
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatarUrl: true
            }
          }
        }
      })

      reply.status(201)
      return {
        success: true,
        data: {
          id: comment.id,
          content: comment.content,
          createdAt: comment.createdAt.toISOString(),
          user: comment.user
        }
      }
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Failed to create comment' })
    }
  })
}

export default videoRoutes