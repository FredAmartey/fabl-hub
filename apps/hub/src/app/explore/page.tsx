import React from "react";
import { VideoCard } from "../../components/VideoCard";
import { CompassIcon } from "lucide-react";

export default function ExplorePage() {
  // Sample videos from different categories
  const exploreVideos = [
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
      id: 2,
      title: "Syntheti Storytelling: The Last Cosmic Voyager",
      channel: "StoryForge AI",
      views: "856K",
      timestamp: "1 week ago",
      thumbnail:
        "https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?q=80&w=800&auto=format&fit=crop",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&auto=format&fit=crop&crop=faces",
      duration: "15:42",
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
      id: 4,
      title: "Visual Wonder: Ocean Depths Reimagined",
      channel: "DeepDream Studio",
      views: "647K",
      timestamp: "4 days ago",
      thumbnail:
        "https://images.unsplash.com/photo-1551244072-5d12893278ab?q=80&w=800&auto=format&fit=crop",
      avatar:
        "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=150&h=150&auto=format&fit=crop&crop=faces",
      duration: "12:05",
    },
    {
      id: 5,
      title: "Robot Creations: Future Architecture Concepts",
      channel: "AI Builder",
      views: "1.5M",
      timestamp: "5 days ago",
      thumbnail:
        "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop",
      avatar:
        "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=150&h=150&auto=format&fit=crop&crop=faces",
      duration: "18:30",
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
  ];

  return (
    <div className="px-6 pt-6">
      <div className="mb-6 flex items-center">
        <CompassIcon className="w-8 h-8 text-purple-500 mr-3" />
        <div>
          <h1 className="text-2xl font-bold font-afacad bg-gradient-to-r from-purple-500 to-blue-400 bg-clip-text text-transparent inline-block">
            Explore AI Content
          </h1>
          <p className="text-gray-400 mt-1">Discover amazing AI-generated videos from all categories</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {exploreVideos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </div>
  );
}