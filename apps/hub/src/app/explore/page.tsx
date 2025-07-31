"use client";

import React from "react";
import { CompassIcon } from "lucide-react";
import { InfiniteVideoGrid } from "@/components/InfiniteVideoGrid";
import { useInfiniteVideoList } from "@/hooks/use-videos";

export default function ExplorePage() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteVideoList({ 
    limit: 24 // Show more variety on explore page
  });

  const exploreVideos = data?.pages
    ?.flatMap(page => page?.data || [])
    ?.filter(video => video && video.id) || [];

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
      <InfiniteVideoGrid
        videos={exploreVideos}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        isLoading={isLoading}
        onLoadMore={fetchNextPage}
        emptyMessage="No videos to explore. Check back soon!"
      />
    </div>
  );
}