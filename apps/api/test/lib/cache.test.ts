import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import Redis from 'ioredis'
import { CacheService, CacheKeyBuilder, CACHE_CONFIG } from '../../src/lib/cache'

// Mock Redis
vi.mock('ioredis')
const MockedRedis = vi.mocked(Redis)

describe('CacheService', () => {
  let cacheService: CacheService
  let mockRedis: any

  beforeEach(() => {
    mockRedis = {
      connect: vi.fn().mockResolvedValue(undefined),
      disconnect: vi.fn().mockResolvedValue(undefined),
      get: vi.fn(),
      setex: vi.fn(),
      del: vi.fn(),
      keys: vi.fn(),
      mget: vi.fn(),
      pipeline: vi.fn(),
      ping: vi.fn().mockResolvedValue('PONG'),
      on: vi.fn()
    }
    MockedRedis.mockImplementation(() => mockRedis)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('constructor', () => {
    it('should initialize with default values when no Redis URL provided', () => {
      cacheService = new CacheService()
      expect(cacheService.isAvailable()).toBe(false)
    })

    it('should store Redis URL for later initialization', () => {
      cacheService = new CacheService('redis://localhost:6379')
      expect(MockedRedis).not.toHaveBeenCalled() // Lazy initialization
    })
  })

  describe('connect', () => {
    beforeEach(() => {
      cacheService = new CacheService('redis://localhost:6379')
    })

    it('should initialize Redis instance on first connect', async () => {
      await cacheService.connect()
      expect(MockedRedis).toHaveBeenCalledWith(
        'redis://localhost:6379',
        expect.objectContaining({
          maxRetriesPerRequest: 3,
          enableReadyCheck: true,
          lazyConnect: true
        })
      )
    })

    it('should handle connection failures gracefully', async () => {
      mockRedis.connect.mockRejectedValue(new Error('Connection failed'))
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      
      await cacheService.connect()
      
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Redis connection failed'),
        expect.any(Error)
      )
      consoleSpy.mockRestore()
    })
  })

  describe('get', () => {
    beforeEach(async () => {
      cacheService = new CacheService('redis://localhost:6379')
      await cacheService.connect()
      // Simulate connected state
      cacheService['isConnected'] = true
    })

    it('should return null when Redis is not connected', async () => {
      cacheService['isConnected'] = false
      const result = await cacheService.get('test-key')
      expect(result).toBeNull()
      expect(cacheService.getStats().misses).toBe(1)
    })

    it('should increment hits when cache hit occurs', async () => {
      const testData = { test: 'value' }
      mockRedis.get.mockResolvedValue(JSON.stringify(testData))
      
      const result = await cacheService.get('test-key')
      
      expect(result).toEqual(testData)
      expect(cacheService.getStats().hits).toBe(1)
      expect(cacheService.getStats().operations).toBe(1)
    })

    it('should increment misses when cache miss occurs', async () => {
      mockRedis.get.mockResolvedValue(null)
      
      const result = await cacheService.get('test-key')
      
      expect(result).toBeNull()
      expect(cacheService.getStats().misses).toBe(1)
    })

    it('should handle JSON parse errors gracefully', async () => {
      mockRedis.get.mockResolvedValue('invalid-json')
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      const result = await cacheService.get('test-key')
      
      expect(result).toBeNull()
      expect(cacheService.getStats().errors).toBe(1)
      consoleSpy.mockRestore()
    })
  })

  describe('set', () => {
    beforeEach(async () => {
      cacheService = new CacheService('redis://localhost:6379')
      await cacheService.connect()
      cacheService['isConnected'] = true
    })

    it('should set value with default TTL', async () => {
      const testData = { test: 'value' }
      
      await cacheService.set('test-key', testData)
      
      expect(mockRedis.setex).toHaveBeenCalledWith(
        'fabl:general:test-key',
        CACHE_CONFIG.DEFAULT_TTL,
        JSON.stringify(testData)
      )
    })

    it('should set value with custom TTL and prefix', async () => {
      const testData = { test: 'value' }
      
      await cacheService.set('test-key', testData, { ttl: 120, prefix: 'videos' })
      
      expect(mockRedis.setex).toHaveBeenCalledWith(
        'fabl:videos:test-key',
        120,
        JSON.stringify(testData)
      )
    })
  })

  describe('batch operations', () => {
    beforeEach(async () => {
      cacheService = new CacheService('redis://localhost:6379')
      await cacheService.connect()
      cacheService['isConnected'] = true
    })

    it('should handle mget with mixed hits and misses', async () => {
      mockRedis.mget.mockResolvedValue([
        JSON.stringify({ id: 1 }),
        null,
        JSON.stringify({ id: 3 })
      ])
      
      const results = await cacheService.mget(['key1', 'key2', 'key3'])
      
      expect(results).toEqual([{ id: 1 }, null, { id: 3 }])
      expect(cacheService.getStats().hits).toBe(2)
      expect(cacheService.getStats().misses).toBe(1)
    })

    it('should handle mset with multiple entries', async () => {
      const mockPipeline = {
        setex: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue([])
      }
      mockRedis.pipeline.mockReturnValue(mockPipeline)
      
      const entries = [
        { key: 'key1', value: { id: 1 } },
        { key: 'key2', value: { id: 2 } }
      ]
      
      await cacheService.mset(entries, { ttl: 60, prefix: 'test' })
      
      expect(mockPipeline.setex).toHaveBeenCalledTimes(2)
      expect(mockPipeline.setex).toHaveBeenCalledWith(
        'fabl:test:key1',
        60,
        JSON.stringify({ id: 1 })
      )
      expect(mockPipeline.exec).toHaveBeenCalled()
    })
  })

  describe('health check', () => {
    it('should return disconnected when Redis is not available', async () => {
      cacheService = new CacheService()
      const health = await cacheService.health()
      expect(health.status).toBe('disconnected')
    })

    it('should return connected with latency when ping succeeds', async () => {
      cacheService = new CacheService('redis://localhost:6379')
      await cacheService.connect()
      cacheService['isConnected'] = true
      
      const health = await cacheService.health()
      
      expect(health.status).toBe('connected')
      expect(typeof health.latency).toBe('number')
    })

    it('should return error status when ping fails', async () => {
      cacheService = new CacheService('redis://localhost:6379')
      await cacheService.connect()
      cacheService['isConnected'] = true
      mockRedis.ping.mockRejectedValue(new Error('Ping failed'))
      
      const health = await cacheService.health()
      
      expect(health.status).toBe('error')
      expect(health.error).toBe('Ping failed')
    })
  })

  describe('statistics', () => {
    beforeEach(async () => {
      cacheService = new CacheService('redis://localhost:6379')
      await cacheService.connect()
      cacheService['isConnected'] = true
    })

    it('should calculate hit rate correctly', async () => {
      // Simulate 3 hits, 1 miss
      mockRedis.get
        .mockResolvedValueOnce(JSON.stringify({}))
        .mockResolvedValueOnce(JSON.stringify({}))
        .mockResolvedValueOnce(JSON.stringify({}))
        .mockResolvedValueOnce(null)
      
      await cacheService.get('key1')
      await cacheService.get('key2')
      await cacheService.get('key3')
      await cacheService.get('key4')
      
      const stats = cacheService.getStats()
      expect(stats.hits).toBe(3)
      expect(stats.misses).toBe(1)
      expect(stats.hitRate).toBe('75.00%')
    })

    it('should reset statistics', async () => {
      await cacheService.get('key1')
      expect(cacheService.getStats().operations).toBe(1)
      
      cacheService.resetStats()
      
      const stats = cacheService.getStats()
      expect(stats.hits).toBe(0)
      expect(stats.misses).toBe(0)
      expect(stats.operations).toBe(0)
    })
  })
})

describe('CacheKeyBuilder', () => {
  describe('createSortedKey', () => {
    it('should generate consistent keys regardless of object key order', () => {
      const obj1 = { b: 2, a: 1, c: 3 }
      const obj2 = { a: 1, c: 3, b: 2 }
      
      const key1 = CacheKeyBuilder.createSortedKey('test', obj1)
      const key2 = CacheKeyBuilder.createSortedKey('test', obj2)
      
      expect(key1).toBe(key2)
      expect(key1).toBe('test:{"a":1,"b":2,"c":3}')
    })

    it('should handle nested objects correctly', () => {
      const obj = {
        query: { search: 'test' },
        page: 1,
        filters: { category: 'video' }
      }
      
      const key = CacheKeyBuilder.createSortedKey('search', obj)
      
      expect(key).toContain('search:')
      expect(key).toContain('"filters"')
      expect(key).toContain('"page"')
      expect(key).toContain('"query"')
    })

    it('should handle special characters in values', () => {
      const obj = { query: 'test with spaces & symbols!' }
      
      const key = CacheKeyBuilder.createSortedKey('search', obj)
      
      expect(key).toBe('search:{"query":"test with spaces & symbols!"}')
    })
  })

  describe('videoList', () => {
    it('should generate consistent keys for same query parameters', () => {
      const query = { status: 'published', creatorId: '123' }
      
      const key1 = CacheKeyBuilder.videoList(query, 1, 20)
      const key2 = CacheKeyBuilder.videoList(query, 1, 20)
      
      expect(key1).toBe(key2)
    })

    it('should generate different keys for different parameters', () => {
      const query = { status: 'published' }
      
      const key1 = CacheKeyBuilder.videoList(query, 1, 20)
      const key2 = CacheKeyBuilder.videoList(query, 2, 20)
      const key3 = CacheKeyBuilder.videoList(query, 1, 10)
      
      expect(key1).not.toBe(key2)
      expect(key1).not.toBe(key3)
      expect(key2).not.toBe(key3)
    })
  })

  describe('videoDetail', () => {
    it('should generate simple key for video ID', () => {
      const key = CacheKeyBuilder.videoDetail('video-123')
      expect(key).toBe('videos:detail:video-123')
    })
  })

  describe('searchResults', () => {
    it('should include query and filters in key', () => {
      const filters = { category: 'music', duration: 'short' }
      const key = CacheKeyBuilder.searchResults('test query', filters)
      
      expect(key).toContain('search:')
      expect(key).toContain('test query')
      expect(key).toContain('category')
      expect(key).toContain('duration')
    })
  })
})