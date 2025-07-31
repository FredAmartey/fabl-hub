"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useUser } from '@/hooks/api/use-user';
import { useVideos } from '@/hooks/api/use-videos';
import { Button } from '@/components/Button';
import { VideoGrid } from '@/components/VideoGrid';
import { Avatar } from '@/components/Avatar';
import { 
  SettingsIcon, 
  BarChart3Icon, 
  VideoIcon, 
  ClockIcon, 
  ThumbsUpIcon, 
  BookmarkIcon,
  PlayIcon,
  UsersIcon,
  EyeIcon,
} from 'lucide-react';
import { formatNumber } from '@/lib/utils';

export default function ProfileOverviewPage() {
  const { data: user, isLoading: userLoading } = useUser();
  const [activeTab, setActiveTab] = useState<'uploads' | 'history' | 'liked' | 'saved'>('uploads');

  // Fetch videos based on active tab
  const { data: videosData, isLoading: videosLoading } = useVideos({
    creatorId: activeTab === 'uploads' ? user?.id : undefined,
    limit: 12,
  });

  const videos = videosData?.pages.flatMap(page => page.data) || [];

  // Mock stats for now
  const stats = {
    totalViews: 245600,
    totalVideos: 24,
    totalLikes: 8420,
    watchTime: 12450, // minutes
  };

  const tabs = [
    { id: 'uploads' as const, label: 'My Videos', icon: VideoIcon },
    { id: 'history' as const, label: 'Watch History', icon: ClockIcon },
    { id: 'liked' as const, label: 'Liked Videos', icon: ThumbsUpIcon },
    { id: 'saved' as const, label: 'Saved Videos', icon: BookmarkIcon },
  ];

  if (userLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="animate-pulse">
          <div className="h-48 bg-gray-800 rounded-xl mb-6" />
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 bg-gray-800 rounded-full" />
            <div className="flex-1">
              <div className="h-8 bg-gray-800 rounded w-1/3 mb-2" />
              <div className="h-4 bg-gray-800 rounded w-1/4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-xl p-6 mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <Avatar
            src={user?.avatarUrl}
            alt={user?.name || 'User'}
            size="xl"
          />
          
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{user?.name}</h1>
            <p className="text-gray-400 mb-4">@{user?.username}</p>
            
            {/* Quick Stats */}
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2">
                <UsersIcon className="w-4 h-4 text-purple-400" />
                <span>{formatNumber(user?.subscriberCount || 0)} subscribers</span>
              </div>
              <div className="flex items-center gap-2">
                <VideoIcon className="w-4 h-4 text-purple-400" />
                <span>{stats.totalVideos} videos</span>
              </div>
              <div className="flex items-center gap-2">
                <EyeIcon className="w-4 h-4 text-purple-400" />
                <span>{formatNumber(stats.totalViews)} total views</span>
              </div>
              <div className="flex items-center gap-2">
                <PlayIcon className="w-4 h-4 text-purple-400" />
                <span>{formatNumber(stats.watchTime)} min watch time</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Link href="/profile/settings">
              <Button variant="outline" className="flex items-center gap-2">
                <SettingsIcon className="w-4 h-4" />
                Settings
              </Button>
            </Link>
            <Link href={`${process.env.NEXT_PUBLIC_STUDIO_URL || 'http://localhost:3001'}/dashboard`}>
              <Button variant="primary" className="flex items-center gap-2">
                <BarChart3Icon className="w-4 h-4" />
                Go to Studio
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800/50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Views (28 days)</span>
            <EyeIcon className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold">{formatNumber(45200)}</p>
          <p className="text-xs text-green-400">+12.5%</p>
        </div>
        
        <div className="bg-gray-800/50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Watch time (hours)</span>
            <ClockIcon className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold">{formatNumber(892)}</p>
          <p className="text-xs text-green-400">+8.3%</p>
        </div>
        
        <div className="bg-gray-800/50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Subscribers</span>
            <UsersIcon className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold">+{formatNumber(234)}</p>
          <p className="text-xs text-green-400">+18.2%</p>
        </div>
        
        <div className="bg-gray-800/50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Revenue</span>
            <span className="text-purple-400">$</span>
          </div>
          <p className="text-2xl font-bold">${formatNumber(1240)}</p>
          <p className="text-xs text-green-400">+22.1%</p>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="border-b border-gray-800 mb-6">
        <nav className="flex gap-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 py-4 px-1 text-sm font-medium transition-colors relative
                  ${isActive 
                    ? 'text-white' 
                    : 'text-gray-400 hover:text-gray-300'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <VideoGrid 
        videos={videos} 
        loading={videosLoading}
        emptyMessage={
          activeTab === 'uploads' 
            ? "You haven't uploaded any videos yet" 
            : `No ${activeTab} videos`
        }
      />
      
      {/* Quick Actions */}
      {activeTab === 'uploads' && videos.length === 0 && (
        <div className="text-center py-12">
          <Link href={`${process.env.NEXT_PUBLIC_STUDIO_URL || 'http://localhost:3001'}/upload`}>
            <Button variant="primary" size="lg" className="flex items-center gap-2 mx-auto">
              <VideoIcon className="w-5 h-5" />
              Upload Your First Video
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}