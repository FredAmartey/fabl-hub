import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import type { Video, VideoParams, ApiResponse } from '@fabl/types'
import { apiClient } from '@/lib/api-client'

export function useVideos(params?: VideoParams) {
  return useInfiniteQuery({
    queryKey: ['videos', params],
    queryFn: async ({ pageParam = 1 }) => {
      const queryParams = {
        page: pageParam.toString(),
        limit: (params?.limit || 12).toString(),
        ...(params?.search && { search: params.search }),
        ...(params?.creatorId && { creatorId: params.creatorId }),
        ...(params?.tags && { tags: params.tags.join(',') }),
        ...(params?.orderBy && { orderBy: params.orderBy }),
        ...(params?.order && { order: params.order }),
        ...(params?.status && { status: params.status }),
      }

      try {
        const response = await apiClient.get<Video[]>('/videos', queryParams)
        return response
      } catch (error) {
        console.error('Failed to fetch videos:', error)
        throw error
      }
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage.meta?.hasMore) return undefined
      return (lastPage.meta.page || 1) + 1
    },
    initialPageParam: 1,
  })
}

export function useTrendingVideos() {
  return useQuery({
    queryKey: ['videos', 'trending'],
    queryFn: async () => {
      try {
        const response = await apiClient.get<Video[]>('/videos/trending')
        return response.data
      } catch (error) {
        console.error('Failed to fetch trending videos:', error)
        throw error
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useRecommendedVideos() {
  return useQuery({
    queryKey: ['videos', 'recommended'],
    queryFn: async () => {
      try {
        const response = await apiClient.get<Video[]>('/videos/recommended')
        return response.data
      } catch (error) {
        console.error('Failed to fetch recommended videos:', error)
        throw error
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useVideo(id: string) {
  return useQuery({
    queryKey: ['video', id],
    queryFn: async () => {
      try {
        const response = await apiClient.get<Video>(`/videos/${id}`)
        return response.data
      } catch (error) {
        console.error('Failed to fetch video:', error)
        throw error
      }
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
  })
}

// Hook for creator's videos
export function useCreatorVideos(creatorId: string) {
  return useVideos({ creatorId })
}

// Hook for video search
export function useVideoSearch(query: string) {
  return useVideos({ 
    search: query, 
    limit: 20,
    orderBy: 'views',
    order: 'desc'
  })
}

// Hook for videos by tag
export function useVideosByTag(tags: string[]) {
  return useVideos({ 
    tags,
    limit: 20,
    orderBy: 'publishedAt',
    order: 'desc'
  })
}