import { FastifyPluginAsync } from 'fastify'
import { Type } from '@sinclair/typebox'

const authRoutes: FastifyPluginAsync = async (fastify) => {
  // Clerk webhook for user sync
  fastify.post('/webhook', {
    schema: {
      body: Type.Object({
        type: Type.String(),
        data: Type.Object({
          id: Type.String(),
          email_addresses: Type.Array(Type.Object({
            email_address: Type.String()
          })),
          first_name: Type.Optional(Type.String()),
          last_name: Type.Optional(Type.String()),
          username: Type.Optional(Type.String()),
          image_url: Type.Optional(Type.String())
        })
      })
    }
  }, async (request, reply) => {
    const { type, data } = request.body as any

    try {
      switch (type) {
        case 'user.created':
        case 'user.updated':
          const email = data.email_addresses[0]?.email_address
          if (!email) {
            return reply.status(400).send({ error: 'Email is required' })
          }

          const username = data.username || email.split('@')[0] || `user_${data.id.slice(-8)}`
          const name = [data.first_name, data.last_name].filter(Boolean).join(' ') || username

          await fastify.db.user.upsert({
            where: { id: data.id },
            update: {
              email,
              name,
              username,
              avatarUrl: data.image_url
            },
            create: {
              id: data.id,
              email,
              name,
              username,
              avatarUrl: data.image_url
            }
          })

          fastify.log.info({ userId: data.id, type }, 'User synced from Clerk')
          break

        case 'user.deleted':
          await fastify.db.user.delete({
            where: { id: data.id }
          })
          fastify.log.info({ userId: data.id }, 'User deleted')
          break

        default:
          fastify.log.info({ type }, 'Unhandled webhook event')
      }

      return reply.status(200).send({ success: true })
    } catch (error) {
      fastify.log.error({ error, type, userId: data.id }, 'Webhook processing failed')
      return reply.status(500).send({ error: 'Webhook processing failed' })
    }
  })
}

export default authRoutes