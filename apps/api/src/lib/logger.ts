import pino from 'pino'
import { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'

// Production-ready logger configuration
const createLogger = () => {
  const isProduction = process.env.NODE_ENV === 'production'
  
  const loggerConfig = {
    level: process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug'),
    
    // Production logging - structured JSON
    ...(isProduction ? {
      // Remove pretty printing in production
      transport: undefined,
      // Add service metadata
      base: {
        service: 'fabl-api',
        version: process.env.npm_package_version || '1.0.0',
        environment: process.env.NODE_ENV || 'production',
      },
      // Timestamp formatting
      timestamp: pino.stdTimeFunctions.isoTime,
      // Error serialization
      serializers: {
        err: pino.stdSerializers.err,
        req: pino.stdSerializers.req,
        res: pino.stdSerializers.res,
      },
    } : {
      // Development logging - pretty printed
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
        },
      },
    }),
  }

  return pino(loggerConfig)
}

// Custom log levels for different scenarios
export const logger = createLogger()

// Structured logging helpers
export const logRequest = (req: any, additionalData = {}) => {
  logger.info({
    req: {
      method: req.method,
      url: req.url,
      userAgent: req.headers['user-agent'],
      ip: req.ip,
    },
    ...additionalData,
  }, 'HTTP Request')
}

export const logError = (error: Error, context = {}) => {
  logger.error({
    err: error,
    ...context,
  }, error.message)
}

export const logVideoEvent = (event: string, videoId: string, data = {}) => {
  logger.info({
    event,
    videoId,
    ...data,
  }, `Video event: ${event}`)
}

export const logCacheEvent = (operation: string, key: string, hit: boolean, latency?: number) => {
  logger.debug({
    cache: {
      operation,
      key,
      hit,
      latency,
    },
  }, `Cache ${operation}: ${hit ? 'HIT' : 'MISS'}`)
}

export const logSecurityEvent = (event: string, ip: string, data = {}) => {
  logger.warn({
    security: {
      event,
      ip,
      ...data,
    },
  }, `Security event: ${event}`)
}

// Fastify plugin for enhanced logging
const enhancedLoggingPlugin: FastifyPluginAsync = fp(async (fastify) => {
  // Replace default logger
  fastify.decorate('log', logger)

  // Add request/response logging
  fastify.addHook('onRequest', async (request) => {
    logRequest(request)
  })

  fastify.addHook('onResponse', async (request, reply) => {
    const responseTime = reply.getResponseTime()
    
    logger.info({
      req: {
        method: request.method,
        url: request.url,
        ip: request.ip,
      },
      res: {
        statusCode: reply.statusCode,
        responseTime,
      },
    }, 'HTTP Response')
  })

  // Log uncaught errors
  fastify.setErrorHandler(async (error, request, reply) => {
    logError(error, {
      req: {
        method: request.method,
        url: request.url,
        ip: request.ip,
      },
    })
    
    // Let default error handler continue
    throw error
  })
})

export { enhancedLoggingPlugin }