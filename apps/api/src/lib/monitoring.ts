import { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'

// Performance monitoring and metrics collection
export interface Metrics {
  requests: {
    total: number
    errors: number
    avgResponseTime: number
  }
  videos: {
    uploads: number
    views: number
    processing: number
  }
  cache: {
    hits: number
    misses: number
    hitRate: number
  }
  database: {
    connections: number
    avgQueryTime: number
  }
}

class MetricsCollector {
  private metrics: Metrics = {
    requests: { total: 0, errors: 0, avgResponseTime: 0 },
    videos: { uploads: 0, views: 0, processing: 0 },
    cache: { hits: 0, misses: 0, hitRate: 0 },
    database: { connections: 0, avgQueryTime: 0 }
  }

  private responseTimes: number[] = []

  recordRequest(responseTime: number, isError = false) {
    this.metrics.requests.total++
    if (isError) this.metrics.requests.errors++
    
    this.responseTimes.push(responseTime)
    // Keep only last 1000 response times
    if (this.responseTimes.length > 1000) {
      this.responseTimes.shift()
    }
    
    this.metrics.requests.avgResponseTime = 
      this.responseTimes.reduce((a, b) => a + b, 0) / this.responseTimes.length
  }

  recordVideoEvent(event: 'upload' | 'view' | 'processing') {
    if (event === 'upload') {
      this.metrics.videos.uploads++
    } else if (event === 'view') {
      this.metrics.videos.views++
    } else if (event === 'processing') {
      this.metrics.videos.processing++
    }
  }

  recordCacheEvent(hit: boolean) {
    if (hit) {
      this.metrics.cache.hits++
    } else {
      this.metrics.cache.misses++
    }
    
    const total = this.metrics.cache.hits + this.metrics.cache.misses
    this.metrics.cache.hitRate = total > 0 ? (this.metrics.cache.hits / total) * 100 : 0
  }

  getMetrics(): Metrics {
    return { ...this.metrics }
  }

  reset() {
    this.metrics = {
      requests: { total: 0, errors: 0, avgResponseTime: 0 },
      videos: { uploads: 0, views: 0, processing: 0 },
      cache: { hits: 0, misses: 0, hitRate: 0 },
      database: { connections: 0, avgQueryTime: 0 }
    }
    this.responseTimes = []
  }
}

const metricsCollector = new MetricsCollector()

// Application monitoring plugin
const monitoringPlugin: FastifyPluginAsync = fp(async (fastify) => {
  // Add metrics collector to fastify instance
  fastify.decorate('metrics', metricsCollector)

  // Monitor request/response metrics
  fastify.addHook('onResponse', async (request, reply) => {
    const responseTime = reply.getResponseTime()
    const isError = reply.statusCode >= 400
    metricsCollector.recordRequest(responseTime, isError)
  })

  // Metrics endpoint for monitoring systems
  fastify.get('/metrics', async () => {
    const metrics = metricsCollector.getMetrics()
    
    // Add system metrics
    const systemMetrics = {
      ...metrics,
      system: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        cpu: process.cpuUsage(),
        pid: process.pid,
        nodeVersion: process.version,
        platform: process.platform
      },
      timestamp: new Date().toISOString()
    }

    return systemMetrics
  })

  // Prometheus-compatible metrics endpoint
  fastify.get('/metrics/prometheus', async (request, reply) => {
    const metrics = metricsCollector.getMetrics()
    
    const prometheusMetrics = `
# HELP fabl_requests_total Total number of HTTP requests
# TYPE fabl_requests_total counter
fabl_requests_total ${metrics.requests.total}

# HELP fabl_request_errors_total Total number of HTTP request errors
# TYPE fabl_request_errors_total counter
fabl_request_errors_total ${metrics.requests.errors}

# HELP fabl_request_duration_ms Average HTTP request duration in milliseconds
# TYPE fabl_request_duration_ms gauge
fabl_request_duration_ms ${metrics.requests.avgResponseTime}

# HELP fabl_video_uploads_total Total number of video uploads
# TYPE fabl_video_uploads_total counter
fabl_video_uploads_total ${metrics.videos.uploads}

# HELP fabl_video_views_total Total number of video views
# TYPE fabl_video_views_total counter
fabl_video_views_total ${metrics.videos.views}

# HELP fabl_cache_hit_rate Cache hit rate percentage
# TYPE fabl_cache_hit_rate gauge
fabl_cache_hit_rate ${metrics.cache.hitRate}

# HELP fabl_process_uptime_seconds Process uptime in seconds
# TYPE fabl_process_uptime_seconds gauge
fabl_process_uptime_seconds ${process.uptime()}
`.trim()

    reply.type('text/plain')
    return prometheusMetrics
  })

  // Health check with detailed status
  fastify.get('/health/detailed', async () => {
    const health = await checkSystemHealth(fastify as any)
    const metrics = metricsCollector.getMetrics()
    
    return {
      ...health,
      metrics,
      performance: {
        avgResponseTime: metrics.requests.avgResponseTime,
        errorRate: metrics.requests.total > 0 
          ? (metrics.requests.errors / metrics.requests.total) * 100 
          : 0,
        cacheHitRate: metrics.cache.hitRate
      }
    }
  })
})

// Helper function for system health (reuse from existing health check)
async function checkSystemHealth(server: any) {
  const health = {
    status: 'ok' as 'ok' | 'degraded',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0',
    database: 'unknown',
    cache: { status: 'unknown' } as any
  }

  // Check database
  try {
    await server.db.$queryRaw`SELECT 1`
    health.database = 'connected'
  } catch (error) {
    health.database = 'disconnected'
    health.status = 'degraded'
  }

  // Check cache
  if (server.cache) {
    try {
      const cacheHealth = await server.cache.health()
      health.cache = cacheHealth.status === 'connected' 
        ? { ...cacheHealth, stats: server.cache.getStats() }
        : cacheHealth
    } catch (error) {
      health.cache = { status: 'error', error: error instanceof Error ? error.message : 'Unknown error' }
      health.status = 'degraded'
    }
  } else {
    health.cache = { status: 'not_configured' }
  }

  return health
}

export { monitoringPlugin, metricsCollector }