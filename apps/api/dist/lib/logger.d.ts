import { FastifyPluginAsync } from 'fastify';
export declare const logger: import("pino").Logger<never, boolean>;
export declare const logRequest: (req: any, additionalData?: {}) => void;
export declare const logError: (error: Error, context?: {}) => void;
export declare const logVideoEvent: (event: string, videoId: string, data?: {}) => void;
export declare const logCacheEvent: (operation: string, key: string, hit: boolean, latency?: number) => void;
export declare const logSecurityEvent: (event: string, ip: string, data?: {}) => void;
declare const enhancedLoggingPlugin: FastifyPluginAsync;
export { enhancedLoggingPlugin };
