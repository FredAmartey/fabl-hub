import { FastifyPluginAsync } from 'fastify'
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
}

const authPlugin: FastifyPluginAsync = fp(async (fastify) => {
  // Register Clerk plugin
  await fastify.register(clerkPlugin, {
    secretKey: fastify.config.CLERK_SECRET_KEY,
    publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  })

  // Add userAuth decorator to request
  fastify.decorateRequest('userAuth', null)

  // Pre-handler to extract auth from Clerk
  fastify.addHook('preHandler', async (request) => {
    const auth = getAuth(request)
    request.userAuth = {
      userId: auth.userId,
      sessionId: auth.sessionId,
      orgId: auth.orgId,
      orgRole: auth.orgRole,
      orgSlug: auth.orgSlug
    }
    
    // Add userId to request for logging
    if (auth.userId) {
      (request as any).userId = auth.userId
    }
  })

  // Helper to require authentication
  fastify.decorate('requireAuth', (request: any) => {
    if (!request.userAuth.userId) {
      throw fastify.httpErrors.unauthorized('Authentication required')
    }
    return request.userAuth.userId
  })
})

export { authPlugin }