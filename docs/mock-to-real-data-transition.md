# Mock Data to Real Data Transition Plan

## Overview
This document outlines the systematic approach to transition from hardcoded mock data to real, dynamic data across both Hub and Studio applications.

## Current State Analysis

### Identified Mock Data Locations

#### Hub App (`/apps/hub`)
1. **Header Component** (`src/components/Header.tsx`)
   - Hardcoded user: "Alex Neural" (line 339)
   - Mock profile image URL (line 333)
   - Sample notifications array (lines 69-122)
   - Generic gradient avatar instead of user profile picture

2. **VideoCard/VideoGrid Components**
   - Likely placeholder video thumbnails
   - Mock view counts, likes, upload dates
   - Placeholder channel information

3. **Homepage**
   - Static video data
   - Hardcoded categories
   - Mock trending videos

#### Studio App (`/apps/studio`)
1. **Dashboard Analytics**
   - Mock chart data (DonutChart, BarChart, LineChart)
   - Placeholder metrics
   - Static performance numbers

2. **Content Management**
   - Placeholder video listings
   - Mock upload status
   - Static analytics data

## Transition Strategy

### Phase 1: Data Infrastructure Setup
**Timeline: Week 1-2**

#### 1.1 Create Data Models
```typescript
// packages/types/src/index.ts
export interface User {
  id: string;
  email: string;
  name: string;
  username: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Video {
  id: string;
  title: string;
  description?: string;
  thumbnailUrl: string;
  muxAssetId: string;
  muxPlaybackId: string;
  channelId: string;
  viewCount: number;
  likeCount: number;
  status: 'processing' | 'ready' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'like' | 'comment' | 'subscribe' | 'upload';
  actorId: string;
  entityId: string;
  entityType: 'video' | 'comment' | 'channel';
  message: string;
  read: boolean;
  createdAt: Date;
}
```

#### 1.2 Set Up API Endpoints
```typescript
// apps/api/src/routes/users.ts
GET /api/users/me
GET /api/users/:id
PUT /api/users/:id

// apps/api/src/routes/videos.ts
GET /api/videos
GET /api/videos/:id
POST /api/videos
PUT /api/videos/:id

// apps/api/src/routes/notifications.ts
GET /api/notifications
PUT /api/notifications/:id/read
```

### Phase 2: Data Fetching Layer
**Timeline: Week 2-3**

#### 2.1 Create API Client
```typescript
// packages/utils/src/api-client.ts
export class APIClient {
  private baseURL: string;
  
  async getUser(): Promise<User> {
    return this.get('/users/me');
  }
  
  async getVideos(params?: VideoParams): Promise<Video[]> {
    return this.get('/videos', params);
  }
  
  async getNotifications(): Promise<Notification[]> {
    return this.get('/notifications');
  }
}
```

#### 2.2 Add React Query/SWR
```typescript
// apps/hub/src/hooks/useUser.ts
export function useUser() {
  return useQuery({
    queryKey: ['user'],
    queryFn: () => apiClient.getUser(),
  });
}

// apps/hub/src/hooks/useNotifications.ts
export function useNotifications() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: () => apiClient.getNotifications(),
    refetchInterval: 30000, // Poll every 30s
  });
}
```

### Phase 3: Component Migration
**Timeline: Week 3-4**

#### 3.1 Header Component Migration

**Step 1: Create Loading State**
```tsx
// Show skeleton while loading
{isLoading ? (
  <div className="w-9 h-9 rounded-full bg-gray-300 animate-pulse" />
) : (
  <img 
    src={user?.avatarUrl || '/default-avatar.png'} 
    className="w-9 h-9 rounded-full"
  />
)}
```

**Step 2: Replace Mock Data**
```tsx
// Before
const recentNotifications = [
  { id: 1, user: { name: "Maya Rivera" }, ... }
];

// After
const { data: notifications, isLoading } = useNotifications();
```

**Step 3: Add Error Handling**
```tsx
if (error) {
  return <NotificationError retry={refetch} />;
}
```

#### 3.2 Video Components Migration

**Step 1: Create Video Hooks**
```typescript
// apps/hub/src/hooks/useVideos.ts
export function useVideos(filters?: VideoFilters) {
  return useQuery({
    queryKey: ['videos', filters],
    queryFn: () => apiClient.getVideos(filters),
  });
}
```

