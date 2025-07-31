import { useQuery } from '@tanstack/react-query'
import { useDebounce } from '@/hooks/use-debounce'
import type { Video } from '@fabl/types'

interface SearchResult {
  videos: Video[]
  suggestions: string[]
  totalResults: number
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'

// Real search implementation
async function searchVideos(query: string): Promise<SearchResult> {
  if (!query.trim()) {
    return { videos: [], suggestions: [], totalResults: 0 }
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/search?q=${encodeURIComponent(query)}&limit=10`
    )
    
    if (!response.ok) {
      throw new Error(`Search failed: ${response.status}`)
    }
    
    const result = await response.json()
    
    if (result.success) {
      return {
        videos: result.data.videos,
        suggestions: result.data.suggestions,
        totalResults: result.data.totalResults
      }
    } else {
      throw new Error(result.message || 'Search failed')
    }
  } catch (error) {
    console.error('Search API error:', error)
    // Fallback to empty results on error
    return { videos: [], suggestions: [], totalResults: 0 }
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
      try {
        const response = await fetch(`${API_BASE_URL}/api/search/popular`)
        
        if (!response.ok) {
          throw new Error(`Failed to fetch popular searches: ${response.status}`)
        }
        
        const result = await response.json()
        
        if (result.success) {
          return result.data
        } else {
          throw new Error(result.message || 'Failed to fetch popular searches')
        }
      } catch (error) {
        console.error('Popular searches API error:', error)
        // Fallback to default searches
        return [
          "AI music generation",
          "Neural art creation", 
          "Machine learning tutorial",
          "AI video editing",
          "Synthetic voices",
          "Digital storytelling",
          "AI animation"
        ]
      }
    },
    staleTime: 60 * 60 * 1000, // 1 hour
  })
}

// Search suggestions/autocomplete
export function useSearchSuggestions(query: string) {
  const debouncedQuery = useDebounce(query, 200) // Faster for autocomplete

  return useQuery({
    queryKey: ['search-suggestions', debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery.trim()) return []
      
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/search/suggestions?q=${encodeURIComponent(debouncedQuery)}`
        )
        
        if (!response.ok) {
          throw new Error(`Search suggestions failed: ${response.status}`)
        }
        
        const result = await response.json()
        
        if (result.success) {
          return result.data
        } else {
          throw new Error(result.message || 'Search suggestions failed')
        }
      } catch (error) {
        console.error('Search suggestions API error:', error)
        return []
      }
    },
    enabled: debouncedQuery.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}