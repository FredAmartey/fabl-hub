"use client";

import { useState } from "react";
import {
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  EllipsisVerticalIcon,
  PlayIcon,
  EyeIcon,
  ChatBubbleOvalLeftIcon,
  HeartIcon,
  CurrencyDollarIcon,
  PlusIcon,
  FilmIcon,
  SparklesIcon,
  FunnelIcon,
  ArrowUpIcon,
  ClockIcon,
  ChevronDownIcon,
  DocumentTextIcon,
  CloudArrowUpIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";

const mockVideos = [
  {
    id: 1,
    title: "Building a Modern Web App with Next.js 14",
    duration: "6:25",
    status: "live",
    views: "125,632",
    comments: "234",
    likes: "3,421",
    monetization: true,
    date: "Today",
    thumbnail: "🎯",
    color: "from-purple-500 to-pink-500"
  },
  {
    id: 2,
    title: "React Server Components Explained",
    duration: "12:15",
    status: "published", 
    views: "94,234",
    comments: "189",
    likes: "2,890",
    monetization: true,
    date: "Yesterday",
    thumbnail: "⚛️",
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: 3,
    title: "TypeScript Best Practices 2024",
    duration: "8:42",
    status: "draft",
    views: "0",
    comments: "0", 
    likes: "0",
    monetization: false,
    date: "3 days ago",
    thumbnail: "📘",
    color: "from-indigo-500 to-purple-500"
  },
  {
    id: 4,
    title: "AI Integration Tutorial - Part 1",
    duration: "11:13",
    status: "scheduled",
    views: "0",
    comments: "0",
    likes: "0",
    monetization: false,
    date: "Tomorrow",
    thumbnail: "🤖",
    color: "from-emerald-500 to-teal-500"
  },
  {
    id: 5,
    title: "Live Coding: Building a SaaS Dashboard",
    duration: "1:13:45",
    status: "processing",
    views: "0",
    comments: "0",
    likes: "0",
    monetization: false,
    date: "2 hours ago",
    thumbnail: "📺",
    color: "from-amber-500 to-orange-500"
  }
];

export default function ContentPage() {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [hoveredVideo, setHoveredVideo] = useState<number | null>(null);
  const [selectedVideos, setSelectedVideos] = useState<number[]>([]);

  const toggleVideoSelection = (id: number) => {
    setSelectedVideos(prev => 
      prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 -left-48 w-96 h-96 bg-gradient-to-r from-purple-300 to-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute bottom-1/3 -right-48 w-96 h-96 bg-gradient-to-r from-blue-300 to-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-delayed"></div>
      </div>

      <div className="relative z-10 p-8 lg:p-12 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-xl opacity-50"></div>
                <div className="relative p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl">
                  <FilmIcon className="w-10 h-10 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                  Content Studio
                </h1>
                <p className="text-xl text-gray-600 font-light mt-1">Your creative playground</p>
              </div>
              <span className="text-4xl ml-4">🎬</span>
            </div>
            
            {/* Upload Button */}
            <button className="group relative transform hover:scale-105 transition-all duration-300">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-lg opacity-70 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative flex items-center gap-3 bg-white px-8 py-4 rounded-full shadow-xl">
                <CloudArrowUpIcon className="w-6 h-6 text-purple-600" />
                <span className="font-bold text-gray-900">Upload Magic</span>
                <span className="text-2xl">✨</span>
              </div>
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative group">
              <MagnifyingGlassIcon className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
              <input
                type="text"
                placeholder="Search your masterpieces..."
                className="w-full pl-14 pr-6 py-5 bg-white/80 backdrop-blur-xl rounded-2xl text-lg placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-purple-200 shadow-lg transition-all"
              />
              <div className="absolute right-5 top-1/2 transform -translate-y-1/2">
                <kbd className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium">⌘K</kbd>
              </div>
            </div>
            
            {/* Filter Buttons */}
            <div className="flex items-center gap-3">
              {["All", "Live", "Published", "Drafts"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter.toLowerCase())}
                  className={`px-6 py-3 rounded-full font-bold transition-all duration-300 ${
                    selectedFilter === filter.toLowerCase()
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg transform scale-105"
                      : "bg-white/80 text-gray-700 hover:bg-white hover:shadow-md"
                  }`}
                >
                  {filter}
                  {filter === "Live" && selectedFilter === "live" && (
                    <span className="ml-2 inline-block w-2 h-2 bg-white rounded-full animate-pulse"></span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {mockVideos.map((video) => (
            <div
              key={video.id}
              className="group relative transform hover:-translate-y-2 transition-all duration-300"
              onMouseEnter={() => setHoveredVideo(video.id)}
              onMouseLeave={() => setHoveredVideo(null)}
            >
              <div className={`absolute -inset-1 bg-gradient-to-r ${video.color} rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity`}></div>
              
              <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden shadow-xl">
                {/* Thumbnail */}
                <div className={`relative h-48 bg-gradient-to-br ${video.color} flex items-center justify-center`}>
                  <span className="text-6xl transform group-hover:scale-125 transition-transform duration-500">{video.thumbnail}</span>
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 left-4">
                    <div className={`px-4 py-2 rounded-full backdrop-blur-xl font-bold text-sm flex items-center gap-2 ${
                      video.status === 'live' 
                        ? 'bg-red-500 text-white animate-pulse' 
                        : video.status === 'published'
                        ? 'bg-emerald-500 text-white'
                        : video.status === 'scheduled'
                        ? 'bg-blue-500 text-white'
                        : video.status === 'processing'
                        ? 'bg-amber-500 text-white'
                        : 'bg-gray-500 text-white'
                    }`}>
                      {video.status === 'live' && <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>}
                      {video.status.charAt(0).toUpperCase() + video.status.slice(1)}
                    </div>
                  </div>
                  
                  {/* Duration */}
                  <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/50 backdrop-blur-xl rounded-full text-white text-sm font-medium">
                    {video.duration}
                  </div>
                  
                  {/* Hover Play */}
                  {hoveredVideo === video.id && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-500">
                        <PlayIcon className="w-10 h-10 text-gray-900 ml-2" />
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    {video.title}
                  </h3>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-3 bg-purple-50 rounded-xl">
                      <EyeIcon className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                      <p className="text-sm font-bold text-gray-900">{video.views}</p>
                      <p className="text-xs text-gray-600">views</p>
                    </div>
                    <div className="text-center p-3 bg-pink-50 rounded-xl">
                      <HeartIcon className="w-5 h-5 text-pink-600 mx-auto mb-1" />
                      <p className="text-sm font-bold text-gray-900">{video.likes}</p>
                      <p className="text-xs text-gray-600">likes</p>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-xl">
                      <ChatBubbleOvalLeftIcon className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                      <p className="text-sm font-bold text-gray-900">{video.comments}</p>
                      <p className="text-xs text-gray-600">comments</p>
                    </div>
                  </div>
                  
                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-sm text-gray-600">{video.date}</span>
                    {video.monetization ? (
                      <div className="flex items-center gap-1 text-emerald-600 font-bold">
                        <CurrencyDollarIcon className="w-5 h-5" />
                        <span className="text-sm">Monetized</span>
                      </div>
                    ) : (
                      <button className="text-sm text-purple-600 font-bold hover:underline">Enable monetization</button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Upload Card */}
          <div className="group relative transform hover:-translate-y-2 transition-all duration-300">
            <div className="absolute -inset-1 bg-gradient-to-r from-gray-300 to-gray-400 rounded-3xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div className="relative h-full min-h-[400px] bg-white/80 backdrop-blur-xl rounded-3xl border-4 border-dashed border-gray-300 flex flex-col items-center justify-center group-hover:border-purple-400 transition-colors cursor-pointer">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <CloudArrowUpIcon className="w-12 h-12 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Drop Your Next Hit</h3>
                <p className="text-gray-600 mb-6">Drag and drop or click to upload</p>
                <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1"><PhotoIcon className="w-4 h-4" /> Images</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><FilmIcon className="w-4 h-4" /> Videos</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><DocumentTextIcon className="w-4 h-4" /> Documents</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add CSS for animations */}
        <style jsx>{`
          @keyframes float {
            0%, 100% {
              transform: translateY(0) rotate(0deg);
            }
            33% {
              transform: translateY(-20px) rotate(5deg);
            }
            66% {
              transform: translateY(10px) rotate(-5deg);
            }
          }
          @keyframes float-delayed {
            0%, 100% {
              transform: translateY(0) rotate(0deg);
            }
            33% {
              transform: translateY(15px) rotate(-5deg);
            }
            66% {
              transform: translateY(-25px) rotate(5deg);
            }
          }
          .animate-float {
            animation: float 8s ease-in-out infinite;
          }
          .animate-float-delayed {
            animation: float-delayed 8s ease-in-out infinite;
            animation-delay: 2s;
          }
        `}</style>
      </div>
    </div>
  );
}