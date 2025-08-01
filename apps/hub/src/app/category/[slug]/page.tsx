"use client";

import React, { use } from "react";
import { VideoCard } from "../../../components/VideoCard";
import { VideoCardSkeleton } from "../../../components/VideoCardSkeleton";
import { useVideoList } from "@/hooks/use-videos";

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

  // TODO: Replace with actual category-specific API when implemented
  const { data: videosResponse, isLoading, error } = useVideoList({
    limit: 16,
    orderBy: 'createdAt',
    order: 'desc'
  });

  const categoryVideos = videosResponse?.data || [];

  return (
    <div className="px-6 pt-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-afacad bg-gradient-to-r from-purple-500 to-blue-400 bg-clip-text text-transparent inline-block">
          {categoryName}
        </h1>
        <p className="text-gray-400 mt-1">{categoryDescription}</p>
      </div>
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array(12).fill(0).map((_, index) => (
            <VideoCardSkeleton key={index} />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-16">
          <div className="text-red-400 mb-4">Failed to load category videos</div>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : categoryVideos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categoryVideos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-gray-600 mb-4">No videos found in this category</div>
          <p className="text-gray-400 mb-6">Check back later for new content</p>
        </div>
      )}
    </div>
  );
}
