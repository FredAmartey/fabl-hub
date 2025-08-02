import { FastifyPluginAsync } from 'fastify'
import { Type } from '@sinclair/typebox'

const notificationRoutes: FastifyPluginAsync = async (fastify) => {
  // Get user notifications
  fastify.get('/', {
    schema: {
      response: {
        200: Type.Array(Type.Object({
          id: Type.String(),
          type: Type.String(),
          title: Type.String(),
          message: Type.String(),
          read: Type.Boolean(),
          entityId: Type.Optional(Type.String()),
          entityType: Type.Optional(Type.String()),
          createdAt: Type.String()
        }))
      }
    }
  }, async (request) => {
    const userId = (fastify as any).requireAuth(request)

    const notifications = await fastify.db.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50
    })

    return notifications.map(notification => ({
      id: notification.id,
      type: notification.type,
      title: notification.type, // Use type as title for now
      message: notification.message,
      read: notification.read,
      entityId: notification.entityId,
      entityType: notification.entityType,
      createdAt: notification.createdAt.toISOString()
    }))
  })

  // Get unread notification count
  fastify.get('/unread-count', {
    schema: {
      response: {
        200: Type.Object({
          count: Type.Number()
        })
      }
    }
  }, async (request) => {
    const userId = (fastify as any).requireAuth(request)

    const count = await fastify.db.notification.count({
      where: { 
        userId,
        read: false
      }
    })

    return { count }
  })

  // Mark notification as read
  fastify.put('/:id/read', {
    schema: {
      params: Type.Object({
        id: Type.String()
      }),
      response: {
        200: Type.Object({
          success: Type.Boolean()
        })
      }
    }
  }, async (request, reply) => {
    const userId = (fastify as any).requireAuth(request)
    const { id } = request.params as { id: string }

    const notification = await fastify.db.notification.findFirst({
      where: { 
        id,
        userId
      }
    })

    if (!notification) {
      return reply.status(404).send({ error: 'Notification not found' })
    }

    await fastify.db.notification.update({
      where: { id },
      data: { read: true }
    })

    return { success: true }
  })

  // Mark all notifications as read
  fastify.put('/read-all', {
    schema: {
      response: {
        200: Type.Object({
          success: Type.Boolean(),
          updated: Type.Number()
        })
      }
    }
  }, async (request) => {
    const userId = (fastify as any).requireAuth(request)

    const result = await fastify.db.notification.updateMany({
      where: { 
        userId,
        read: false
      },
      data: { read: true }
    })

    return { 
      success: true, 
      updated: result.count 
    }
  })

  // Delete notification
  fastify.delete('/:id', {
    schema: {
      params: Type.Object({
        id: Type.String()
      }),
      response: {
        200: Type.Object({
          success: Type.Boolean()
        })
      }
    }
  }, async (request, reply) => {
    const userId = (fastify as any).requireAuth(request)
    const { id } = request.params as { id: string }

    const notification = await fastify.db.notification.findFirst({
      where: { 
        id,
        userId
      }
    })

    if (!notification) {
      return reply.status(404).send({ error: 'Notification not found' })
    }

    await fastify.db.notification.delete({
      where: { id }
    })

    return { success: true }
  })
}

export default notificationRoutes