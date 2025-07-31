import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const createPublicRouteMatcher = (routes: string[]) => {
  return createRouteMatcher(routes)
}

export const createAuthMiddleware = (additionalPublicRoutes: string[] = []) => {
  const isPublicRoute = createPublicRouteMatcher([
    '/',
    '/explore(.*)',
    '/trending(.*)',
    '/search(.*)',
    '/video/(.*)',
    '/watch/(.*)',
    '/channel/(.*)',
    '/category/(.*)',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/api/webhooks(.*)',
    ...additionalPublicRoutes
  ])

  return clerkMiddleware((auth, req) => {
    if (!isPublicRoute(req)) {
      auth().protect()
    }
  })
}

export const studioAuthMiddleware = clerkMiddleware((auth, req) => {
  const isPublicRoute = createPublicRouteMatcher([
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/api/webhooks(.*)'
  ])

  if (!isPublicRoute(req)) {
    auth().protect()
  }
})