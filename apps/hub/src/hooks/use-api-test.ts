'use client'

import { useQuery } from '@tanstack/react-query'

export function useApiHealthCheck() {
  return useQuery({
    queryKey: ['api', 'health'],
    queryFn: async () => {
      const response = await fetch('http://localhost:3002/health')
      if (!response.ok) {
        throw new Error('API not available')
      }
      return response.json()
    },
    staleTime: 30000, // 30 seconds
  })
}