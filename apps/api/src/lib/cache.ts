import { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'
import Redis from 'ioredis'

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
  private defaultTTL = 300 // 5 minutes default

  constructor(redisUrl?: string) {
    if (redisUrl) {
      try {
        this.redis = new Redis(redisUrl, {
          maxRetriesPerRequest: 3,
          enableReadyCheck: true,
          lazyConnect: true
        })
        
        this.redis.on('error', (err) => {
          console.error('Redis cache error:', err)
          // Don't crash the app if Redis fails, just disable caching
          this.redis = null
        })
      } catch (error) {
        console.warn('Redis cache initialization failed, caching disabled:', error)
        this.redis = null
      }
    }
  }

  async connect(): Promise<void> {
    if (this.redis) {
      try {
        await this.redis.connect()
        console.log('✅ Redis cache connected')
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
    if (!this.redis) return null

    try {
      const fullKey = this.generateKey(options.prefix || 'general', key)
      const cached = await this.redis.get(fullKey)
      
      if (cached) {
        return JSON.parse(cached) as T
      }
      return null
    } catch (error) {
      console.error('Cache get error:', error)
      return null
    }
  }

  async set<T>(key: string, value: T, options: CacheOptions = {}): Promise<void> {
    if (!this.redis) return

    try {
      const fullKey = this.generateKey(options.prefix || 'general', key)
      const ttl = options.ttl || this.defaultTTL
      
      await this.redis.setex(fullKey, ttl, JSON.stringify(value))
    } catch (error) {
      console.error('Cache set error:', error)
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

  // Expose Redis instance for other services that need it
  getRedis(): Redis | null {
    return this.redis
  }
}

const cachePlugin: FastifyPluginAsync = fp(async (fastify) => {
  const redisUrl = process.env.REDIS_URL
  const cache = new CacheService(redisUrl)
  
  await cache.connect()
  
  fastify.decorate('cache', cache)
  
  fastify.addHook('onClose', async () => {
    await cache.disconnect()
  })
})

export { cachePlugin, CacheService }