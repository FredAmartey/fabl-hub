"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbPlugin = void 0;
const db_1 = require("@fabl/db");
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const dbPlugin = (0, fastify_plugin_1.default)(async (fastify) => {
    const db = new db_1.PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
        errorFormat: 'pretty'
    });
    // Test database connection
    try {
        await db.$connect();
        fastify.log.info('✅ Database connected successfully');
    }
    catch (error) {
        fastify.log.error('❌ Database connection failed:', error);
        throw error;
    }
    // Add db to Fastify instance
    fastify.decorate('db', db);
    // Handle graceful shutdown
    fastify.addHook('onClose', async (instance) => {
        instance.log.info('Disconnecting from database...');
        await db.$disconnect();
    });
});
exports.dbPlugin = dbPlugin;
