import { FastifyPluginAsync } from 'fastify';
export interface Metrics {
    requests: {
        total: number;
        errors: number;
        avgResponseTime: number;
    };
    videos: {
        uploads: number;
        views: number;
        processing: number;
    };
    cache: {
        hits: number;
        misses: number;
        hitRate: number;
    };
    database: {
        connections: number;
        avgQueryTime: number;
    };
}
declare class MetricsCollector {
    private metrics;
    private responseTimes;
    recordRequest(responseTime: number, isError?: boolean): void;
    recordVideoEvent(event: 'upload' | 'view' | 'processing'): void;
    recordCacheEvent(hit: boolean): void;
    getMetrics(): Metrics;
    reset(): void;
}
declare const metricsCollector: MetricsCollector;
declare const monitoringPlugin: FastifyPluginAsync;
export { monitoringPlugin, metricsCollector };
