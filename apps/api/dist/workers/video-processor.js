"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoProcessor = videoProcessor;
const bullmq_1 = require("bullmq");
const mux_node_1 = __importDefault(require("@mux/mux-node"));
const types_1 = require("./types");
const queue_1 = require("../lib/queue");
async function videoProcessor(fastify) {
    const mux = new mux_node_1.default({
        tokenId: process.env.MUX_TOKEN_ID,
        tokenSecret: process.env.MUX_TOKEN_SECRET,
    });
    const worker = new bullmq_1.Worker(queue_1.QUEUES.VIDEO_PROCESSING, async (job) => {
        const { videoId, muxAssetId, creatorId } = job.data;
        try {
            fastify.log.info({ videoId, muxAssetId }, 'Processing video');
            // Step 1: Check Mux asset status
            const asset = await mux.video.assets.retrieve(muxAssetId);
            if (asset.status === 'errored') {
                throw new Error(`Mux asset processing failed: ${asset.errors?.messages?.join(', ')}`);
            }
            if (asset.status !== 'ready') {
                // Re-queue the job to check again later
                await job.moveToDelayed(Date.now() + 10000); // Check again in 10 seconds
                return { status: types_1.JobStatus.PROCESSING, message: 'Asset still processing' };
            }
            // Step 2: Update video with Mux data
            const playbackId = asset.playback_ids?.[0]?.id;
            const duration = Math.round(asset.duration || 0);
            // Generate thumbnail URLs
            const thumbnailUrl = playbackId
                ? `https://image.mux.com/${playbackId}/thumbnail.jpg?width=640&height=360&time=5`
                : null;
            await fastify.db.video.update({
                where: { id: videoId },
                data: {
                    muxPlaybackId: playbackId,
                    duration,
                    thumbnailUrl,
                    videoUrl: `https://stream.mux.com/${playbackId}.m3u8`,
                    status: 'PROCESSING', // Will be updated after moderation
                },
            });
            // Step 3: Queue for moderation
            await fastify.queues.moderation.add('moderate-video', {
                videoId,
                muxAssetId,
                muxPlaybackId: playbackId,
                duration,
                creatorId,
            });
            // Step 4: Create analytics entry
            await fastify.db.videoAnalytics.create({
                data: {
                    videoId,
                    date: new Date(),
                    views: 0,
                    watchTimeMinutes: 0,
                    avgViewDuration: 0,
                    likes: 0,
                    comments: 0,
                    shares: 0,
                },
            });
            fastify.log.info({ videoId, playbackId }, 'Video processing completed');
            return {
                status: types_1.JobStatus.COMPLETED,
                data: { videoId, playbackId, duration, thumbnailUrl },
            };
        }
        catch (error) {
            fastify.log.error({ error, videoId }, 'Video processing failed');
            // Update video status to failed
            await fastify.db.video.update({
                where: { id: videoId },
                data: { status: 'DRAFT' },
            });
            // Notify creator of failure
            await fastify.queues.notifications.add('send-notification', {
                type: 'video_failed',
                userId: creatorId,
                data: {
                    title: 'Video Processing Failed',
                    message: 'There was an error processing your video. Please try uploading again.',
                    entityId: videoId,
                    entityType: 'video',
                },
            });
            throw error;
        }
    }, {
        connection: {
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT || '6379', 10),
            password: process.env.REDIS_PASSWORD,
        },
        concurrency: 5,
    });
    worker.on('completed', (job) => {
        fastify.log.info({ jobId: job.id, videoId: job.data.videoId }, 'Video processing job completed');
    });
    worker.on('failed', (job, err) => {
        fastify.log.error({ jobId: job?.id, error: err }, 'Video processing job failed');
    });
    return worker;
}
