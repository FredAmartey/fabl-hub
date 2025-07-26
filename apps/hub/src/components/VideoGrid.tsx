"use client";

import React, { useState } from "react";
import { VideoCard } from "./VideoCard";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

export function VideoGrid() {
  const categories = [
    "All",
    "AI Cinematics",
    "Neural Dreams",
    "Synthetic Stories",
    "Visual Wonders",
    "AI Music",
    "Digital Art",
    "Robot Creations",
  ];
  const [activeCategory, setActiveCategory] = useState("All");

  // Placeholder video data
  const videos = [
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
      title: "Synthetic Storytelling: The Last Cosmic Voyager",
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
    {
      id: 7,
      title: "AI Cinematics: The Silent Observer",
      channel: "Neural Films",
      views: "1.8M",
      timestamp: "3 weeks ago",
      thumbnail:
        "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&auto=format&fit=crop",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&auto=format&fit=crop&crop=faces",
      duration: "25:08",
    },
    {
      id: 8,
      title: "Synthetic Stories: Whispers of Digital Consciousness",
      channel: "StoryForge AI",
      views: "723K",
      timestamp: "2 days ago",
      thumbnail:
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&auto=format&fit=crop&crop=faces",
      duration: "14:32",
    },
  ];

  return (
    <div className="px-6 pt-4">
      <div className="relative mb-6">
        <div className="flex items-center">
          <button className="p-2 rounded-full bg-[#1a1230] hover:bg-purple-500/30 transition-colors mr-2">
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`
                  px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors transition-transform duration-150
                  ${
                    activeCategory === category
                      ? "bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium"
                      : "bg-[#1a1230] hover:bg-purple-500/30 text-gray-300"
                  }
                `}
              >
                {category}
              </button>
            ))}
          </div>
          <button className="p-2 rounded-full bg-[#1a1230] hover:bg-purple-500/30 transition-colors ml-2">
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </div>
  );
}
