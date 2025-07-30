import { notFound } from 'next/navigation';
import { VideoPlayer } from '@/components/VideoPlayer';
import { VideoInfo } from '@/components/VideoInfo';
import { VideoComments } from '@/components/VideoComments';
import { RelatedVideos } from '@/components/RelatedVideos';
import { VideoEngagement } from '@/components/VideoEngagement';
import { getVideoById } from '@/lib/api/videos';

interface VideoPageProps {
  params: {
    id: string;
  };
}

export default async function VideoPage({ params }: VideoPageProps) {
  const video = await getVideoById(params.id);
  
  if (!video) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video Player */}
          <VideoPlayer video={video} />
          
          {/* Video Info */}
          <VideoInfo video={video} />
          
          {/* Engagement Actions */}
          <VideoEngagement video={video} />
          
          {/* Comments Section */}
          <VideoComments videoId={video.id} />
        </div>
        
        {/* Sidebar - Related Videos */}
        <div className="lg:col-span-1">
          <RelatedVideos 
            currentVideoId={video.id} 
            tags={video.tags || []}
          />
        </div>
      </div>
    </div>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: VideoPageProps) {
  const video = await getVideoById(params.id);
  
  if (!video) {
    return {
      title: 'Video Not Found - Fabl',
    };
  }
  
  return {
    title: `${video.title} - Fabl`,
    description: video.description || 'Watch this video on Fabl',
    openGraph: {
      title: video.title,
      description: video.description || 'Watch this video on Fabl',
      images: [video.thumbnailUrl || ''],
      videos: [
        {
          url: video.muxPlaybackId ? `https://stream.mux.com/${video.muxPlaybackId}.m3u8` : '',
          type: 'application/x-mpegURL',
        },
      ],
    },
  };
}