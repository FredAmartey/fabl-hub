import { Redis } from 'ioredis'

export interface IndexProgress {
  id: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  totalItems: number
  processedItems: number
  successfulItems: number
  failedItems: number
  startedAt?: Date
  completedAt?: Date
  error?: string
  lastUpdatedAt: Date
}

export class IndexProgressTracker {
  private redis: Redis | null
  private keyPrefix = 'fabl:index-progress'
  private ttl = 86400 // 24 hours

  constructor(redis: Redis | null) {
    this.redis = redis
  }

  private getKey(id: string): string {
    return `${this.keyPrefix}:${id}`
  }

  async create(id: string, totalItems: number): Promise<IndexProgress> {
    const progress: IndexProgress = {
      id,
      status: 'pending',
      totalItems,
      processedItems: 0,
      successfulItems: 0,
      failedItems: 0,
      lastUpdatedAt: new Date()
    }

    if (this.redis) {
      await this.redis.setex(
        this.getKey(id),
        this.ttl,
        JSON.stringify(progress)
      )
    }

    return progress
  }

  async start(id: string): Promise<void> {
    if (!this.redis) return

    const key = this.getKey(id)
    const data = await this.redis.get(key)
    if (!data) return

    const progress: IndexProgress = JSON.parse(data)
    progress.status = 'running'
    progress.startedAt = new Date()
    progress.lastUpdatedAt = new Date()

    await this.redis.setex(key, this.ttl, JSON.stringify(progress))
  }

  async update(
    id: string,
    updates: {
      processedItems?: number
      successfulItems?: number
      failedItems?: number
    }
  ): Promise<void> {
    if (!this.redis) return

    const key = this.getKey(id)
    const data = await this.redis.get(key)
    if (!data) return

    const progress: IndexProgress = JSON.parse(data)
    
    if (updates.processedItems !== undefined) {
      progress.processedItems = updates.processedItems
    }
    if (updates.successfulItems !== undefined) {
      progress.successfulItems = updates.successfulItems
    }
    if (updates.failedItems !== undefined) {
      progress.failedItems = updates.failedItems
    }
    
    progress.lastUpdatedAt = new Date()

    await this.redis.setex(key, this.ttl, JSON.stringify(progress))
  }

  async complete(id: string, error?: string): Promise<void> {
    if (!this.redis) return

    const key = this.getKey(id)
    const data = await this.redis.get(key)
    if (!data) return

    const progress: IndexProgress = JSON.parse(data)
    progress.status = error ? 'failed' : 'completed'
    progress.completedAt = new Date()
    progress.lastUpdatedAt = new Date()
    if (error) {
      progress.error = error
    }

    await this.redis.setex(key, this.ttl, JSON.stringify(progress))
  }

  async get(id: string): Promise<IndexProgress | null> {
    if (!this.redis) return null

    const data = await this.redis.get(this.getKey(id))
    if (!data) return null

    const progress = JSON.parse(data)
    // Convert date strings back to Date objects
    progress.lastUpdatedAt = new Date(progress.lastUpdatedAt)
    if (progress.startedAt) progress.startedAt = new Date(progress.startedAt)
    if (progress.completedAt) progress.completedAt = new Date(progress.completedAt)
    
    return progress
  }

  async list(): Promise<IndexProgress[]> {
    if (!this.redis) return []

    const keys = await this.redis.keys(`${this.keyPrefix}:*`)
    if (keys.length === 0) return []

    const pipeline = this.redis.pipeline()
    keys.forEach(key => pipeline.get(key))
    
    const results = await pipeline.exec()
    if (!results) return []

    return results
      .map(([err, data]) => {
        if (err || !data) return null
        const progress = JSON.parse(data as string)
        // Convert date strings back to Date objects
        progress.lastUpdatedAt = new Date(progress.lastUpdatedAt)
        if (progress.startedAt) progress.startedAt = new Date(progress.startedAt)
        if (progress.completedAt) progress.completedAt = new Date(progress.completedAt)
        return progress
      })
      .filter((p): p is IndexProgress => p !== null)
      .sort((a, b) => b.lastUpdatedAt.getTime() - a.lastUpdatedAt.getTime())
  }

  async delete(id: string): Promise<void> {
    if (!this.redis) return
    await this.redis.del(this.getKey(id))
  }
}