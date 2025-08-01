import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'

// Dashboard Stats Hook
export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: async () => {
      const response = await fetch('/api/dashboard/stats', {
        credentials: 'include',
      })
      if (!response.ok) throw new Error('Failed to fetch dashboard stats')
      return response.json()
    },
    refetchInterval: 60000, // Refresh every minute
    staleTime: 30000, // Consider data stale after 30 seconds
  })
}

// Top Videos Hook
export function useTopVideos() {
  return useQuery({
    queryKey: ['dashboard', 'top-videos'],
    queryFn: async () => {
      const response = await fetch('/api/dashboard/top-videos', {
        credentials: 'include',
      })
      if (!response.ok) throw new Error('Failed to fetch top videos')
      return response.json()
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Recent Subscribers Hook
export function useRecentSubscribers() {
  return useQuery({
    queryKey: ['dashboard', 'recent-subscribers'],
    queryFn: async () => {
      const response = await fetch('/api/dashboard/recent-subscribers', {
        credentials: 'include',
      })
      if (!response.ok) throw new Error('Failed to fetch recent subscribers')
      return response.json()
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

// Recent Comments Hook
export function useRecentComments() {
  return useQuery({
    queryKey: ['dashboard', 'recent-comments'],
    queryFn: async () => {
      const response = await fetch('/api/dashboard/recent-comments', {
        credentials: 'include',
      })
      if (!response.ok) throw new Error('Failed to fetch recent comments')
      return response.json()
    },
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

// Studio Videos Hook
export function useStudioVideos(params: {
  page?: number
  limit?: number
  status?: string
  search?: string
  orderBy?: string
  order?: string
} = {}) {
  const searchParams = new URLSearchParams()
  if (params.page) searchParams.set('page', params.page.toString())
  if (params.limit) searchParams.set('limit', params.limit.toString())
  if (params.status) searchParams.set('status', params.status)
  if (params.search) searchParams.set('search', params.search)
  if (params.orderBy) searchParams.set('orderBy', params.orderBy)
  if (params.order) searchParams.set('order', params.order)

  return useQuery({
    queryKey: ['studio', 'videos', params],
    queryFn: async () => {
      const response = await fetch(`/api/studio/videos?${searchParams}`, {
        credentials: 'include',
      })
      if (!response.ok) throw new Error('Failed to fetch studio videos')
      return response.json()
    },
    staleTime: 30 * 1000, // 30 seconds
  })
}

// Single Studio Video Hook
export function useStudioVideo(id: string) {
  return useQuery({
    queryKey: ['studio', 'video', id],
    queryFn: async () => {
      const response = await fetch(`/api/studio/videos/${id}`, {
        credentials: 'include',
      })
      if (!response.ok) throw new Error('Failed to fetch video')
      return response.json()
    },
    enabled: !!id,
  })
}

// Update Video Hook
export function useUpdateVideo() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const response = await fetch(`/api/studio/videos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(updates),
      })
      if (!response.ok) throw new Error('Failed to update video')
      return response.json()
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch video queries
      queryClient.invalidateQueries({ queryKey: ['studio', 'videos'] })
      queryClient.invalidateQueries({ queryKey: ['studio', 'video', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

// Delete Video Hook
export function useDeleteVideo() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/studio/videos/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!response.ok) throw new Error('Failed to delete video')
      return response.json()
    },
    onSuccess: () => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: ['studio', 'videos'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

// Bulk Video Operations Hook
export function useBulkVideoOperation() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ action, videoIds }: { action: string; videoIds: string[] }) => {
      const response = await fetch('/api/studio/videos/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ action, videoIds }),
      })
      if (!response.ok) throw new Error('Failed to perform bulk operation')
      return response.json()
    },
    onSuccess: () => {
      // Invalidate and refetch all video-related queries
      queryClient.invalidateQueries({ queryKey: ['studio', 'videos'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

// Analytics Hook (placeholder for future implementation)
export function useAnalytics(period: string = '28d') {
  return useQuery({
    queryKey: ['analytics', period],
    queryFn: async () => {
      // For now, return empty data - this will be implemented later
      return {
        overview: {
          views: { value: '0', change: '+0%', trend: 'up' },
          watchTime: { value: '0 hours', change: '+0%', trend: 'up' },
          subscribers: { value: '0', change: '+0%', trend: 'up' },
          engagement: { value: '0%', change: '+0%', trend: 'up' },
        },
        chartData: [],
        topVideos: [],
        insights: []
      }
    },
    enabled: false, // Disable for now
  })
}

// Upload Video Hook
export function useUploadVideo() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ file, metadata }: { file: File; metadata: any }) => {
      // Step 1: Request upload URL
      const uploadResponse = await fetch('/api/upload/url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          fileName: file.name,
          fileSize: file.size,
          mimeType: file.type,
        }),
      })
      
      if (!uploadResponse.ok) throw new Error('Failed to get upload URL')
      const { uploadUrl, uploadId } = await uploadResponse.json()
      
      // Step 2: Upload file to Mux
      const formData = new FormData()
      formData.append('file', file)
      
      const uploadResult = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
      })
      
      if (!uploadResult.ok) throw new Error('Failed to upload file')
      
      // Step 3: Complete upload with metadata
      const completeResponse = await fetch('/api/upload/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          uploadId,
          ...metadata,
        }),
      })
      
      if (!completeResponse.ok) throw new Error('Failed to complete upload')
      return completeResponse.json()
    },
    onSuccess: () => {
      // Refresh video lists after successful upload
      queryClient.invalidateQueries({ queryKey: ['studio', 'videos'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}