'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'

// Simple API client for upload operations
async function uploadApiCall(endpoint: string, options?: RequestInit) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  })

  if (!response.ok) {
    throw new Error(`Upload API Error: ${response.status}`)
  }

  return response.json()
}

export function useRequestUploadUrl() {
  return useMutation({
    mutationFn: async (data: { fileName: string; fileSize: number; mimeType: string }) => {
      return uploadApiCall('/api/upload/url', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },
  })
}

export function useCompleteUpload() {
  return useMutation({
    mutationFn: async (data: { 
      uploadId: string; 
      title: string; 
      description?: string; 
      visibility: string;
    }) => {
      return uploadApiCall('/api/upload/complete', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },
  })
}

export function useUploadStatus(uploadId: string, enabled = false) {
  return useQuery({
    queryKey: ['upload', 'status', uploadId],
    queryFn: () => uploadApiCall(`/api/upload/${uploadId}/status`),
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