import type {
  User,
  Video,
  Notification,
  DashboardStats,
  DashboardActivity,
  VideoParams,
  Comment,
  Transaction,
  AnalyticsOverview,
  VideoPerformance,
  AudienceData,
  UploadRequest,
  UploadResponse,
  VideoMetadata,
  RevenueStream,
  PayoutInfo,
  TaxInfo,
  ApiResponse,
  ApiError,
  AnalyticsPeriod
} from '@fabl/types'

export interface APIClientConfig {
  baseURL: string
  getAuthToken?: () => string | null
}

export class APIClient {
  private baseURL: string
  private getAuthToken?: () => string | null

  constructor(config: APIClientConfig) {
    this.baseURL = config.baseURL
    this.getAuthToken = config.getAuthToken
  }

  async request<T>(
    path: string,
    options: RequestInit & { body?: any } = {}
  ): Promise<T> {
    const token = this.getAuthToken?.()
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    console.log('API Request:', {
      url: `${this.baseURL}${path}`,
      hasToken: !!token,
      headers: headers
    })

    // Convert body to JSON string if it's an object
    let body = options.body
    if (body && typeof body === 'object' && !(body instanceof FormData)) {
      body = JSON.stringify(body)
    }

    const response = await fetch(`${this.baseURL}${path}`, {
      ...options,
      body,
      headers,
      credentials: 'include', // Include cookies for CORS
    })

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        message: 'An unexpected error occurred',
      }))
      throw new Error(error.message)
    }

    return response.json()
  }

  // Hub methods
  async getUser(): Promise<User> {
    return this.request<User>('/api/users/me')
  }

  async getVideos(params?: VideoParams): Promise<ApiResponse<Video[]>> {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.status) searchParams.set('status', params.status)
    if (params?.search) searchParams.set('search', params.search)
    if (params?.orderBy) searchParams.set('orderBy', params.orderBy)
    if (params?.order) searchParams.set('order', params.order)
    if (params?.tags && params.tags.length > 0) searchParams.set('tags', params.tags.join(','))
    if (params?.creatorId) searchParams.set('creatorId', params.creatorId)

    const response = await this.request<any>(
      `/api/videos?${searchParams.toString()}`
    )
    
    // Transform the response to match ApiResponse<Video[]> format
    return {
      success: true,
      data: response.videos || [],
      meta: {
        page: response.pagination?.page || 1,
        limit: response.pagination?.limit || 20,
        total: response.pagination?.total || 0,
        totalPages: response.pagination?.totalPages || 0,
        hasMore: (response.pagination?.page || 1) < (response.pagination?.totalPages || 0)
      }
    }
  }

  async getVideo(id: string): Promise<ApiResponse<Video>> {
    return this.request<ApiResponse<Video>>(`/api/videos/${id}`)
  }

  async getTrendingVideos(): Promise<Video[]> {
    return this.request<Video[]>('/api/videos/trending')
  }

  async getRecommendedVideos(): Promise<Video[]> {
    return this.request<Video[]>('/api/videos/recommended')
  }

  async likeVideo(videoId: string): Promise<void> {
    return this.request(`/api/videos/${videoId}/like`, {
      method: 'POST',
    })
  }

  async recordVideoView(videoId: string): Promise<void> {
    return this.request(`/api/videos/${videoId}/view`, {
      method: 'POST',
    })
  }

  async getNotifications(): Promise<Notification[]> {
    return this.request<Notification[]>('/api/notifications')
  }

  async markNotificationRead(id: string): Promise<void> {
    return this.request(`/api/notifications/${id}/read`, {
      method: 'PUT',
    })
  }

  async deleteNotification(id: string): Promise<void> {
    return this.request(`/api/notifications/${id}`, {
      method: 'DELETE',
    })
  }

  async createComment(data: {
    videoId: string
    content: string
    parentId?: string
  }): Promise<Comment> {
    return this.request<Comment>('/api/comments', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async deleteComment(id: string): Promise<void> {
    return this.request(`/api/comments/${id}`, {
      method: 'DELETE',
    })
  }

  // Studio methods
  async getDashboardStats(): Promise<DashboardStats> {
    return this.request<DashboardStats>('/api/studio/dashboard/stats')
  }

  async getDashboardActivity(): Promise<DashboardActivity> {
    return this.request<DashboardActivity>('/api/studio/dashboard/recent-activity')
  }

  async getCreatorVideos(params?: VideoParams): Promise<ApiResponse<Video[]>> {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.status) searchParams.set('status', params.status)
    if (params?.search) searchParams.set('search', params.search)

    return this.request<ApiResponse<Video[]>>(
      `/api/studio/videos?${searchParams.toString()}`
    )
  }

  async updateVideo(id: string, data: Partial<VideoMetadata>): Promise<Video> {
    return this.request<Video>(`/api/studio/videos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteVideo(id: string): Promise<void> {
    return this.request(`/api/studio/videos/${id}`, {
      method: 'DELETE',
    })
  }

  async publishVideo(id: string): Promise<Video> {
    return this.request<Video>(`/api/studio/videos/${id}/publish`, {
      method: 'POST',
    })
  }

  async getAnalytics(period: AnalyticsPeriod['period']): Promise<AnalyticsOverview> {
    return this.request<AnalyticsOverview>(
      `/api/studio/analytics/overview?period=${period}`
    )
  }

  async getVideoPerformance(videoId: string): Promise<VideoPerformance> {
    return this.request<VideoPerformance>(
      `/api/studio/analytics/videos/${videoId}/performance`
    )
  }

  async getAudienceData(): Promise<AudienceData> {
    return this.request<AudienceData>('/api/studio/analytics/audience')
  }

  async getComments(videoId: string): Promise<ApiResponse<Comment[]>> {
    return this.request<ApiResponse<Comment[]>>(
      `/api/videos/${videoId}/comments`
    )
  }

  async replyToComment(commentId: string, content: string): Promise<Comment> {
    return this.request<Comment>(`/api/studio/comments/${commentId}/reply`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    })
  }

  async heartComment(commentId: string): Promise<void> {
    return this.request(`/api/studio/comments/${commentId}/heart`, {
      method: 'POST',
    })
  }

  async getTransactions(period: string): Promise<Transaction[]> {
    return this.request<Transaction[]>(
      `/api/studio/monetization/transactions?period=${period}`
    )
  }

  async getRevenueStreams(): Promise<RevenueStream[]> {
    return this.request<RevenueStream[]>('/api/studio/monetization/revenue-streams')
  }

  async updateRevenueStream(
    id: string,
    settings: Record<string, any>
  ): Promise<RevenueStream> {
    return this.request<RevenueStream>('/api/studio/monetization/settings', {
      method: 'PUT',
      body: JSON.stringify({ id, settings }),
    })
  }

  async getPayouts(): Promise<PayoutInfo[]> {
    return this.request<PayoutInfo[]>('/api/studio/monetization/payouts')
  }

  async getTaxInfo(): Promise<TaxInfo> {
    return this.request<TaxInfo>('/api/studio/monetization/tax-info')
  }

  async requestUploadUrl(data: UploadRequest): Promise<UploadResponse> {
    return this.request<UploadResponse>('/api/studio/upload/request-url', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async completeUpload(uploadId: string, metadata: VideoMetadata): Promise<Video> {
    return this.request<Video>('/api/studio/upload/complete', {
      method: 'POST',
      body: JSON.stringify({ uploadId, ...metadata }),
    })
  }

  async getUploadStatus(uploadId: string): Promise<{
    status: 'uploading' | 'processing' | 'complete' | 'failed'
    progress?: number
    error?: string
  }> {
    return this.request(`/api/studio/upload/${uploadId}/status`)
  }
}