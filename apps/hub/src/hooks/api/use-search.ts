import { useQuery } from '@tanstack/react-query'
import { useDebounce } from '@/hooks/use-debounce'
import type { Video } from '@fabl/types'
import { VideoStatus } from '@fabl/types'

interface SearchResult {
  videos: Video[]
  suggestions: string[]
  totalResults: number
}

// Mock search implementation
async function searchVideos(query: string): Promise<SearchResult> {
  await new Promise(resolve => setTimeout(resolve, 300))

  if (!query.trim()) {
    return { videos: [], suggestions: [], totalResults: 0 }
  }

  // Generate mock search results
  const mockTitles = [
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

  const searchLower = query.toLowerCase()
  const matchingTitles = mockTitles.filter(title => 
    title.toLowerCase().includes(searchLower)
  )

  const videos: Video[] = matchingTitles.slice(0, 6).map((title, index) => ({
    id: `search_${index}_${Date.now()}`,
    creatorId: `creator_${index}`,
    title,
    description: `Search result for "${query}"`,
    thumbnailUrl: `https://picsum.photos/seed/search${index}/640/360`,
    videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    muxAssetId: `asset_search_${index}`,
    muxPlaybackId: `playback_search_${index}`,
    duration: Math.floor(Math.random() * 600) + 120,
    status: VideoStatus.PUBLISHED,
    views: Math.floor(Math.random() * 100000),
    monetizationEnabled: true,
    aiRatio: 0.5,
    isApproved: true,
    publishedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
  }))

  // Generate search suggestions
  const suggestions = [
    `${query} tutorial`,
    `${query} for beginners`,
    `${query} advanced techniques`,
    `best ${query}`,
    `how to ${query}`
  ].filter(s => s.length < 40)

  return {
    videos,
    suggestions: suggestions.slice(0, 5),
    totalResults: matchingTitles.length * 10 // Mock total
  }
}

export function useSearch(query: string) {
  const debouncedQuery = useDebounce(query, 300)

  return useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: () => searchVideos(debouncedQuery),
    enabled: debouncedQuery.length > 0,
    staleTime: 60 * 1000, // 1 minute
  })
}

// Popular searches for suggestions
export function usePopularSearches() {
  return useQuery({
    queryKey: ['popular-searches'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 200))
      return [
        "AI music generation",
        "Neural art creation",
        "Deepfake technology",
        "Machine learning basics",
        "AI video editing",
        "Synthetic voices",
        "Digital storytelling",
        "AI animation"
      ]
    },
    staleTime: 60 * 60 * 1000, // 1 hour
  })
}