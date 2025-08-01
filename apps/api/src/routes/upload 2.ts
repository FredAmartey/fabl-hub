import { FastifyPluginAsync } from 'fastify'
import { Type } from '@sinclair/typebox'
import Mux from '@mux/mux-node'
import crypto from 'crypto'

const uploadRoutes: FastifyPluginAsync = async (fastify) => {
  // Initialize Mux client
  const mux = new Mux({
    tokenId: process.env.MUX_TOKEN_ID!,
    tokenSecret: process.env.MUX_TOKEN_SECRET!,
  })

  // Generate Mux upload URL
  fastify.post('/url', {
    schema: {
      body: Type.Object({
        fileName: Type.String(),
        fileSize: Type.Number(),
        mimeType: Type.String()
      }),
      response: {
        200: Type.Object({
          uploadUrl: Type.String(),
          assetId: Type.String(),
          uploadId: Type.String(),
          expiresAt: Type.String()
        })
      }
    }
  }, async (request, reply) => {
    const userId = (fastify as any).requireAuth(request)
    const body = request.body as any
    const { fileName, fileSize, mimeType } = body

    try {
      // Create Mux upload
      const upload = await mux.video.uploads.create({
        cors_origin: process.env.STUDIO_URL || 'http://localhost:3001',
        new_asset_settings: {
          playback_policy: ['public'],
          video_quality: 'plus', // Better quality for AI-generated content
          master_access: 'temporary', // Allow downloading original for moderation
          mp4_support: 'standard',
          normalize_audio: true,
          per_title_encode: true, // Optimize encoding per video
        },
        test: process.env.NODE_ENV === 'development',
      })

      // Generate a unique upload ID for tracking
      const uploadId = crypto.randomBytes(16).toString('hex')
      
      // Store upload metadata in cache for later reference
      await fastify.cache.set(`upload:${uploadId}`, {
        userId,
        uploadId,
        muxUploadId: upload.id,
        fileName,
        fileSize,
        mimeType,
        status: 'pending',
        createdAt: new Date().toISOString(),
      }, {
        ttl: 24 * 60 * 60, // 24 hours
      })

      fastify.log.info({ userId, uploadId, muxUploadId: upload.id }, 'Created Mux upload')

      return {
        uploadUrl: upload.url!,
        assetId: upload.asset_id || '',
        uploadId,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60).toISOString() // 1 hour
      }
    } catch (error) {
      fastify.log.error({ error, userId }, 'Failed to create Mux upload')
      return reply.status(500).send({ 
        error: 'Failed to create upload URL',
        message: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      })
    }
  })

  // Handle Mux webhook
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
          }))),
          duration: Type.Optional(Type.Number()),
          aspect_ratio: Type.Optional(Type.String()),
          upload_id: Type.Optional(Type.String())
        })
      })
    }
  }, async (request, reply) => {
    const body = request.body as any
    const { type, data } = body

    try {
      // Verify webhook signature if in production
      if (process.env.NODE_ENV === 'production' && process.env.MUX_WEBHOOK_SECRET) {
        const signature = request.headers['mux-signature'] as string
        if (!verifyMuxWebhook(JSON.stringify(request.body), signature, process.env.MUX_WEBHOOK_SECRET)) {
          return reply.status(401).send({ error: 'Invalid webhook signature' })
        }
      }

      switch (type) {
        case 'video.asset.ready':
          const playbackId = data.playback_ids?.[0]?.id

          if (playbackId) {
            // Find the video by Mux asset ID
            const video = await fastify.db.video.findFirst({
              where: { muxAssetId: data.id }
            })

            if (video) {
              // Queue for video processing
              await fastify.queues.videoProcessing.add('process-video', {
                videoId: video.id,
                muxAssetId: data.id,
                creatorId: video.creatorId,
                uploadId: data.upload_id
              })

              fastify.log.info({ 
                assetId: data.id, 
                playbackId, 
                videoId: video.id 
              }, 'Video asset ready, queued for processing')
            } else {
              fastify.log.warn({ assetId: data.id }, 'No video found for Mux asset')
            }
          }
          break

        case 'video.asset.errored':
          const failedVideo = await fastify.db.video.findFirst({
            where: { muxAssetId: data.id }
          })

          if (failedVideo) {
            await fastify.db.video.update({
              where: { id: failedVideo.id },
              data: { status: 'DRAFT' }
            })

            // Notify creator of failure
            await fastify.queues.notifications.add('send-notification', {
              type: 'video_failed',
              userId: failedVideo.creatorId,
              data: {
                title: 'Video Processing Failed',
                message: 'There was an error processing your video. Please try uploading again.',
                entityId: failedVideo.id,
                entityType: 'video'
              }
            })
          }

          fastify.log.error({ assetId: data.id }, 'Video asset processing failed')
          break

        case 'video.upload.cancelled':
          // Clean up any associated data
          if (data.upload_id) {
            await fastify.cache.delete(`upload:${data.upload_id}`)
          }
          fastify.log.info({ uploadId: data.upload_id }, 'Video upload cancelled')
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

  // Complete upload and create video record
  fastify.post('/complete', {
    schema: {
      body: Type.Object({
        uploadId: Type.String(),
        title: Type.String({ minLength: 1, maxLength: 200 }),
        description: Type.Optional(Type.String({ maxLength: 5000 })),
        tags: Type.Optional(Type.Array(Type.String())),
        category: Type.Optional(Type.String()),
        visibility: Type.Optional(Type.String())
      }),
      response: {
        201: Type.Object({
          videoId: Type.String(),
          status: Type.String(),
          message: Type.String()
        })
      }
    }
  }, async (request, reply) => {
    const userId = (fastify as any).requireAuth(request)
    const body = request.body as any
    const { uploadId, title, description, tags, category, visibility } = body

    try {
      // Get upload metadata from cache
      const uploadData = await fastify.cache.get<any>(`upload:${uploadId}`)
      
      if (!uploadData) {
        return reply.status(404).send({ error: 'Upload not found or expired' })
      }

      if (uploadData.userId !== userId) {
        return reply.status(403).send({ error: 'Not authorized' })
      }

      // Get Mux upload status
      const muxUpload = await mux.video.uploads.retrieve(uploadData.muxUploadId)
      
      if (muxUpload.status !== 'asset_created') {
        return reply.status(400).send({ 
          error: 'Upload not complete',
          status: muxUpload.status 
        })
      }

      // Create video record
      const video = await fastify.db.video.create({
        data: {
          creatorId: userId,
          title,
          description,
          muxAssetId: muxUpload.asset_id!,
          status: 'PROCESSING',
          videoUrl: '', // Will be updated when asset is ready
          monetizationEnabled: false,
          tags: tags || [],
        }
      })

      // Clean up upload cache
      await fastify.cache.delete(`upload:${uploadId}`)

      fastify.log.info({ 
        videoId: video.id, 
        muxAssetId: muxUpload.asset_id 
      }, 'Video created and queued for processing')

      reply.status(201)
      return {
        videoId: video.id,
        status: video.status,
        message: 'Video uploaded successfully. Processing will begin shortly.'
      }
    } catch (error) {
      fastify.log.error({ error, uploadId }, 'Failed to complete upload')
      return reply.status(500).send({ 
        error: 'Failed to complete upload',
        message: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      })
    }
  })
}

// Verify Mux webhook signature
function verifyMuxWebhook(payload: string, signature: string, secret: string): boolean {
  const hmac = crypto.createHmac('sha256', secret)
  hmac.update(payload)
  const expectedSignature = hmac.digest('base64')
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  )
}

export default uploadRoutes