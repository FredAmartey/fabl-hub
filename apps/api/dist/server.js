"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const helmet_1 = __importDefault(require("@fastify/helmet"));
const rate_limit_1 = __importDefault(require("@fastify/rate-limit"));
const env_1 = __importDefault(require("@fastify/env"));
// Import plugins and routes
const db_1 = require("./lib/db");
const auth_1 = require("./lib/auth");
const cache_1 = require("./lib/cache");
const queue_1 = require("./lib/queue");
const structured_logger_1 = require("./lib/structured-logger");
const error_handler_1 = require("./lib/error-handler");
const workers_1 = require("./workers");
// Route imports
const auth_2 = __importDefault(require("./routes/auth"));
const users_1 = __importDefault(require("./routes/users"));
const videos_1 = __importDefault(require("./routes/videos"));
const upload_1 = __importDefault(require("./routes/upload"));
const search_1 = __importDefault(require("./routes/search"));
const dashboard_1 = __importDefault(require("./routes/dashboard"));
const studio_1 = __importDefault(require("./routes/studio"));
const server = (0, fastify_1.default)({
    logger: {
        level: process.env.LOG_LEVEL || 'info',
        transport: process.env.NODE_ENV === 'development' ? {
            target: 'pino-pretty',
            options: {
                colorize: true
            }
        } : undefined
    }
}).withTypeProvider();
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
};
async function checkDatabaseHealth(db) {
    try {
        await db.$queryRaw `SELECT 1`;
        return 'connected';
    }
    catch (error) {
        return 'disconnected';
    }
}
async function checkCacheHealth(cache) {
    if (!cache) {
        return { status: 'not_configured' };
    }
    try {
        const cacheHealth = await cache.health();
        return cacheHealth.status === 'connected'
            ? { ...cacheHealth, stats: cache.getStats() }
            : cacheHealth;
    }
    catch (error) {
        return {
            status: 'error',
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}
async function checkSystemHealth(server) {
    const health = {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV,
        version: process.env.npm_package_version || '1.0.0',
        database: 'unknown',
        cache: { status: 'unknown' }
    };
    // Check database
    health.database = await checkDatabaseHealth(server.db);
    if (health.database === 'disconnected') {
        health.status = 'degraded';
    }
    // Check cache
    health.cache = await checkCacheHealth(server.cache);
    if (health.cache.status === 'error') {
        health.status = 'degraded';
    }
    return health;
}
async function start() {
    try {
        // Register environment validation
        await server.register(env_1.default, {
            schema: envSchema,
            dotenv: true
        });
        // Register security plugins
        const isProduction = process.env.NODE_ENV === 'production';
        const enableSecurityHeaders = process.env.ENABLE_SECURITY_HEADERS === 'true';
        await server.register(helmet_1.default, {
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
        });
        // Configure CORS origins
        const corsOrigins = process.env.CORS_ORIGIN
            ? process.env.CORS_ORIGIN.split(',')
            : [
                'http://localhost:3000', // Hub
                'http://localhost:3001', // Studio
                process.env.HUB_URL || 'http://localhost:3000',
                process.env.STUDIO_URL || 'http://localhost:3001'
            ];
        await server.register(cors_1.default, {
            origin: corsOrigins,
            credentials: true
        });
        await server.register(rate_limit_1.default, {
            max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
            timeWindow: parseInt(process.env.RATE_LIMIT_WINDOW || '60000', 10),
            errorResponseBuilder: () => ({
                code: 'RATE_LIMIT_EXCEEDED',
                error: 'Rate Limit Exceeded',
                message: 'Too many requests, please try again later.',
                statusCode: 429
            })
        });
        // Register custom plugins
        await server.register(structured_logger_1.structuredLoggingPlugin);
        await server.register(db_1.dbPlugin);
        await server.register(cache_1.cachePlugin);
        await server.register(queue_1.queuePlugin);
        await server.register(auth_1.authPlugin);
        // Enhanced logging with monitoring
        const { enhancedLoggingPlugin } = await Promise.resolve().then(() => __importStar(require('./lib/logger')));
        const { monitoringPlugin } = await Promise.resolve().then(() => __importStar(require('./lib/monitoring')));
        await server.register(enhancedLoggingPlugin);
        await server.register(monitoringPlugin);
        // Register error handler
        server.setErrorHandler(error_handler_1.errorHandler);
        // Health check endpoint
        server.get('/health', async () => checkSystemHealth(server));
        // Cache monitoring endpoint (for internal monitoring)
        server.get('/cache/stats', async () => {
            if (!server.cache) {
                return { error: 'Cache not configured' };
            }
            const stats = server.cache.getStats();
            const health = await server.cache.health();
            return {
                ...stats,
                health,
                timestamp: new Date().toISOString()
            };
        });
        // Cache management endpoints (for admin)
        server.delete('/cache/flush/:prefix?', async (request) => {
            if (!server.cache) {
                return { error: 'Cache not configured' };
            }
            const { prefix } = request.params;
            await server.cache.flush(prefix);
            return {
                success: true,
                message: prefix ? `Flushed cache prefix: ${prefix}` : 'Flushed all cache keys',
                timestamp: new Date().toISOString()
            };
        });
        server.post('/cache/stats/reset', async () => {
            if (!server.cache) {
                return { error: 'Cache not configured' };
            }
            server.cache.resetStats();
            return {
                success: true,
                message: 'Cache statistics reset',
                timestamp: new Date().toISOString()
            };
        });
        // Register API routes
        await server.register(auth_2.default, { prefix: '/api/auth' });
        await server.register(users_1.default, { prefix: '/api/users' });
        await server.register(videos_1.default, { prefix: '/api/videos' });
        await server.register(upload_1.default, { prefix: '/api/upload' });
        await server.register(search_1.default, { prefix: '/api/search' });
        await server.register(dashboard_1.default, { prefix: '/api/dashboard' });
        await server.register(studio_1.default, { prefix: '/api/studio' });
        // Start server
        const port = parseInt(process.env.PORT || '3002', 10);
        const host = process.env.HOST || '0.0.0.0';
        await server.listen({ port, host });
        // Start background workers
        if (process.env.ENABLE_WORKERS !== 'false') {
            await (0, workers_1.startWorkers)(server);
            server.log.info('🔧 Background workers started');
        }
        server.log.info(`🚀 Fabl API server listening on http://${host}:${port}`);
        server.log.info(`📊 Health check available at http://${host}:${port}/health`);
    }
    catch (err) {
        server.log.error(err);
        process.exit(1);
    }
}
// Handle graceful shutdown
process.on('SIGINT', async () => {
    server.log.info('Received SIGINT, shutting down gracefully...');
    await server.close();
    process.exit(0);
});
process.on('SIGTERM', async () => {
    server.log.info('Received SIGTERM, shutting down gracefully...');
    await server.close();
    process.exit(0);
});
start();
