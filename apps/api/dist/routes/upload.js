"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typebox_1 = require("@sinclair/typebox");
const uploadRoutes = async (fastify) => {
    // Generate Mux upload URL (placeholder for now)
    fastify.post('/url', {
        schema: {
            response: {
                200: typebox_1.Type.Object({
                    uploadUrl: typebox_1.Type.String(),
                    assetId: typebox_1.Type.String(),
                    expiresAt: typebox_1.Type.String()
                })
            }
        }
    }, async (request, reply) => {
        const userId = fastify.requireAuth(request);
        // TODO: Integrate with Mux API
        // For now, return a mock response
        const mockAssetId = `mock_asset_${Date.now()}`;
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour from now
        fastify.log.info({ userId, assetId: mockAssetId }, 'Generated upload URL');
        return {
            uploadUrl: `https://storage.mux.com/upload/${mockAssetId}`,
            assetId: mockAssetId,
            expiresAt: expiresAt.toISOString()
        };
    });
    // Handle Mux webhook (placeholder)
    fastify.post('/webhook/mux', {
        schema: {
            body: typebox_1.Type.Object({
                type: typebox_1.Type.String(),
                data: typebox_1.Type.Object({
                    id: typebox_1.Type.String(),
                    status: typebox_1.Type.Optional(typebox_1.Type.String()),
                    playback_ids: typebox_1.Type.Optional(typebox_1.Type.Array(typebox_1.Type.Object({
                        id: typebox_1.Type.String(),
                        policy: typebox_1.Type.String()
                    })))
                })
            })
        }
    }, async (request, reply) => {
        const { type, data } = request.body;
        try {
            switch (type) {
                case 'video.asset.ready':
                    const playbackId = data.playback_ids?.[0]?.id;
                    if (playbackId) {
                        // Update video record with Mux data
                        await fastify.db.video.updateMany({
                            where: { muxAssetId: data.id },
                            data: {
                                muxPlaybackId: playbackId,
                                status: 'PROCESSING' // Will be updated after moderation
                            }
                        });
                        fastify.log.info({ assetId: data.id, playbackId }, 'Video asset ready');
                    }
                    break;
                case 'video.asset.errored':
                    await fastify.db.video.updateMany({
                        where: { muxAssetId: data.id },
                        data: { status: 'DRAFT' } // Reset to draft on error
                    });
                    fastify.log.error({ assetId: data.id }, 'Video asset processing failed');
                    break;
                default:
                    fastify.log.info({ type }, 'Unhandled Mux webhook event');
            }
            return reply.status(200).send({ success: true });
        }
        catch (error) {
            fastify.log.error({ error, type, assetId: data.id }, 'Mux webhook processing failed');
            return reply.status(500).send({ error: 'Webhook processing failed' });
        }
    });
};
exports.default = uploadRoutes;
