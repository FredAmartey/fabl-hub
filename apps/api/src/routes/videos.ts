import { FastifyPluginAsync } from 'fastify'
import { Type } from '@sinclair/typebox'
import { CacheKeyBuilder, CACHE_CONFIG } from '../lib/cache'

// Request parsing utilities
interface VideoListQuery {
  page?: string
  limit?: string
  status?: string
  creatorId?: string
}

interface ParsedVideoListRequest {
  query: VideoListQuery
  pagination: {
    page: number
    limit: number
    skip: number
  }
  where: any
}

function parseVideoListRequest(request: any): ParsedVideoListRequest {
  const query = request.query as VideoListQuery
  const page = parseInt(query.page || '1', 10)
  const limit = Math.min(parseInt(query.limit || '20', 10), 100)
  const skip = (page - 1) * limit

  const where: any = {
    status: 'PUBLISHED'
    // Note: Removed isApproved filter to show all published videos
    // Moderation happens asynchronously, so manually published videos should be visible
  }

  if (query.creatorId) {
    where.creatorId = query.creatorId
    delete where.status
    delete where.isApproved
  }

  return {
    query,
    pagination: { page, limit, skip },
    where
  }
}

// Database operations
async function fetchVideosFromDatabase(fastify: any, where: any, skip: number, limit: number) {
  return Promise.all([
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
}

// Response formatting
function formatVideoListResponse(videos: any[], total: number, page: number, limit: number) {
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
}

// Main business logic
async function getVideoList(fastify: any, parsedRequest: ParsedVideoListRequest) {
  const { where, pagination } = parsedRequest
  const [videos, total] = await fetchVideosFromDatabase(fastify, where, pagination.skip, pagination.limit)
  return formatVideoListResponse(videos, total, pagination.page, pagination.limit)
}

// Video detail operations
async function fetchVideoFromDatabase(fastify: any, videoId: string) {
  return fastify.db.video.findUnique({
    where: { id: videoId },
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
}

function formatVideoDetailResponse(video: any) {
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
}

async function getVideoDetails(fastify: any, videoId: string) {
  const video = await fetchVideoFromDatabase(fastify, videoId)
  
  if (!video) {
    throw new Error('Video not found')
  }

  return formatVideoDetailResponse(video)
}

async function incrementVideoViews(fastify: any, videoId: string) {
  // Increment view count in background, don't await
  fastify.db.video.update({
    where: { id: videoId },
    data: { views: { increment: 1 } }
  }).catch((err: any) => fastify.log.error({ err, videoId }, 'Failed to increment view count'))
}

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
    const parsedRequest = parseVideoListRequest(request)
    const cacheKey = CacheKeyBuilder.videoList(
      parsedRequest.query, 
      parsedRequest.pagination.page, 
      parsedRequest.pagination.limit
    )
    
    return await fastify.cache.wrap(
      cacheKey,
      () => getVideoList(fastify, parsedRequest),
      { 
        prefix: 'api',
        ttl: CACHE_CONFIG.VIDEO_LIST_TTL
      }
    )
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
    const { id } = request.params as { id: string }
    const cacheKey = CacheKeyBuilder.videoDetail(id)

    try {
      // Get video details with caching
      const video = await fastify.cache.wrap(
        cacheKey,
        () => getVideoDetails(fastify, id),
        { 
          prefix: 'api',
          ttl: CACHE_CONFIG.VIDEO_DETAIL_TTL
        }
      )

      // Increment view count in background (don't cache this)
      incrementVideoViews(fastify, id)

      return video
    } catch (error) {
      if (error instanceof Error && error.message === 'Video not found') {
        return reply.status(404).send({ error: 'Video not found' })
      }
      throw error
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
    const videoData = request.body as any

    const video = await fastify.db.video.create({
      data: {
        title: videoData.title,
        description: videoData.description,
        videoUrl: videoData.videoUrl,
        muxAssetId: videoData.muxAssetId,
        muxPlaybackId: videoData.muxPlaybackId,
        thumbnailUrl: videoData.thumbnailUrl,
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
    const params = request.params as any
    const { id } = params

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
        ...(request.body as Record<string, any>),
        ...((request.body as any).status === 'PUBLISHED' && { 
          publishedAt: new Date(),
          isApproved: true // Auto-approve manually published videos
        })
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
    const params = request.params as any
    const { id } = params

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
    const params = request.params as any
    const { id } = params
    const body = request.body as any || {}
    const { watchTime, userId } = body

    try {
      // Check if video exists
      const video = await fastify.db.video.findUnique({
        where: { id },
        select: { id: true, views: true }
      })

      if (!video) {
        return reply.status(404).send({ error: 'Video not found' })
      }

      // View deduplication: Check if same user/IP has viewed recently
      const viewKey = `view:${id}:${userId || request.ip || 'anonymous'}`
      const recentView = await fastify.cache.get(viewKey)
      
      let shouldIncrement = false
      if (!recentView) {
        // First view from this user/IP in the last hour
        shouldIncrement = true
        await fastify.cache.set(viewKey, Date.now(), { ttl: 3600 }) // 1 hour cooldown
      }

      // Increment view count only if it's a new unique view
      const updatedVideo = shouldIncrement 
        ? await fastify.db.video.update({
            where: { id },
            data: { views: { increment: 1 } }
          })
        : video

      // Store detailed view analytics data
      await fastify.db.viewEvent.create({
        data: {
          videoId: id,
          userId: userId || null,
          watchTime: watchTime || 0,
          completed: watchTime ? watchTime >= 30 : false, // Consider 30+ seconds as meaningful view
        }
      }).catch(err => {
        // Log error but don't fail the request
        fastify.log.error({ err, videoId: id }, 'Failed to store view analytics')
      })

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
    const params = request.params as any
    const { id } = params

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
    const { id } = request.params as { id: string }
    const commentQuery = request.query as any
    const page = parseInt(commentQuery.page || '1', 10)
    const limit = Math.min(parseInt(commentQuery.limit || '20', 10), 50)
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
    const params = request.params as any
    const { id } = params
    const body = request.body as any
    const { content, parentId } = body

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