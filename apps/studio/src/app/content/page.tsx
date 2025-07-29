"use client";

import { useState, useEffect, useRef } from "react";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  CloudArrowUpIcon,
  FilmIcon,
  PlayIcon,
  EyeIcon,
  ChatBubbleOvalLeftIcon,
  HeartIcon,
  CurrencyDollarIcon,
  Squares2X2Icon,
  ListBulletIcon,
  CalendarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  XMarkIcon,
  LockClosedIcon,
  EllipsisVerticalIcon,
  ChartBarIcon,
  PencilIcon,
  LinkIcon,
  ArrowDownTrayIcon,
  TrashIcon,
  ArrowTopRightOnSquareIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

// Generate more realistic video data
const generateMockVideos = () => {
  const titles = [
    "Building a Modern Web App with Next.js 14",
    "React Server Components Explained",
    "TypeScript Best Practices 2024",
    "AI Integration Tutorial - Part 1",
    "Live Coding: Building a SaaS Dashboard",
    "Understanding React Hooks Deep Dive",
    "GraphQL vs REST API: Complete Comparison",
    "Microservices Architecture Pattern",
    "Docker and Kubernetes for Beginners",
    "Advanced CSS Grid Techniques",
    "Vue.js 3 Composition API Tutorial",
    "Building Real-time Apps with WebSockets",
    "Node.js Performance Optimization",
    "MongoDB Schema Design Patterns",
    "AWS Lambda Functions Guide",
    "Testing React Applications",
    "CI/CD Pipeline with GitHub Actions",
    "Flutter Mobile App Development",
    "Rust Programming Language Basics",
    "Web Security Best Practices",
    "Machine Learning with TensorFlow.js",
    "Blockchain Development Tutorial",
    "Progressive Web Apps (PWA) Guide",
    "Svelte vs React Performance",
    "Redis Caching Strategies",
    "PostgreSQL Advanced Queries",
    "Deno vs Node.js Comparison",
    "Angular Universal SSR",
    "Web Assembly Introduction",
    "Python FastAPI Tutorial",
    "React Native Navigation",
    "Tailwind CSS Advanced Tips",
    "JAMstack Architecture",
    "Serverless Functions Deep Dive",
    "Git Advanced Workflows",
    "OAuth 2.0 Implementation",
    "WebRTC Video Calling App",
    "Elasticsearch Full Text Search",
    "Kafka Event Streaming",
    "gRPC Microservices Communication"
  ];

  const statuses = ["public", "public", "public", "unlisted", "private", "scheduled", "draft"];
  
  return titles.map((title, index) => {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const isPublished = status === "public" || status === "unlisted";
    const views = isPublished ? Math.floor(Math.random() * 500000) : 0;
    const likes = isPublished ? Math.floor(views * (Math.random() * 0.1)) : 0;
    const dislikes = isPublished ? Math.floor(likes * (Math.random() * 0.05)) : 0;
    const comments = isPublished ? Math.floor(likes * (Math.random() * 0.3)) : 0;
    
    return {
      id: index + 1,
      title,
      duration: `${Math.floor(Math.random() * 20)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      status,
      views: views.toLocaleString(),
      comments: comments.toString(),
      likes,
      dislikes,
      monetization: isPublished && Math.random() > 0.3,
      date: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000).toLocaleDateString(),
      thumbnail: "/api/placeholder/120/68"
    };
  });
};

const mockVideos = generateMockVideos();

export default function ContentPage() {
  const [selectedVideos, setSelectedVideos] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("list");
  const [showFilters, setShowFilters] = useState(false);
  const [visibilityFilter, setVisibilityFilter] = useState("all");
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{[key: number]: 'down' | 'up'}>({});
  const [currentPage, setCurrentPage] = useState(1);
  const videosPerPage = 10;
  const filtersRef = useRef<HTMLDivElement>(null);

  // Close filters and dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filtersRef.current && !filtersRef.current.contains(event.target as Node)) {
        setShowFilters(false);
      }
      // Close dropdown if clicking outside
      if (activeDropdown !== null) {
        const target = event.target as Element;
        if (!target.closest('.dropdown-container')) {
          setActiveDropdown(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeDropdown]);

  const toggleVideoSelection = (id: number) => {
    setSelectedVideos(prev => 
      prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    const currentPageVideoIds = paginatedVideos.map(video => video.id);
    const allSelected = currentPageVideoIds.every(id => selectedVideos.includes(id));
    
    if (allSelected) {
      setSelectedVideos(selectedVideos.filter(id => !currentPageVideoIds.includes(id)));
    } else {
      setSelectedVideos([...new Set([...selectedVideos, ...currentPageVideoIds])]);
    }
  };

  const filteredVideos = mockVideos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVisibility = visibilityFilter === "all" || video.status === visibilityFilter;
    return matchesSearch && matchesVisibility;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredVideos.length / videosPerPage);
  const startIndex = (currentPage - 1) * videosPerPage;
  const endIndex = startIndex + videosPerPage;
  const paginatedVideos = filteredVideos.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, visibilityFilter]);

  // Reset dropdown when changing pages
  useEffect(() => {
    setActiveDropdown(null);
  }, [currentPage]);

  const handleVideoClick = (videoId: number) => {
    console.log('Video clicked:', videoId);
    // TODO: Navigate to video edit page or show video details
  };

  const handleUploadClick = () => {
    // Trigger the upload modal from the parent StudioLayout
    const uploadButton = document.querySelector('[data-upload-trigger]') as HTMLButtonElement;
    if (uploadButton) {
      uploadButton.click();
    } else {
      // Fallback: dispatch a custom event that StudioLayout can listen to
      window.dispatchEvent(new CustomEvent('openUploadModal'));
    }
  };

  const handleDropdownToggle = (videoId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (activeDropdown === videoId) {
      setActiveDropdown(null);
      return;
    }
    
    // Calculate if there's enough space below for the dropdown
    const button = event.currentTarget as HTMLElement;
    const buttonRect = button.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const dropdownHeight = 250; // More accurate dropdown height (includes padding and all items)
    const safetyMargin = 20; // Add some margin to ensure full visibility
    
    const spaceBelow = viewportHeight - buttonRect.bottom - safetyMargin;
    const spaceAbove = buttonRect.top - safetyMargin;
    
    // Prefer opening downward unless there's clearly not enough space
    // Only switch to upward if there's more space above AND not enough below
    const position = spaceBelow < dropdownHeight && spaceAbove > spaceBelow ? 'up' : 'down';
    
    setDropdownPosition(prev => ({ ...prev, [videoId]: position }));
    setActiveDropdown(videoId);
  };

  const handleVideoAction = (videoId: number, action: string) => {
    setActiveDropdown(null);
    console.log(`${action} for video ${videoId}`);
    
    switch (action) {
      case 'analytics':
        // Navigate to video analytics
        alert(`Navigate to video ${videoId} analytics`);
        break;
      case 'comments':
        // Navigate to video comments
        alert(`Navigate to video ${videoId} comments`);
        break;
      case 'view-hub':
        // Open video on hub in new tab
        window.open(`/hub/video/${videoId}`, '_blank');
        break;
      case 'edit':
        // Open title & description editor
        alert(`Edit title & description for video ${videoId}`);
        break;
      case 'share':
        // Copy shareable link
        navigator.clipboard.writeText(`${window.location.origin}/hub/video/${videoId}`);
        alert('Shareable link copied to clipboard!');
        break;
      case 'download':
        // Download video
        alert(`Download video ${videoId}`);
        break;
      case 'delete':
        // Delete video with confirmation
        if (confirm('Are you sure you want to delete this video?')) {
          alert(`Delete video ${videoId}`);
        }
        break;
    }
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "public":
        return { label: "PUBLIC", color: "bg-green-500/20 text-green-300", icon: CheckCircleIcon };
      case "unlisted":
        return { label: "UNLISTED", color: "bg-orange-500/20 text-orange-300", icon: EyeIcon };
      case "private":
        return { label: "PRIVATE", color: "bg-gray-500/20 text-gray-300", icon: LockClosedIcon };
      case "scheduled":
        return { label: "SCHEDULED", color: "bg-blue-500/20 text-blue-300", icon: CalendarIcon };
      case "draft":
        return { label: "DRAFT", color: "bg-purple-500/20 text-purple-300", icon: ClockIcon };
      default:
        return { label: status.toUpperCase(), color: "bg-gray-500/20 text-gray-300", icon: XMarkIcon };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-200 to-violet-300">
      {/* Ethereal Galaxy Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Galaxy center */}
        <div className="absolute top-1/2 left-1/2 w-[800px] h-[600px] galaxy-core rounded-full filter blur-3xl animate-pulse" style={{transform: 'translate(-50%, -50%)', animationDuration: '12s'}}></div>
        
        {/* Nebula clouds */}
        <div className="absolute top-1/6 right-1/4 w-[500px] h-[400px] bg-gradient-to-r from-violet-300/25 to-purple-400/20 rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{animationDuration: '15s'}}></div>
        <div className="absolute bottom-1/4 left-1/5 w-[400px] h-[500px] bg-gradient-to-r from-purple-400/20 to-indigo-300/15 rounded-full mix-blend-multiply filter blur-3xl animate-float-delayed" style={{animationDuration: '18s'}}></div>
        
        
        {/* Cosmic dust streams */}
        <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-violet-300/30 to-transparent transform rotate-12"></div>
        <div className="absolute bottom-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-300/25 to-transparent transform -rotate-12"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <PlayIcon className="w-8 h-8 text-purple-600" />
                <h1 className="text-3xl font-bold text-gray-900">Content</h1>
              </div>
              <p className="text-gray-600">Manage your videos and creative content</p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={handleUploadClick}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg transition-all font-medium shadow-lg"
              >
                <CloudArrowUpIcon className="w-4 h-4" />
                Upload Video
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Control Bar */}
        <div className="flex items-center gap-5 mb-10">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-600 stroke-2" />
              </div>
              <input
                type="text"
                placeholder="Search your content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white/60 backdrop-blur-xl border border-white/40 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 text-gray-900 placeholder-gray-600 shadow-lg transition-all duration-200"
              />
            </div>
          </div>

          {/* Filters Button */}
          <div className="relative" ref={filtersRef}>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-6 py-3.5 bg-white/60 backdrop-blur-xl border border-white/40 rounded-xl hover:bg-white/70 transition-colors text-gray-900 font-medium shadow-lg"
            >
              <FunnelIcon className="w-5 h-5" />
              <span>Filters</span>
            </button>
            
            {showFilters && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white backdrop-blur-xl border border-gray-300 rounded-xl shadow-xl z-20">
                <div className="p-4">
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-900 mb-2">Filter by Visibility</label>
                    <select 
                      value={visibilityFilter}
                      onChange={(e) => setVisibilityFilter(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-sm"
                    >
                      <option value="all">All Videos</option>
                      <option value="public">Public</option>
                      <option value="unlisted">Unlisted</option>
                      <option value="private">Private</option>
                      <option value="draft">Draft</option>
                      <option value="scheduled">Scheduled</option>
                    </select>
                  </div>
                  <button 
                    onClick={() => {
                      setVisibilityFilter("all");
                      setShowFilters(false);
                    }}
                    className="w-full px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* View Controls */}
          <div className="flex items-center gap-1 bg-white/60 backdrop-blur-xl rounded-xl p-1 border border-white/40 shadow-lg">
            {[
              { key: "list", icon: ListBulletIcon },
              { key: "grid", icon: Squares2X2Icon }
            ].map((mode) => (
              <button
                key={mode.key}
                onClick={() => setViewMode(mode.key)}
                className={`p-3.5 rounded-lg transition-all duration-200 ${
                  viewMode === mode.key
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg" 
                    : "text-gray-700 hover:text-gray-900 hover:bg-white/40"
                }`}
              >
                <mode.icon className="w-4 h-4" />
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="backdrop-blur-xl rounded-2xl border border-white/40 shadow-2xl overflow-hidden" style={{backgroundColor: 'rgba(255, 255, 255, 0.2)', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)'}}>
          {viewMode === "list" ? (
            /* List View */
            <div>
              {/* Table Header */}
              <div className="px-6 py-6 border-b border-white/30 backdrop-blur-xl" style={{backgroundColor: 'rgba(255, 255, 255, 0.25)', backdropFilter: 'blur(20px)'}}>
                <div className="grid grid-cols-12 gap-3 text-sm font-medium text-gray-700">
                  <div className="col-span-1 flex justify-start">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={paginatedVideos.length > 0 && paginatedVideos.every(video => selectedVideos.includes(video.id))}
                        onChange={toggleSelectAll}
                        className="sr-only"
                      />
                      <div 
                        onClick={toggleSelectAll}
                        className={`w-5 h-5 rounded-md border-2 cursor-pointer transition-all flex items-center justify-center ${
                          paginatedVideos.length > 0 && paginatedVideos.every(video => selectedVideos.includes(video.id))
                            ? 'border-purple-500 bg-gradient-to-r from-purple-500 to-pink-500'
                            : 'border-gray-400 bg-white/20 backdrop-blur-sm hover:border-purple-400'
                        }`}
                      >
                        <svg className={`w-3 h-3 text-white transition-opacity ${
                          paginatedVideos.length > 0 && paginatedVideos.every(video => selectedVideos.includes(video.id)) ? 'opacity-100' : 'opacity-0'
                        }`} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-5 -ml-4">Video</div>
                  <div className="col-span-1">Visibility</div>
                  <div className="col-span-1">Views</div>
                  <div className="col-span-1">Comments</div>
                  <div className="col-span-2">Likes (vs. dislikes)</div>
                  <div className="col-span-1">Date</div>
                </div>
              </div>

              {/* Video Rows */}
              <div className="divide-y divide-white/10">
                {paginatedVideos.map((video) => {
                  const statusDisplay = getStatusDisplay(video.status);
                  const StatusIcon = statusDisplay.icon;
                  
                  return (
                    <div 
                      key={video.id} 
                      className={`px-6 py-4 transition-all duration-300 group ${
                        activeDropdown !== null
                          ? activeDropdown === video.id ? 'backdrop-blur-sm bg-white/10' : ''
                          : 'hover:backdrop-blur-sm hover:bg-white/10'
                      }`}
                    >
                      <div className="grid grid-cols-12 gap-3 items-center">
                        {/* Checkbox */}
                        <div className="col-span-1 flex justify-start">
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={selectedVideos.includes(video.id)}
                              onChange={() => toggleVideoSelection(video.id)}
                              className="sr-only"
                            />
                            <div 
                              onClick={() => toggleVideoSelection(video.id)}
                              className={`w-5 h-5 rounded-md border-2 cursor-pointer transition-all flex items-center justify-center ${
                                selectedVideos.includes(video.id)
                                  ? 'border-purple-500 bg-gradient-to-r from-purple-500 to-pink-500'
                                  : 'border-gray-400 bg-white/20 backdrop-blur-sm hover:border-purple-400'
                              }`}
                            >
                              <svg className={`w-3 h-3 text-white transition-opacity ${
                                selectedVideos.includes(video.id) ? 'opacity-100' : 'opacity-0'
                              }`} fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        </div>

                        {/* Video Info */}
                        <div className="col-span-5 -ml-4 flex items-center gap-3">
                          <div className="relative w-32 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center overflow-hidden border border-white/30 shadow-sm">
                            <FilmIcon className="w-10 h-10 text-gray-600" />
                            <div className="absolute bottom-1 right-1 bg-black/90 text-white text-xs px-1.5 py-0.5 rounded font-medium">
                              {video.duration}
                            </div>
                            {/* Monetization indicator on thumbnail */}
                            {video.monetization && (
                              <div className="absolute top-1 left-1 bg-green-500/90 p-1 rounded-full" title="Monetized">
                                <CurrencyDollarIcon className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 
                              className="font-medium text-gray-900 hover:text-purple-600 transition-colors cursor-pointer"
                              onClick={() => handleVideoClick(video.id)}
                            >
                              {video.title}
                            </h3>
                            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                              <span>PUBLIC</span>
                              <span>•</span>
                              <span>HD</span>
                              {video.monetization && (
                                <>
                                  <span>•</span>
                                  <span className="text-green-600 font-medium flex items-center gap-1">
                                    <CurrencyDollarIcon className="w-3 h-3" />
                                    Monetized
                                  </span>
                                </>
                              )}
                            </div>
                            
                            {/* YouTube-style action buttons underneath video text */}
                            <div className={`transition-opacity duration-200 flex items-center gap-1 ${
                              activeDropdown === video.id 
                                ? 'opacity-100' 
                                : activeDropdown !== null 
                                  ? 'opacity-0' 
                                  : 'opacity-0 group-hover:opacity-100'
                            }`}>
                              {/* Analytics */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleVideoAction(video.id, 'analytics');
                                }}
                                className="p-1.5 hover:bg-gray-200 rounded-full transition-all duration-200 text-gray-600 hover:text-gray-900"
                                title="Analytics"
                              >
                                <ChartBarIcon className="w-4 h-4" />
                              </button>
                              
                              {/* Comments */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleVideoAction(video.id, 'comments');
                                }}
                                className="p-1.5 hover:bg-gray-200 rounded-full transition-all duration-200 text-gray-600 hover:text-gray-900"
                                title="Comments"
                              >
                                <ChatBubbleOvalLeftIcon className="w-4 h-4" />
                              </button>
                              
                              {/* View on Hub */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleVideoAction(video.id, 'view-hub');
                                }}
                                className="p-1.5 hover:bg-gray-200 rounded-full transition-all duration-200 text-gray-600 hover:text-gray-900"
                                title="View on Hub"
                              >
                                <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                              </button>
                              
                              {/* More Options */}
                              <div className="dropdown-container relative z-50">
                                <button
                                  onClick={(e) => handleDropdownToggle(video.id, e)}
                                  className="p-1.5 hover:bg-gray-200 rounded-full transition-all duration-200 text-gray-600 hover:text-gray-900"
                                  title="More options"
                                >
                                  <EllipsisVerticalIcon className="w-4 h-4" />
                                </button>

                                {/* Dropdown Menu */}
                                {activeDropdown === video.id && (
                                  <div 
                                    className={`absolute left-0 w-56 bg-white border border-gray-200 rounded-lg shadow-lg py-1 ${
                                      dropdownPosition[video.id] === 'up' 
                                        ? 'bottom-full mb-2' 
                                        : 'top-full mt-2'
                                    }`}
                                    style={{ zIndex: 1000 }}
                                    onMouseEnter={() => {
                                      // Keep the dropdown open and action buttons visible when hovering over dropdown
                                      setActiveDropdown(video.id);
                                    }}
                                  >
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleVideoAction(video.id, 'edit');
                                      }}
                                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
                                    >
                                      <PencilIcon className="w-4 h-4" />
                                      Edit Title & Description
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleVideoAction(video.id, 'share');
                                      }}
                                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
                                    >
                                      <LinkIcon className="w-4 h-4" />
                                      Get Shareable Link
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleVideoAction(video.id, 'download');
                                      }}
                                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
                                    >
                                      <ArrowDownTrayIcon className="w-4 h-4" />
                                      Download
                                    </button>
                                    <div className="border-t border-gray-200 my-1"></div>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleVideoAction(video.id, 'delete');
                                      }}
                                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                                    >
                                      <TrashIcon className="w-4 h-4" />
                                      Delete Video
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Status */}
                        <div className="col-span-1">
                          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            video.status === 'public' ? 'bg-green-100 text-green-800' :
                            video.status === 'unlisted' ? 'bg-orange-100 text-orange-800' :
                            video.status === 'private' ? 'bg-gray-100 text-gray-800' :
                            video.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                            video.status === 'draft' ? 'bg-purple-100 text-purple-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            <StatusIcon className="w-3 h-3" />
                            {video.status === 'public' ? 'Public' :
                             video.status === 'unlisted' ? 'Unlisted' :
                             video.status === 'private' ? 'Private' :
                             video.status === 'scheduled' ? 'Scheduled' :
                             video.status === 'draft' ? 'Draft' : 'Processing'}
                          </div>
                        </div>

                        {/* Views */}
                        <div className="col-span-1">
                          <span className="text-sm text-gray-900">{video.views}</span>
                        </div>

                        {/* Comments */}
                        <div className="col-span-1">
                          <span className="text-sm text-gray-900">{video.comments}</span>
                        </div>

                        {/* Likes */}
                        <div className="col-span-2">
                          {(() => {
                            const total = video.likes + video.dislikes;
                            const percentage = total > 0 ? ((video.likes / total) * 100).toFixed(1) : "0.0";
                            const likePercentage = total > 0 ? (video.likes / total) * 100 : 0;
                            
                            return (
                              <div className="space-y-1">
                                <div className="text-sm font-medium text-gray-900">{percentage}%</div>
                                <div className="text-xs text-gray-600">{video.likes.toLocaleString()} likes</div>
                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                  <div 
                                    className="bg-green-500 h-1.5 rounded-full transition-all duration-300" 
                                    style={{ width: `${likePercentage}%` }}
                                  ></div>
                                </div>
                              </div>
                            );
                          })()}
                        </div>

                        {/* Date */}
                        <div className="col-span-1">
                          <span className="text-sm text-gray-600">{video.date}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-white/30 backdrop-blur-xl flex items-center justify-between" style={{backgroundColor: 'rgba(255, 255, 255, 0.25)', backdropFilter: 'blur(20px)'}}>
                  <div className="text-sm text-gray-600">
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredVideos.length)} of {filteredVideos.length} videos
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {/* Previous Button */}
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        currentPage === 1
                          ? 'bg-gray-100/50 text-gray-400 cursor-not-allowed'
                          : 'bg-white/70 hover:bg-white/90 text-gray-700 hover:text-gray-900 shadow-lg backdrop-blur-sm'
                      }`}
                    >
                      <ChevronLeftIcon className="w-5 h-5" />
                    </button>

                    {/* Page Numbers */}
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                        // Show first page, last page, current page, and pages around current
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                page === currentPage
                                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                                  : 'bg-white/60 hover:bg-white/80 text-gray-700 hover:text-gray-900'
                              }`}
                            >
                              {page}
                            </button>
                          );
                        } else if (
                          page === currentPage - 2 ||
                          page === currentPage + 2
                        ) {
                          return <span key={page} className="px-1 text-gray-500">...</span>;
                        }
                        return null;
                      })}
                    </div>

                    {/* Next Button */}
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        currentPage === totalPages
                          ? 'bg-gray-100/50 text-gray-400 cursor-not-allowed'
                          : 'bg-white/70 hover:bg-white/90 text-gray-700 hover:text-gray-900 shadow-lg backdrop-blur-sm'
                      }`}
                    >
                      <ChevronRightIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Grid View */
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {paginatedVideos.map((video) => {
                  const statusDisplay = getStatusDisplay(video.status);
                  return (
                    <div key={video.id} className="group relative">
                      <div className="bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-white/50">
                        {/* Video Thumbnail */}
                        <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <FilmIcon className="w-16 h-16 text-gray-400" />
                          </div>
                          
                          {/* Duration */}
                          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded font-medium">
                            {video.duration}
                          </div>
                          
                          {/* Hover Overlay with Actions */}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleVideoAction(video.id, 'analytics')}
                              className="p-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full transition-all text-white"
                              title="Analytics"
                            >
                              <ChartBarIcon className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleVideoAction(video.id, 'edit')}
                              className="p-3 bg-white hover:bg-gray-100 rounded-full transition-all text-gray-900"
                              title="Edit"
                            >
                              <PencilIcon className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleVideoAction(video.id, 'view-hub')}
                              className="p-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full transition-all text-white"
                              title="View on Hub"
                            >
                              <ArrowTopRightOnSquareIcon className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                        
                        {/* Video Info */}
                        <div className="p-4">
                          {/* Title and Menu */}
                          <div className="flex items-start gap-2 mb-3">
                            <h3 
                              className="flex-1 font-medium text-gray-900 line-clamp-2 cursor-pointer hover:text-purple-600 transition-colors text-sm"
                              onClick={() => handleVideoClick(video.id)}
                              title={video.title}
                            >
                              {video.title}
                            </h3>
                            <div className="dropdown-container relative">
                              <button
                                onClick={(e) => handleDropdownToggle(video.id, e)}
                                className="p-1 hover:bg-gray-100 rounded transition-colors text-gray-600 opacity-0 group-hover:opacity-100"
                              >
                                <EllipsisVerticalIcon className="w-4 h-4" />
                              </button>
                              
                              {/* Dropdown Menu */}
                              {activeDropdown === video.id && (
                                <div 
                                  className={`absolute right-0 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50 ${
                                    dropdownPosition[video.id] === 'up' 
                                      ? 'bottom-full mb-2' 
                                      : 'top-full mt-2'
                                  }`}
                                  style={{ zIndex: 1000 }}
                                >
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleVideoAction(video.id, 'share');
                                    }}
                                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
                                  >
                                    <LinkIcon className="w-4 h-4" />
                                    Get Shareable Link
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleVideoAction(video.id, 'download');
                                    }}
                                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
                                  >
                                    <ArrowDownTrayIcon className="w-4 h-4" />
                                    Download
                                  </button>
                                  <div className="border-t border-gray-200 my-1"></div>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleVideoAction(video.id, 'delete');
                                    }}
                                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                                  >
                                    <TrashIcon className="w-4 h-4" />
                                    Delete Video
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Status and Monetization */}
                          <div className="flex items-center gap-3 mb-3 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <statusDisplay.icon className="w-3 h-3" />
                              <span>{video.status.charAt(0).toUpperCase() + video.status.slice(1)}</span>
                            </div>
                            {video.monetization && (
                              <div className="flex items-center gap-1">
                                <CurrencyDollarIcon className="w-3 h-3 text-green-600" />
                              </div>
                            )}
                          </div>
                          
                          {/* Stats Grid */}
                          <div className="grid grid-cols-2 gap-3 text-xs">
                            <div>
                              <div className="text-gray-500 mb-1">Views</div>
                              <div className="font-medium text-gray-900">{video.views}</div>
                            </div>
                            <div>
                              <div className="text-gray-500 mb-1">Comments</div>
                              <div className="font-medium text-gray-900">{video.comments}</div>
                            </div>
                            <div>
                              <div className="text-gray-500 mb-1">Likes</div>
                              <div className="font-medium text-gray-900">{video.likes.toLocaleString()}</div>
                            </div>
                            <div>
                              <div className="text-gray-500 mb-1">Date</div>
                              <div className="font-medium text-gray-900">{video.date}</div>
                            </div>
                          </div>
                          
                          {/* Like Percentage Bar */}
                          {video.likes + video.dislikes > 0 && (
                            <div className="mt-3">
                              <div className="flex items-center justify-between text-xs mb-1">
                                <span className="text-gray-600">Audience rating</span>
                                <span className="font-medium text-gray-900">
                                  {((video.likes / (video.likes + video.dislikes)) * 100).toFixed(0)}%
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <div 
                                  className="bg-gradient-to-r from-green-500 to-green-400 h-1.5 rounded-full transition-all duration-300" 
                                  style={{ width: `${(video.likes / (video.likes + video.dislikes)) * 100}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Pagination Controls for Grid View */}
              {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredVideos.length)} of {filteredVideos.length} videos
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {/* Previous Button */}
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        currentPage === 1
                          ? 'bg-gray-100/50 text-gray-400 cursor-not-allowed'
                          : 'bg-white/70 hover:bg-white/90 text-gray-700 hover:text-gray-900 shadow-lg backdrop-blur-sm'
                      }`}
                    >
                      <ChevronLeftIcon className="w-5 h-5" />
                    </button>

                    {/* Page Numbers */}
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                        // Show first page, last page, current page, and pages around current
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                page === currentPage
                                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                                  : 'bg-white/60 hover:bg-white/80 text-gray-700 hover:text-gray-900'
                              }`}
                            >
                              {page}
                            </button>
                          );
                        } else if (
                          page === currentPage - 2 ||
                          page === currentPage + 2
                        ) {
                          return <span key={page} className="px-1 text-gray-500">...</span>;
                        }
                        return null;
                      })}
                    </div>

                    {/* Next Button */}
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        currentPage === totalPages
                          ? 'bg-gray-100/50 text-gray-400 cursor-not-allowed'
                          : 'bg-white/70 hover:bg-white/90 text-gray-700 hover:text-gray-900 shadow-lg backdrop-blur-sm'
                      }`}
                    >
                      <ChevronRightIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Add CSS for animations */}
        <style jsx>{`
          .galaxy-core {
            background: radial-gradient(ellipse, rgba(147, 51, 234, 0.3) 0%, rgba(139, 92, 246, 0.2) 30%, rgba(124, 58, 237, 0.1) 60%, transparent 100%);
          }
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