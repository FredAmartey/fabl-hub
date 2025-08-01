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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startWorkers = startWorkers;
const video_processor_1 = require("./video-processor");
const moderation_worker_1 = require("./moderation-worker");
const analytics_aggregator_1 = require("./analytics-aggregator");
const notification_worker_1 = require("./notification-worker");
async function startWorkers(fastify) {
    const workers = [];
    // Video Processing Worker
    workers.push(await (0, video_processor_1.videoProcessor)(fastify));
    // Moderation Worker
    workers.push(await (0, moderation_worker_1.moderationWorker)(fastify));
    // Analytics Aggregator
    workers.push(await (0, analytics_aggregator_1.analyticsAggregator)(fastify));
    // Notification Worker
    workers.push(await (0, notification_worker_1.notificationWorker)(fastify));
    fastify.log.info(`Started ${workers.length} workers`);
    // Graceful shutdown
    process.on('SIGTERM', async () => {
        fastify.log.info('Shutting down workers...');
        await Promise.all(workers.map(worker => worker.close()));
    });
    return workers;
}
__exportStar(require("./types"), exports);
