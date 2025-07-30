# Mock Data to Real Data Transition Plan

## Overview
This document outlines the systematic approach to transition from hardcoded mock data to real, dynamic data across both Hub and Studio applications.

## Current State Analysis

### Identified Mock Data Locations

#### Hub App (`/apps/hub`)
1. **Header Component** (`src/components/Header.tsx`)
   - Hardcoded user: "Alex Neural"
   - Mock profile image URL
   - Sample notifications array
   - Generic gradient avatar instead of user profile picture

2. **VideoCard/VideoGrid Components**
   - Placeholder video thumbnails
   - Mock view counts, likes, upload dates
   - Placeholder channel information

3. **Homepage**
   - Static video data
   - Hardcoded categories
   - Mock trending videos

#### Studio App (`/apps/studio`)
1. **Dashboard Page** (`src/app/page.tsx`)
   - Hardcoded stats: subscribers (1,247), views (12.4K), watch time (847h), revenue ($23.47)
   - Mock top videos list with static view counts
   - Static recent subscribers and comments
   - Hardcoded creator insider news items

2. **Analytics Page** (`src/app/analytics/page.tsx`)
   - Extensive mock data for charts, insights, and performance metrics
   - Static retention graphs and audience demographics
   - Hardcoded top videos with engagement metrics

3. **Content Page** (`src/app/content/page.tsx`)
   - `generateMockVideos()` function creating 40 fake videos
   - Random stats generation for views, likes, comments
   - No real video thumbnails or metadata

4. **Monetization Page** (`src/app/monetization/page.tsx`)
   - Mock transaction history
   - Static revenue streams configuration
   - Hardcoded payout and tax information

5. **Comments Page** (`src/app/comments/page.tsx`)
   - Static comment array with fake user avatars
   - No real comment threading or reply functionality

## Unified Data Models

### Core Models Needed

```typescript
// packages/types/src/index.ts

// User/Creator Model
export interface User {
  id: string
  email: string
  name: string
  username: string
  avatarUrl?: string
  channelName?: string
  subscriberCount: number
  isVerified: boolean
  createdAt: Date
  updatedAt: Date
}

// Video Model
export interface Video {
  id: string
  creatorId: string
  title: string
  description?: string
  thumbnailUrl?: string
  videoUrl: string
  muxAssetId?: string
  muxPlaybackId?: string
  duration: number
  status: 'draft' | 'processing' | 'published' | 'scheduled' | 'unlisted' | 'private'
  views: number
  likes: number
  dislikes: number
  monetizationEnabled: boolean
  publishedAt?: Date
  scheduledAt?: Date
  createdAt: Date
  updatedAt: Date
}

// Analytics Models
export interface AnalyticsSnapshot {
  id: string
  creatorId: string
  date: Date
  views: number
  watchTimeMinutes: number
  subscribersGained: number
  subscribersLost: number
  estimatedRevenue: number
  impressions: number
  clickThroughRate: number
}

// Comment Model
export interface Comment {
  id: string
  videoId: string
  userId: string
  parentId?: string // for replies
  content: string
  likes: number
  isHearted: boolean
  isPinned: boolean
  createdAt: Date
  user: {
    name: string
    avatarUrl?: string
    isSubscriber: boolean
    isVerified: boolean
  }
}

// Notification Model
export interface Notification {
  id: string
  userId: string
  type: 'like' | 'comment' | 'subscribe' | 'upload' | 'mention' | 'milestone'
  actorId: string
  entityId: string
  entityType: 'video' | 'comment' | 'channel'
  message: string
  read: boolean
  createdAt: Date
}

// Revenue/Transaction Model
export interface Transaction {
  id: string
  creatorId: string
  type: 'ad_revenue' | 'subscription' | 'tip' | 'merchandise' | 'premium_content'
  amount: number
  currency: string
  status: 'pending' | 'paid' | 'failed'
  sourceId?: string // video ID or subscription ID
  sourceName: string
  createdAt: Date
  paidAt?: Date
}
```

## Unified API Endpoints

