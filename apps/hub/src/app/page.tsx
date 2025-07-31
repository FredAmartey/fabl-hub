"use client";

import React, { useState } from "react";
import { InfiniteVideoGrid } from "../components/InfiniteVideoGrid";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useInfiniteVideoList } from "@/hooks/use-videos";

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

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState("All");
  
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteVideoList({ limit: 12 });

  const allVideos = data?.pages
    ?.flatMap(page => page?.data || [])
    ?.filter(video => video && video.id) || [];

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
      
      <InfiniteVideoGrid
        videos={allVideos}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        isLoading={isLoading}
        onLoadMore={fetchNextPage}
        emptyMessage="No videos found. Check back soon!"
      />
    </div>
  );
}