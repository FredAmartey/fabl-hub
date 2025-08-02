import { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'
import Redis from 'ioredis'

// Cache configuration constants
export const CACHE_CONFIG = {
  DEFAULT_TTL: 300, // 5 minutes
  VIDEO_LIST_TTL: 60, // 1 minute
  VIDEO_DETAIL_TTL: 300, // 5 minutes
  USER_PROFILE_TTL: 600, // 10 minutes
  SEARCH_RESULTS_TTL: 120, // 2 minutes
} as const

// Cache key utilities
export class CacheKeyBuilder {
  static createSortedKey(prefix: string, data: Record<string, any>): string {
    const sortedKeys = Object.keys(data).sort()
    const sortedData = sortedKeys.reduce((result, key) => {
      result[key] = data[key]
      return result
    }, {} as Record<string, any>)
    
    const hash = JSON.stringify(sortedData)
    return `${prefix}:${hash}`
  }

  static videoList(query: Record<string, any>, page: number, limit: number): string {
    return this.createSortedKey('videos:list', { ...query, page, limit })
  }

  static videoDetail(videoId: string): string {
    return `videos:detail:${videoId}`
  }

  static userProfile(userId: string): string {
    return `users:profile:${userId}`
  }

  static searchResults(query: string, filters: Record<string, any> = {}): string {
    return this.createSortedKey('search', { query, ...filters })
  }
}

declare module 'fastify' {
  interface FastifyInstance {
    cache: CacheService
  }
}

interface CacheOptions {
  ttl?: number // Time to live in seconds
  prefix?: string
}

class CacheService {
  private redis: Redis | null = null
  private defaultTTL = CACHE_CONFIG.DEFAULT_TTL
  private isConnected = false
  private redisUrl?: string
  private stats = {
    hits: 0,
    misses: 0,
    errors: 0,
    operations: 0
  }

  constructor(redisUrl?: string) {
    this.redisUrl = redisUrl
    this.stats = { hits: 0, misses: 0, errors: 0, operations: 0 }
  }

  private getRedisConfig() {
    return {
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      lazyConnect: true,
      // Production-ready connection options
      connectTimeout: 10000,
      commandTimeout: 5000,
      retryDelayOnFailover: 100,
      enableOfflineQueue: false,
      // Connection pool settings
      family: 4,
      keepAlive: 30000,
      db: 0
    }
  }

  private createRedisInstance(): Redis | null {
    if (!this.redisUrl) return null
    
    try {
      return new Redis(this.redisUrl, this.getRedisConfig())
    } catch (error) {
      console.warn('Redis cache initialization failed:', error)
      return null
    }
  }

  private handleConnect(): void {
    console.log('✅ Redis cache connected')
    this.isConnected = true
  }

  private handleReady(): void {
    console.log('✅ Redis cache ready')
    this.isConnected = true
  }

  private handleError(error: Error): void {
    console.error('Redis cache error:', error)
    this.isConnected = false
    this.stats.errors++
    // Don't crash the app if Redis fails, just disable caching temporarily
  }

  private handleClose(): void {
    console.log('⚠️ Redis cache connection closed')
    this.isConnected = false
  }

  private handleReconnecting(): void {
    console.log('🔄 Redis cache reconnecting...')
    this.isConnected = false
  }

  private setupEventHandlers(redis: Redis): void {
    redis.on('connect', () => this.handleConnect())
    redis.on('ready', () => this.handleReady())
    redis.on('error', (err) => this.handleError(err))
    redis.on('close', () => this.handleClose())
    redis.on('reconnecting', () => this.handleReconnecting())
  }

  private initializeRedis(): void {
    this.redis = this.createRedisInstance()
    if (this.redis) {
      this.setupEventHandlers(this.redis)
    }
  }

  async connect(): Promise<void> {
    if (!this.redis) {
      this.initializeRedis()
    }
    
    if (this.redis && !this.isConnected) {
      try {
        await this.redis.connect()
      } catch (error) {
        console.warn('❌ Redis connection failed, caching disabled:', error)
        this.redis = null
      }
    }
  }

  async disconnect(): Promise<void> {
    if (this.redis) {
      await this.redis.disconnect()
    }
  }

  private generateKey(prefix: string, key: string): string {
    return `fabl:${prefix}:${key}`
  }

  async get<T>(key: string, options: CacheOptions = {}): Promise<T | null> {
    if (!this.redis || !this.isConnected) {
      this.stats.misses++
      return null
    }

    try {
      this.stats.operations++
      const fullKey = this.generateKey(options.prefix || 'general', key)
      const cached = await this.redis.get(fullKey)
      
      if (cached) {
        this.stats.hits++
        return JSON.parse(cached) as T
      }
      
      this.stats.misses++
      return null
    } catch (error) {
      console.error('Cache get error:', error)
      this.stats.errors++
      return null
    }
  }

  async set<T>(key: string, value: T, options: CacheOptions = {}): Promise<void> {
    if (!this.redis || !this.isConnected) return

    try {
      this.stats.operations++
      const fullKey = this.generateKey(options.prefix || 'general', key)
      const ttl = options.ttl || this.defaultTTL
      
      await this.redis.setex(fullKey, ttl, JSON.stringify(value))
    } catch (error) {
      console.error('Cache set error:', error)
      this.stats.errors++
      // Fail silently, don't break the app
    }
  }

  async delete(key: string, options: CacheOptions = {}): Promise<void> {
    if (!this.redis) return

    try {
      const fullKey = this.generateKey(options.prefix || 'general', key)
      await this.redis.del(fullKey)
    } catch (error) {
      console.error('Cache delete error:', error)
    }
  }

  async flush(prefix?: string): Promise<void> {
    if (!this.redis) return

    try {
      const pattern = prefix ? `fabl:${prefix}:*` : 'fabl:*'
      const keys = await this.redis.keys(pattern)
      
      if (keys.length > 0) {
        await this.redis.del(...keys)
      }
    } catch (error) {
      console.error('Cache flush error:', error)
    }
  }

  // Wrap a function with caching
  async wrap<T>(
    key: string,
    fn: () => Promise<T>,
    options: CacheOptions = {}
  ): Promise<T> {
    // Try to get from cache first
    const cached = await this.get<T>(key, options)
    if (cached !== null) {
      return cached
    }

    // Execute function and cache result
    const result = await fn()
    await this.set(key, result, options)
    
    return result
  }

  // Get cache statistics
  getStats() {
    const hitRate = this.stats.operations > 0 
      ? ((this.stats.hits / (this.stats.hits + this.stats.misses)) * 100).toFixed(2)
      : '0.00'
    
    return {
      ...this.stats,
      hitRate: `${hitRate}%`,
      isConnected: this.isConnected,
      defaultTTL: this.defaultTTL
    }
  }

  // Reset statistics
  resetStats() {
    this.stats = {
      hits: 0,
      misses: 0,
      errors: 0,
      operations: 0
    }
  }

  // Health check for cache
  async health(): Promise<{ status: string; latency?: number; error?: string }> {
    if (!this.redis || !this.isConnected) {
      return { status: 'disconnected' }
    }

    try {
      const start = Date.now()
      await this.redis.ping()
      const latency = Date.now() - start
      
      return { 
        status: 'connected',
        latency
      }
    } catch (error) {
      return { 
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Batch operations for better performance
  async mget<T>(keys: string[], options: CacheOptions = {}): Promise<(T | null)[]> {
    if (!this.redis || !this.isConnected) {
      return keys.map(() => null)
    }

    try {
      this.stats.operations++
      const fullKeys = keys.map(key => this.generateKey(options.prefix || 'general', key))
      const cached = await this.redis.mget(...fullKeys)
      
      return cached.map(item => {
        if (item) {
          this.stats.hits++
          return JSON.parse(item) as T
        }
        this.stats.misses++
        return null
      })
    } catch (error) {
      console.error('Cache mget error:', error)
      this.stats.errors++
      return keys.map(() => null)
    }
  }

  async mset<T>(entries: Array<{ key: string; value: T }>, options: CacheOptions = {}): Promise<void> {
    if (!this.redis || !this.isConnected) return

    try {
      this.stats.operations++
      const ttl = options.ttl || this.defaultTTL
      const pipeline = this.redis.pipeline()
      
      entries.forEach(({ key, value }) => {
        const fullKey = this.generateKey(options.prefix || 'general', key)
        pipeline.setex(fullKey, ttl, JSON.stringify(value))
      })
      
      await pipeline.exec()
    } catch (error) {
      console.error('Cache mset error:', error)
      this.stats.errors++
    }
  }

  // Expose Redis instance for other services that need it
  getRedis(): Redis | null {
    return this.redis
  }

  // Check if cache is available
  isAvailable(): boolean {
    return this.redis !== null && this.isConnected
  }
}

const cachePlugin: FastifyPluginAsync = fp(async (fastify) => {
  const redisUrl = process.env.REDIS_URL
  const cache = new CacheService(redisUrl)
  
  try {
    await cache.connect()
    fastify.log.info('✅ Redis cache connected successfully')
  } catch (error) {
    fastify.log.warn('⚠️  Redis cache connection failed, running without cache:', error)
  }
  
  fastify.decorate('cache', cache)
  
  fastify.addHook('onClose', async () => {
    try {
      await cache.disconnect()
    } catch (error) {
      fastify.log.warn('Cache disconnect error:', error)
    }
  })
}, {
  name: 'cache'
})

export { cachePlugin, CacheService }