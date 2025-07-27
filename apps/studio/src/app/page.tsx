"use client";

import Link from "next/link";
import {
  PlayIcon,
  EyeIcon,
  ClockIcon,
  UserGroupIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  VideoCameraIcon,
  PlusIcon,
  ArrowTrendingUpIcon,
  HeartIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";
import { CurrencyDollarIcon } from "@heroicons/react/24/solid";

export default function StudioDashboard() {
  const stats = [
    {
      label: "Views",
      value: "1.2M",
      change: 12.5,
      period: "Last 28 days",
      icon: EyeIcon,
      color: "text-blue-400",
    },
    {
      label: "Watch time",
      value: "847 hours",
      change: 8.3,
      period: "Last 28 days",
      icon: ClockIcon,
      color: "text-purple-400",
    },
    {
      label: "Subscribers",
      value: "45.2K",
      change: 5.7,
      period: "+2.5K this month",
      icon: UserGroupIcon,
      color: "text-pink-400",
    },
    {
      label: "Revenue",
      value: "$2,840",
      change: 23.1,
      period: "This month",
      icon: CurrencyDollarIcon,
      color: "text-green-400",
    },
  ];

  const videos = [
    {
      id: 1,
      title: "Building a Modern React App with AI Assistance",
      thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=225&auto=format&fit=crop",
      views: "23.4K",
      likes: "1.2K",
      comments: "89",
      avgViewDuration: "8:23",
      publishedDays: 2,
      performance: "rising",
    },
    {
      id: 2,
      title: "Next.js 14 Features: A Deep Dive into the Future",
      thumbnail: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=225&auto=format&fit=crop",
      views: "18.7K",
      likes: "956",
      comments: "67",
      avgViewDuration: "12:15",
      publishedDays: 5,
      performance: "stable",
    },
    {
      id: 3,
      title: "TypeScript Tips for Beginners: Master the Basics",
      thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=225&auto=format&fit=crop",
      views: "31.2K",
      likes: "1.8K",
      comments: "124",
      avgViewDuration: "10:33",
      publishedDays: 7,
      performance: "rising",
    },
  ];

  return (
    <div className="p-8 bg-[#0a0a0f] min-h-screen">
      {/* Channel Overview */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-white mb-6">Channel analytics</h2>
        <p className="text-gray-400 text-sm mb-1">Current subscriber count</p>
        <div className="flex items-baseline gap-2 mb-6">
          <span className="text-4xl font-bold text-white">45,273</span>
          <span className="text-green-400 text-sm">+2,543 in last 28 days</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-gray-900/60 rounded-2xl p-6 hover:bg-gray-800/60 transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <div className={`flex items-center gap-1 text-sm ${
                stat.change > 0 ? "text-green-400" : "text-red-400"
              }`}>
                {stat.change > 0 ? (
                  <ArrowUpIcon className="w-3 h-3" />
                ) : (
                  <ArrowDownIcon className="w-3 h-3" />
                )}
                <span>{Math.abs(stat.change)}%</span>
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-sm text-gray-400">{stat.label}</div>
            <div className="text-xs text-gray-500 mt-1">{stat.period}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Link href="/upload" className="group">
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl p-6 hover:from-pink-600 hover:to-purple-700 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Upload Video</h3>
                <p className="text-sm text-white/80">Share your content</p>
              </div>
              <VideoCameraIcon className="w-8 h-8 text-white/80" />
            </div>
          </div>
        </Link>

        <Link href="/go-live" className="group">
          <div className="bg-gray-900/60 rounded-2xl p-6 hover:bg-gray-800/60 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Go Live</h3>
                <p className="text-sm text-gray-400">Start streaming</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full" />
              </div>
            </div>
          </div>
        </Link>

        <Link href="/create-post" className="group">
          <div className="bg-gray-900/60 rounded-2xl p-6 hover:bg-gray-800/60 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Create Post</h3>
                <p className="text-sm text-gray-400">Engage community</p>
              </div>
              <PlusIcon className="w-8 h-8 text-gray-400" />
            </div>
          </div>
        </Link>
      </div>

      {/* Content Performance */}
      <div className="bg-gray-900/60 rounded-2xl p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Latest video performance</h2>
          <Link href="/content" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
            View all
          </Link>
        </div>

        <div className="space-y-4">
          {videos.map((video) => (
            <div
              key={video.id}
              className="flex gap-4 p-4 rounded-xl hover:bg-gray-800/50 transition-colors cursor-pointer"
            >
              {/* Thumbnail */}
              <div className="relative w-32 h-20 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 py-0.5 rounded">
                  {video.avgViewDuration}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-white mb-2 line-clamp-1">
                  {video.title}
                </h3>
                
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-1">
                    <EyeIcon className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300">{video.views}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <HeartIcon className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300">{video.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ChatBubbleLeftRightIcon className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300">{video.comments}</span>
                  </div>
                  <span className="text-gray-500">{video.publishedDays}d ago</span>
                </div>
              </div>

              {/* Performance indicator */}
              <div className="flex items-center">
                {video.performance === 'rising' ? (
                  <ArrowTrendingUpIcon className="w-5 h-5 text-green-400" />
                ) : (
                  <ArrowTrendingUpIcon className="w-5 h-5 text-gray-500" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top videos */}
        <div className="bg-gray-900/60 rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Top videos</h3>
          <div className="text-sm text-gray-400 mb-4">Last 48 hours</div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-gray-500">1</span>
                <div>
                  <p className="text-white font-medium">Building a Modern React App</p>
                  <p className="text-sm text-gray-400">23.4K views</p>
                </div>
              </div>
              <ArrowTrendingUpIcon className="w-5 h-5 text-green-400" />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-gray-500">2</span>
                <div>
                  <p className="text-white font-medium">TypeScript Tips for Beginners</p>
                  <p className="text-sm text-gray-400">19.2K views</p>
                </div>
              </div>
              <ArrowTrendingUpIcon className="w-5 h-5 text-green-400" />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-gray-500">3</span>
                <div>
                  <p className="text-white font-medium">Next.js 14 Features</p>
                  <p className="text-sm text-gray-400">15.8K views</p>
                </div>
              </div>
              <ArrowTrendingUpIcon className="w-5 h-5 text-gray-500" />
            </div>
          </div>
        </div>

        {/* Realtime Activity */}
        <div className="bg-gray-900/60 rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Realtime</h3>
          <div className="text-3xl font-bold text-white mb-2">284</div>
          <div className="text-sm text-gray-400 mb-6">Watching now</div>
          
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-400">Top location</span>
                <span className="text-white">United States</span>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-400">Top traffic source</span>
                <span className="text-white">Browse features</span>
              </div>
            </div>
            <Link href="/analytics" className="block text-center py-2 text-blue-400 hover:text-blue-300 transition-colors">
              See more in Analytics
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}