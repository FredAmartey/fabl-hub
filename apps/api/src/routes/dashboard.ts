import { FastifyPluginAsync } from 'fastify'
import { Type } from '@sinclair/typebox'

const dashboardRoutes: FastifyPluginAsync = async (fastify) => {
  // Get dashboard stats
  fastify.get('/stats', {
    schema: {
      response: {
        200: Type.Object({
          subscribers: Type.Object({
            current: Type.Number(),
            change: Type.Number(),
            period: Type.String()
          }),
          views: Type.Object({
            total: Type.Number(),
            change: Type.Number(),
            period: Type.String()
          }),
          watchTime: Type.Object({
            hours: Type.Number(),
            change: Type.Number(),
            period: Type.String()
          }),
          revenue: Type.Object({
            total: Type.Number(),
            change: Type.Number(),
            breakdown: Type.Object({
              ads: Type.Number(),
              memberships: Type.Number(),
              other: Type.Number()
            })
          })
        })
      }
    }
  }, async (request, reply) => {
    const userId = (fastify as any).requireAuth(request)

    try {
      // Try to get cached stats first
      const cacheKey = `dashboard:stats:${userId}`
      const cachedStats = await fastify.cache.get<any>(cacheKey, {
        prefix: 'dashboard',
        ttl: 60 // Cache for 1 minute since dashboard stats change frequently
      })
      
      if (cachedStats) {
        return reply.send(cachedStats)
      }
      
      // Constants for calculations
      const COMPARISON_PERIOD_DAYS = 30
      const AVERAGE_WATCH_TIME_MINUTES = 3
      
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - COMPARISON_PERIOD_DAYS)

      // Single optimized query to get all user stats
      const userStats = await fastify.db.user.findUnique({
        where: { id: userId },
        select: {
          subscriberCount: true,
          videos: {
            select: {
              views: true,
              createdAt: true,
              _count: {
                select: { comments: true }
              }
            }
          },
          subscribers: {
            where: { createdAt: { gte: thirtyDaysAgo } },
            select: { id: true }
          }
        }
      })

      if (!userStats) {
        return reply.status(404).send({ error: 'User not found' })
      }

      // Calculate aggregated stats from the single query result
      const currentViews = userStats.videos.reduce((sum, video) => sum + video.views, 0)
      const totalComments = userStats.videos.reduce((sum, video) => sum + video._count.comments, 0)
      const videoCount = userStats.videos.length
      
      // Calculate views from older videos (created before 30 days ago)
      const prevViews = userStats.videos
        .filter(video => video.createdAt < thirtyDaysAgo)
        .reduce((sum, video) => sum + video.views, 0)

      // Calculate stats for current period
      const currentSubs = userStats.subscriberCount
      const recentSubsCount = userStats.subscribers.length
      const prevSubs = currentSubs - recentSubsCount

      // Calculate percentage changes with safe division
      const calculateChange = (current: number, previous: number): number => {
        if (previous === 0) return current > 0 ? 100 : 0
        return Math.round(((current - previous) / previous) * 100 * 100) / 100
      }

      const viewsChange = calculateChange(currentViews, prevViews)
      const subsChange = calculateChange(currentSubs, prevSubs)
      
      // Calculate watch time based on views
      const estimatedWatchTimeHours = Math.round((currentViews * AVERAGE_WATCH_TIME_MINUTES) / 60)
      const prevWatchTimeHours = Math.round((prevViews * AVERAGE_WATCH_TIME_MINUTES) / 60)
      const watchTimeChange = calculateChange(estimatedWatchTimeHours, prevWatchTimeHours)

      const statsResponse = {
        subscribers: {
          current: currentSubs,
          change: subsChange,
          period: `${COMPARISON_PERIOD_DAYS} days`
        },
        views: {
          total: currentViews,
          change: viewsChange,
          period: `${COMPARISON_PERIOD_DAYS} days`
        },
        watchTime: {
          hours: estimatedWatchTimeHours,
          change: watchTimeChange,
          period: `${COMPARISON_PERIOD_DAYS} days`
        },
        revenue: {
          total: 0, // TODO: Implement revenue tracking
          change: 0,
          breakdown: {
            ads: 0,
            memberships: 0,
            other: 0
          }
        }
      }
      
      // Cache the response
      await fastify.cache.set(cacheKey, statsResponse, {
        prefix: 'dashboard',
        ttl: 60 // Cache for 1 minute
      })
      
      return statsResponse
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Failed to get dashboard stats' })
    }
  })

  // Get top performing videos
  fastify.get('/top-videos', {
    schema: {
      response: {
        200: Type.Array(Type.Object({
          id: Type.String(),
          title: Type.String(),
          views: Type.Number(),
          engagement: Type.String(),
          rank: Type.Number()
        }))
      }
    }
  }, async (request, reply) => {
    const userId = (fastify as any).requireAuth(request)

    try {
      const topVideos = await fastify.db.video.findMany({
        where: {
          creatorId: userId,
          status: 'PUBLISHED'
        },
        select: {
          id: true,
          title: true,
          views: true,
          _count: {
            select: {
              likes: true,
              comments: true
            }
          }
        },
        orderBy: { views: 'desc' },
        take: 10
      })

      return topVideos.map((video: any, index: number) => ({
        id: video.id,
        title: video.title,
        views: video.views,
        engagement: `${video._count.likes + video._count.comments} interactions`,
        rank: index + 1
      }))
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Failed to get top videos' })
    }
  })

  // Get recent subscribers
  fastify.get('/recent-subscribers', {
    schema: {
      response: {
        200: Type.Array(Type.Object({
          id: Type.String(),
          name: Type.String(),
          subscriberCount: Type.Number(),
          avatar: Type.Optional(Type.String()),
          subscribedAt: Type.String()
        }))
      }
    }
  }, async (request, reply) => {
    const userId = (fastify as any).requireAuth(request)

    try {
      const recentSubscriptions = await fastify.db.subscription.findMany({
        where: { channelId: userId },
        include: {
          subscriber: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
              subscriberCount: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 20
      })

      return recentSubscriptions.map((sub: any) => ({
        id: sub.subscriber.id,
        name: sub.subscriber.name,
        subscriberCount: sub.subscriber.subscriberCount,
        avatar: sub.subscriber.avatarUrl,
        subscribedAt: sub.createdAt.toISOString()
      }))
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Failed to get recent subscribers' })
    }
  })

  // Get recent comments on user's videos
  fastify.get('/recent-comments', {
    schema: {
      response: {
        200: Type.Array(Type.Object({
          id: Type.String(),
          user: Type.String(),
          content: Type.String(),
          createdAt: Type.String(),
          videoId: Type.String(),
          avatar: Type.Optional(Type.String())
        }))
      }
    }
  }, async (request, reply) => {
    const userId = (fastify as any).requireAuth(request)

    try {
      const recentComments = await fastify.db.comment.findMany({
        where: {
          video: { creatorId: userId }
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatarUrl: true
            }
          },
          video: {
            select: {
              id: true,
              title: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 20
      })

      return recentComments.map((comment: any) => ({
        id: comment.id,
        user: comment.user.name,
        content: comment.content,
        createdAt: comment.createdAt.toISOString(),
        videoId: comment.videoId,
        avatar: comment.user.avatarUrl
      }))
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Failed to get recent comments' })
    }
  })
}

export default dashboardRoutes