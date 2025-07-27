"use client";

import { useState } from "react";
import {
  FolderPlusIcon,
  PlayIcon,
  EllipsisVerticalIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  LockClosedIcon,
  GlobeAltIcon,
  ClockIcon,
  FilmIcon,
  MusicalNoteIcon,
  SparklesIcon,
  HeartIcon,
  BookmarkIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";

const mockPlaylists = [
  {
    id: 1,
    title: "Web Development Tutorials",
    description: "Complete series on modern web development",
    videoCount: 12,
    totalDuration: "2h 34m",
    views: "45,230",
    lastUpdated: "2 days ago",
    thumbnail: "🎯",
    isPublic: true,
    color: "from-purple-500 to-pink-500"
  },
  {
    id: 2,
    title: "React Deep Dive",
    description: "Advanced React concepts and patterns",
    videoCount: 8,
    totalDuration: "1h 47m",
    views: "32,180",
    lastUpdated: "1 week ago",
    thumbnail: "⚛️",
    isPublic: true,
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: 3,
    title: "TypeScript Mastery",
    description: "From basics to advanced TypeScript",
    videoCount: 15,
    totalDuration: "3h 12m",
    views: "28,450",
    lastUpdated: "3 days ago",
    thumbnail: "📘",
    isPublic: false,
    color: "from-indigo-500 to-purple-500"
  },
  {
    id: 4,
    title: "Design Systems",
    description: "Building scalable design systems",
    videoCount: 10,
    totalDuration: "2h 15m",
    views: "19,320",
    lastUpdated: "5 days ago",
    thumbnail: "🎨",
    isPublic: true,
    color: "from-emerald-500 to-teal-500"
  }
];

export default function PlaylistsPage() {
  const [hoveredPlaylist, setHoveredPlaylist] = useState<number | null>(null);
  const [selectedFilter, setSelectedFilter] = useState("all");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 -left-48 w-96 h-96 bg-gradient-to-r from-indigo-300 to-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute bottom-1/3 -right-48 w-96 h-96 bg-gradient-to-r from-pink-300 to-rose-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-delayed"></div>
      </div>

      <div className="relative z-10 p-8 lg:p-12 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl blur-xl opacity-50"></div>
                <div className="relative p-4 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-3xl">
                  <FolderPlusIcon className="w-10 h-10 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                  Playlist Paradise
                </h1>
                <p className="text-xl text-gray-600 font-light mt-1">Curate your masterpiece collections</p>
              </div>
              <span className="text-4xl ml-4">🎵</span>
            </div>
            
            {/* Create Button */}
            <button className="group relative transform hover:scale-105 transition-all duration-300">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full blur-lg opacity-70 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative flex items-center gap-3 bg-white px-8 py-4 rounded-full shadow-xl">
                <PlusIcon className="w-6 h-6 text-indigo-600" />
                <span className="font-bold text-gray-900">Create Playlist</span>
                <span className="text-2xl">🎭</span>
              </div>
            </button>
          </div>
        </div>

        {/* Search and Stats Row */}
        <div className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Search Bar */}
            <div className="lg:col-span-2">
              <div className="relative group">
                <MagnifyingGlassIcon className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                <input
                  type="text"
                  placeholder="Search your collections..."
                  className="w-full pl-14 pr-6 py-5 bg-white/80 backdrop-blur-xl rounded-2xl text-lg placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-purple-200 shadow-lg transition-all"
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <AdjustmentsHorizontalIcon className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 text-center shadow-lg">
                <p className="text-2xl font-black text-purple-600">{mockPlaylists.length}</p>
                <p className="text-xs text-gray-600 mt-1">Playlists</p>
              </div>
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 text-center shadow-lg">
                <p className="text-2xl font-black text-blue-600">45</p>
                <p className="text-xs text-gray-600 mt-1">Videos</p>
              </div>
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 text-center shadow-lg">
                <p className="text-2xl font-black text-emerald-600">125K</p>
                <p className="text-xs text-gray-600 mt-1">Views</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            {["All", "Public", "Private", "Favorites"].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter.toLowerCase())}
                className={`px-6 py-3 rounded-full font-bold transition-all duration-300 ${
                  selectedFilter === filter.toLowerCase()
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg transform scale-105"
                    : "bg-white/80 text-gray-700 hover:bg-white hover:shadow-md"
                }`}
              >
                {filter}
                {filter === "Favorites" && (
                  <HeartIcon className="inline-block w-4 h-4 ml-2" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Playlists Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockPlaylists.map((playlist) => (
            <div
              key={playlist.id}
              className="group relative transform hover:-translate-y-2 transition-all duration-300"
              onMouseEnter={() => setHoveredPlaylist(playlist.id)}
              onMouseLeave={() => setHoveredPlaylist(null)}
            >
              <div className={`absolute -inset-1 bg-gradient-to-r ${playlist.color} rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity`}></div>
              
              <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden shadow-xl">
                {/* Thumbnail Area */}
                <div className={`relative h-48 bg-gradient-to-br ${playlist.color} p-6`}>
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-4 right-4 w-24 h-24 bg-white/20 rounded-full"></div>
                    <div className="absolute bottom-4 left-4 w-32 h-32 bg-white/10 rounded-full"></div>
                  </div>
                  
                  <div className="relative z-10 flex flex-col justify-between h-full">
                    <div className="flex items-start justify-between">
                      <span className="text-5xl transform group-hover:scale-110 transition-transform duration-500">
                        {playlist.thumbnail}
                      </span>
                      <div className={`px-3 py-1.5 rounded-full backdrop-blur-xl font-bold text-sm flex items-center gap-2 ${
                        playlist.isPublic 
                          ? 'bg-white/30 text-white' 
                          : 'bg-black/30 text-white'
                      }`}>
                        {playlist.isPublic ? (
                          <>
                            <GlobeAltIcon className="w-4 h-4" />
                            <span>Public</span>
                          </>
                        ) : (
                          <>
                            <LockClosedIcon className="w-4 h-4" />
                            <span>Private</span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-white/90">
                      <div className="flex items-center gap-1">
                        <FilmIcon className="w-4 h-4" />
                        <span className="text-sm font-bold">{playlist.videoCount} videos</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ClockIcon className="w-4 h-4" />
                        <span className="text-sm font-bold">{playlist.totalDuration}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Hover Play Button */}
                  {hoveredPlaylist === playlist.id && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-500">
                        <PlayIcon className="w-10 h-10 text-gray-900 ml-2" />
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900 pr-2">
                      {playlist.title}
                    </h3>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                      <EllipsisVerticalIcon className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {playlist.description}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <EyeIcon className="w-5 h-5 text-gray-600" />
                      <span className="text-sm font-bold text-gray-900">{playlist.views} views</span>
                    </div>
                    <span className="text-sm text-gray-500">Updated {playlist.lastUpdated}</span>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 mt-4">
                    <button className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-lg transition-all">
                      Play All
                    </button>
                    <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                      <BookmarkIcon className="w-5 h-5 text-gray-700" />
                    </button>
                    <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                      <HeartIcon className="w-5 h-5 text-gray-700" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Create New Playlist Card */}
          <div className="group relative transform hover:-translate-y-2 transition-all duration-300">
            <div className="absolute -inset-1 bg-gradient-to-r from-gray-300 to-gray-400 rounded-3xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div className="relative h-full min-h-[460px] bg-white/80 backdrop-blur-xl rounded-3xl border-4 border-dashed border-gray-300 flex flex-col items-center justify-center group-hover:border-purple-400 transition-colors cursor-pointer">
              <div className="text-center p-8">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <PlusIcon className="w-12 h-12 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Create New Playlist</h3>
                <p className="text-gray-600 mb-4">Organize your videos into collections</p>
                <div className="flex items-center justify-center gap-3 text-4xl">
                  <span className="transform hover:scale-125 transition-transform cursor-pointer">🎵</span>
                  <span className="transform hover:scale-125 transition-transform cursor-pointer">🎬</span>
                  <span className="transform hover:scale-125 transition-transform cursor-pointer">🎨</span>
                  <span className="transform hover:scale-125 transition-transform cursor-pointer">📚</span>
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