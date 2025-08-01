"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheService = exports.cachePlugin = exports.CacheKeyBuilder = exports.CACHE_CONFIG = void 0;
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const ioredis_1 = __importDefault(require("ioredis"));
// Cache configuration constants
exports.CACHE_CONFIG = {
    DEFAULT_TTL: 300, // 5 minutes
    VIDEO_LIST_TTL: 60, // 1 minute
    VIDEO_DETAIL_TTL: 300, // 5 minutes
    USER_PROFILE_TTL: 600, // 10 minutes
    SEARCH_RESULTS_TTL: 120, // 2 minutes
};
// Cache key utilities
class CacheKeyBuilder {
    static createSortedKey(prefix, data) {
        const sortedKeys = Object.keys(data).sort();
        const sortedData = sortedKeys.reduce((result, key) => {
            result[key] = data[key];
            return result;
        }, {});
        const hash = JSON.stringify(sortedData);
        return `${prefix}:${hash}`;
    }
    static videoList(query, page, limit) {
        return this.createSortedKey('videos:list', { ...query, page, limit });
    }
    static videoDetail(videoId) {
        return `videos:detail:${videoId}`;
    }
    static userProfile(userId) {
        return `users:profile:${userId}`;
    }
    static searchResults(query, filters = {}) {
        return this.createSortedKey('search', { query, ...filters });
    }
}
exports.CacheKeyBuilder = CacheKeyBuilder;
class CacheService {
    constructor(redisUrl) {
        this.redis = null;
        this.defaultTTL = exports.CACHE_CONFIG.DEFAULT_TTL;
        this.isConnected = false;
        this.stats = {
            hits: 0,
            misses: 0,
            errors: 0,
            operations: 0
        };
        this.redisUrl = redisUrl;
        this.stats = { hits: 0, misses: 0, errors: 0, operations: 0 };
    }
    getRedisConfig() {
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
        };
    }
    createRedisInstance() {
        if (!this.redisUrl)
            return null;
        try {
            return new ioredis_1.default(this.redisUrl, this.getRedisConfig());
        }
        catch (error) {
            console.warn('Redis cache initialization failed:', error);
            return null;
        }
    }
    handleConnect() {
        console.log('✅ Redis cache connected');
        this.isConnected = true;
    }
    handleReady() {
        console.log('✅ Redis cache ready');
        this.isConnected = true;
    }
    handleError(error) {
        console.error('Redis cache error:', error);
        this.isConnected = false;
        this.stats.errors++;
        // Don't crash the app if Redis fails, just disable caching temporarily
    }
    handleClose() {
        console.log('⚠️ Redis cache connection closed');
        this.isConnected = false;
    }
    handleReconnecting() {
        console.log('🔄 Redis cache reconnecting...');
        this.isConnected = false;
    }
    setupEventHandlers(redis) {
        redis.on('connect', () => this.handleConnect());
        redis.on('ready', () => this.handleReady());
        redis.on('error', (err) => this.handleError(err));
        redis.on('close', () => this.handleClose());
        redis.on('reconnecting', () => this.handleReconnecting());
    }
    initializeRedis() {
        this.redis = this.createRedisInstance();
        if (this.redis) {
            this.setupEventHandlers(this.redis);
        }
    }
    async connect() {
        if (!this.redis) {
            this.initializeRedis();
        }
        if (this.redis && !this.isConnected) {
            try {
                await this.redis.connect();
            }
            catch (error) {
                console.warn('❌ Redis connection failed, caching disabled:', error);
                this.redis = null;
            }
        }
    }
    async disconnect() {
        if (this.redis) {
            await this.redis.disconnect();
        }
    }
    generateKey(prefix, key) {
        return `fabl:${prefix}:${key}`;
    }
    async get(key, options = {}) {
        if (!this.redis || !this.isConnected) {
            this.stats.misses++;
            return null;
        }
        try {
            this.stats.operations++;
            const fullKey = this.generateKey(options.prefix || 'general', key);
            const cached = await this.redis.get(fullKey);
            if (cached) {
                this.stats.hits++;
                return JSON.parse(cached);
            }
            this.stats.misses++;
            return null;
        }
        catch (error) {
            console.error('Cache get error:', error);
            this.stats.errors++;
            return null;
        }
    }
    async set(key, value, options = {}) {
        if (!this.redis || !this.isConnected)
            return;
        try {
            this.stats.operations++;
            const fullKey = this.generateKey(options.prefix || 'general', key);
            const ttl = options.ttl || this.defaultTTL;
            await this.redis.setex(fullKey, ttl, JSON.stringify(value));
        }
        catch (error) {
            console.error('Cache set error:', error);
            this.stats.errors++;
            // Fail silently, don't break the app
        }
    }
    async delete(key, options = {}) {
        if (!this.redis)
            return;
        try {
            const fullKey = this.generateKey(options.prefix || 'general', key);
            await this.redis.del(fullKey);
        }
        catch (error) {
            console.error('Cache delete error:', error);
        }
    }
    async flush(prefix) {
        if (!this.redis)
            return;
        try {
            const pattern = prefix ? `fabl:${prefix}:*` : 'fabl:*';
            const keys = await this.redis.keys(pattern);
            if (keys.length > 0) {
                await this.redis.del(...keys);
            }
        }
        catch (error) {
            console.error('Cache flush error:', error);
        }
    }
    // Wrap a function with caching
    async wrap(key, fn, options = {}) {
        // Try to get from cache first
        const cached = await this.get(key, options);
        if (cached !== null) {
            return cached;
        }
        // Execute function and cache result
        const result = await fn();
        await this.set(key, result, options);
        return result;
    }
    // Get cache statistics
    getStats() {
        const hitRate = this.stats.operations > 0
            ? ((this.stats.hits / (this.stats.hits + this.stats.misses)) * 100).toFixed(2)
            : '0.00';
        return {
            ...this.stats,
            hitRate: `${hitRate}%`,
            isConnected: this.isConnected,
            defaultTTL: this.defaultTTL
        };
    }
    // Reset statistics
    resetStats() {
        this.stats = {
            hits: 0,
            misses: 0,
            errors: 0,
            operations: 0
        };
    }
    // Health check for cache
    async health() {
        if (!this.redis || !this.isConnected) {
            return { status: 'disconnected' };
        }
        try {
            const start = Date.now();
            await this.redis.ping();
            const latency = Date.now() - start;
            return {
                status: 'connected',
                latency
            };
        }
        catch (error) {
            return {
                status: 'error',
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }
    // Batch operations for better performance
    async mget(keys, options = {}) {
        if (!this.redis || !this.isConnected) {
            return keys.map(() => null);
        }
        try {
            this.stats.operations++;
            const fullKeys = keys.map(key => this.generateKey(options.prefix || 'general', key));
            const cached = await this.redis.mget(...fullKeys);
            return cached.map(item => {
                if (item) {
                    this.stats.hits++;
                    return JSON.parse(item);
                }
                this.stats.misses++;
                return null;
            });
        }
        catch (error) {
            console.error('Cache mget error:', error);
            this.stats.errors++;
            return keys.map(() => null);
        }
    }
    async mset(entries, options = {}) {
        if (!this.redis || !this.isConnected)
            return;
        try {
            this.stats.operations++;
            const ttl = options.ttl || this.defaultTTL;
            const pipeline = this.redis.pipeline();
            entries.forEach(({ key, value }) => {
                const fullKey = this.generateKey(options.prefix || 'general', key);
                pipeline.setex(fullKey, ttl, JSON.stringify(value));
            });
            await pipeline.exec();
        }
        catch (error) {
            console.error('Cache mset error:', error);
            this.stats.errors++;
        }
    }
    // Expose Redis instance for other services that need it
    getRedis() {
        return this.redis;
    }
    // Check if cache is available
    isAvailable() {
        return this.redis !== null && this.isConnected;
    }
}
exports.CacheService = CacheService;
const cachePlugin = (0, fastify_plugin_1.default)(async (fastify) => {
    const redisUrl = process.env.REDIS_URL;
    const cache = new CacheService(redisUrl);
    await cache.connect();
    fastify.decorate('cache', cache);
    fastify.addHook('onClose', async () => {
        await cache.disconnect();
    });
});
exports.cachePlugin = cachePlugin;
