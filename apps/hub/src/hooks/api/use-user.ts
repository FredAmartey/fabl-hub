import { useQuery } from '@tanstack/react-query'
import type { User } from '@fabl/types'

// Mock API client for now - will be replaced with real API integration
// const apiClient = new APIClient({
//   baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002',
//   getAuthToken: () => {
//     // TODO: Get auth token from auth provider
//     return null
//   }
// })

export function useUser() {
  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      // TODO: Replace with real API call once backend is ready
      // For now, return mock data for development
      const mockUser: User = {
        id: 'user_1',
        email: 'alex.neural@example.com',
        name: 'Alex Neural',
        username: 'alexneural',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
        channelName: 'Neural Networks',
        subscriberCount: 12450,
        isVerified: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      return mockUser
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}