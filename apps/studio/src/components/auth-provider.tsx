'use client'

import { useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import { setAuthToken } from '@/lib/api-client'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn, getToken } = useAuth()

  useEffect(() => {
    if (!isLoaded) return

    const updateToken = async () => {
      try {
        console.log('Auth state:', { isSignedIn, isLoaded })
        if (isSignedIn) {
          const token = await getToken()
          console.log('Got auth token:', token ? `Token received (length: ${token.length})` : 'No token')
          
          setAuthToken(token)
        } else {
          console.log('User not signed in')
          setAuthToken(null)
        }
      } catch (error) {
        console.error('Failed to get auth token:', error)
        setAuthToken(null)
      }
    }

    updateToken()
    
    // Update token every 30 seconds to ensure it's fresh
    const interval = setInterval(updateToken, 30 * 1000)
    
    return () => clearInterval(interval)
  }, [isLoaded, isSignedIn, getToken])

  return <>{children}</>
}