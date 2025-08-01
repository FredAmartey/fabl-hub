"use strict";
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
const structured_logger_1 = require("./lib/structured-logger");
const error_handler_1 = require("./lib/error-handler");
// Route imports
const auth_2 = __importDefault(require("./routes/auth"));
const users_1 = __importDefault(require("./routes/users"));
const videos_1 = __importDefault(require("./routes/videos"));
const upload_1 = __importDefault(require("./routes/upload"));
const search_1 = __importDefault(require("./routes/search"));
const dashboard_1 = __importDefault(require("./routes/dashboard"));
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
        MUX_TOKEN_SECRET: { type: 'string' }
    }
};
async function start() {
    try {
        // Register environment validation
        await server.register(env_1.default, {
            schema: envSchema,
            dotenv: true
        });
        // Register security plugins
        await server.register(helmet_1.default, {
            contentSecurityPolicy: false
        });
        await server.register(cors_1.default, {
            origin: [
                'http://localhost:3000', // Hub
                'http://localhost:3001', // Studio
                process.env.HUB_URL || 'http://localhost:3000',
                process.env.STUDIO_URL || 'http://localhost:3001'
            ],
            credentials: true
        });
        await server.register(rate_limit_1.default, {
            max: 100,
            timeWindow: '1 minute',
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
        await server.register(auth_1.authPlugin);
        // Register error handler
        server.setErrorHandler(error_handler_1.errorHandler);
        // Health check endpoint
        server.get('/health', async () => ({
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime: process.uptime()
        }));
        // Register API routes
        await server.register(auth_2.default, { prefix: '/api/auth' });
        await server.register(users_1.default, { prefix: '/api/users' });
        await server.register(videos_1.default, { prefix: '/api/videos' });
        await server.register(upload_1.default, { prefix: '/api/upload' });
        await server.register(search_1.default, { prefix: '/api/search' });
        await server.register(dashboard_1.default, { prefix: '/api/dashboard' });
        // Start server
        const port = parseInt(server.config.PORT, 10);
        const host = server.config.HOST;
        await server.listen({ port, host });
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
