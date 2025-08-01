"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.enhancedLoggingPlugin = exports.logSecurityEvent = exports.logCacheEvent = exports.logVideoEvent = exports.logError = exports.logRequest = exports.logger = void 0;
const pino_1 = __importDefault(require("pino"));
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
// Production-ready logger configuration
const createLogger = () => {
    const isProduction = process.env.NODE_ENV === 'production';
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
            timestamp: pino_1.default.stdTimeFunctions.isoTime,
            // Error serialization
            serializers: {
                err: pino_1.default.stdSerializers.err,
                req: pino_1.default.stdSerializers.req,
                res: pino_1.default.stdSerializers.res,
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
    };
    return (0, pino_1.default)(loggerConfig);
};
// Custom log levels for different scenarios
exports.logger = createLogger();
// Structured logging helpers
const logRequest = (req, additionalData = {}) => {
    exports.logger.info({
        req: {
            method: req.method,
            url: req.url,
            userAgent: req.headers['user-agent'],
            ip: req.ip,
        },
        ...additionalData,
    }, 'HTTP Request');
};
exports.logRequest = logRequest;
const logError = (error, context = {}) => {
    exports.logger.error({
        err: error,
        ...context,
    }, error.message);
};
exports.logError = logError;
const logVideoEvent = (event, videoId, data = {}) => {
    exports.logger.info({
        event,
        videoId,
        ...data,
    }, `Video event: ${event}`);
};
exports.logVideoEvent = logVideoEvent;
const logCacheEvent = (operation, key, hit, latency) => {
    exports.logger.debug({
        cache: {
            operation,
            key,
            hit,
            latency,
        },
    }, `Cache ${operation}: ${hit ? 'HIT' : 'MISS'}`);
};
exports.logCacheEvent = logCacheEvent;
const logSecurityEvent = (event, ip, data = {}) => {
    exports.logger.warn({
        security: {
            event,
            ip,
            ...data,
        },
    }, `Security event: ${event}`);
};
exports.logSecurityEvent = logSecurityEvent;
// Fastify plugin for enhanced logging
const enhancedLoggingPlugin = (0, fastify_plugin_1.default)(async (fastify) => {
    // Replace default logger
    fastify.decorate('log', exports.logger);
    // Add request/response logging
    fastify.addHook('onRequest', async (request) => {
        (0, exports.logRequest)(request);
    });
    fastify.addHook('onResponse', async (request, reply) => {
        const responseTime = reply.getResponseTime();
        exports.logger.info({
            req: {
                method: request.method,
                url: request.url,
                ip: request.ip,
            },
            res: {
                statusCode: reply.statusCode,
                responseTime,
            },
        }, 'HTTP Response');
    });
    // Log uncaught errors
    fastify.setErrorHandler(async (error, request, reply) => {
        (0, exports.logError)(error, {
            req: {
                method: request.method,
                url: request.url,
                ip: request.ip,
            },
        });
        // Let default error handler continue
        throw error;
    });
});
exports.enhancedLoggingPlugin = enhancedLoggingPlugin;
