-- Add performance indexes for search and dashboard queries

-- Video search indexes
CREATE INDEX IF NOT EXISTS "idx_video_status_approved" ON "Video" ("status", "isApproved") WHERE "status" = 'PUBLISHED' AND "isApproved" = true;
CREATE INDEX IF NOT EXISTS "idx_video_title_gin" ON "Video" USING gin (to_tsvector('english', "title"));
CREATE INDEX IF NOT EXISTS "idx_video_description_gin" ON "Video" USING gin (to_tsvector('english', "description"));
CREATE INDEX IF NOT EXISTS "idx_video_creator_views" ON "Video" ("creatorId", "views" DESC);
CREATE INDEX IF NOT EXISTS "idx_video_published_at" ON "Video" ("publishedAt" DESC) WHERE "publishedAt" IS NOT NULL;

-- Dashboard stats indexes
CREATE INDEX IF NOT EXISTS "idx_video_creator_created" ON "Video" ("creatorId", "createdAt");
CREATE INDEX IF NOT EXISTS "idx_subscription_channel_created" ON "Subscription" ("channelId", "createdAt");
CREATE INDEX IF NOT EXISTS "idx_comment_video_created" ON "Comment" ("videoId", "createdAt");

-- User query optimization
CREATE INDEX IF NOT EXISTS "idx_user_username" ON "User" ("username");
CREATE INDEX IF NOT EXISTS "idx_user_name_search" ON "User" USING gin (to_tsvector('english', "name"));

-- View event tracking indexes
CREATE INDEX IF NOT EXISTS "idx_view_event_video_user" ON "ViewEvent" ("videoId", "userId", "createdAt");

-- Analytics query indexes
CREATE INDEX IF NOT EXISTS "idx_analytics_creator_date" ON "AnalyticsSnapshot" ("creatorId", "date" DESC);
CREATE INDEX IF NOT EXISTS "idx_video_analytics_date" ON "VideoAnalytics" ("videoId", "date" DESC);

-- Like query optimization
CREATE INDEX IF NOT EXISTS "idx_like_video_created" ON "Like" ("videoId", "createdAt");

-- Full-text search function for better performance
CREATE OR REPLACE FUNCTION search_videos(search_query text)
RETURNS TABLE(video_id text, rank real) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    v."id" as video_id,
    ts_rank(
      setweight(to_tsvector('english', v."title"), 'A') ||
      setweight(to_tsvector('english', COALESCE(v."description", '')), 'B'),
      plainto_tsquery('english', search_query)
    ) as rank
  FROM "Video" v
  WHERE 
    v."status" = 'PUBLISHED' 
    AND v."isApproved" = true
    AND (
      to_tsvector('english', v."title") @@ plainto_tsquery('english', search_query)
      OR to_tsvector('english', COALESCE(v."description", '')) @@ plainto_tsquery('english', search_query)
    )
  ORDER BY rank DESC;
END;
$$ LANGUAGE plpgsql;