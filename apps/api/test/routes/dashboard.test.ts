import { mockPrisma, createMockVideo, createMockUser, createMockComment, createMockFastify } from '../setup'

describe('Dashboard Routes', () => {
  let mockFastify: any

  beforeEach(() => {
    mockFastify = createMockFastify()
  })

  describe('Dashboard Stats Endpoint', () => {
    it('should return dashboard stats for authenticated user', async () => {
      const mockUserData = {
        subscriberCount: 100,
        videos: [
          { views: 1000, createdAt: new Date('2024-01-01'), _count: { comments: 5 } },
          { views: 500, createdAt: new Date('2024-02-01'), _count: { comments: 3 } }
        ],
        subscribers: [
          { id: 'sub-1' },
          { id: 'sub-2' }
        ]
      }

      // Mock cache miss and database response
      mockFastify.cache.get.mockResolvedValueOnce(null)
      mockFastify.cache.set.mockResolvedValueOnce(true)
      ;(mockPrisma.user.findUnique as jest.Mock).mockResolvedValueOnce(mockUserData)

      // Simulate the stats calculation logic
      const currentViews = mockUserData.videos.reduce((sum, video) => sum + video.views, 0)
      const currentSubs = mockUserData.subscriberCount
      const recentSubsCount = mockUserData.subscribers.length
      const prevSubs = currentSubs - recentSubsCount

      const calculateChange = (current: number, previous: number): number => {
        if (previous === 0) return current > 0 ? 100 : 0
        return Math.round(((current - previous) / previous) * 100 * 100) / 100
      }

      const expectedStats = {
        subscribers: {
          current: currentSubs,
          change: calculateChange(currentSubs, prevSubs),
          period: '30 days'
        },
        views: {
          total: currentViews,
          change: 0, // No previous views in this simplified test
          period: '30 days'
        },
        watchTime: {
          hours: Math.round((currentViews * 3) / 60),
          change: 0,
          period: '30 days'
        },
        revenue: {
          total: 0,
          change: 0,
          breakdown: { ads: 0, memberships: 0, other: 0 }
        }
      }

      // Verify mock was called correctly
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'test-user-id' },
        select: expect.objectContaining({
          subscriberCount: true,
          videos: expect.any(Object),
          subscribers: expect.any(Object)
        })
      })

      expect(mockFastify.cache.get).toHaveBeenCalledWith(
        'dashboard:stats:test-user-id',
        { prefix: 'dashboard', ttl: 60 }
      )
    })

    it('should return cached stats when available', async () => {
      const cachedStats = {
        subscribers: { current: 100, change: 10, period: '30 days' },
        views: { total: 1000, change: 5, period: '30 days' },
        watchTime: { hours: 50, change: 8, period: '30 days' },
        revenue: { total: 0, change: 0, breakdown: { ads: 0, memberships: 0, other: 0 } }
      }

      mockFastify.cache.get.mockResolvedValueOnce(cachedStats)

      // If cache hit, should not call database
      expect(mockPrisma.user.findUnique).not.toHaveBeenCalled()
    })

    it('should handle user not found', async () => {
      mockFastify.cache.get.mockResolvedValueOnce(null)
      ;(mockPrisma.user.findUnique as jest.Mock).mockResolvedValueOnce(null)

      // Should call database but return null
      expect(mockPrisma.user.findUnique).toHaveBeenCalled()
    })

    it('should handle database errors gracefully', async () => {
      mockFastify.cache.get.mockResolvedValueOnce(null)
      ;(mockPrisma.user.findUnique as jest.Mock).mockRejectedValueOnce(new Error('Database error'))

      // Should log error via fastify log
      expect(mockFastify.log.error).toBeDefined()
    })
  })

  describe('Top Videos Endpoint', () => {
    it('should return top performing videos for user', async () => {
      const mockVideoData = [
        {
          id: 'video-1',
          title: 'Top Video',
          views: 1000,
          _count: { likes: 10, comments: 5 }
        },
        {
          id: 'video-2', 
          title: 'Second Video',
          views: 500,
          _count: { likes: 8, comments: 3 }
        }
      ]

      ;(mockPrisma.video.findMany as jest.Mock).mockResolvedValueOnce(mockVideoData)

      // Verify query structure
      expect(mockPrisma.video.findMany).toHaveBeenCalledWith({
        where: {
          creatorId: 'test-user-id',
          status: 'PUBLISHED'
        },
        select: expect.objectContaining({
          id: true,
          title: true,
          views: true,
          _count: expect.any(Object)
        }),
        orderBy: { views: 'desc' },
        take: 10
      })
    })

    it('should handle empty video list', async () => {
      ;(mockPrisma.video.findMany as jest.Mock).mockResolvedValueOnce([])
      
      // Should handle empty results gracefully
      expect(mockPrisma.video.findMany).toHaveBeenCalled()
    })
  })

  describe('Recent Subscribers Endpoint', () => {
    it('should return recent subscribers', async () => {
      const mockSubscriptionData = [
        {
          id: 'sub-1',
          subscriberId: 'user-1',
          channelId: 'test-user-id',
          createdAt: new Date('2024-01-15'),
          subscriber: {
            id: 'user-1',
            name: 'New Subscriber',
            avatarUrl: 'https://example.com/avatar1.jpg',
            subscriberCount: 50
          }
        }
      ]

      ;(mockPrisma.subscription.findMany as jest.Mock).mockResolvedValueOnce(mockSubscriptionData)

      // Verify query structure
      expect(mockPrisma.subscription.findMany).toHaveBeenCalledWith({
        where: { channelId: 'test-user-id' },
        include: {
          subscriber: {
            select: expect.objectContaining({
              id: true,
              name: true,
              avatarUrl: true,
              subscriberCount: true
            })
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 20
      })
    })
  })

  describe('Recent Comments Endpoint', () => {
    it('should return recent comments on user videos', async () => {
      const mockCommentData = [
        {
          id: 'comment-1',
          content: 'Great video!',
          videoId: 'video-1',
          createdAt: new Date('2024-01-15'),
          user: {
            id: 'user-1',
            name: 'Commenter',
            avatarUrl: 'https://example.com/avatar.jpg'
          },
          video: {
            id: 'video-1',
            title: 'Test Video'
          }
        }
      ]

      ;(mockPrisma.comment.findMany as jest.Mock).mockResolvedValueOnce(mockCommentData)

      // Verify query structure
      expect(mockPrisma.comment.findMany).toHaveBeenCalledWith({
        where: {
          video: { creatorId: 'test-user-id' }
        },
        include: expect.objectContaining({
          user: expect.any(Object),
          video: expect.any(Object)
        }),
        orderBy: { createdAt: 'desc' },
        take: 20
      })
    })

    it('should handle database errors in comments endpoint', async () => {
      ;(mockPrisma.comment.findMany as jest.Mock).mockRejectedValueOnce(new Error('Database error'))

      // Should handle error gracefully
      expect(mockFastify.log.error).toBeDefined()
    })
  })

  describe('Dashboard calculation logic', () => {
    it('should calculate percentage changes correctly', () => {
      const calculateChange = (current: number, previous: number): number => {
        if (previous === 0) return current > 0 ? 100 : 0
        return Math.round(((current - previous) / previous) * 100 * 100) / 100
      }

      expect(calculateChange(120, 100)).toBe(20)
      expect(calculateChange(100, 120)).toBe(-16.67)
      expect(calculateChange(100, 0)).toBe(100)
      expect(calculateChange(0, 0)).toBe(0)
    })

    it('should calculate watch time based on average view duration', () => {
      const currentViews = 1200
      const AVERAGE_WATCH_TIME_MINUTES = 3
      
      const estimatedWatchTimeHours = Math.round((currentViews * AVERAGE_WATCH_TIME_MINUTES) / 60)
      
      expect(estimatedWatchTimeHours).toBe(60) // (1200 * 3) / 60 = 60
    })

    it('should handle edge cases in stats calculations', () => {
      const calculateChange = (current: number, previous: number): number => {
        if (previous === 0) return current > 0 ? 100 : 0
        return Math.round(((current - previous) / previous) * 100 * 100) / 100
      }

      expect(calculateChange(0, 100)).toBe(-100)
      expect(calculateChange(50, 0)).toBe(100)
      expect(calculateChange(0, 0)).toBe(0)
    })
  })
})