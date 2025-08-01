"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.moderationWorker = moderationWorker;
const bullmq_1 = require("bullmq");
const axios_1 = __importDefault(require("axios"));
const types_1 = require("./types");
const queue_1 = require("../lib/queue");
async function moderationWorker(fastify) {
    const worker = new bullmq_1.Worker(queue_1.QUEUES.MODERATION, async (job) => {
        const { videoId, muxAssetId, muxPlaybackId, duration, creatorId } = job.data;
        try {
            fastify.log.info({ videoId, muxAssetId }, 'Starting video moderation');
            // Step 1: Extract frames for AI detection (1 fps)
            const frameCount = Math.min(duration, 300); // Max 300 frames (5 minutes)
            const frameUrls = [];
            for (let i = 0; i < frameCount; i++) {
                frameUrls.push(`https://image.mux.com/${muxPlaybackId}/thumbnail.jpg?width=640&height=360&time=${i}`);
            }
            // Step 2: AI Detection - Check if content is AI-generated
            const aiDetectionResults = await detectAIContent(frameUrls);
            const aiFrameCount = aiDetectionResults.filter(r => r.isAIGenerated).length;
            const aiRatio = aiFrameCount / frameCount;
            // Step 3: Content Moderation - Check for inappropriate content
            const contentModerationResult = await moderateContent(frameUrls);
            // Step 4: Determine approval status
            const isApproved = aiRatio >= 0.3 && !contentModerationResult.inappropriate;
            const moderationStatus = isApproved ? 'APPROVED' : 'REJECTED';
            let rejectionReason = '';
            if (aiRatio < 0.3) {
                rejectionReason = `Video must contain at least 30% AI-generated content (detected: ${Math.round(aiRatio * 100)}%)`;
            }
            else if (contentModerationResult.inappropriate) {
                rejectionReason = contentModerationResult.reason || 'Content violates community guidelines';
            }
            // Step 5: Update video status
            await fastify.db.video.update({
                where: { id: videoId },
                data: {
                    aiRatio,
                    isApproved,
                    status: isApproved ? 'PUBLISHED' : 'DRAFT',
                    publishedAt: isApproved ? new Date() : null,
                },
            });
            // Step 6: Create moderation log
            await fastify.db.moderationLog.create({
                data: {
                    videoId,
                    status: moderationStatus,
                    reason: rejectionReason || null,
                    aiScore: aiRatio,
                },
            });
            // Step 7: Send notification
            const notificationType = isApproved ? 'video_ready' : 'video_failed';
            const notificationMessage = isApproved
                ? 'Your video has been approved and is now live!'
                : rejectionReason;
            await fastify.queues.notifications.add('send-notification', {
                type: notificationType,
                userId: creatorId,
                data: {
                    title: isApproved ? 'Video Published!' : 'Video Not Approved',
                    message: notificationMessage,
                    entityId: videoId,
                    entityType: 'video',
                },
            });
            fastify.log.info({ videoId, isApproved, aiRatio }, 'Video moderation completed');
            return {
                status: types_1.JobStatus.COMPLETED,
                data: {
                    videoId,
                    isApproved,
                    aiRatio,
                    moderationStatus,
                    reason: rejectionReason,
                },
            };
        }
        catch (error) {
            fastify.log.error({ error, videoId }, 'Video moderation failed');
            // Update video status to need review
            await fastify.db.video.update({
                where: { id: videoId },
                data: { status: 'DRAFT' },
            });
            throw error;
        }
    }, {
        connection: {
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT || '6379', 10),
            password: process.env.REDIS_PASSWORD,
        },
        concurrency: 3, // Limit concurrent moderation jobs
    });
    worker.on('completed', (job) => {
        fastify.log.info({ jobId: job.id, videoId: job.data.videoId }, 'Moderation job completed');
    });
    worker.on('failed', (job, err) => {
        fastify.log.error({ jobId: job?.id, error: err }, 'Moderation job failed');
    });
    return worker;
}
// AI Detection Service Integration
async function detectAIContent(frameUrls) {
    // This is a placeholder for the actual AI detection service
    // In production, this would call services like:
    // - Sensity API
    // - Amber Video
    // - Custom Vision Transformer model
    if (process.env.AI_DETECTION_API_KEY && process.env.AI_DETECTION_API_URL) {
        try {
            const results = await Promise.all(frameUrls.map(async (url, index) => {
                const response = await axios_1.default.post(process.env.AI_DETECTION_API_URL, { imageUrl: url }, {
                    headers: {
                        'Authorization': `Bearer ${process.env.AI_DETECTION_API_KEY}`,
                        'Content-Type': 'application/json',
                    },
                    timeout: 5000,
                });
                return {
                    frameNumber: index,
                    isAIGenerated: response.data.isAIGenerated || false,
                    confidence: response.data.confidence || 0,
                };
            }));
            return results;
        }
        catch (error) {
            console.error('AI detection API error:', error);
            // Fallback to mock detection
        }
    }
    // Mock AI detection for development
    return frameUrls.map((_, index) => ({
        frameNumber: index,
        isAIGenerated: Math.random() > 0.5, // 50% chance for dev
        confidence: 0.7 + Math.random() * 0.3,
    }));
}
// Content Moderation Service Integration
async function moderateContent(frameUrls) {
    // This would integrate with Hive AI or Sightengine
    if (process.env.HIVE_API_KEY && process.env.HIVE_API_URL) {
        try {
            // Sample only every 10th frame to reduce API calls
            const sampled = frameUrls.filter((_, i) => i % 10 === 0);
            const results = await Promise.all(sampled.map(async (url) => {
                const response = await axios_1.default.post(process.env.HIVE_API_URL, { url }, {
                    headers: {
                        'Authorization': `Token ${process.env.HIVE_API_KEY}`,
                        'Content-Type': 'application/json',
                    },
                    timeout: 5000,
                });
                const classes = response.data.status[0].response.output[0].classes;
                // Check for inappropriate content
                const nsfw = classes.find((c) => c.class === 'nsfw');
                const violence = classes.find((c) => c.class === 'violence');
                return {
                    inappropriate: (nsfw?.score > 0.8) || (violence?.score > 0.8),
                    reason: nsfw?.score > 0.8 ? 'NSFW content detected' :
                        violence?.score > 0.8 ? 'Violence detected' : undefined,
                };
            }));
            // If any frame is inappropriate, reject the video
            const inappropriate = results.find(r => r.inappropriate);
            return inappropriate || { inappropriate: false };
        }
        catch (error) {
            console.error('Content moderation API error:', error);
            // Fallback to no moderation in case of error
        }
    }
    // For development, approve all content
    return { inappropriate: false };
}
