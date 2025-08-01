import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { build } from '../helpers/build-app'
import { FastifyInstance } from 'fastify'

describe('Video Routes Integration', () => {
  let app: FastifyInstance

  beforeEach(async () => {
    app = build()
    await app.ready()
  })

  afterEach(async () => {
    await app.close()
  })

  describe('GET /api/videos', () => {
    it('should return paginated video list with default parameters', async () => {
      // Mock database response
      const mockVideos = [
        {
          id: 'video-1',
          title: 'Test Video 1',
          description: 'Test description',
          thumbnailUrl: 'https://example.com/thumb1.jpg',
          duration: 120,
          views: 1000,
          createdAt: new Date('2024-01-01T10:00:00Z'),
          publishedAt: new Date('2024-01-01T12:00:00Z'),
          creator: {
            id: 'creator-1',
            name: 'Test Creator',
            username: 'testcreator',
            avatarUrl: 'https://example.com/avatar1.jpg'
          }
        }
      ]

      // Mock database calls
      app.db.video.findMany = vi.fn().mockResolvedValue(mockVideos)
      app.db.video.count = vi.fn().mockResolvedValue(1)

      const response = await app.inject({
        method: 'GET',
        url: '/api/videos'
      })

      expect(response.statusCode).toBe(200)
      const data = JSON.parse(response.body)
      
      expect(data.videos).toHaveLength(1)
      expect(data.videos[0]).toMatchObject({
        id: 'video-1',
        title: 'Test Video 1',
        creator: {
          id: 'creator-1',
          name: 'Test Creator'
        }
      })
      
      expect(data.pagination).toEqual({
        page: 1,
        limit: 20,
        total: 1,
        totalPages: 1
      })
    })

    it('should handle pagination parameters correctly', async () => {
      app.db.video.findMany = vi.fn().mockResolvedValue([])
      app.db.video.count = vi.fn().mockResolvedValue(100)

      const response = await app.inject({
        method: 'GET',
        url: '/api/videos?page=3&limit=15'
      })

      expect(response.statusCode).toBe(200)
      
      // Verify database was called with correct pagination
      expect(app.db.video.findMany).toHaveBeenCalledWith({
        where: {
          status: 'PUBLISHED',
          isApproved: true
        },
        include: expect.any(Object),
        orderBy: { publishedAt: 'desc' },
        skip: 30, // (3-1) * 15
        take: 15
      })
    })

    it('should limit page size to maximum of 100', async () => {
      app.db.video.findMany = vi.fn().mockResolvedValue([])
      app.db.video.count = vi.fn().mockResolvedValue(0)

      const response = await app.inject({
        method: 'GET',
        url: '/api/videos?limit=500'
      })

      expect(response.statusCode).toBe(200)
      
      // Verify limit was capped at 100
      expect(app.db.video.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 100
        })
      )
    })

    it('should handle creator-specific queries', async () => {
      app.db.video.findMany = vi.fn().mockResolvedValue([])
      app.db.video.count = vi.fn().mockResolvedValue(0)

      const response = await app.inject({
        method: 'GET',
        url: '/api/videos?creatorId=creator-123'
      })

      expect(response.statusCode).toBe(200)
      
      // Verify where clause for creator
      expect(app.db.video.findMany).toHaveBeenCalledWith({
        where: {
          creatorId: 'creator-123'
        },
        include: expect.any(Object),
        orderBy: { publishedAt: 'desc' },
        skip: 0,
        take: 20
      })
    })

    it('should use cache for repeated requests', async () => {
      const mockVideos = [{
        id: 'video-1',
        title: 'Cached Video',
        description: null,
        thumbnailUrl: null,
        duration: 60,
        views: 500,
        createdAt: new Date(),
        publishedAt: new Date(),
        creator: { id: 'c1', name: 'Creator', username: 'creator', avatarUrl: null }
      }]

      app.db.video.findMany = vi.fn().mockResolvedValue(mockVideos)
      app.db.video.count = vi.fn().mockResolvedValue(1)

      // First request
      const response1 = await app.inject({
        method: 'GET',
        url: '/api/videos'
      })

      // Second identical request
      const response2 = await app.inject({
        method: 'GET',
        url: '/api/videos'
      })

      expect(response1.statusCode).toBe(200)
      expect(response2.statusCode).toBe(200)
      
      // Database should only be called once due to caching
      expect(app.db.video.findMany).toHaveBeenCalledTimes(1)
      expect(app.db.video.count).toHaveBeenCalledTimes(1)
    })
  })

  describe('GET /api/videos/:id', () => {
    it('should return video details for valid ID', async () => {
      const mockVideo = {
        id: 'video-123',
        title: 'Test Video',
        description: 'Test description',
        thumbnailUrl: 'https://example.com/thumb.jpg',
        videoUrl: 'https://example.com/video.mp4',
        muxPlaybackId: 'mux-123',
        duration: 180,
        views: 1500,
        status: 'PUBLISHED',
        createdAt: new Date('2024-01-01T10:00:00Z'),
        publishedAt: new Date('2024-01-01T12:00:00Z'),
        creator: {
          id: 'creator-1',
          name: 'Test Creator',
          username: 'testcreator',
          avatarUrl: 'https://example.com/avatar.jpg',
          subscriberCount: 100
        },
        _count: {
          likes: 50
        }
      }

      app.db.video.findUnique = vi.fn().mockResolvedValue(mockVideo)
      app.db.video.update = vi.fn().mockResolvedValue({})

      const response = await app.inject({
        method: 'GET',
        url: '/api/videos/video-123'
      })

      expect(response.statusCode).toBe(200)
      const data = JSON.parse(response.body)
      
      expect(data).toMatchObject({
        id: 'video-123',
        title: 'Test Video',
        likes: 50,
        creator: {
          id: 'creator-1',
          name: 'Test Creator',
          subscriberCount: 100
        }
      })
      
      // Verify view count increment was called
      expect(app.db.video.update).toHaveBeenCalledWith({
        where: { id: 'video-123' },
        data: { views: { increment: 1 } }
      })
    })

    it('should return 404 for non-existent video', async () => {
      app.db.video.findUnique = vi.fn().mockResolvedValue(null)

      const response = await app.inject({
        method: 'GET',
        url: '/api/videos/non-existent'
      })

      expect(response.statusCode).toBe(404)
      const data = JSON.parse(response.body)
      expect(data.error).toBe('Video not found')
    })

    it('should use cache for repeated video detail requests', async () => {
      const mockVideo = {
        id: 'video-cached',
        title: 'Cached Video',
        description: null,
        thumbnailUrl: null,
        videoUrl: 'https://example.com/video.mp4',
        muxPlaybackId: null,
        duration: 120,
        views: 1000,
        status: 'PUBLISHED',
        createdAt: new Date(),
        publishedAt: new Date(),
        creator: { id: 'c1', name: 'Creator', username: 'creator', avatarUrl: null, subscriberCount: 0 },
        _count: { likes: 10 }
      }

      app.db.video.findUnique = vi.fn().mockResolvedValue(mockVideo)
      app.db.video.update = vi.fn().mockResolvedValue({})

      // First request
      const response1 = await app.inject({
        method: 'GET',
        url: '/api/videos/video-cached'
      })

      // Second identical request
      const response2 = await app.inject({
        method: 'GET',
        url: '/api/videos/video-cached'
      })

      expect(response1.statusCode).toBe(200)
      expect(response2.statusCode).toBe(200)
      
      // Database findUnique should only be called once due to caching
      expect(app.db.video.findUnique).toHaveBeenCalledTimes(1)
      
      // But view increment should be called twice (not cached)
      expect(app.db.video.update).toHaveBeenCalledTimes(2)
    })
  })

  describe('error handling', () => {
    it('should handle database errors gracefully', async () => {
      app.db.video.findMany = vi.fn().mockRejectedValue(new Error('Database error'))

      const response = await app.inject({
        method: 'GET',
        url: '/api/videos'
      })

      expect(response.statusCode).toBe(500)
    })

    it('should handle cache errors gracefully', async () => {
      // Mock cache failure
      app.cache.get = vi.fn().mockRejectedValue(new Error('Cache error'))
      app.cache.set = vi.fn().mockRejectedValue(new Error('Cache error'))
      
      const mockVideos = [{
        id: 'video-1',
        title: 'Test',
        description: null,
        thumbnailUrl: null,
        duration: 60,
        views: 100,
        createdAt: new Date(),
        publishedAt: new Date(),
        creator: { id: 'c1', name: 'Creator', username: 'creator', avatarUrl: null }
      }]
      
      app.db.video.findMany = vi.fn().mockResolvedValue(mockVideos)
      app.db.video.count = vi.fn().mockResolvedValue(1)

      const response = await app.inject({
        method: 'GET',
        url: '/api/videos'
      })

      // Should still work despite cache errors
      expect(response.statusCode).toBe(200)
      
      // Database should still be called
      expect(app.db.video.findMany).toHaveBeenCalled()
    })
  })
})