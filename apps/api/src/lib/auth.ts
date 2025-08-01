import { FastifyPluginAsync, FastifyRequest } from 'fastify'
import createError from '@fastify/error'
import { clerkPlugin, getAuth } from '@clerk/fastify'
import fp from 'fastify-plugin'

declare module 'fastify' {
  interface FastifyRequest {
    userAuth: {
      userId: string | null
      sessionId: string | null
      orgId: string | null
      orgRole: string | null
      orgSlug: string | null
    }
  }
  
  interface FastifyInstance {
    requireAuth: (request: FastifyRequest) => string
  }
}

const authPlugin: FastifyPluginAsync = fp(async (fastify) => {
  // Register Clerk plugin
  await fastify.register(clerkPlugin, {
    secretKey: process.env.CLERK_SECRET_KEY || '',
    publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || ''
  })

  // Add userAuth decorator to request
  fastify.decorateRequest('userAuth', null)

  // Pre-handler to extract auth from Clerk
  fastify.addHook('preHandler', async (request) => {
    const auth = getAuth(request)
    request.userAuth = {
      userId: auth.userId || null,
      sessionId: auth.sessionId || null,
      orgId: auth.orgId || null,
      orgRole: auth.orgRole || null,
      orgSlug: auth.orgSlug || null
    }
    
    // Add userId to request for logging
    if (auth.userId) {
      (request as any).userId = auth.userId
    }
  })

  // Helper to require authentication
  fastify.decorate('requireAuth', (request: FastifyRequest) => {
    if (!request.userAuth.userId) {
      const UnauthorizedError = createError('UNAUTHORIZED', 'Authentication required', 401)
      throw new UnauthorizedError()
    }
    return request.userAuth.userId
  })
})

export { authPlugin }