import { useAuth as useClerkAuth, useUser as useClerkUser } from '@clerk/nextjs'

export const useAuth = () => {
  const auth = useClerkAuth()
  
  return {
    ...auth,
    isAuthenticated: !!auth.userId,
  }
}

export const useUser = () => {
  const { user, isLoaded, isSignedIn } = useClerkUser()
  
  return {
    user,
    isLoaded,
    isSignedIn,
    isAuthenticated: isSignedIn,
  }
}