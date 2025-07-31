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
import { structuredLoggingPlugin } from './lib/structured-logger'
import { errorHandler } from './lib/error-handler'

// Route imports
import authRoutes from './routes/auth'
import userRoutes from './routes/users'
import videoRoutes from './routes/videos'
import uploadRoutes from './routes/upload'
import searchRoutes from './routes/search'
import dashboardRoutes from './routes/dashboard'

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
    MUX_TOKEN_SECRET: { type: 'string' }
  }
}

async function start() {
  try {
    // Register environment validation
    await server.register(env, {
      schema: envSchema,
      dotenv: true
    })

    // Register security plugins
    await server.register(helmet, {
      contentSecurityPolicy: false
    })

    await server.register(cors, {
      origin: [
        'http://localhost:3000', // Hub
        'http://localhost:3001', // Studio
        process.env.HUB_URL || 'http://localhost:3000',
        process.env.STUDIO_URL || 'http://localhost:3001'
      ],
      credentials: true
    })

    await server.register(rateLimit, {
      max: 100,
      timeWindow: '1 minute',
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
    await server.register(authPlugin)

    // Register error handler
    server.setErrorHandler(errorHandler)

    // Health check endpoint
    server.get('/health', async () => ({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    }))

    // Register API routes
    await server.register(authRoutes, { prefix: '/api/auth' })
    await server.register(userRoutes, { prefix: '/api/users' })
    await server.register(videoRoutes, { prefix: '/api/videos' })
    await server.register(uploadRoutes, { prefix: '/api/upload' })
    await server.register(searchRoutes, { prefix: '/api/search' })
    await server.register(dashboardRoutes, { prefix: '/api/dashboard' })

    // Start server
    const port = parseInt(server.config.PORT, 10)
    const host = server.config.HOST

    await server.listen({ port, host })
    
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