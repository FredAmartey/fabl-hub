"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.structuredLoggingPlugin = exports.StructuredLogger = void 0;
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const uuid_1 = require("uuid");
class StructuredLogger {
    constructor(baseLogger) {
        this.baseLogger = baseLogger;
    }
    formatMessage(level, message, context) {
        return {
            timestamp: new Date().toISOString(),
            level,
            message,
            ...context
        };
    }
    info(message, context) {
        this.baseLogger.info(this.formatMessage('info', message, context));
    }
    warn(message, context) {
        this.baseLogger.warn(this.formatMessage('warn', message, context));
    }
    error(message, error, context) {
        const errorContext = {
            ...context,
            error: error instanceof Error ? {
                name: error.name,
                message: error.message,
                stack: error.stack
            } : error
        };
        this.baseLogger.error(this.formatMessage('error', message, errorContext));
    }
    debug(message, context) {
        this.baseLogger.debug(this.formatMessage('debug', message, context));
    }
    child(context) {
        return new StructuredLogger(this.baseLogger.child(context));
    }
}
exports.StructuredLogger = StructuredLogger;
const structuredLoggingPlugin = (0, fastify_plugin_1.default)(async (fastify) => {
    // Add correlation ID to all requests
    fastify.addHook('onRequest', async (request, reply) => {
        // Try to get correlation ID from headers, or generate a new one
        const correlationId = request.headers['x-correlation-id'] ||
            request.headers['x-request-id'] ||
            (0, uuid_1.v4)();
        request.correlationId = correlationId;
        // Add correlation ID to response headers
        reply.header('x-correlation-id', correlationId);
        // Create a child logger with correlation ID
        request.log = fastify.log.child({ correlationId });
    });
    // Log request details
    fastify.addHook('preHandler', async (request, reply) => {
        const context = {
            correlationId: request.correlationId,
            method: request.method,
            url: request.url,
            ip: request.ip,
            userAgent: request.headers['user-agent']
        };
        // Add user ID if available
        if (request.userId) {
            context.userId = request.userId;
        }
        request.log.info('Request received', context);
    });
    // Log response details
    fastify.addHook('onResponse', async (request, reply) => {
        const context = {
            correlationId: request.correlationId,
            method: request.method,
            url: request.url,
            statusCode: reply.statusCode,
            responseTime: reply.getResponseTime()
        };
        if (request.userId) {
            context.userId = request.userId;
        }
        const level = reply.statusCode >= 400 ? 'warn' : 'info';
        request.log[level]('Request completed', context);
    });
    // Log errors with correlation ID
    fastify.addHook('onError', async (request, reply, error) => {
        const context = {
            correlationId: request.correlationId,
            method: request.method,
            url: request.url,
            statusCode: reply.statusCode
        };
        if (request.userId) {
            context.userId = request.userId;
        }
        request.log.error('Request error', error, context);
    });
    // Decorate fastify with structured logger
    const structuredLogger = new StructuredLogger(fastify.log);
    fastify.decorate('slog', structuredLogger);
});
exports.structuredLoggingPlugin = structuredLoggingPlugin;
