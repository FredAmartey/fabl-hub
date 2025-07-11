import React from 'react';
import { Button } from '../Button';
import { VideoCard } from '../VideoCard';
import { BookmarkIcon } from 'lucide-react';
export function SubscriptionsPage() {
  const subscriptionVideos = [{
    id: 2,
    title: 'Synthetic Storytelling: The Last Cosmic Voyager',
    channel: 'StoryForge AI',
    views: '856K',
    timestamp: '1 week ago',
    thumbnail: 'https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?q=80&w=800&auto=format&fit=crop',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&auto=format&fit=crop&crop=faces',
    duration: '15:42'
  }, {
    id: 8,
    title: 'Synthetic Stories: Whispers of Digital Consciousness',
    channel: 'StoryForge AI',
    views: '723K',
    timestamp: '2 days ago',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&auto=format&fit=crop&crop=faces',
    duration: '14:32'
  }];
  const subscribedChannels = [{
    id: 1,
    name: 'StoryForge AI',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&auto=format&fit=crop&crop=faces',
    subscribers: '2.4M'
  }, {
    id: 2,
    name: 'AI Wanderer',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&auto=format&fit=crop&crop=faces',
    subscribers: '1.8M'
  }, {
    id: 3,
    name: 'Harmonic AI',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&auto=format&fit=crop&crop=faces',
    subscribers: '3.2M'
  }];
  return <div className="px-6 pt-6">
      <div className="mb-6 flex items-center">
        <BookmarkIcon className="w-8 h-8 text-purple-500 mr-3" />
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-blue-400 bg-clip-text text-transparent inline-block">
            Subscriptions
          </h1>
          <p className="text-gray-400 mt-1">
            Latest videos from your subscribed channels
          </p>
        </div>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4 mb-6">
        {subscribedChannels.map(channel => <div key={channel.id} className="flex-shrink-0 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-purple-500/30 hover:ring-purple-500 transition-all">
              <img src={channel.avatar} alt={channel.name} className="w-full h-full object-cover" />
            </div>
            <span className="text-xs mt-2 text-center font-medium">
              {channel.name}
            </span>
            <span className="text-xs text-gray-500">
              {channel.subscribers} subs
            </span>
          </div>)}
        <div className="flex-shrink-0 flex flex-col items-center justify-center">
          <Button variant="ghost" size="sm" className="rounded-full h-16 w-16 flex items-center justify-center">
            <span className="text-2xl">+</span>
          </Button>
          <span className="text-xs mt-2 text-center font-medium">Add More</span>
          <span className="text-xs text-gray-500">Discover</span>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {subscriptionVideos.map(video => <VideoCard key={video.id} video={video} />)}
      </div>
      <div className="mt-8 text-center">
        <p className="text-gray-400 mb-4">Discover more AI content creators</p>
        <Button variant="primary">Explore Channels</Button>
      </div>
    </div>;
}