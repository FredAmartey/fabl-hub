import { APIClient } from '@fabl/utils'

// Client-side API client
export const apiClient = new APIClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002',
  getAuthToken: () => {
    if (typeof window !== 'undefined') {
      // Client-side: get token from Clerk
      // This will be handled by Clerk's session management
      const clerk = (window as any).Clerk
      if (clerk && clerk.session) {
        return clerk.session.getToken() || null
      }
    }
    return null
  }
})