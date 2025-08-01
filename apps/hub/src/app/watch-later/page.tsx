"use client";

import React from "react";
import { Button } from "../../components/Button";
import { VideoCard } from "../../components/VideoCard";
import { VideoCardSkeleton } from "../../components/VideoCardSkeleton";
import { ClockIcon } from "lucide-react";
import { useVideoList } from "@/hooks/use-videos";

export default function WatchLaterPage() {
  // TODO: Replace with actual watch-later API when implemented
  // For now, return empty array as watch-later is user-specific
  const { isLoading } = useVideoList({ limit: 1 }); // Minimal call just for loading state
  const watchLaterVideos: any[] = [];

  return (
    <div className="px-6 pt-6">
      <div className="mb-6 flex items-center">
        <ClockIcon className="w-8 h-8 text-purple-400 mr-3" />
        <div>
          <h1 className="text-2xl font-bold font-afacad bg-gradient-to-r from-purple-500 to-blue-400 bg-clip-text text-transparent inline-block">
            Watch Later
          </h1>
          <p className="text-gray-400 mt-1">Videos you&apos;ve saved for later viewing</p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array(4).fill(0).map((_, index) => (
            <VideoCardSkeleton key={index} />
          ))}
        </div>
      ) : watchLaterVideos.length > 0 ? (
        <>
          <div className="flex justify-between mb-4">
            <span className="text-sm text-gray-400">{watchLaterVideos.length} videos</span>
            <Button variant="ghost" size="sm">
              Clear All
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {watchLaterVideos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-16">
          <ClockIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-xl font-medium mb-2">Your Watch Later list is empty</h2>
          <p className="text-gray-400 mb-6">Save videos to watch them later</p>
          <Button variant="primary">Browse Videos</Button>
        </div>
      )}
    </div>
  );
}
