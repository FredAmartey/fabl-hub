// Enums
export enum VideoStatus {
  DRAFT = 'DRAFT',
  PROCESSING = 'PROCESSING',
  PUBLISHED = 'PUBLISHED',
  SCHEDULED = 'SCHEDULED',
  UNLISTED = 'UNLISTED',
  PRIVATE = 'PRIVATE'
}

export enum NotificationType {
  LIKE = 'LIKE',
  COMMENT = 'COMMENT',
  SUBSCRIBE = 'SUBSCRIBE',
  UPLOAD = 'UPLOAD',
  MENTION = 'MENTION',
  MILESTONE = 'MILESTONE'
}

export enum EntityType {
  VIDEO = 'VIDEO',
  COMMENT = 'COMMENT',
  CHANNEL = 'CHANNEL'
}

export enum TransactionType {
  AD_REVENUE = 'AD_REVENUE',
  SUBSCRIPTION = 'SUBSCRIPTION',
  TIP = 'TIP',
  MERCHANDISE = 'MERCHANDISE',
  PREMIUM_CONTENT = 'PREMIUM_CONTENT'
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED'
}

export enum ModerationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  FLAGGED = 'FLAGGED',
  REJECTED = 'REJECTED'
}

// Core Models
export interface User {
  id: string
  email: string
  name: string
  username: string
  avatarUrl?: string | null
  image?: string | null // Alias for avatarUrl for compatibility
  channelName?: string | null
  subscriberCount: number
  isVerified: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Video {
  id: string
  creatorId: string
  title: string
  description?: string | null
  thumbnailUrl?: string | null
  videoUrl: string
  muxAssetId?: string | null
  muxPlaybackId?: string | null
  duration: number
  status: VideoStatus
  views: number
  likes?: number
  monetizationEnabled: boolean
  aiRatio?: number | null
  isApproved: boolean
  publishedAt?: Date | null
  scheduledAt?: Date | null
  createdAt: Date
  updatedAt: Date
  
  // Relations
  creator?: User
  tags?: string[]
}

export interface Comment {
  id: string
  videoId: string
  userId: string
  parentId?: string | null
  content: string
  likes: number
  isHearted: boolean
  isPinned: boolean
  createdAt: Date
  updatedAt: Date
  
  // Relations
  user?: User
}

export interface Like {
  id: string
  userId: string
  videoId: string
  createdAt: Date
}

export interface Subscription {
  id: string
  subscriberId: string
  channelId: string
  createdAt: Date
}

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  actorId: string
  entityId: string
  entityType: EntityType
  message: string
  read: boolean
  createdAt: Date
}

export interface Transaction {
  id: string
  creatorId: string
  type: TransactionType
  amount: number
  currency: string
  status: TransactionStatus
  sourceId?: string | null
  sourceName: string
  createdAt: Date
  paidAt?: Date | null
}

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
  createdAt: Date
}

export interface VideoAnalytics {
  id: string
  videoId: string
  date: Date
  views: number
  watchTimeMinutes: number
  avgViewDuration: number
  likes: number
  comments: number
  shares: number
  createdAt: Date
}

export interface ViewEvent {
  id: string
  videoId: string
  userId?: string | null
  watchTime: number
  completed: boolean
  createdAt: Date
}

export interface ModerationLog {
  id: string
  videoId: string
  status: ModerationStatus
  reason?: string | null
  aiScore?: number | null
  createdAt: Date
}