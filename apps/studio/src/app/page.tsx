"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  PlayIcon,
  EyeIcon,
  ClockIcon,
  UserGroupIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  VideoCameraIcon,
  ChartBarIcon,
  PlusIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";

export default function StudioDashboard() {
  const [timeOfDay, setTimeOfDay] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay("morning");
    else if (hour < 17) setTimeOfDay("afternoon");
    else setTimeOfDay("evening");
  }, []);

  const stats = [
    {
      label: "Views",
      value: "1.2M",
      change: 12.5,
      subtext: "Last 28 days",
      icon: EyeIcon,
    },
    {
      label: "Watch time",
      value: "847h",
      change: 8.3,
      subtext: "Last 28 days",
      icon: ClockIcon,
    },
    {
      label: "Subscribers",
      value: "45.2K",
      change: 5.7,
      subtext: "+2.5K this month",
      icon: UserGroupIcon,
    },
    {
      label: "Revenue",
      value: "$2,840",
      change: 23.1,
      subtext: "This month",
      icon: ArrowTrendingUpIcon,
    },
  ];

  const videos = [
    {
      id: 1,
      title: "Building a Modern React App",
      thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300&h=200&auto=format&fit=crop",
      views: 23456,
      impressions: 145234,
      ctr: 16.1,
      avgViewDuration: "8:23",
      publishedDays: 2,
    },
    {
      id: 2,
      title: "Next.js 14 Features Deep Dive",
      thumbnail: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=300&h=200&auto=format&fit=crop",
      views: 18732,
      impressions: 98234,
      ctr: 19.1,
      avgViewDuration: "12:15",
      publishedDays: 5,
    },
    {
      id: 3,
      title: "TypeScript Tips for Beginners",
      thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&auto=format&fit=crop",
      views: 31234,
      impressions: 178234,
      ctr: 17.5,
      avgViewDuration: "10:33",
      publishedDays: 7,
    },
  ];

  const topPerformers = [
    { title: "#javascript", type: "Tag", performance: "+40% views" },
    { title: "Tutorial Series", type: "Playlist", performance: "+28% completion" },
    { title: "8-10 PM EST", type: "Time", performance: "Peak viewing" },
    { title: "North America", type: "Region", performance: "68% audience" },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Good {timeOfDay}, Alex
        </h1>
        <p className="text-slate-400">
          Here's how your channel is performing today
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-slate-800/50 border border-slate-700 rounded-lg p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <stat.icon className="w-5 h-5 text-slate-400" />
              <div className={`flex items-center gap-1 text-sm ${
                stat.change > 0 ? "text-green-500" : "text-red-500"
              }`}>
                {stat.change > 0 ? (
                  <ArrowUpIcon className="w-3 h-3" />
                ) : (
                  <ArrowDownIcon className="w-3 h-3" />
                )}
                <span>{Math.abs(stat.change)}%</span>
              </div>
            </div>
            <div className="mb-1">
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-slate-400">{stat.label}</div>
            </div>
            <div className="text-xs text-slate-500">{stat.subtext}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Upload */}
        <Link href="/upload" className="group">
          <div className="bg-violet-600/10 border border-violet-600/30 rounded-lg p-6 hover:bg-violet-600/20 transition-colors cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <VideoCameraIcon className="w-8 h-8 text-violet-500" />
              <PlusIcon className="w-5 h-5 text-violet-500 group-hover:rotate-90 transition-transform" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">Upload video</h3>
            <p className="text-sm text-slate-400">Share your latest creation</p>
          </div>
        </Link>

        {/* Analytics */}
        <Link href="/analytics" className="group">
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:bg-slate-800 transition-colors cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <ChartBarIcon className="w-8 h-8 text-slate-400" />
              <ArrowUpIcon className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">View analytics</h3>
            <p className="text-sm text-slate-400">Deep dive into your data</p>
          </div>
        </Link>

        {/* Go Live */}
        <Link href="/live" className="group">
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:bg-slate-800 transition-colors cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="relative">
                <PlayIcon className="w-8 h-8 text-slate-400" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
              </div>
              <span className="text-xs text-red-500 font-medium">LIVE</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">Go live</h3>
            <p className="text-sm text-slate-400">Connect with your audience</p>
          </div>
        </Link>
      </div>

      {/* Content Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Videos */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold text-white mb-4">Recent uploads</h2>
          <div className="space-y-4">
            {videos.map((video) => (
              <div
                key={video.id}
                className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:bg-slate-800/70 transition-colors"
              >
                <div className="flex gap-4">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-32 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-white mb-2">{video.title}</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-slate-400">Views</span>
                        <p className="text-white font-medium">{video.views.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-slate-400">CTR</span>
                        <p className="text-white font-medium">{video.ctr}%</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Impressions</span>
                        <p className="text-white font-medium">{video.impressions.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Avg view</span>
                        <p className="text-white font-medium">{video.avgViewDuration}</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                      Published {video.publishedDays} days ago
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performers */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Top performers</h2>
          <div className="space-y-3">
            {topPerformers.map((item, index) => (
              <div
                key={index}
                className="bg-slate-800/50 border border-slate-700 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-500 uppercase">{item.type}</span>
                  <span className="text-xs text-green-500 font-medium">{item.performance}</span>
                </div>
                <p className="text-white font-medium">{item.title}</p>
              </div>
            ))}
          </div>

          {/* Channel Health */}
          <div className="mt-6 bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            <h3 className="font-medium text-white mb-3">Channel health</h3>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-slate-400">Engagement rate</span>
                  <span className="text-white">8.2%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: "82%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-slate-400">Subscriber growth</span>
                  <span className="text-white">5.7%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-violet-500 h-2 rounded-full" style={{ width: "57%" }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}