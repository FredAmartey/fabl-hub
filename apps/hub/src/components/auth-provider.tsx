'use client'

import { useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import { apiClient } from '@/lib/api-client'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { getToken, isLoaded } = useAuth()

  useEffect(() => {
    if (!isLoaded) return

    // Function to update the auth token
    const updateToken = async () => {
      try {
        const token = await getToken()
        apiClient.setAuthToken(token)
      } catch (error) {
        console.error('Failed to get auth token:', error)
        apiClient.setAuthToken(null)
      }
    }

    // Update token immediately
    updateToken()

    // Update token when window regains focus
    const handleFocus = () => updateToken()
    window.addEventListener('focus', handleFocus)

    // Update token periodically (every 5 minutes)
    const interval = setInterval(updateToken, 5 * 60 * 1000)

    return () => {
      window.removeEventListener('focus', handleFocus)
      clearInterval(interval)
    }
  }, [getToken, isLoaded])

  return <>{children}</>
}