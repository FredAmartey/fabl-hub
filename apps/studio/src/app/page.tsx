"use client";

import { useState, useEffect } from "react";
import {
  PlayIcon,
  EyeIcon,
  ArrowTrendingUpIcon,
  ChartBarIcon,
  UserGroupIcon,
  SparklesIcon,
  VideoCameraIcon,
  CursorArrowRaysIcon,
  FireIcon,
  CurrencyDollarIcon,
  EllipsisVerticalIcon,
  ClockIcon,
  BellIcon,
  RocketLaunchIcon,
  CalendarDaysIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  ShareIcon,
  PlusIcon,
  CogIcon,
} from "@heroicons/react/24/outline";
import { useUpload } from "../contexts/UploadContext";

export default function StudioDashboard() {
  const { openUploadModal } = useUpload();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-pink-50"
      onMouseMove={handleMouseMove}
    >
      {/* Dynamic Gradient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-[600px] h-[600px] rounded-full opacity-40"
          style={{
            background: "radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, transparent 70%)",
            left: `${mousePosition.x * 0.5}%`,
            top: `${mousePosition.y * 0.5}%`,
            transform: "translate(-50%, -50%)",
            transition: "all 0.3s ease-out",
          }}
        />
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-gradient-to-r from-violet-300 to-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute top-3/4 -right-48 w-96 h-96 bg-gradient-to-r from-blue-300 to-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-delayed"></div>
      </div>

      <div className="relative z-10 p-6 max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-3">
                Welcome back,{" "}
                <span className="bg-gradient-to-br from-pink-500 via-pink-400 to-amber-300 bg-clip-text text-transparent">
                  Creator
                </span>{" "}
                👋
              </h1>
              <p className="text-xl text-gray-600">
                Here's what's happening with your content today
              </p>
            </div>
            <div className="flex items-center gap-3 bg-white/60 backdrop-blur-xl rounded-2xl px-6 py-3 border border-white/50">
              <ClockIcon className="w-6 h-6 text-gray-500" />
              <span className="text-lg text-gray-700 font-medium">
                {currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          </div>
        </div>

        {/* Layout Container */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* First Row - Stats Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
            {/* Current Subscribers - Small */}
            <div>
              <div
                className="group relative h-48 transform hover:-translate-y-1 transition-all duration-300"
                onMouseEnter={() => setHoveredCard("subscribers")}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-3xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
                <div className="relative h-full bg-white/70 backdrop-blur-xl rounded-3xl p-6 border border-white/50 overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-blue-200 to-cyan-200 rounded-full -translate-y-10 translate-x-10 opacity-50"></div>

                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-blue-500 rounded-xl">
                        <UserGroupIcon className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-base font-medium text-gray-600">Current subscribers</span>
                    </div>
                    <div>
                      <p className="text-5xl font-black text-gray-900 mb-2">1,247</p>
                      <p className="text-green-600 text-base font-semibold">+127 in last 28 days</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Views (Last 28 Days) - Small */}
            <div>
              <div
                className="group relative h-48 transform hover:-translate-y-1 transition-all duration-300"
                onMouseEnter={() => setHoveredCard("views")}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-400 rounded-3xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
                <div className="relative h-full bg-white/70 backdrop-blur-xl rounded-3xl p-6 border border-white/50 overflow-hidden">
                  <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-purple-200 to-pink-200 rounded-full translate-y-10 -translate-x-10 opacity-50"></div>

                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-purple-500 rounded-xl">
                        <EyeIcon className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-base font-medium text-gray-600">Views</span>
                    </div>
                    <div>
                      <p className="text-5xl font-black text-gray-900 mb-2">12.4K</p>
                      <p className="text-green-600 text-base font-semibold">+2.3K in last 28 days</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Watch Time - Small */}
            <div>
              <div
                className="group relative h-48 transform hover:-translate-y-1 transition-all duration-300"
                onMouseEnter={() => setHoveredCard("watchtime")}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-3xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
                <div className="relative h-full bg-white/70 backdrop-blur-xl rounded-3xl p-6 border border-white/50 overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-200 to-teal-200 rounded-full -translate-y-12 translate-x-12 opacity-50"></div>

                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-emerald-500 rounded-xl">
                        <ClockIcon className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-base font-medium text-gray-600">Watch time (hours)</span>
                    </div>
                    <div>
                      <p className="text-5xl font-black text-gray-900 mb-2">847</p>
                      <p className="text-green-600 text-base font-semibold">
                        +156 hours in last 28 days
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions - Small */}
            <div>
              <div
                className="group relative h-48 transform hover:-translate-y-1 transition-all duration-300"
                onMouseEnter={() => setHoveredCard("actions")}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-violet-400 to-purple-400 rounded-3xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
                <div className="relative h-full bg-white/70 backdrop-blur-xl rounded-3xl p-5 border border-white/50 overflow-hidden">
                  <div className="h-full flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="flex-1 flex flex-col justify-center space-y-3 min-h-0">
                      <button 
                        onClick={openUploadModal}
                        className="w-full flex items-center gap-3 p-2.5 bg-white/50 hover:bg-white/70 rounded-xl transition-colors text-left hover:shadow-md"
                      >
                        <div className="p-2 bg-violet-500 rounded-lg flex-shrink-0">
                          <RocketLaunchIcon className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm font-medium text-gray-700 truncate">
                          Upload Video
                        </span>
                      </button>
                      <button className="w-full flex items-center gap-3 p-2.5 bg-white/50 hover:bg-white/70 rounded-xl transition-colors text-left">
                        <div className="p-2 bg-blue-500 rounded-lg flex-shrink-0">
                          <CalendarDaysIcon className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm font-medium text-gray-700 truncate">
                          Schedule Post
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '2fr 1fr', 
            gridTemplateRows: 'auto auto',
            gridTemplateAreas: `
              "videos creator-insider"
              "bottom-cards creator-insider"
            `,
            gap: '1.5rem'
          }}>
            {/* Top Videos */}
            <div style={{ gridArea: 'videos' }}>
              <div
                className="group relative transform hover:-translate-y-1 transition-all duration-300"
                onMouseEnter={() => setHoveredCard("top-content")}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-pink-200 to-pink-300 rounded-3xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
                <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl p-6 border border-white/50">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Top videos</h3>
                      <p className="text-sm text-gray-600">Last 48 hours · Views</p>
                    </div>
                    <button className="text-purple-600 hover:text-purple-700 font-medium text-base">
                      Go to channel analytics
                    </button>
                  </div>

                  <div className="space-y-4">
                    {[
                      { title: "Best support builds Season 14", views: "2.1K views", metric: "Most watched", rank: "#1" },
                      { title: "Garen R cast time", views: "1.2K views", metric: "High engagement", rank: "#2" },
                      { title: "How to ward baron properly", views: "847 views", metric: "Rising fast", rank: "#3" },
                    ].map((video, i) => (
                      <div
                        key={i}
                        className="group/video bg-white/50 hover:bg-white/70 rounded-2xl p-5 transition-all cursor-pointer hover:shadow-md"
                      >
                        <div className="flex items-start gap-4">
                          <div className="relative flex-shrink-0">
                            <div className="w-20 h-14 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
                              <PlayIcon className="w-6 h-6 text-gray-500" />
                            </div>
                            <div className="absolute -top-2 -left-2 w-6 h-6 bg-pink-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                              {video.rank}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 text-lg leading-tight group-hover/video:text-pink-600 transition-colors">
                              {video.title}
                            </h4>
                            <div className="flex items-center gap-4 mt-1">
                              <p className="text-base text-gray-600">{video.views}</p>
                              <p className="text-sm text-blue-600 font-medium">{video.metric}</p>
                            </div>
                          </div>
                          <div className="opacity-0 group-hover/video:opacity-100 transition-opacity">
                            <button className="p-2 hover:bg-pink-100 rounded-lg transition-colors" title="View Analytics">
                              <ChartBarIcon className="w-5 h-5 text-gray-500" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row Cards */}
            <div style={{ gridArea: 'bottom-cards', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              {/* Recent Subscribers */}
              <div
                className="group relative h-80 transform hover:-translate-y-1 transition-all duration-300"
                onMouseEnter={() => setHoveredCard("recent-subscribers")}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-400 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <div className="relative h-full bg-white/70 backdrop-blur-xl rounded-3xl p-6 border border-white/50">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Recent subscribers</h3>
                      <p className="text-sm text-gray-600">Lifetime</p>
                    </div>
                    <button className="text-purple-600 hover:text-purple-700 font-medium text-sm">
                      See all
                    </button>
                  </div>

                  <div className="space-y-2">
                    {[
                      { name: "kingaslan619", subscribers: "0 subscribers", avatar: "KA" },
                      { name: "Koby Quagraine", subscribers: "1 subscriber", avatar: "KQ" },
                      { name: "Sarah Chen", subscribers: "12 subscribers", avatar: "SC" },
                    ].map((subscriber, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-3 bg-white/40 rounded-xl hover:bg-white/60 transition-colors cursor-pointer"
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                          {subscriber.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-semibold text-gray-900">{subscriber.name}</p>
                          <p className="text-sm text-gray-600">{subscriber.subscribers}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Latest Comments */}
              <div
                className="group relative h-80 transform hover:-translate-y-1 transition-all duration-300"
                onMouseEnter={() => setHoveredCard("comments")}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-400 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <div className="relative h-full bg-white/70 backdrop-blur-xl rounded-3xl p-6 border border-white/50">
                  <div className="h-full flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">Latest comments</h3>
                        <p className="text-sm text-gray-600">
                          Channel comments I haven't responded to
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 flex-1 overflow-hidden">
                      {[
                        {
                          user: "@alessiapinelli",
                          text: "This looks tilting asf",
                          time: "1 day ago",
                          avatar: "AP",
                        },
                        {
                          user: "@mikejones",
                          text: "Great tutorial! When's the next part coming?",
                          time: "2 days ago",
                          avatar: "MJ",
                        },
                        {
                          user: "@gamerpro",
                          text: "Amazing content as always! Keep it up 🔥",
                          time: "3 days ago",
                          avatar: "GP",
                        },
                      ].map((comment, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-3 p-3 bg-white/40 rounded-xl hover:bg-white/60 transition-colors cursor-pointer"
                        >
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {comment.avatar}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-sm font-semibold text-gray-900">{comment.user}</p>
                              <span className="text-xs text-gray-500">•</span>
                              <p className="text-xs text-gray-500">{comment.time}</p>
                            </div>
                            <p className="text-sm text-gray-700 leading-tight">{comment.text}</p>
                          </div>
                        </div>
                      ))}
                      <button className="w-full text-center text-purple-600 hover:text-purple-700 font-medium text-sm py-2">
                        View more
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Revenue and Creator Insider Combined */}
            <div style={{ gridArea: 'creator-insider', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Revenue Overview */}
              <div
                className="group relative h-64 transform hover:-translate-y-1 transition-all duration-300"
                onMouseEnter={() => setHoveredCard("revenue")}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-amber-400 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <div className="relative h-full bg-white/70 backdrop-blur-xl rounded-3xl p-6 border border-white/50 overflow-hidden">
                  <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-yellow-200 to-amber-200 rounded-full -translate-y-8 -translate-x-8 opacity-50"></div>

                  <div className="relative z-10 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">Revenue</h3>
                        <p className="text-sm text-gray-600">Last 28 days</p>
                      </div>
                      <div className="p-3 bg-yellow-500 rounded-xl">
                        <CurrencyDollarIcon className="w-6 h-6 text-white" />
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col justify-center">
                      <p className="text-4xl font-black text-gray-900 mb-2">$23.47</p>
                      <p className="text-green-600 text-base font-semibold mb-4">
                        +$8.12 from last month
                      </p>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Ad revenue</span>
                          <span className="text-sm font-semibold text-gray-900">$18.30</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Memberships</span>
                          <span className="text-sm font-semibold text-gray-900">$5.17</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Creator Insider */}
              <div
                className="group relative flex-1 transform hover:-translate-y-1 transition-all duration-300"
                onMouseEnter={() => setHoveredCard("creator-news")}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <div className="relative h-full bg-white/70 backdrop-blur-xl rounded-3xl p-6 border border-white/50">
                  <div className="h-full flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">Creator Insider</h3>
                        <p className="text-sm text-gray-600">Latest updates and news for creators</p>
                      </div>
                    </div>

                    <div className="space-y-4 flex-1 overflow-hidden">
                      <div className="p-4 bg-white/40 rounded-xl">
                        <h4 className="font-semibold text-gray-900 mb-2">Fabl News Flash</h4>
                        <p className="text-sm text-gray-700 mb-3">
                          New AI-powered thumbnails and monetization updates.
                        </p>
                        <button className="text-purple-600 hover:text-purple-700 font-medium text-sm">
                          Watch on Fabl
                        </button>
                      </div>
                      <div className="p-4 bg-white/40 rounded-xl">
                        <h4 className="font-semibold text-gray-900 mb-2">What's new in Studio</h4>
                        <p className="text-sm text-gray-700 mb-3">
                          Enhanced editor, analytics, and collaboration features.
                        </p>
                        <button className="text-purple-600 hover:text-purple-700 font-medium text-sm">
                          Explore features
                        </button>
                      </div>
                      <div className="p-4 bg-white/40 rounded-xl">
                        <h4 className="font-semibold text-gray-900 mb-2">Community Guidelines</h4>
                        <p className="text-sm text-gray-700 mb-3">
                          Updated policies on content moderation.
                        </p>
                        <button className="text-purple-600 hover:text-purple-700 font-medium text-sm">
                          Review changes
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}