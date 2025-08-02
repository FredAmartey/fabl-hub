import { FastifyPluginAsync } from 'fastify'
import { Type } from '@sinclair/typebox'
import Mux from '@mux/mux-node'

const adminRoutes: FastifyPluginAsync = async (fastify) => {
  const mux = new Mux({
    tokenId: process.env.MUX_TOKEN_ID!,
    tokenSecret: process.env.MUX_TOKEN_SECRET!,
  })

  // Get Mux asset stats (development only)
  fastify.get('/mux/assets', {
    schema: {
      response: {
        200: Type.Object({
          totalAssets: Type.Number(),
          limit: Type.Number(),
          assets: Type.Array(Type.Object({
            id: Type.String(),
            createdAt: Type.String(),
            duration: Type.Optional(Type.Number()),
            status: Type.String(),
            inDatabase: Type.Boolean()
          }))
        })
      }
    }
  }, async (request, reply) => {
    if (process.env.NODE_ENV !== 'development') {
      return reply.status(403).send({ error: 'Admin endpoints only available in development' })
    }

    try {
      // Get all Mux assets
      const muxAssets = await mux.video.assets.list({ limit: 100 })
      
      // Get all videos from database
      const dbVideos = await fastify.db.video.findMany({
        select: { muxAssetId: true }
      })
      const dbAssetIds = new Set(dbVideos.map(v => v.muxAssetId).filter(Boolean))
      
      // Format response
      const assets = muxAssets.map(asset => ({
        id: asset.id,
        createdAt: asset.created_at,
        duration: asset.duration,
        status: asset.status,
        inDatabase: dbAssetIds.has(asset.id)
      }))
      
      return {
        totalAssets: assets.length,
        limit: 10,
        assets: assets.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      }
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Failed to fetch Mux assets' })
    }
  })

  // Delete Mux asset (development only)
  fastify.delete('/mux/assets/:assetId', {
    schema: {
      params: Type.Object({
        assetId: Type.String()
      }),
      response: {
        200: Type.Object({
          success: Type.Boolean(),
          message: Type.String()
        })
      }
    }
  }, async (request, reply) => {
    if (process.env.NODE_ENV !== 'development') {
      return reply.status(403).send({ error: 'Admin endpoints only available in development' })
    }

    const { assetId } = request.params as { assetId: string }

    try {
      // Check if asset exists in database
      const video = await fastify.db.video.findFirst({
        where: { muxAssetId: assetId }
      })
      
      if (video) {
        // Delete from database first
        await fastify.db.video.delete({
          where: { id: video.id }
        })
        fastify.log.info(`Deleted video ${video.id} from database`)
      }
      
      // Delete from Mux
      await mux.video.assets.delete(assetId)
      fastify.log.info(`Deleted asset ${assetId} from Mux`)
      
      return {
        success: true,
        message: `Asset ${assetId} deleted successfully`
      }
    } catch (error: any) {
      if (error.status === 404) {
        return reply.status(404).send({ error: 'Asset not found in Mux' })
      }
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Failed to delete asset' })
    }
  })
}

export default adminRoutes