### Hub APIs
```typescript
// User & Auth
GET /api/users/me
GET /api/users/:id
PUT /api/users/:id

// Videos - Public
GET /api/videos
GET /api/videos/:id
GET /api/videos/trending
GET /api/videos/recommended

// Interactions
POST /api/videos/:id/like
POST /api/videos/:id/view
POST /api/comments
DELETE /api/comments/:id

// Notifications
GET /api/notifications
PUT /api/notifications/:id/read
DELETE /api/notifications/:id
```

### Studio APIs
```typescript
// Creator Dashboard
GET /api/studio/dashboard/stats
GET /api/studio/dashboard/recent-activity
GET /api/studio/dashboard/top-content

// Video Management
GET /api/studio/videos?page=1&limit=10&status=all&search=
GET /api/studio/videos/:id
POST /api/studio/videos
PUT /api/studio/videos/:id
DELETE /api/studio/videos/:id
POST /api/studio/videos/:id/publish
POST /api/studio/videos/bulk-action

// Analytics
GET /api/studio/analytics/overview?period=28d
GET /api/studio/analytics/videos/:id/performance
GET /api/studio/analytics/audience
GET /api/studio/analytics/retention/:videoId
GET /api/studio/analytics/realtime

// Comments Management
GET /api/studio/comments?filter=all&page=1
GET /api/studio/comments/video/:videoId
POST /api/studio/comments/:id/reply
POST /api/studio/comments/:id/heart
DELETE /api/studio/comments/:id
POST /api/studio/comments/moderation-settings

// Monetization
GET /api/studio/monetization/transactions?period=month
GET /api/studio/monetization/revenue-streams
GET /api/studio/monetization/payouts
PUT /api/studio/monetization/settings
GET /api/studio/monetization/tax-info

// Upload & Processing
POST /api/studio/upload/request-url
POST /api/studio/upload/complete
GET /api/studio/upload/:id/status
POST /api/studio/videos/:id/generate-thumbnail
```

## Implementation Phases

### Phase 1: Data Infrastructure Setup

1. **Create Database Schema**
   - Set up Prisma models in `/packages/db`
   - Configure relationships between tables
   - Add indexes for performance
   - Set up migrations

2. **Create Shared Types Package**
   - Define TypeScript interfaces in `/packages/types`
   - Export for use across all apps
   - Include validation schemas (Zod)

3. **Implement Core API Endpoints**
   - Set up Fastify routes in `/apps/api`
   - Add authentication middleware
   - Implement basic CRUD operations
   - Add request validation

### Phase 2: Data Fetching Layer

1. **Create API Client**
```typescript
// packages/utils/src/api-client.ts
export class APIClient {
  private baseURL: string
  
  // Hub methods
  async getUser(): Promise<User>
  async getVideos(params?: VideoParams): Promise<Video[]>
  async getNotifications(): Promise<Notification[]>
  
  // Studio methods
  async getDashboardStats(): Promise<DashboardStats>
  async getCreatorVideos(params?: VideoParams): Promise<Video[]>
  async getAnalytics(period: string): Promise<Analytics>
  async getComments(filter: CommentFilter): Promise<Comment[]>
  async getTransactions(period: string): Promise<Transaction[]>
}
```

2. **Add React Query Hooks**
```typescript
// Shared hooks for both apps
export function useUser() {
  return useQuery({
    queryKey: ['user'],
    queryFn: () => apiClient.getUser(),
  })
}

// Studio-specific hooks
export function useDashboardStats() {
  return useQuery({
    queryKey: ['studio', 'dashboard', 'stats'],
    queryFn: () => apiClient.getDashboardStats(),
    refetchInterval: 60000, // Refresh every minute
  })
}

export function useCreatorAnalytics(period: string) {
  return useQuery({
    queryKey: ['studio', 'analytics', period],
    queryFn: () => apiClient.getAnalytics(period),
  })
}
```

### Phase 3: Hub App Migration

1. **Header Component**
   - Replace hardcoded "Alex Neural" with real user data
   - Implement real-time notifications
   - Add user avatar upload functionality

2. **Video Components**
   - Replace mock video data with API calls
   - Implement infinite scroll for video lists
   - Add real view counting
   - Integrate with Mux for video playback

