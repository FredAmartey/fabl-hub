import React from "react";
import { VideoCard } from "../../components/VideoCard";
import { TrendingUpIcon } from "lucide-react";

export default function TrendingPage() {
  // Filter only trending videos
  const trendingVideos = [
    {
      id: 1,
      title: "Neural Dream Journey Through Ancient Civilizations",
      channel: "AI Wanderer",
      views: "1.2M",
      timestamp: "3 days ago",
      thumbnail:
        "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=800&auto=format&fit=crop",
      avatar:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&auto=format&fit=crop&crop=faces",
      duration: "10:23",
      trending: true,
    },
    {
      id: 3,
      title: "AI Generated Music: Symphony of Digital Emotions",
      channel: "Harmonic AI",
      views: "2.3M",
      timestamp: "2 weeks ago",
      thumbnail:
        "https://images.unsplash.com/photo-1614149162883-504ce4d13909?q=80&w=800&auto=format&fit=crop",
      avatar:
        "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&auto=format&fit=crop&crop=faces",
      duration: "8:17",
      trending: true,
    },
    {
      id: 6,
      title: "Digital Art Evolution: From Pixels to Neural Networks",
      channel: "ArtMatrix",
      views: "932K",
      timestamp: "1 day ago",
      thumbnail:
        "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=800&auto=format&fit=crop",
      avatar:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&auto=format&fit=crop&crop=faces",
      duration: "22:14",
      trending: true,
    },
    {
      id: 9,
      title: "The Future of AI Creativity: Beyond Boundaries",
      channel: "Tomorrow&apos;s Tech",
      views: "1.7M",
      timestamp: "5 days ago",
      thumbnail:
        "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=800&auto=format&fit=crop",
      avatar:
        "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&auto=format&fit=crop&crop=faces",
      duration: "19:42",
      trending: true,
    },
  ];

  return (
    <div className="px-6 pt-6">
      <div className="mb-6 flex items-center">
        <TrendingUpIcon className="w-8 h-8 text-purple-500 mr-3" />
        <div>
          <h1 className="text-2xl font-bold font-afacad bg-gradient-to-r from-purple-500 to-blue-400 bg-clip-text text-transparent inline-block">
            Trending Now
          </h1>
          <p className="text-gray-400 mt-1">The most popular AI-generated content right now</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {trendingVideos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </div>
  );
}
