'use client'

import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import type { VideoParams } from '@fabl/types'

export function useVideoList(params?: VideoParams) {
  return useQuery({
    queryKey: ['videos', 'list', params],
    queryFn: () => apiClient.getVideos(params),
  })
}

export function useInfiniteVideoList(params?: Omit<VideoParams, 'page'>) {
  return useInfiniteQuery({
    queryKey: ['videos', 'list', params],
    queryFn: ({ pageParam }) => apiClient.getVideos({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const hasMore = lastPage.meta?.hasMore ?? false
      const nextPage = (lastPage.meta?.page ?? 0) + 1
      return hasMore ? nextPage : undefined
    },
  })
}

export function useTrending() {
  return useQuery({
    queryKey: ['videos', 'trending'],
    queryFn: () => apiClient.getTrendingVideos(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useRecommended() {
  return useQuery({
    queryKey: ['videos', 'recommended'],
    queryFn: () => apiClient.getRecommendedVideos(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}