import { FastifyPluginAsync } from 'fastify'
import { Type } from '@sinclair/typebox'

const uploadRoutes: FastifyPluginAsync = async (fastify) => {
  // Generate Mux upload URL (placeholder for now)
  fastify.post('/url', {
    schema: {
      response: {
        200: Type.Object({
          uploadUrl: Type.String(),
          assetId: Type.String(),
          expiresAt: Type.String()
        })
      }
    }
  }, async (request, reply) => {
    const userId = (fastify as any).requireAuth(request)

    // TODO: Integrate with Mux API
    // For now, return a mock response
    const mockAssetId = `mock_asset_${Date.now()}`
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60) // 1 hour from now

    fastify.log.info({ userId, assetId: mockAssetId }, 'Generated upload URL')

    return {
      uploadUrl: `https://storage.mux.com/upload/${mockAssetId}`,
      assetId: mockAssetId,
      expiresAt: expiresAt.toISOString()
    }
  })

  // Handle Mux webhook (placeholder)
  fastify.post('/webhook/mux', {
    schema: {
      body: Type.Object({
        type: Type.String(),
        data: Type.Object({
          id: Type.String(),
          status: Type.Optional(Type.String()),
          playback_ids: Type.Optional(Type.Array(Type.Object({
            id: Type.String(),
            policy: Type.String()
          })))
        })
      })
    }
  }, async (request, reply) => {
    const { type, data } = request.body

    try {
      switch (type) {
        case 'video.asset.ready':
          const playbackId = data.playback_ids?.[0]?.id

          if (playbackId) {
            // Update video record with Mux data
            await fastify.db.video.updateMany({
              where: { muxAssetId: data.id },
              data: {
                muxPlaybackId: playbackId,
                status: 'PROCESSING' // Will be updated after moderation
              }
            })

            fastify.log.info({ assetId: data.id, playbackId }, 'Video asset ready')
          }
          break

        case 'video.asset.errored':
          await fastify.db.video.updateMany({
            where: { muxAssetId: data.id },
            data: { status: 'DRAFT' } // Reset to draft on error
          })

          fastify.log.error({ assetId: data.id }, 'Video asset processing failed')
          break

        default:
          fastify.log.info({ type }, 'Unhandled Mux webhook event')
      }

      return reply.status(200).send({ success: true })
    } catch (error) {
      fastify.log.error({ error, type, assetId: data.id }, 'Mux webhook processing failed')
      return reply.status(500).send({ error: 'Webhook processing failed' })
    }
  })
}

export default uploadRoutes