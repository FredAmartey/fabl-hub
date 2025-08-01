import { FastifyPluginAsync } from 'fastify';
import Redis from 'ioredis';
export declare const CACHE_CONFIG: {
    readonly DEFAULT_TTL: 300;
    readonly VIDEO_LIST_TTL: 60;
    readonly VIDEO_DETAIL_TTL: 300;
    readonly USER_PROFILE_TTL: 600;
    readonly SEARCH_RESULTS_TTL: 120;
};
export declare class CacheKeyBuilder {
    static createSortedKey(prefix: string, data: Record<string, any>): string;
    static videoList(query: Record<string, any>, page: number, limit: number): string;
    static videoDetail(videoId: string): string;
    static userProfile(userId: string): string;
    static searchResults(query: string, filters?: Record<string, any>): string;
}
declare module 'fastify' {
    interface FastifyInstance {
        cache: CacheService;
    }
}
interface CacheOptions {
    ttl?: number;
    prefix?: string;
}
declare class CacheService {
    private redis;
    private defaultTTL;
    private isConnected;
    private redisUrl?;
    private stats;
    constructor(redisUrl?: string);
    private getRedisConfig;
    private createRedisInstance;
    private handleConnect;
    private handleReady;
    private handleError;
    private handleClose;
    private handleReconnecting;
    private setupEventHandlers;
    private initializeRedis;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    private generateKey;
    get<T>(key: string, options?: CacheOptions): Promise<T | null>;
    set<T>(key: string, value: T, options?: CacheOptions): Promise<void>;
    delete(key: string, options?: CacheOptions): Promise<void>;
    flush(prefix?: string): Promise<void>;
    wrap<T>(key: string, fn: () => Promise<T>, options?: CacheOptions): Promise<T>;
    getStats(): {
        hitRate: string;
        isConnected: boolean;
        defaultTTL: 300;
        hits: number;
        misses: number;
        errors: number;
        operations: number;
    };
    resetStats(): void;
    health(): Promise<{
        status: string;
        latency?: number;
        error?: string;
    }>;
    mget<T>(keys: string[], options?: CacheOptions): Promise<(T | null)[]>;
    mset<T>(entries: Array<{
        key: string;
        value: T;
    }>, options?: CacheOptions): Promise<void>;
    getRedis(): Redis | null;
    isAvailable(): boolean;
}
declare const cachePlugin: FastifyPluginAsync;
export { cachePlugin, CacheService };