3. **Homepage**
   - Dynamic trending videos
   - Personalized recommendations
   - Real category filtering

### Phase 4: Studio App Migration

1. **Dashboard Page**
   - Real-time stats from analytics service
   - Live subscriber count
   - Actual revenue data from payment provider
   - Dynamic top videos based on performance

2. **Analytics Page**
   - Integrate with analytics service (Mixpanel/Amplitude)
   - Real chart data with date filtering
   - Export functionality for reports
   - Video-specific performance metrics

3. **Content Management**
   - Replace `generateMockVideos()` with paginated API
   - Real video status tracking
   - Bulk operations support
   - Integration with Mux for thumbnails

4. **Comments System**
   - Real-time comment loading
   - Reply threading implementation
   - Moderation queue functionality
   - Sentiment analysis integration

5. **Monetization**
   - Stripe integration for payments
   - Real transaction history
   - Automated payout scheduling
   - Tax form generation

### Phase 5: Real-time Features

1. **WebSocket Integration**
```typescript
// Real-time notifications
const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL)
ws.on('notification', (data) => {
  queryClient.invalidateQueries(['notifications'])
})

// Live view counts
ws.on('video-view', (data) => {
  queryClient.setQueryData(['video', data.videoId], (old) => ({
    ...old,
    views: old.views + 1
  }))
})
```

2. **Optimistic Updates**
```typescript
const likeMutation = useMutation({
  mutationFn: (videoId) => apiClient.likeVideo(videoId),
  onMutate: async (videoId) => {
    await queryClient.cancelQueries(['video', videoId])
    const previous = queryClient.getQueryData(['video', videoId])
    queryClient.setQueryData(['video', videoId], (old) => ({
      ...old,
      likes: old.likes + 1,
      isLiked: true,
    }))
    return { previous }
  },
  onError: (err, videoId, context) => {
    queryClient.setQueryData(['video', videoId], context.previous)
  },
})
```

### Phase 6: Performance & Polish

1. **Caching Strategy**
   - Redis for frequently accessed data
   - CDN for static assets
   - Browser cache headers
   - React Query cache configuration

2. **Error Handling**
   - Graceful fallbacks
   - Retry logic
   - Error boundaries
   - User-friendly error messages

3. **Loading States**
   - Skeleton screens
   - Progressive loading
   - Lazy loading for images
   - Suspense boundaries

## Migration Checklist

### Hub App Components
- [ ] Header - User profile integration
- [ ] Header - Real notifications system
- [ ] VideoCard - Dynamic video data
- [ ] VideoGrid - Paginated API listing
- [ ] HomePage - Trending algorithm
- [ ] VideoPage - Mux player integration
- [ ] ProfilePage - User's content
- [ ] Search - Elasticsearch integration

### Studio App Components
- [ ] Dashboard - Live statistics
- [ ] Content list - Creator's videos
- [ ] Upload flow - Mux integration
- [ ] Analytics - Real metrics
- [ ] Comments - Moderation system
- [ ] Monetization - Payment processing
- [ ] Settings - User preferences

### Infrastructure Requirements
- [ ] Database schema deployed
- [ ] API endpoints live
- [ ] Authentication system
- [ ] File upload to Mux
- [ ] Analytics tracking
- [ ] Payment processing
- [ ] WebSocket server
- [ ] Redis cache
- [ ] CDN configured

## Rollout Strategy

### Safe Deployment

1. **Feature Flags**
```typescript
const useRealData = process.env.NEXT_PUBLIC_USE_REAL_DATA === 'true'
const data = useRealData ? await fetchFromAPI() : mockData
```

2. **Gradual Migration**
   - Start with read-only features
   - Move to create operations
   - Finally migrate destructive operations

3. **Fallback Mechanism**
```typescript
try {
  const data = await api.getVideos()
  return data
} catch (error) {
  console.error('API failed, using mock data:', error)
  return mockVideos // Fallback to mock
}
```

## Success Metrics
- Page load time < 2s
- API response time < 200ms
- Zero increase in error rate
- User engagement maintained
- No data loss during migration

This comprehensive plan covers both Hub and Studio apps, providing a unified approach to transitioning from mock to real data while maintaining system stability and user experience.