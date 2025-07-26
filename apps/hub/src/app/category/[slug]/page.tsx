"use client";

import React, { use } from "react";
import { VideoCard } from "../../../components/VideoCard";

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { slug: categoryId } = use(params);

  // Get category info immediately to prevent hydration mismatch
  const getCategoryInfo = (slug: string) => {
    switch (slug) {
      case "ai-cinematics":
        return {
          name: "AI Cinematics",
          description: "Computer-generated films and visual narratives",
        };
      case "neural-dreams":
        return {
          name: "Neural Dreams",
          description: "Surreal and dreamlike AI-generated visuals",
        };
      case "synthetic-stories":
        return {
          name: "Synthetic Stories",
          description: "AI-crafted narratives and storytelling",
        };
      case "visual-wonders":
        return {
          name: "Visual Wonders",
          description: "Stunning AI-generated visual experiences",
        };
      case "ai-music":
        return {
          name: "AI Music",
          description: "Computer-composed and generated music",
        };
      case "digital-art":
        return {
          name: "Digital Art",
          description: "AI-assisted artistic creations",
        };
      case "robot-creations":
        return {
          name: "Robot Creations",
          description: "Content created by physical AI systems",
        };
      default:
        return {
          name: "Category",
          description: "AI-generated content",
        };
    }
  };

  const categoryInfo = getCategoryInfo(categoryId);
  const categoryName = categoryInfo.name;
  const categoryDescription = categoryInfo.description;

  // Sample videos filtered by category
  const categoryVideos = [
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
      id: 10,
      title: `Exploring ${categoryName}: A Deep Dive`,
      channel: "AI Explorer",
      views: "542K",
      timestamp: "1 week ago",
      thumbnail:
        "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop",
      avatar:
        "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=150&h=150&auto=format&fit=crop&crop=faces",
      duration: "18:30",
    },
    {
      id: 11,
      title: `The Future of ${categoryName} Technology`,
      channel: "Tech Forward",
      views: "328K",
      timestamp: "3 days ago",
      thumbnail:
        "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=800&auto=format&fit=crop",
      avatar:
        "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&auto=format&fit=crop&crop=faces",
      duration: "12:45",
    },
  ];

  return (
    <div className="px-6 pt-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-afacad bg-gradient-to-r from-purple-500 to-blue-400 bg-clip-text text-transparent inline-block">
          {categoryName}
        </h1>
        <p className="text-gray-400 mt-1">{categoryDescription}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categoryVideos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </div>
  );
}
