import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import type { Video, VideoParams, ApiResponse } from '@fabl/types'
import { VideoStatus } from '@fabl/types'

// Mock video data generator
function generateMockVideo(index: number): Video {
  const titles = [
    "AI-Generated Music: The Future of Composition",
    "Neural Networks Create Stunning Digital Art",
    "Machine Learning Transforms Video Editing",
    "Synthetic Voices: The AI Revolution",
    "Deep Learning in Animation Production",
    "AI Cinema: Films Written by Algorithms",
    "Generative Art: When AI Becomes Creative",
    "The Rise of AI-Powered Storytelling",
    "Virtual Actors: AI in Entertainment",
    "Algorithmic Poetry and Literature"
  ]
  
  const creators = [
    { id: 'creator_1', name: 'Neural Dreams', username: 'neuraldreams' },
    { id: 'creator_2', name: 'AI Artistry', username: 'aiartistry' },
    { id: 'creator_3', name: 'Synthetic Studio', username: 'syntheticstudio' },
    { id: 'creator_4', name: 'Digital Minds', username: 'digitalminds' },
    { id: 'creator_5', name: 'Algorithm Arts', username: 'algorithmarts' }
  ]
  
  const creator = creators[index % creators.length]
  const baseViews = Math.floor(Math.random() * 1000000)
  const hoursAgo = Math.floor(Math.random() * 720) // Up to 30 days
  
  return {
    id: `video_${index}`,
    creatorId: creator.id,
    title: titles[index % titles.length],
    description: `An exploration of AI-generated content showcasing the latest in machine learning and creative algorithms.`,
    thumbnailUrl: `https://picsum.photos/seed/${index}/640/360`,
    videoUrl: `https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8`,
    muxAssetId: `asset_${index}`,
    muxPlaybackId: `playback_${index}`,
    duration: Math.floor(Math.random() * 600) + 120, // 2-12 minutes
    status: VideoStatus.PUBLISHED,
    views: baseViews,
    monetizationEnabled: Math.random() > 0.3,
    aiRatio: 0.3 + Math.random() * 0.7, // 30-100% AI
    isApproved: true,
    publishedAt: new Date(Date.now() - hoursAgo * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - (hoursAgo + 24) * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - hoursAgo * 60 * 60 * 1000),
    tags: ['ai', 'machine-learning', 'tutorial', 'technology'].slice(0, Math.floor(Math.random() * 3) + 2),
  }
}

export function useVideos(params?: VideoParams) {
  return useInfiniteQuery({
    queryKey: ['videos', params],
    queryFn: async ({ pageParam = 1 }) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const limit = params?.limit || 12
      const startIndex = (pageParam - 1) * limit
      const videos = Array.from({ length: limit }, (_, i) => 
        generateMockVideo(startIndex + i)
      )
      
      // Apply filters
      let filteredVideos = videos
      
      // Filter by search
      if (params?.search) {
        const searchLower = params.search.toLowerCase()
        filteredVideos = filteredVideos.filter(v => 
          v.title.toLowerCase().includes(searchLower)
        )
      }
      
      // Filter by creatorId
      if (params?.creatorId) {
        filteredVideos = filteredVideos.filter(v => 
          v.creatorId === params.creatorId
        )
      }
      
      // Filter by tags
      if (params?.tags && params.tags.length > 0) {
        filteredVideos = filteredVideos.filter(v => 
          v.tags?.some(tag => params.tags?.includes(tag))
        )
      }
      
      // Apply sorting
      if (params?.orderBy) {
        filteredVideos.sort((a, b) => {
          const order = params.order === 'asc' ? 1 : -1
          switch (params.orderBy) {
            case 'views':
              return (a.views - b.views) * order
            case 'likes':
              return 0 // No likes field in current model
            case 'createdAt':
              return (a.createdAt.getTime() - b.createdAt.getTime()) * order
            default:
              return 0
          }
        })
      }
      
      const response: ApiResponse<Video[]> = {
        success: true,
        data: filteredVideos,
        meta: {
          page: pageParam,
          limit,
          total: 100, // Mock total
          hasMore: pageParam < 9 // Mock 9 pages total
        }
      }
      
      return response
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
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // Generate trending videos with high view counts
      const trendingVideos = Array.from({ length: 10 }, (_, i) => {
        const video = generateMockVideo(i)
        video.views = video.views * 10 // Boost views for trending
        return video
      })
      
      // Sort by views descending
      trendingVideos.sort((a, b) => b.views - a.views)
      
      return trendingVideos
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useRecommendedVideos() {
  return useQuery({
    queryKey: ['videos', 'recommended'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 400))
      
      // Generate personalized recommendations
      const recommendedVideos = Array.from({ length: 20 }, (_, i) => 
        generateMockVideo(i + 100) // Different seed for variety
      )
      
      // Shuffle for randomness
      for (let i = recommendedVideos.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [recommendedVideos[i], recommendedVideos[j]] = [recommendedVideos[j], recommendedVideos[i]]
      }
      
      return recommendedVideos.slice(0, 12)
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useVideo(id: string) {
  return useQuery({
    queryKey: ['video', id],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 200))
      
      // Extract numeric part for consistent generation
      const numericId = parseInt(id.replace('video_', '')) || 0
      return generateMockVideo(numericId)
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
  })
}