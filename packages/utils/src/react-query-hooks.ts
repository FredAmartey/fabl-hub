'use client'

import { useQuery, useMutation, useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import type {
  User,
  Video,
  VideoParams,
  DashboardStats,
  DashboardActivity,
  Comment,
  AnalyticsPeriod,
  AnalyticsOverview,
  VideoPerformance,
  AudienceData,
  UploadRequest,
  UploadResponse,
  VideoMetadata,
  ApiResponse
} from '@fabl/types'
import { APIClient } from './api-client'

// Query key factories
export const queryKeys = {
  all: ['fabl'] as const,
  auth: () => [...queryKeys.all, 'auth'] as const,
  user: () => [...queryKeys.auth(), 'user'] as const,
  
  videos: () => [...queryKeys.all, 'videos'] as const,
  videoList: (params?: VideoParams) => [...queryKeys.videos(), 'list', params] as const,
  videoDetail: (id: string) => [...queryKeys.videos(), 'detail', id] as const,
  videoComments: (id: string) => [...queryKeys.videos(), 'comments', id] as const,
  trending: () => [...queryKeys.videos(), 'trending'] as const,
  recommended: () => [...queryKeys.videos(), 'recommended'] as const,
  
  dashboard: () => [...queryKeys.all, 'dashboard'] as const,
  dashboardStats: () => [...queryKeys.dashboard(), 'stats'] as const,
  dashboardActivity: () => [...queryKeys.dashboard(), 'activity'] as const,
  
  analytics: () => [...queryKeys.all, 'analytics'] as const,
  analyticsOverview: (period: AnalyticsPeriod['period']) => [...queryKeys.analytics(), 'overview', period] as const,
  videoPerformance: (videoId: string) => [...queryKeys.analytics(), 'video', videoId] as const,
  audienceData: () => [...queryKeys.analytics(), 'audience'] as const,
  
  studio: () => [...queryKeys.all, 'studio'] as const,
  studioVideos: (params?: VideoParams) => [...queryKeys.studio(), 'videos', params] as const,
  
  channels: () => [...queryKeys.all, 'channels'] as const,
  channelByUsername: (username: string) => [...queryKeys.channels(), 'username', username] as const,
  channelVideos: (channelId: string) => [...queryKeys.channels(), 'videos', channelId] as const,
}

// Hub Hooks
export function useCurrentUser(apiClient: APIClient) {
  return useQuery({
    queryKey: queryKeys.user(),
    queryFn: () => apiClient.getUser(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useVideos(apiClient: APIClient, params?: VideoParams) {
  return useQuery({
    queryKey: queryKeys.videoList(params),
    queryFn: () => apiClient.getVideos(params),
  })
}

export function useInfiniteVideos(apiClient: APIClient, params?: Omit<VideoParams, 'page'>) {
  return useInfiniteQuery({
    queryKey: queryKeys.videoList(params),
    queryFn: ({ pageParam }) => apiClient.getVideos({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const hasMore = lastPage.meta?.hasMore ?? false
      const nextPage = (lastPage.meta?.page ?? 0) + 1
      return hasMore ? nextPage : undefined
    },
  })
}

export function useVideo(apiClient: APIClient, id: string) {
  return useQuery({
    queryKey: queryKeys.videoDetail(id),
    queryFn: () => apiClient.getVideo(id),
    enabled: !!id,
  })
}

export function useTrendingVideos(apiClient: APIClient) {
  return useQuery({
    queryKey: queryKeys.trending(),
    queryFn: () => apiClient.getTrendingVideos(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useRecommendedVideos(apiClient: APIClient) {
  return useQuery({
    queryKey: queryKeys.recommended(),
    queryFn: () => apiClient.getRecommendedVideos(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useVideoComments(apiClient: APIClient, videoId: string) {
  return useQuery({
    queryKey: queryKeys.videoComments(videoId),
    queryFn: () => apiClient.getComments(videoId),
    enabled: !!videoId,
  })
}

export function useLikeVideo(apiClient: APIClient) {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (videoId: string) => apiClient.likeVideo(videoId),
    onSuccess: (_, videoId) => {
      // Invalidate video detail to refresh like count
      queryClient.invalidateQueries({ queryKey: queryKeys.videoDetail(videoId) })
    },
  })
}

export function useRecordView(apiClient: APIClient) {
  return useMutation({
    mutationFn: (videoId: string) => apiClient.recordVideoView(videoId),
  })
}

export function useCreateComment(apiClient: APIClient) {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: { videoId: string; content: string; parentId?: string }) => 
      apiClient.createComment(data),
    onSuccess: (_, variables) => {
      // Invalidate comments list for the video
      queryClient.invalidateQueries({ queryKey: queryKeys.videoComments(variables.videoId) })
    },
  })
}

// Studio Hooks
export function useDashboardStats(apiClient: APIClient) {
  return useQuery({
    queryKey: queryKeys.dashboardStats(),
    queryFn: () => apiClient.getDashboardStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useDashboardActivity(apiClient: APIClient) {
  return useQuery({
    queryKey: queryKeys.dashboardActivity(),
    queryFn: () => apiClient.getDashboardActivity(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export function useStudioVideos(apiClient: APIClient, params?: VideoParams) {
  return useQuery({
    queryKey: queryKeys.studioVideos(params),
    queryFn: () => apiClient.getCreatorVideos(params),
  })
}

export function useUpdateVideo(apiClient: APIClient) {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<VideoMetadata> }) => 
      apiClient.updateVideo(id, data),
    onSuccess: (_, variables) => {
      // Invalidate video detail and studio videos list
      queryClient.invalidateQueries({ queryKey: queryKeys.videoDetail(variables.id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.studioVideos() })
    },
  })
}

export function useDeleteVideo(apiClient: APIClient) {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => apiClient.deleteVideo(id),
    onSuccess: () => {
      // Invalidate studio videos list
      queryClient.invalidateQueries({ queryKey: queryKeys.studioVideos() })
    },
  })
}

export function usePublishVideo(apiClient: APIClient) {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => apiClient.publishVideo(id),
    onSuccess: (_, id) => {
      // Invalidate video detail and studio videos list
      queryClient.invalidateQueries({ queryKey: queryKeys.videoDetail(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.studioVideos() })
    },
  })
}

export function useAnalyticsOverview(apiClient: APIClient, period: AnalyticsPeriod['period']) {
  return useQuery({
    queryKey: queryKeys.analyticsOverview(period),
    queryFn: () => apiClient.getAnalytics(period),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useVideoPerformance(apiClient: APIClient, videoId: string) {
  return useQuery({
    queryKey: queryKeys.videoPerformance(videoId),
    queryFn: () => apiClient.getVideoPerformance(videoId),
    enabled: !!videoId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useAudienceData(apiClient: APIClient) {
  return useQuery({
    queryKey: queryKeys.audienceData(),
    queryFn: () => apiClient.getAudienceData(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  })
}

export function useRequestUploadUrl(apiClient: APIClient) {
  return useMutation({
    mutationFn: (data: UploadRequest) => apiClient.requestUploadUrl(data),
  })
}

export function useCompleteUpload(apiClient: APIClient) {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ uploadId, metadata }: { uploadId: string; metadata: VideoMetadata }) => 
      apiClient.completeUpload(uploadId, metadata),
    onSuccess: () => {
      // Invalidate studio videos list
      queryClient.invalidateQueries({ queryKey: queryKeys.studioVideos() })
    },
  })
}

export function useUploadStatus(apiClient: APIClient, uploadId: string, enabled = true) {
  return useQuery({
    queryKey: ['upload', 'status', uploadId],
    queryFn: () => apiClient.getUploadStatus(uploadId),
    enabled: enabled && !!uploadId,
    refetchInterval: (query) => {
      // Poll every 2 seconds while uploading/processing
      const data = query.state.data
      if (data?.status === 'uploading' || data?.status === 'processing') {
        return 2000
      }
      return false
    },
  })
}