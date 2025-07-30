// Re-export model types
export * from './models'

// API Request/Response Types
export interface PaginationParams {
  page?: number
  limit?: number
}

export interface VideoParams extends PaginationParams {
  status?: string
  search?: string
  orderBy?: 'views' | 'createdAt' | 'likes'
  order?: 'asc' | 'desc'
  tags?: string[]
  creatorId?: string
}

export interface CommentFilter {
  filter?: 'all' | 'unanswered' | 'hearted'
  videoId?: string
}

// Dashboard Types
export interface DashboardStats {
  subscribers: number
  subscriberChange: number
  views: number
  viewsChange: number
  watchTime: number // in minutes
  watchTimeChange: number
  revenue: number
  revenueChange: number
}

export interface DashboardActivity {
  topVideos: {
    id: string
    title: string
    thumbnailUrl?: string
    views: number
    viewsChange: number
  }[]
  recentSubscribers: {
    id: string
    name: string
    avatarUrl?: string
    subscribedAt: Date
  }[]
  recentComments: {
    id: string
    userId: string
    userName: string
    userAvatar?: string
    videoId: string
    videoTitle: string
    content: string
    createdAt: Date
  }[]
}

// Analytics Types
export interface AnalyticsPeriod {
  period: '7d' | '28d' | '90d' | '365d' | 'lifetime'
}

export interface AnalyticsOverview {
  views: number[]
  watchTime: number[]
  subscribers: number[]
  revenue: number[]
  dates: string[]
  totals: {
    views: number
    watchTime: number
    subscribers: number
    revenue: number
  }
  changes: {
    views: number
    watchTime: number
    subscribers: number
    revenue: number
  }
}

export interface VideoPerformance {
  videoId: string
  title: string
  thumbnailUrl?: string
  views: number
  avgViewDuration: number
  likes: number
  comments: number
  shares: number
  retentionCurve: number[] // percentage at each 10% interval
}

export interface AudienceData {
  demographics: {
    age: { range: string; percentage: number }[]
    gender: { type: string; percentage: number }[]
    location: { country: string; percentage: number }[]
  }
  devices: {
    type: string
    percentage: number
  }[]
  trafficSources: {
    source: string
    percentage: number
  }[]
}

// Upload Types
export interface UploadRequest {
  fileName: string
  fileSize: number
  mimeType: string
}

export interface UploadResponse {
  uploadId: string
  uploadUrl: string
  assetId: string
}

export interface VideoMetadata {
  title: string
  description?: string
  tags?: string[]
  category?: string
  visibility: 'DRAFT' | 'PROCESSING' | 'PUBLISHED' | 'SCHEDULED' | 'UNLISTED' | 'PRIVATE'
  monetizationEnabled?: boolean
  scheduledAt?: Date
}

// Revenue Types
export interface RevenueStream {
  id: string
  type: 'AD_REVENUE' | 'SUBSCRIPTION' | 'TIP' | 'MERCHANDISE' | 'PREMIUM_CONTENT'
  enabled: boolean
  settings: Record<string, any>
}

export interface PayoutInfo {
  id: string
  amount: number
  currency: string
  status: 'pending' | 'processing' | 'paid'
  scheduledDate: Date
  method: string
}

export interface TaxInfo {
  id: string
  type: string
  status: 'pending' | 'submitted' | 'approved'
  year: number
  forms: {
    name: string
    url: string
  }[]
}

// Auth Types
export interface AuthUser {
  id: string
  email: string
  name: string
  username: string
  avatarUrl?: string
  isVerified: boolean
}

export interface AuthSession {
  user: AuthUser
  accessToken: string
  refreshToken: string
  expiresAt: Date
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data: T
  error?: string
  meta?: {
    page?: number
    limit?: number
    total?: number
    hasMore?: boolean
  }
}

export interface ApiError {
  message: string
  code?: string
  details?: Record<string, any>
}

// WebSocket Event Types
export interface WebSocketEvent {
  type: 'notification' | 'video-view' | 'comment' | 'subscriber'
  data: any
  timestamp: Date
}