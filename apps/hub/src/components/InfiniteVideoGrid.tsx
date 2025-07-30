"use client";

import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { VideoGrid } from "./VideoGrid";
import { Loader2Icon } from "lucide-react";
import type { Video } from "@fabl/types";

interface InfiniteVideoGridProps {
  videos: Video[];
  hasNextPage?: boolean;
  isFetchingNextPage: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  emptyMessage?: string;
  columns?: 1 | 2 | 3 | 4;
}

export function InfiniteVideoGrid({
  videos,
  hasNextPage,
  isFetchingNextPage,
  isLoading,
  onLoadMore,
  emptyMessage,
  columns = 4,
}: InfiniteVideoGridProps) {
  const { ref, inView } = useInView({
    threshold: 0.1,
    rootMargin: "100px",
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      onLoadMore();
    }
  }, [inView, hasNextPage, isFetchingNextPage, onLoadMore]);

  return (
    <div>
      <VideoGrid
        videos={videos}
        loading={isLoading && videos.length === 0}
        emptyMessage={emptyMessage}
        columns={columns}
        priority
      />
      
      {hasNextPage && (
        <div
          ref={ref}
          className="flex justify-center py-8"
        >
          {isFetchingNextPage ? (
            <div className="flex items-center gap-2 text-purple-400">
              <Loader2Icon className="w-5 h-5 animate-spin" />
              <span>Loading more videos...</span>
            </div>
          ) : (
            <button
              onClick={onLoadMore}
              className="px-6 py-2 bg-purple-600/20 hover:bg-purple-600/30 rounded-lg transition-colors"
            >
              Load More
            </button>
          )}
        </div>
      )}
    </div>
  );
}