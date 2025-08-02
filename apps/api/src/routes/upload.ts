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
      // Mock mode for development when Mux limit is reached
      if (process.env.MOCK_UPLOADS === 'true') {
        fastify.log.info('Using mock upload mode (MOCK_UPLOADS=true)')
        
        const mockUploadId = crypto.randomBytes(16).toString('hex')
        const mockUploadUrl = 'https://example.com/mock-upload'
        
        // Store mock upload metadata
        await fastify.cache.set(`upload:${mockUploadId}`, {
          userId,
          uploadId: mockUploadId,
          muxUploadId: `mock_${mockUploadId}`,
          fileName,
          fileSize,
          mimeType,
          status: 'pending',
          createdAt: new Date().toISOString(),
          isMock: true
        }, {
          ttl: 24 * 60 * 60,
        })
        
        return {
          uploadUrl: mockUploadUrl,
          assetId: `mock_asset_${mockUploadId}`,
          uploadId: mockUploadId,
          expiresAt: new Date(Date.now() + 1000 * 60 * 60).toISOString()
        }
      }
      
      // Check asset count if in development (free tier limit)
      if (process.env.NODE_ENV === 'development') {
        try {
          const assets = await mux.video.assets.list({ limit: 100 })
          if (assets.length >= 10) {
            fastify.log.warn(`Mux asset limit reached: ${assets.length}/10 assets`)
            return reply.status(429).send({ 
              error: 'Asset limit reached',
              message: 'Free Mux plan limit of 10 assets reached. Please delete old videos or upgrade your Mux plan.',
              assetCount: assets.length,
              tip: 'Set MOCK_UPLOADS=true in .env to use mock uploads for testing'
            })
          }
        } catch (listError) {
          fastify.log.warn('Could not check asset count:', listError)
        }
      }
      
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
              // Update video with playback ID and video URL
              const updatedVideo = await fastify.db.video.update({
                where: { id: video.id },
                data: {
                  muxPlaybackId: playbackId,
                  videoUrl: `https://stream.mux.com/${playbackId}.m3u8`,
                  duration: Math.round(data.duration || video.duration || 0)
                }
              })

              // Queue for AI moderation
              await fastify.queues.moderation.add('moderate-video', {
                videoId: video.id,
                muxAssetId: data.id,
                muxPlaybackId: playbackId,
                duration: Math.round(data.duration || video.duration || 0),
                creatorId: video.creatorId
              })

              fastify.log.info({ 
                assetId: data.id, 
                playbackId, 
                videoId: video.id 
              }, 'Video asset ready, updated with playback ID and queued for moderation')
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

  // Create draft video record immediately after upload
  fastify.post('/create-draft', {
    schema: {
      body: Type.Object({
        uploadId: Type.String(),
        fileName: Type.String(),
        duration: Type.Optional(Type.Number()),
        thumbnailUrl: Type.Optional(Type.String())
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
    const { uploadId, fileName, duration = 0, thumbnailUrl } = body

    try {
      // Get upload metadata from cache
      const uploadData = await fastify.cache.get<any>(`upload:${uploadId}`)
      
      if (!uploadData) {
        return reply.status(404).send({ error: 'Upload not found or expired' })
      }

      if (uploadData.userId !== userId) {
        return reply.status(403).send({ error: 'Not authorized' })
      }

      let muxAssetId: string
      
      // Handle mock uploads differently
      if (uploadData.isMock) {
        muxAssetId = `mock_asset_${uploadId}`
        fastify.log.info('Creating draft for mock upload')
      } else {
        // Get Mux upload status
        const muxUpload = await mux.video.uploads.retrieve(uploadData.muxUploadId)
        
        if (muxUpload.status !== 'asset_created') {
          return reply.status(400).send({ 
            error: 'Upload not complete',
            status: muxUpload.status 
          })
        }
        
        muxAssetId = muxUpload.asset_id!
      }

      // Ensure user exists in database (create if first time)
      await fastify.db.user.upsert({
        where: { id: userId },
        update: {}, // Don't update anything if user exists
        create: {
          id: userId,
          name: 'Creator', // Will be updated when user sets profile
          username: `user_${userId.slice(-8)}`, // Temp username
          email: '', // Will be updated from Clerk webhook or profile
        }
      })

      // Create draft video record
      const defaultTitle = fileName.replace(/\.[^/.]+$/, '') // Remove extension
      const video = await fastify.db.video.create({
        data: {
          creatorId: userId,
          title: defaultTitle,
          description: '',
          muxAssetId: muxAssetId,
          status: 'DRAFT', // Start as draft
          videoUrl: uploadData.isMock ? 'https://example.com/mock-video.mp4' : '', // Mock video URL
          muxPlaybackId: uploadData.isMock ? `mock_playback_${uploadId}` : undefined,
          duration: duration || (uploadData.isMock ? 120 : 0), // Use provided duration, fallback to mock or 0
          thumbnailUrl: thumbnailUrl || null, // Use provided thumbnail URL
          isApproved: false, // Not approved until published
          publishedAt: null, // Not published yet
          monetizationEnabled: false,
        }
      })

      fastify.log.info({ 
        videoId: video.id, 
        muxAssetId: muxAssetId,
        isMock: uploadData.isMock
      }, 'Draft video created')

      reply.status(201)
      return {
        videoId: video.id,
        status: video.status,
        message: 'Draft video created successfully'
      }
    } catch (error) {
      fastify.log.error({ error, uploadId }, 'Failed to create draft video')
      return reply.status(500).send({ 
        error: 'Failed to create draft video',
        message: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      })
    }
  })

  // Publish draft video (complete the flow)
  fastify.post('/complete', {
    schema: {
      body: Type.Object({
        videoId: Type.String(),
        title: Type.String({ minLength: 1, maxLength: 200 }),
        description: Type.Optional(Type.String({ maxLength: 5000 })),
        tags: Type.Optional(Type.Array(Type.String())),
        category: Type.Optional(Type.String()),
        visibility: Type.Optional(Type.String())
      }),
      response: {
        200: Type.Object({
          videoId: Type.String(),
          status: Type.String(),
          message: Type.String()
        })
      }
    }
  }, async (request, reply) => {
    const userId = (fastify as any).requireAuth(request)
    const body = request.body as any
    const { videoId, title, description, tags, category, visibility } = body

    try {
      // Find the existing draft video
      const existingVideo = await fastify.db.video.findUnique({
        where: { id: videoId },
        select: { 
          id: true, 
          creatorId: true, 
          status: true, 
          muxAssetId: true,
          muxPlaybackId: true
        }
      })

      if (!existingVideo) {
        return reply.status(404).send({ error: 'Video not found' })
      }

      if (existingVideo.creatorId !== userId) {
        return reply.status(403).send({ error: 'Not authorized' })
      }

      if (existingVideo.status !== 'DRAFT') {
        return reply.status(400).send({ error: 'Video is not in draft status' })
      }

      // Determine final status based on content and Mux processing
      let finalStatus = 'PROCESSING'
      let publishedAt = null
      let isApproved = false

      // If this is a mock video, publish immediately
      if (existingVideo.muxAssetId?.startsWith('mock_')) {
        finalStatus = 'PUBLISHED'
        publishedAt = new Date()
        isApproved = true
      } else {
        // For real videos, check if Mux processing is complete
        try {
          const asset = await mux.video.assets.retrieve(existingVideo.muxAssetId)
          if (asset.status === 'ready') {
            finalStatus = 'PUBLISHED'
            publishedAt = new Date()
            isApproved = true
          }
        } catch (error) {
          // Asset not ready yet, will remain in PROCESSING
          fastify.log.info({ videoId, muxAssetId: existingVideo.muxAssetId }, 'Mux asset still processing')
        }
      }

      // Update the video with new details and status
      const updatedVideo = await fastify.db.video.update({
        where: { id: videoId },
        data: {
          title,
          description,
          status: finalStatus,
          publishedAt,
          isApproved,
          // TODO: Handle tags and category when we add those fields to the schema
        }
      })

      fastify.log.info({ 
        videoId: updatedVideo.id, 
        status: finalStatus,
        wasProcessingComplete: finalStatus === 'PUBLISHED'
      }, 'Video published from draft')

      return {
        videoId: updatedVideo.id,
        status: finalStatus,
        message: finalStatus === 'PUBLISHED' 
          ? 'Video published successfully!'
          : 'Video published! It may take 5-10 minutes for processing to complete. You can close this window - your video will be available once processing finishes.'
      }
    } catch (error) {
      fastify.log.error({ error, videoId }, 'Failed to publish video')
      return reply.status(500).send({ 
        error: 'Failed to publish video',
        message: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      })
    }
  })

  // Development helper: Sync Mux asset status
  fastify.post('/sync-mux-status', async (request, reply) => {
    if (process.env.NODE_ENV !== 'development') {
      return reply.status(403).send({ error: 'Only available in development' })
    }

    try {
      // Get all processing videos
      const processingVideos = await fastify.db.video.findMany({
        where: { status: 'PROCESSING' }
      })

      let updatedCount = 0
      const statusReport = []
      
      fastify.log.info(`Checking ${processingVideos.length} processing videos`)
      
      for (const video of processingVideos) {
        try {
          const asset = await mux.video.assets.retrieve(video.muxAssetId)
          
          fastify.log.info({ 
            videoId: video.id, 
            assetId: video.muxAssetId, 
            muxStatus: asset.status,
            title: video.title 
          }, 'Mux asset status check')
          
          statusReport.push({
            videoId: video.id,
            title: video.title,
            muxAssetId: video.muxAssetId,
            muxStatus: asset.status,
            dbStatus: video.status
          })
          
          if (asset.status === 'ready') {
            const playbackId = asset.playback_ids?.[0]?.id
            
            await fastify.db.video.update({
              where: { id: video.id },
              data: {
                status: 'PUBLISHED',
                muxPlaybackId: playbackId,
                duration: Math.round(asset.duration || 0),
                publishedAt: video.publishedAt || new Date(),
                isApproved: true
              }
            })
            
            updatedCount++
            fastify.log.info({ videoId: video.id, assetId: video.muxAssetId }, 'Synced video status from Mux')
          }
        } catch (error) {
          fastify.log.warn({ videoId: video.id, assetId: video.muxAssetId, error }, 'Failed to sync video status')
          statusReport.push({
            videoId: video.id,
            title: video.title,
            muxAssetId: video.muxAssetId,
            error: error instanceof Error ? error.message : 'Unknown error'
          })
        }
      }

      return { 
        message: `Synced ${updatedCount} videos from processing to published`,
        totalProcessing: processingVideos.length,
        statusReport 
      }
    } catch (error) {
      fastify.log.error(error, 'Failed to sync Mux status')
      return reply.status(500).send({ error: 'Sync failed' })
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