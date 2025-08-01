import fastify from 'fastify'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import rateLimit from '@fastify/rate-limit'
import env from '@fastify/env'

// Import plugins and routes
import { dbPlugin } from './lib/db'
import { authPlugin } from './lib/auth'
import { cachePlugin } from './lib/cache'
import { queuePlugin } from './lib/queue'
import { structuredLoggingPlugin } from './lib/structured-logger'
import { errorHandler } from './lib/error-handler'
import { startWorkers } from './workers'

// Route imports
import authRoutes from './routes/auth'
import userRoutes from './routes/users'
import videoRoutes from './routes/videos'
import uploadRoutes from './routes/upload'
import searchRoutes from './routes/search'
import dashboardRoutes from './routes/dashboard'
import studioRoutes from './routes/studio'

const server = fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info',
    transport: process.env.NODE_ENV === 'development' ? {
      target: 'pino-pretty',
      options: {
        colorize: true
      }
    } : undefined
  }
}).withTypeProvider<TypeBoxTypeProvider>()

// Environment schema
const envSchema = {
  type: 'object',
  required: ['DATABASE_URL', 'CLERK_SECRET_KEY'],
  properties: {
    NODE_ENV: { type: 'string', default: 'development' },
    PORT: { type: 'string', default: '3002' },
    HOST: { type: 'string', default: '0.0.0.0' },
    DATABASE_URL: { type: 'string' },
    CLERK_SECRET_KEY: { type: 'string' },
    REDIS_URL: { type: 'string', default: 'redis://localhost:6379' },
    MUX_TOKEN_ID: { type: 'string' },
    MUX_TOKEN_SECRET: { type: 'string' },
    HUB_URL: { type: 'string', default: 'http://localhost:3000' },
    STUDIO_URL: { type: 'string', default: 'http://localhost:3001' },
    ENABLE_SECURITY_HEADERS: { type: 'string', default: 'false' },
    RATE_LIMIT_MAX: { type: 'string', default: '100' },
    RATE_LIMIT_WINDOW: { type: 'string', default: '60000' },
    CORS_ORIGIN: { type: 'string' }
  }
}

// Health check utilities
interface SystemHealth {
  status: 'ok' | 'degraded'
  timestamp: string
  uptime: number
  environment: string | undefined
  version: string
  database: string
  cache: {
    status: string
    latency?: number
    error?: string
    stats?: any
  }
}

async function checkDatabaseHealth(db: any): Promise<string> {
  try {
    await db.$queryRaw`SELECT 1`
    return 'connected'
  } catch (error) {
    return 'disconnected'
  }
}

