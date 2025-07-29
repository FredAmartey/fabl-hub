"use client";

import React, { useState, useEffect } from "react";
import {
  FolderIcon,
  EllipsisVerticalIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  LockClosedIcon,
  GlobeAltIcon,
  Squares2X2Icon,
  ListBulletIcon,
  FunnelIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const mockPlaylists = [
  {
    id: 1,
    title: "Web Development Complete Course",
    description: "Master modern web development with React, Next.js, TypeScript, and advanced patterns",
    videoCount: 24,
    lastUpdated: "2 days ago",
    isPublic: true,
    status: "published"
  },
  {
    id: 2,
    title: "React Advanced Patterns",
    description: "Deep dive into advanced React concepts, hooks, context, and performance optimization",
    videoCount: 16,
    lastUpdated: "5 days ago",
    isPublic: true,
    status: "published"
  },
  {
    id: 3,
    title: "TypeScript Fundamentals",
    description: "Complete guide to TypeScript from basics to advanced topics with real-world projects",
    videoCount: 18,
    lastUpdated: "1 week ago",
    isPublic: false,
    status: "draft"
  },
  {
    id: 4,
    title: "UI/UX Design Systems",
    description: "Build scalable design systems with Figma, Storybook, and modern design principles",
    videoCount: 12,
    lastUpdated: "3 days ago",
    isPublic: true,
    status: "published"
  }
];


export default function PlaylistsPage() {
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("cards");
  const [sortBy, setSortBy] = useState("performance");
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState<number | null>(null);


  const filteredPlaylists = mockPlaylists.filter(playlist => {
    if (selectedTab === "published" && playlist.status !== "published") return false;
    if (selectedTab === "drafts" && playlist.status !== "draft") return false;
    if (selectedTab === "private" && playlist.isPublic) return false;
    if (searchQuery && !playlist.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handlePlaylistClick = (playlistId: number) => {
    console.log(`Opening playlist ${playlistId}`);
    // TODO: Navigate to playlist detail page
  };

  const handleOptionsClick = (e: React.MouseEvent, playlistId: number) => {
    e.stopPropagation();
    setShowOptionsMenu(showOptionsMenu === playlistId ? null : playlistId);
  };

  // Close options menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowOptionsMenu(null);
    };

    if (showOptionsMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showOptionsMenu]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-amber-50">
      {/* Gold Animated Background with Black Hints */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-gradient-to-r from-yellow-300/25 to-amber-300/25 rounded-full mix-blend-multiply filter blur-3xl animate-float"></div>
        <div className="absolute bottom-1/3 -right-48 w-96 h-96 bg-gradient-to-r from-amber-300/25 to-yellow-400/25 rounded-full mix-blend-multiply filter blur-3xl animate-float-delayed"></div>
        {/* Black accent orbs */}
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-r from-black/8 to-gray-900/12 rounded-full mix-blend-multiply filter blur-2xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/3 w-48 h-48 bg-gradient-to-r from-gray-800/10 to-black/8 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{animationDelay: '3s'}}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header with Navigation */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <FolderIcon className="w-8 h-8 text-amber-600" />
                <h1 className="text-3xl font-bold text-gray-900">Playlists</h1>
              </div>
              <p className="text-gray-600">Organize and manage your video collections</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-600 to-yellow-700 text-white rounded-lg hover:shadow-lg transition-all"
              >
                <PlusIcon className="w-4 h-4" />
                New Playlist
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Control Bar */}
        <div className="backdrop-blur-sm rounded-2xl border border-gray-200/80 shadow-xl mb-8 p-6" style={{backgroundColor: '#F5F5F5', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)'}}>
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search & Filters */}
            <div className="flex-1">
              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                  <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search playlists by title, tag, or category..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-900 placeholder-gray-500 shadow-sm transition-all duration-200"
                    style={{backgroundColor: '#F5F5F5'}}
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors text-gray-700 font-medium"
                >
                  <FunnelIcon className="w-4 h-4" />
                  <span>Filters</span>
                </button>
              </div>
            </div>

            {/* View Controls */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
                {[
                  { key: "cards", icon: Squares2X2Icon, label: "Cards" },
                  { key: "list", icon: ListBulletIcon, label: "List" }
                ].map((mode) => (
                  <button
                    key={mode.key}
                    onClick={() => setViewMode(mode.key)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                      viewMode === mode.key
                        ? "bg-white shadow-sm text-amber-600 font-medium"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <mode.icon className="w-4 h-4" />
                    <span className="text-sm">{mode.label}</span>
                  </button>
                ))}
              </div>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-900 shadow-sm font-medium"
                style={{backgroundColor: '#F5F5F5'}}
              >
                <option value="performance">Best Performance</option>
                <option value="updated">Recently Updated</option>
                <option value="views">Most Views</option>
                <option value="created">Date Created</option>
              </select>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 mt-6 pt-6 border-t border-gray-100">
            {[
              { key: "all", label: "All Playlists", count: mockPlaylists.length },
              { key: "published", label: "Published", count: mockPlaylists.filter(p => p.status === "published").length },
              { key: "drafts", label: "Drafts", count: mockPlaylists.filter(p => p.status === "draft").length },
              { key: "private", label: "Private", count: mockPlaylists.filter(p => !p.isPublic).length }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setSelectedTab(tab.key)}
                className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 ${
                  selectedTab === tab.key
                    ? "bg-amber-100 text-amber-700 shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="backdrop-blur-sm rounded-2xl border border-gray-300/90 shadow-2xl overflow-hidden" style={{backgroundColor: '#F5F5F5', boxShadow: '0 12px 40px rgba(0, 0, 0, 0.20)'}}>
          {viewMode === "cards" ? (
            /* Simple Cards View */
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPlaylists.map((playlist) => (
                  <div key={playlist.id} className="group relative">
                    <div 
                      className="border border-gray-300 rounded-xl p-4 hover:shadow-xl hover:border-amber-400 transition-all duration-200 cursor-pointer" 
                      style={{backgroundColor: '#F5F5F5', boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)'}}
                      onClick={() => handlePlaylistClick(playlist.id)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg flex items-center justify-center border border-gray-300" style={{backgroundColor: 'rgba(17, 24, 39, 0.08)'}}>
                            <FolderIcon className="w-6 h-6 text-gray-700" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-1" style={{color: 'rgba(17, 24, 39, 0.95)'}}>{playlist.title}</h3>
                            <p className="text-sm text-gray-600">{playlist.videoCount} videos</p>
                          </div>
                        </div>
                        <div className="relative">
                          <button 
                            className="p-1 hover:bg-gray-100 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => handleOptionsClick(e, playlist.id)}
                          >
                            <EllipsisVerticalIcon className="w-4 h-4 text-gray-500" />
                          </button>
                          {showOptionsMenu === playlist.id && (
                            <div className="absolute right-0 top-8 bg-white rounded-lg shadow-xl border border-gray-200 py-2 w-48 z-50">
                              <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                Edit playlist
                              </button>
                              <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                Add videos
                              </button>
                              <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                Share playlist
                              </button>
                              <div className="border-t border-gray-100 my-1"></div>
                              <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors">
                                Delete playlist
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1">
                          {playlist.isPublic ? (
                            <>
                              <GlobeAltIcon className="w-4 h-4 text-emerald-600" />
                              <span className="text-emerald-600">Public</span>
                            </>
                          ) : (
                            <>
                              <LockClosedIcon className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-500">Private</span>
                            </>
                          )}
                        </div>
                        <span className="text-gray-500">{playlist.lastUpdated}</span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Create New Card */}
                <div 
                  onClick={() => setShowCreateModal(true)}
                  className="group cursor-pointer"
                >
                  <div className="border-2 border-dashed border-gray-400 rounded-xl p-4 hover:border-yellow-500 hover:shadow-lg transition-all duration-200 flex items-center justify-center min-h-[120px]" style={{backgroundColor: '#F5F5F5', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'}}>
                    <div className="text-center">
                      <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <PlusIcon className="w-5 h-5 text-amber-600" />
                      </div>
                      <p className="text-sm font-medium text-gray-700">New Playlist</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* List View */
            <div>
              {/* Table Header */}
              <div className="px-6 py-3 border-b border-gray-200" style={{backgroundColor: 'rgba(249, 250, 251, 0.8)'}}>
                <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
                  <div className="col-span-6">Playlist</div>
                  <div className="col-span-2">Videos</div>
                  <div className="col-span-2">Visibility</div>
                  <div className="col-span-2">Updated</div>
                </div>
              </div>

              {/* Table Rows */}
              <div className="divide-y divide-gray-100">
                {filteredPlaylists.map((playlist) => (
                  <div 
                    key={playlist.id} 
                    className="px-6 py-4 hover:bg-amber-50/30 transition-colors group cursor-pointer"
                    onClick={() => handlePlaylistClick(playlist.id)}
                  >
                    <div className="grid grid-cols-12 gap-4 items-center">
                      {/* Playlist Info */}
                      <div className="col-span-6 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 border border-gray-300" style={{backgroundColor: 'rgba(17, 24, 39, 0.08)'}}>
                          <FolderIcon className="w-5 h-5 text-gray-700" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-medium mb-1 truncate" style={{color: 'rgba(17, 24, 39, 0.95)'}}>{playlist.title}</h3>
                          <p className="text-sm text-gray-600 truncate">{playlist.description}</p>
                        </div>
                      </div>

                      {/* Video Count */}
                      <div className="col-span-2">
                        <span className="text-sm text-gray-900">{playlist.videoCount}</span>
                      </div>

                      {/* Visibility */}
                      <div className="col-span-2">
                        <div className="flex items-center gap-1">
                          {playlist.isPublic ? (
                            <>
                              <GlobeAltIcon className="w-4 h-4 text-emerald-600" />
                              <span className="text-sm text-emerald-600">Public</span>
                            </>
                          ) : (
                            <>
                              <LockClosedIcon className="w-4 h-4 text-gray-500" />
                              <span className="text-sm text-gray-500">Private</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Last Updated */}
                      <div className="col-span-2 flex items-center justify-between">
                        <span className="text-sm text-gray-600">{playlist.lastUpdated}</span>
                        <div className="relative">
                          <button 
                            className="p-1 hover:bg-gray-100 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => handleOptionsClick(e, playlist.id)}
                          >
                            <EllipsisVerticalIcon className="w-4 h-4 text-gray-500" />
                          </button>
                          {showOptionsMenu === playlist.id && (
                            <div className="absolute right-0 top-8 bg-white rounded-lg shadow-xl border border-gray-200 py-2 w-48 z-50">
                              <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                Edit playlist
                              </button>
                              <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                Add videos
                              </button>
                              <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                Share playlist
                              </button>
                              <div className="border-t border-gray-100 my-1"></div>
                              <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors">
                                Delete playlist
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty State */}
              {filteredPlaylists.length === 0 && (
                <div className="text-center py-12">
                  <FolderIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No playlists found</p>
                  <button 
                    onClick={() => setShowCreateModal(true)}
                    className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                  >
                    Create your first playlist
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Enhanced Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="rounded-3xl w-full max-w-md transform scale-95 animate-in border border-gray-400" style={{backgroundColor: '#F5F5F5', boxShadow: '0 25px 60px rgba(0, 0, 0, 0.35)'}}>
              <div className="p-8 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">Create New Playlist</h2>
                    <p className="text-gray-600">Start organizing your content</p>
                  </div>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <XMarkIcon className="w-6 h-6 text-gray-500" />
                  </button>
                </div>
              </div>
              <div className="p-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-3">
                      Playlist Title
                    </label>
                    <input
                      type="text"
                      placeholder="Enter an engaging title..."
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-900 placeholder-gray-500 shadow-sm"
                      style={{backgroundColor: '#F5F5F5'}}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-3">
                      Description
                    </label>
                    <textarea
                      placeholder="Describe what viewers can expect..."
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-900 placeholder-gray-500 shadow-sm resize-none"
                      style={{backgroundColor: '#F5F5F5'}}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-3">
                      Visibility
                    </label>
                    <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-900 shadow-sm" style={{backgroundColor: '#F5F5F5'}}>
                      <option value="public">🌍 Public - Anyone can view</option>
                      <option value="private">🔒 Private - Only you can view</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-4 mt-8 pt-6 border-t border-gray-100">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
                  >
                    Cancel
                  </button>
                  <button className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-500 text-white rounded-xl hover:from-amber-600 hover:to-amber-600 transition-all duration-200 font-semibold shadow-lg">
                    Create Playlist
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

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