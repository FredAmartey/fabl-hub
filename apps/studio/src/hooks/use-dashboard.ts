'use client'

import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'

// Simple API client for dashboard operations
async function dashboardApiCall(endpoint: string, options?: RequestInit) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  })

  if (!response.ok) {
    throw new Error(`Dashboard API Error: ${response.status}`)
  }

  return response.json()
}

export interface DashboardStats {
  subscribers: {
    current: number
    change: number
    period: string
  }
  views: {
    total: number
    change: number
    period: string
  }
  watchTime: {
    hours: number
    change: number
    period: string
  }
  revenue: {
    total: number
    change: number
    breakdown: {
      ads: number
      memberships: number
      other: number
    }
  }
}

export interface TopVideo {
  id: string
  title: string
  views: number
  engagement: string
  rank: number
}

export interface RecentSubscriber {
  id: string
  name: string
  subscriberCount: number
  avatar?: string
  subscribedAt: string
}

export interface RecentComment {
  id: string
  user: string
  content: string
  createdAt: string
  videoId: string
  avatar?: string
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => dashboardApiCall('/api/dashboard/stats'),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useTopVideos() {
  return useQuery({
    queryKey: ['dashboard', 'top-videos'],
    queryFn: () => dashboardApiCall('/api/dashboard/top-videos'),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useRecentSubscribers() {
  return useQuery({
    queryKey: ['dashboard', 'recent-subscribers'],
    queryFn: () => dashboardApiCall('/api/dashboard/recent-subscribers'),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export function useRecentComments() {
  return useQuery({
    queryKey: ['dashboard', 'recent-comments'],
    queryFn: () => dashboardApiCall('/api/dashboard/recent-comments'),
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}