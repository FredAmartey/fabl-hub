export const CLERK_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!
export const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY!

export const getClerkConfig = () => {
  return {
    publishableKey: CLERK_PUBLISHABLE_KEY,
    secretKey: CLERK_SECRET_KEY,
    signInUrl: '/sign-in',
    signUpUrl: '/sign-up',
    afterSignInUrl: '/',
    afterSignUpUrl: '/',
  }
}

export const getStudioRedirectUrl = () => {
  return process.env.NEXT_PUBLIC_STUDIO_URL || 'http://localhost:3001'
}

export const getHubRedirectUrl = () => {
  return process.env.NEXT_PUBLIC_HUB_URL || 'http://localhost:3000'
}