"use client";

import React from "react";
import { TrendingUpIcon } from "lucide-react";
import { InfiniteVideoGrid } from "@/components/InfiniteVideoGrid";
import { useInfiniteVideoList } from "@/hooks/use-videos";

export default function TrendingPage() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteVideoList({ 
    orderBy: "views",
    order: "desc",
    limit: 20 
  });

  const trendingVideos = data?.pages
    ?.flatMap(page => page?.data || [])
    ?.filter(video => video && video.id) || [];

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
      <InfiniteVideoGrid
        videos={trendingVideos}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        isLoading={isLoading}
        onLoadMore={fetchNextPage}
        emptyMessage="No trending videos found. Check back soon!"
      />
    </div>
  );
}
