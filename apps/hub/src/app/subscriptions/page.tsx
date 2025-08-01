"use client";

import React from "react";
import { Button } from "../../components/Button";
import { VideoCard } from "../../components/VideoCard";
import { VideoCardSkeleton } from "../../components/VideoCardSkeleton";
import { BookmarkIcon } from "lucide-react";
import { useVideoList } from "@/hooks/use-videos";

export default function SubscriptionsPage() {
  // TODO: Replace with actual subscriptions API when implemented
  const { data: videosResponse, isLoading, error } = useVideoList({
    limit: 20,
    orderBy: 'createdAt',
    order: 'desc'
  });

  const subscriptionVideos = videosResponse?.data || [];

  // TODO: Replace with actual subscriptions API when implemented
  const subscribedChannels: any[] = [];

  return (
    <div className="px-6 pt-6">
      <div className="mb-6 flex items-center">
        <BookmarkIcon className="w-8 h-8 text-purple-500 mr-3" />
        <div>
          <h1 className="text-2xl font-bold font-afacad bg-gradient-to-r from-purple-500 to-blue-400 bg-clip-text text-transparent inline-block">
            Subscriptions
          </h1>
          <p className="text-gray-400 mt-1">Latest videos from your subscribed channels</p>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 mb-6">
        {subscribedChannels.map((channel) => (
          <div key={channel.id} className="flex-shrink-0 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-purple-500/30 hover:ring-purple-500 transition-all">
              <img src={channel.avatar} alt={channel.name} className="w-full h-full object-cover" />
            </div>
            <span className="text-xs mt-2 text-center font-medium">{channel.name}</span>
            <span className="text-xs text-gray-500">{channel.subscribers} subs</span>
          </div>
        ))}
        <div className="flex-shrink-0 flex flex-col items-center justify-center">
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full h-16 w-16 flex items-center justify-center"
          >
            <span className="text-2xl">+</span>
          </Button>
          <span className="text-xs mt-2 text-center font-medium">Add More</span>
          <span className="text-xs text-gray-500">Discover</span>
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
          <div className="text-red-400 mb-4">Failed to load subscription videos</div>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      ) : subscriptionVideos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {subscriptionVideos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <BookmarkIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-xl font-medium mb-2">No subscription videos yet</h2>
          <p className="text-gray-400 mb-6">Subscribe to channels to see their latest videos</p>
          <Button variant="primary">Explore Channels</Button>
        </div>
      )}

      <div className="mt-8 text-center">
        <p className="text-gray-400 mb-4">Discover more AI content creators</p>
        <Button variant="primary">Explore Channels</Button>
      </div>
    </div>
  );
}
