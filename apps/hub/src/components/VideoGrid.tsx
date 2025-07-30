"use client";

import React from "react";
import { VideoCard } from "./VideoCard";
import { VideoCardSkeleton } from "./VideoCardSkeleton";
import type { Video } from "@fabl/types";

interface VideoGridProps {
  videos?: Video[];
  loading?: boolean;
  emptyMessage?: string;
  columns?: 1 | 2 | 3 | 4;
  priority?: boolean;
}

export function VideoGrid({ 
  videos, 
  loading = false, 
  emptyMessage = "No videos found",
  columns = 4,
  priority = false
}: VideoGridProps) {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
  };

  if (loading) {
    return (
      <div className={`grid ${gridCols[columns]} gap-6`}>
        {Array.from({ length: 12 }).map((_, i) => (
          <VideoCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!videos || videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-gray-400 text-center">
          <div className="text-6xl mb-4">📹</div>
          <p className="text-lg">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`grid ${gridCols[columns]} gap-6`}>
      {videos.map((video, index) => (
        <VideoCard 
          key={video.id} 
          video={video} 
          priority={priority && index < 4}
        />
      ))}
    </div>
  );
}