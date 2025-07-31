import { FastifyPluginAsync } from 'fastify'
import { Type } from '@sinclair/typebox'

const userRoutes: FastifyPluginAsync = async (fastify) => {
  // Get current user profile
  fastify.get('/me', {
    schema: {
      response: {
        200: Type.Object({
          id: Type.String(),
          email: Type.String(),
          name: Type.String(),
          username: Type.String(),
          avatarUrl: Type.Optional(Type.String()),
          channelName: Type.Optional(Type.String()),
          subscriberCount: Type.Number(),
          isVerified: Type.Boolean(),
          createdAt: Type.String(),
          updatedAt: Type.String()
        })
      }
    }
  }, async (request, reply) => {
    const userId = (fastify as any).requireAuth(request)

    const user = await fastify.db.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return reply.status(404).send({ error: 'User not found' })
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      username: user.username,
      avatarUrl: user.avatarUrl,
      channelName: user.channelName,
      subscriberCount: user.subscriberCount,
      isVerified: user.isVerified,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString()
    }
  })

  // Update user profile
  fastify.put('/me', {
    schema: {
      body: Type.Object({
        name: Type.Optional(Type.String()),
        channelName: Type.Optional(Type.String())
      }),
      response: {
        200: Type.Object({
          id: Type.String(),
          email: Type.String(),
          name: Type.String(),
          username: Type.String(),
          avatarUrl: Type.Optional(Type.String()),
          channelName: Type.Optional(Type.String()),
          subscriberCount: Type.Number(),
          isVerified: Type.Boolean(),
          createdAt: Type.String(),
          updatedAt: Type.String()
        })
      }
    }
  }, async (request, reply) => {
    const userId = (fastify as any).requireAuth(request)
    const { name, channelName } = request.body

    const user = await fastify.db.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(channelName && { channelName })
      }
    })

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      username: user.username,
      avatarUrl: user.avatarUrl,
      channelName: user.channelName,
      subscriberCount: user.subscriberCount,
      isVerified: user.isVerified,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString()
    }
  })

  // Get user by username/id
  fastify.get('/:identifier', {
    schema: {
      params: Type.Object({
        identifier: Type.String()
      }),
      response: {
        200: Type.Object({
          id: Type.String(),
          name: Type.String(),
          username: Type.String(),
          avatarUrl: Type.Optional(Type.String()),
          channelName: Type.Optional(Type.String()),
          subscriberCount: Type.Number(),
          isVerified: Type.Boolean(),
          createdAt: Type.String()
        })
      }
    }
  }, async (request, reply) => {
    const { identifier } = request.params

    const user = await fastify.db.user.findFirst({
      where: {
        OR: [
          { id: identifier },
          { username: identifier }
        ]
      },
      select: {
        id: true,
        name: true,
        username: true,
        avatarUrl: true,
        channelName: true,
        subscriberCount: true,
        isVerified: true,
        createdAt: true
      }
    })

    if (!user) {
      return reply.status(404).send({ error: 'User not found' })
    }

    return {
      id: user.id,
      name: user.name,
      username: user.username,
      avatarUrl: user.avatarUrl,
      channelName: user.channelName,
      subscriberCount: user.subscriberCount,
      isVerified: user.isVerified,
      createdAt: user.createdAt.toISOString()
    }
  })
}

export default userRoutes