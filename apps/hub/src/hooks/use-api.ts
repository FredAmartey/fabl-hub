'use client'

import { useQuery } from '@tanstack/react-query'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'

// Simple API client for client-side only
async function apiCall(endpoint: string, options?: RequestInit) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  })

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`)
  }

  return response.json()
}

export function useApiHealth() {
  return useQuery({
    queryKey: ['api', 'health'],
    queryFn: () => apiCall('/health'),
    staleTime: 30000, // 30 seconds
  })
}

export function useVideosApi(params?: any) {
  return useQuery({
    queryKey: ['videos', params],
    queryFn: () => apiCall('/api/videos', { 
      method: 'GET',
    }),
    enabled: false, // Disable until we fix the API endpoints
  })
}