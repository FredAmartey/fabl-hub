import { FastifyPluginAsync } from 'fastify'
import { PrismaClient } from '@fabl/db'
import fp from 'fastify-plugin'

declare module 'fastify' {
  interface FastifyInstance {
    db: PrismaClient
  }
}

const dbPlugin: FastifyPluginAsync = fp(async (fastify) => {
  const db = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
    errorFormat: 'pretty'
  })

  // Test database connection
  try {
    await db.$connect()
    fastify.log.info('✅ Database connected successfully')
  } catch (error) {
    fastify.log.error('❌ Database connection failed:', error)
    throw error
  }

  // Add db to Fastify instance
  fastify.decorate('db', db)

  // Handle graceful shutdown
  fastify.addHook('onClose', async (instance) => {
    instance.log.info('Disconnecting from database...')
    await db.$disconnect()
  })
})

export { dbPlugin }