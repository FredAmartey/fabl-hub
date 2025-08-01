"use client";

import React from "react";
import { Button } from "../../components/Button";
import { VideoCard } from "../../components/VideoCard";
import { VideoCardSkeleton } from "../../components/VideoCardSkeleton";
import { HeartIcon } from "lucide-react";
import { useVideoList } from "@/hooks/use-videos";

export default function FavoritesPage() {
  // TODO: Replace with actual favorites API when implemented
  // For now, fetch recent videos as placeholder
  const { data: videosResponse, isLoading, error } = useVideoList({
    limit: 12,
    orderBy: 'createdAt',
    order: 'desc'
  });

  const favoriteVideos = videosResponse?.data || [];

  return (
    <div className="px-6 pt-6">
      <div className="mb-6 flex items-center">
        <HeartIcon className="w-8 h-8 text-pink-400 mr-3" />
        <div>
          <h1 className="text-2xl font-bold font-afacad bg-gradient-to-r from-purple-500 to-blue-400 bg-clip-text text-transparent inline-block">
            Favorites
          </h1>
          <p className="text-gray-400 mt-1">Your favorite AI-generated content</p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array(8).fill(0).map((_, index) => (
            <VideoCardSkeleton key={index} />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-16">
          <div className="text-red-400 mb-4">Failed to load favorites</div>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      ) : favoriteVideos.length > 0 ? (
        <>
          <div className="flex justify-between mb-4">
            <span className="text-sm text-gray-400">{favoriteVideos.length} videos</span>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">
                Sort by
              </Button>
              <Button variant="ghost" size="sm">
                Filter
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoriteVideos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-16">
          <HeartIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-xl font-medium mb-2">Your Favorites list is empty</h2>
          <p className="text-gray-400 mb-6">Add videos you love to your favorites</p>
          <Button variant="primary">Browse Videos</Button>
        </div>
      )}
    </div>
  );
}
