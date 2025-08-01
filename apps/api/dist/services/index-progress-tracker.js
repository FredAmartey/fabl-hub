"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndexProgressTracker = void 0;
class IndexProgressTracker {
    constructor(redis) {
        this.keyPrefix = 'fabl:index-progress';
        this.ttl = 86400; // 24 hours
        this.redis = redis;
    }
    getKey(id) {
        return `${this.keyPrefix}:${id}`;
    }
    async create(id, totalItems) {
        const progress = {
            id,
            status: 'pending',
            totalItems,
            processedItems: 0,
            successfulItems: 0,
            failedItems: 0,
            lastUpdatedAt: new Date()
        };
        if (this.redis) {
            await this.redis.setex(this.getKey(id), this.ttl, JSON.stringify(progress));
        }
        return progress;
    }
    async start(id) {
        if (!this.redis)
            return;
        const key = this.getKey(id);
        const data = await this.redis.get(key);
        if (!data)
            return;
        const progress = JSON.parse(data);
        progress.status = 'running';
        progress.startedAt = new Date();
        progress.lastUpdatedAt = new Date();
        await this.redis.setex(key, this.ttl, JSON.stringify(progress));
    }
    async update(id, updates) {
        if (!this.redis)
            return;
        const key = this.getKey(id);
        const data = await this.redis.get(key);
        if (!data)
            return;
        const progress = JSON.parse(data);
        if (updates.processedItems !== undefined) {
            progress.processedItems = updates.processedItems;
        }
        if (updates.successfulItems !== undefined) {
            progress.successfulItems = updates.successfulItems;
        }
        if (updates.failedItems !== undefined) {
            progress.failedItems = updates.failedItems;
        }
        progress.lastUpdatedAt = new Date();
        await this.redis.setex(key, this.ttl, JSON.stringify(progress));
    }
    async complete(id, error) {
        if (!this.redis)
            return;
        const key = this.getKey(id);
        const data = await this.redis.get(key);
        if (!data)
            return;
        const progress = JSON.parse(data);
        progress.status = error ? 'failed' : 'completed';
        progress.completedAt = new Date();
        progress.lastUpdatedAt = new Date();
        if (error) {
            progress.error = error;
        }
        await this.redis.setex(key, this.ttl, JSON.stringify(progress));
    }
    async get(id) {
        if (!this.redis)
            return null;
        const data = await this.redis.get(this.getKey(id));
        if (!data)
            return null;
        const progress = JSON.parse(data);
        // Convert date strings back to Date objects
        progress.lastUpdatedAt = new Date(progress.lastUpdatedAt);
        if (progress.startedAt)
            progress.startedAt = new Date(progress.startedAt);
        if (progress.completedAt)
            progress.completedAt = new Date(progress.completedAt);
        return progress;
    }
    async list() {
        if (!this.redis)
            return [];
        const keys = await this.redis.keys(`${this.keyPrefix}:*`);
        if (keys.length === 0)
            return [];
        const pipeline = this.redis.pipeline();
        keys.forEach(key => pipeline.get(key));
        const results = await pipeline.exec();
        if (!results)
            return [];
        return results
            .map(([err, data]) => {
            if (err || !data)
                return null;
            const progress = JSON.parse(data);
            // Convert date strings back to Date objects
            progress.lastUpdatedAt = new Date(progress.lastUpdatedAt);
            if (progress.startedAt)
                progress.startedAt = new Date(progress.startedAt);
            if (progress.completedAt)
                progress.completedAt = new Date(progress.completedAt);
            return progress;
        })
            .filter((p) => p !== null)
            .sort((a, b) => b.lastUpdatedAt.getTime() - a.lastUpdatedAt.getTime());
    }
    async delete(id) {
        if (!this.redis)
            return;
        await this.redis.del(this.getKey(id));
    }
}
exports.IndexProgressTracker = IndexProgressTracker;
