export interface VideoProcessingJob {
    videoId: string;
    muxAssetId: string;
    creatorId: string;
    uploadId?: string;
}
export interface ModerationJob {
    videoId: string;
    muxAssetId: string;
    muxPlaybackId: string;
    duration: number;
    creatorId: string;
}
export interface AnalyticsJob {
    type: 'view' | 'engagement' | 'retention';
    videoId?: string;
    userId?: string;
    data: Record<string, any>;
    timestamp: Date;
}
export interface NotificationJob {
    type: 'video_ready' | 'video_failed' | 'moderation_complete' | 'new_comment' | 'new_subscriber';
    userId: string;
    data: {
        title?: string;
        message: string;
        entityId?: string;
        entityType?: 'video' | 'comment' | 'channel';
        actorId?: string;
    };
}
export declare enum JobStatus {
    PENDING = "pending",
    PROCESSING = "processing",
    COMPLETED = "completed",
    FAILED = "failed"
}
export interface JobResult<T = any> {
    status: JobStatus;
    data?: T;
    error?: string;
    timestamp: Date;
}
