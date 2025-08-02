'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import { useAuth } from '@clerk/nextjs'
import { apiClient } from '@/lib/api-client'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'

// Simple API client for upload operations
async function uploadApiCall(endpoint: string, options?: RequestInit, authToken?: string) {
  try {
    // Ensure baseURL has protocol and endpoint starts with /
    const baseURL = API_BASE_URL.startsWith('http') ? API_BASE_URL : `http://${API_BASE_URL}`
    const fullEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
    const fullUrl = `${baseURL}${fullEndpoint}`
    
    console.log(`🔄 API Call: ${fullUrl}`)
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options?.headers,
    }
    
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`
    }
    
    const response = await fetch(fullUrl, {
      headers,
      ...options,
    })

    console.log(`📡 Response: ${response.status} ${response.statusText}`)

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`❌ API Error: ${response.status} - ${errorText}`)
      throw new Error(`Upload API Error: ${response.status} - ${response.statusText}`)
    }

    const data = await response.json()
    console.log(`✅ Success:`, data)
    return data
  } catch (error) {
    console.error(`🚨 Network Error:`, error)
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(`Cannot connect to API server at ${API_BASE_URL}. Is the API server running?`)
    }
    if (error.name === 'TypeError' && error.message.includes('URL')) {
      throw new Error(`Invalid API URL configuration: ${API_BASE_URL}${endpoint}`)
    }
    throw error
  }
}

export function useRequestUploadUrl() {
  const { getToken } = useAuth()
  
  return useMutation({
    mutationFn: async (data: { fileName: string; fileSize: number; mimeType: string }) => {
      console.log('🔑 Getting auth token...')
      const token = await getToken()
      console.log('🔑 Auth token:', token ? 'Present' : 'Missing')
      
      console.log('📡 Calling upload URL API with data:', data)
      return uploadApiCall('/api/upload/url', {
        method: 'POST',
        body: JSON.stringify(data),
      }, token)
    },
  })
}

export function useCreateDraft() {
  const { getToken } = useAuth()
  
  return useMutation({
    mutationFn: async (data: { 
      uploadId: string; 
      fileName: string; 
      duration?: number;
      thumbnailUrl?: string;
    }) => {
      const token = await getToken()
      return uploadApiCall('/api/upload/create-draft', {
        method: 'POST',
        body: JSON.stringify(data),
      }, token)
    },
  })
}

export function useCompleteUpload() {
  const { getToken } = useAuth()
  
  return useMutation({
    mutationFn: async (data: { 
      videoId: string;
      title: string; 
      description?: string; 
      visibility: string;
    }) => {
      const token = await getToken()
      return uploadApiCall('/api/upload/complete', {
        method: 'POST',
        body: JSON.stringify(data),
      }, token)
    },
  })
}

export function useUploadStatus(uploadId: string, enabled = false) {
  const { getToken } = useAuth()
  
  return useQuery({
    queryKey: ['upload', 'status', uploadId],
    queryFn: async () => {
      const token = await getToken()
      return uploadApiCall(`/api/upload/${uploadId}/status`, {}, token)
    },
    enabled: enabled && !!uploadId,
    refetchInterval: (query) => {
      const data = query.state.data as any
      // Poll every 2 seconds while uploading/processing
      if (data?.status === 'uploading' || data?.status === 'processing') {
        return 2000
      }
      return false
    },
  })
}