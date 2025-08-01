import { FastifyPluginAsync } from 'fastify';
declare module 'fastify' {
    interface FastifyRequest {
        correlationId: string;
    }
}
interface LogContext {
    correlationId?: string;
    userId?: string;
    method?: string;
    url?: string;
    error?: any;
    [key: string]: any;
}
export declare class StructuredLogger {
    private baseLogger;
    constructor(baseLogger: any);
    private formatMessage;
    info(message: string, context?: LogContext): void;
    warn(message: string, context?: LogContext): void;
    error(message: string, error?: Error | any, context?: LogContext): void;
    debug(message: string, context?: LogContext): void;
    child(context: LogContext): StructuredLogger;
}
declare const structuredLoggingPlugin: FastifyPluginAsync;
declare module 'fastify' {
    interface FastifyInstance {
        slog: StructuredLogger;
    }
}
export { structuredLoggingPlugin };
