"use client";

import { useVideos } from '@/hooks/api/use-videos';
import { VideoCard } from './VideoCard';

interface RelatedVideosProps {
  currentVideoId: string;
  tags: string[];
}

export function RelatedVideos({ currentVideoId, tags }: RelatedVideosProps) {
  // Fetch videos with similar tags
  const { data, isLoading } = useVideos({ 
    tags: tags.slice(0, 3), // Use first 3 tags for relevance
    limit: 10,
  });

  const videos = data?.pages.flatMap(page => page.data) || [];
  
  // Filter out current video and limit to 8 suggestions
  const relatedVideos = videos
    .filter(v => v.id !== currentVideoId)
    .slice(0, 8);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold mb-4">Related Videos</h3>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex gap-3">
            <div className="w-40 h-24 bg-gray-800 rounded animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-800 rounded animate-pulse" />
              <div className="h-3 bg-gray-800 rounded animate-pulse w-3/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Related Videos</h3>
      
      <div className="space-y-3">
        {relatedVideos.map((video) => (
          <VideoCard
            key={video.id}
            video={video}
            variant="horizontal"
            size="sm"
          />
        ))}
      </div>

      {relatedVideos.length === 0 && (
        <p className="text-gray-400 text-center py-8">
          No related videos found
        </p>
      )}
    </div>
  );
}