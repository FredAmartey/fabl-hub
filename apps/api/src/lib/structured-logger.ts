import { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify'
import fp from 'fastify-plugin'
import { v4 as uuidv4 } from 'uuid'

declare module 'fastify' {
  interface FastifyRequest {
    correlationId: string
  }
}

interface LogContext {
  correlationId: string
  userId?: string
  method?: string
  url?: string
  [key: string]: any
}

export class StructuredLogger {
  constructor(private baseLogger: any) {}

  private formatMessage(level: string, message: string, context?: LogContext) {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...context
    }
  }

  info(message: string, context?: LogContext) {
    this.baseLogger.info(this.formatMessage('info', message, context))
  }

  warn(message: string, context?: LogContext) {
    this.baseLogger.warn(this.formatMessage('warn', message, context))
  }

  error(message: string, error?: Error | any, context?: LogContext) {
    const errorContext = {
      ...context,
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : error
    }
    this.baseLogger.error(this.formatMessage('error', message, errorContext))
  }

  debug(message: string, context?: LogContext) {
    this.baseLogger.debug(this.formatMessage('debug', message, context))
  }

  child(context: LogContext): StructuredLogger {
    return new StructuredLogger(this.baseLogger.child(context))
  }
}

const structuredLoggingPlugin: FastifyPluginAsync = fp(async (fastify) => {
  // Add correlation ID to all requests
  fastify.addHook('onRequest', async (request: FastifyRequest, reply: FastifyReply) => {
    // Try to get correlation ID from headers, or generate a new one
    const correlationId = 
      request.headers['x-correlation-id'] as string ||
      request.headers['x-request-id'] as string ||
      uuidv4()
    
    request.correlationId = correlationId
    
    // Add correlation ID to response headers
    reply.header('x-correlation-id', correlationId)
    
    // Create a child logger with correlation ID
    request.log = fastify.log.child({ correlationId })
  })

  // Log request details
  fastify.addHook('preHandler', async (request: FastifyRequest, reply: FastifyReply) => {
    const context: LogContext = {
      correlationId: request.correlationId,
      method: request.method,
      url: request.url,
      ip: request.ip,
      userAgent: request.headers['user-agent']
    }

    // Add user ID if available
    if ((request as any).userId) {
      context.userId = (request as any).userId
    }

    request.log.info('Request received', context)
  })

  // Log response details
  fastify.addHook('onResponse', async (request: FastifyRequest, reply: FastifyReply) => {
    const context: LogContext = {
      correlationId: request.correlationId,
      method: request.method,
      url: request.url,
      statusCode: reply.statusCode,
      responseTime: reply.getResponseTime()
    }

    if ((request as any).userId) {
      context.userId = (request as any).userId
    }

    const level = reply.statusCode >= 400 ? 'warn' : 'info'
    request.log[level]('Request completed', context)
  })

  // Log errors with correlation ID
  fastify.addHook('onError', async (request: FastifyRequest, reply: FastifyReply, error: Error) => {
    const context: LogContext = {
      correlationId: request.correlationId,
      method: request.method,
      url: request.url,
      statusCode: reply.statusCode
    }

    if ((request as any).userId) {
      context.userId = (request as any).userId
    }

    request.log.error('Request error', error, context)
  })

  // Decorate fastify with structured logger
  const structuredLogger = new StructuredLogger(fastify.log)
  fastify.decorate('slog', structuredLogger)
})

declare module 'fastify' {
  interface FastifyInstance {
    slog: StructuredLogger
  }
}

export { structuredLoggingPlugin }