async function checkCacheHealth(cache: any) {
  if (!cache) {
    return { status: 'not_configured' }
  }

  try {
    const cacheHealth = await cache.health()
    return cacheHealth.status === 'connected' 
      ? { ...cacheHealth, stats: cache.getStats() }
      : cacheHealth
  } catch (error) {
    return { 
      status: 'error', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

async function checkSystemHealth(server: any): Promise<SystemHealth> {
  const health: SystemHealth = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0',
    database: 'unknown',
    cache: { status: 'unknown' }
  }

  // Check database
  health.database = await checkDatabaseHealth(server.db)
  if (health.database === 'disconnected') {
    health.status = 'degraded'
  }

  // Check cache
  health.cache = await checkCacheHealth(server.cache)
  if (health.cache.status === 'error') {
    health.status = 'degraded'
  }

  return health
}

async function start() {
  try {
    // Register environment validation
    await server.register(env, {
      schema: envSchema,
      dotenv: true
    })

    // Register security plugins
    const isProduction = process.env.NODE_ENV === 'production'
    const enableSecurityHeaders = process.env.ENABLE_SECURITY_HEADERS === 'true'
    
    await server.register(helmet, {
      contentSecurityPolicy: enableSecurityHeaders ? {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'", "https:"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
          connectSrc: ["'self'", "https://api.clerk.com"],
          fontSrc: ["'self'", "https:", "data:"],
          objectSrc: ["'none'"],
          mediaSrc: ["'self'", "https://stream.mux.com"],
          frameSrc: ["'none'"]
        }
      } : false,
      crossOriginEmbedderPolicy: enableSecurityHeaders,
      hsts: isProduction ? {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
      } : false
    })

    // Configure CORS origins
    const corsOrigins = process.env.CORS_ORIGIN 
      ? process.env.CORS_ORIGIN.split(',')
      : [
          'http://localhost:3000', // Hub
          'http://localhost:3001', // Studio
          process.env.HUB_URL || 'http://localhost:3000',
          process.env.STUDIO_URL || 'http://localhost:3001'
        ]

    await server.register(cors, {
      origin: corsOrigins,
      credentials: true
    })

    await server.register(rateLimit, {
      max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
      timeWindow: parseInt(process.env.RATE_LIMIT_WINDOW || '60000', 10),
      errorResponseBuilder: () => ({
        code: 'RATE_LIMIT_EXCEEDED',
        error: 'Rate Limit Exceeded',
        message: 'Too many requests, please try again later.',
        statusCode: 429
      })
    })

    // Register custom plugins
    await server.register(structuredLoggingPlugin)
    await server.register(dbPlugin)
    await server.register(cachePlugin)
    await server.register(queuePlugin)
    await server.register(authPlugin)

    // Register error handler
    server.setErrorHandler(errorHandler)

    // Health check endpoint
    server.get('/health', async () => checkSystemHealth(server))

    // Cache monitoring endpoint (for internal monitoring)
    server.get('/cache/stats', async () => {
      if (!server.cache) {
        return { error: 'Cache not configured' }
      }

      const stats = server.cache.getStats()
      const health = await server.cache.health()
      
      return {
        ...stats,
        health,
        timestamp: new Date().toISOString()
      }
    })

    // Cache management endpoints (for admin)
    server.delete('/cache/flush/:prefix?', async (request) => {
      if (!server.cache) {
        return { error: 'Cache not configured' }
      }

      const { prefix } = request.params as { prefix?: string }
      await server.cache.flush(prefix)
      
      return { 
        success: true, 
        message: prefix ? `Flushed cache prefix: ${prefix}` : 'Flushed all cache keys',
        timestamp: new Date().toISOString()
      }
    })

    server.post('/cache/stats/reset', async () => {
      if (!server.cache) {
        return { error: 'Cache not configured' }
      }

      server.cache.resetStats()
      
      return { 
        success: true, 
        message: 'Cache statistics reset',
        timestamp: new Date().toISOString()
      }
    })

    // Register API routes
    await server.register(authRoutes, { prefix: '/api/auth' })
    await server.register(userRoutes, { prefix: '/api/users' })
    await server.register(videoRoutes, { prefix: '/api/videos' })
    await server.register(uploadRoutes, { prefix: '/api/upload' })
    await server.register(searchRoutes, { prefix: '/api/search' })
    await server.register(dashboardRoutes, { prefix: '/api/dashboard' })
    await server.register(studioRoutes, { prefix: '/api/studio' })

    // Start server
    const port = parseInt(process.env.PORT || '3002', 10)
    const host = process.env.HOST || '0.0.0.0'

    await server.listen({ port, host })
    
    // Start background workers
    if (process.env.ENABLE_WORKERS !== 'false') {
      await startWorkers(server as any)
      server.log.info('🔧 Background workers started')
    }
    
    server.log.info(`🚀 Fabl API server listening on http://${host}:${port}`)
    server.log.info(`📊 Health check available at http://${host}:${port}/health`)
    
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  server.log.info('Received SIGINT, shutting down gracefully...')
  await server.close()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  server.log.info('Received SIGTERM, shutting down gracefully...')
  await server.close()
  process.exit(0)
})

start()