**Step 2: Update VideoGrid**
```tsx
// Before
const mockVideos = [...];

// After
export function VideoGrid({ category }: Props) {
  const { data: videos, isLoading, error } = useVideos({ category });
  
  if (isLoading) return <VideoGridSkeleton />;
  if (error) return <VideoGridError />;
  if (!videos?.length) return <EmptyState />;
  
  return (
    <div className="grid">
      {videos.map(video => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
}
```

### Phase 4: Authentication Integration
**Timeline: Week 4-5**

#### 4.1 User Context Setup
```tsx
// apps/hub/src/contexts/AuthContext.tsx
export function AuthProvider({ children }) {
  const { data: user, isLoading } = useUser();
  
  return (
    <AuthContext.Provider value={{ user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
```

#### 4.2 Protected Data Access
```tsx
// Ensure authenticated before fetching user-specific data
export function useMyVideos() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['videos', 'my', user?.id],
    queryFn: () => apiClient.getMyVideos(),
    enabled: !!user, // Only fetch when user exists
  });
}
```

### Phase 5: Studio App Migration
**Timeline: Week 5-6**

#### 5.1 Analytics Data
```typescript
// apps/studio/src/hooks/useAnalytics.ts
export function useAnalytics(timeRange: TimeRange) {
  return useQuery({
    queryKey: ['analytics', timeRange],
    queryFn: () => apiClient.getAnalytics(timeRange),
  });
}
```

#### 5.2 Content Management
```tsx
// Replace mock video list with real data
export function ContentDashboard() {
  const { data: videos, isLoading } = useMyVideos();
  const { data: analytics } = useAnalytics('7d');
  
  return (
    <Dashboard
      videos={videos}
      analytics={analytics}
      isLoading={isLoading}
    />
  );
}
```

### Phase 6: Data Synchronization
**Timeline: Week 6-7**

#### 6.1 Real-time Updates
```typescript
// Subscribe to real-time notifications
useEffect(() => {
  const subscription = notificationService.subscribe(user.id, (notification) => {
    queryClient.invalidateQueries(['notifications']);
  });
  
  return () => subscription.unsubscribe();
}, [user.id]);
```

#### 6.2 Optimistic Updates
```typescript
// Optimistically update UI before server confirms
const likeMutation = useMutation({
  mutationFn: (videoId) => apiClient.likeVideo(videoId),
  onMutate: async (videoId) => {
    // Update cache optimistically
    queryClient.setQueryData(['video', videoId], old => ({
      ...old,
      likeCount: old.likeCount + 1,
      isLiked: true,
    }));
  },
});
```

## Migration Checklist

### Hub App Components
- [ ] Header - User profile data
- [ ] Header - Notifications
- [ ] VideoCard - Dynamic video data
- [ ] VideoGrid - API-based listing
- [ ] HomePage - Real trending/recommended
- [ ] VideoPage - Real video player
- [ ] ProfilePage - User's actual content
- [ ] Search - Real search results

### Studio App Components
- [ ] Dashboard - Real analytics
- [ ] Content list - User's videos
- [ ] Upload status - Real processing state
- [ ] Analytics charts - Real metrics
- [ ] Channel settings - User's channel data

### Data Requirements
- [ ] User authentication working
- [ ] Database seeded with test data
- [ ] API endpoints implemented
- [ ] File upload to Mux working
- [ ] Analytics tracking active

## Testing Strategy

### 1. Feature Flags
```typescript
// Use feature flags to gradually roll out
if (featureFlags.useRealUserData) {
  return <RealUserProfile />;
} else {
  return <MockUserProfile />;
}
```

### 2. Staging Environment
- Deploy with real API but test data
- Validate all flows before production
- Performance test with realistic data volumes

### 3. Rollback Plan
- Keep mock data components available
- Feature flag to instantly revert
- Database backups before migration

## Success Metrics
- All components load within 2s
- No increase in error rates
- User engagement maintained or improved
- Zero data loss during migration

## Timeline Summary
- **Week 1-2**: Infrastructure setup
- **Week 3-4**: Hub app migration
- **Week 5-6**: Studio app migration
- **Week 7**: Testing and optimization
- **Week 8**: Production rollout

This plan ensures a smooth, systematic transition from mock to real data with minimal user disruption.