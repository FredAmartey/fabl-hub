"use client";

import { useState, useEffect } from "react";
import {
  ChatBubbleOvalLeftIcon,
  HeartIcon,
  FlagIcon,
  CheckCircleIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  FireIcon,
  StarIcon,
  EyeIcon,
  ArrowTrendingUpIcon,
  SparklesIcon,
  BoltIcon,
  PaperAirplaneIcon,
  GiftIcon,
  CursorArrowRaysIcon,
  ChartBarIcon,
  LightBulbIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon, FireIcon as FireSolidIcon, StarIcon as StarSolidIcon } from "@heroicons/react/24/solid";

const mockComments = [
  {
    id: 1,
    author: "Sarah Chen",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b500?w=40&h=40&fit=crop&crop=face",
    comment: "This tutorial literally saved my project! The way you explained React hooks finally made it click for me. Thank you so much! 🔥",
    video: "React Server Components Explained",
    time: "2 hours ago",
    likes: 124,
    replies: 8,
    isPinned: true,
    isHearted: true,
    sentiment: "positive",
    trending: true,
    isVerified: true,
    isSubscriber: true,
    aiInsight: "High-value feedback",
    engagementScore: 95,
    influence: "high",
    location: "San Francisco, CA",
    hasReplied: false
  },
  {
    id: 2,
    author: "Alex Rivera", 
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
    comment: "Great content! Quick question - how would you handle authentication with this approach? Would love to see a follow-up video on this 💭",
    video: "Building a Modern Web App",
    time: "5 hours ago",
    likes: 45,
    replies: 3,
    isPinned: false,
    isHearted: false,
    sentiment: "neutral",
    trending: false,
    isVerified: false,
    isSubscriber: true,
    aiInsight: "Content suggestion",
    engagementScore: 78,
    influence: "medium",
    location: "New York, NY",
    hasReplied: false
  },
  {
    id: 3,
    author: "Marcus Johnson",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
    comment: "The audio quality could be better. Hard to hear some parts, especially around the 8:30 mark.",
    video: "TypeScript Best Practices",
    time: "1 day ago",
    likes: 12,
    replies: 1,
    isPinned: false,
    isHearted: false,
    sentiment: "negative",
    trending: false,
    isVerified: false,
    isSubscriber: false,
    aiInsight: "Technical feedback",
    engagementScore: 65,
    influence: "low",
    location: "London, UK",
    hasReplied: false
  },
  {
    id: 4,
    author: "Emily Wong",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
    comment: "Can't wait for the next part! When are you uploading it? This series is absolutely amazing! ⚡️",
    video: "AI Integration Tutorial - Part 1",
    time: "3 days ago",
    likes: 89,
    replies: 5,
    isPinned: false,
    isHearted: true,
    sentiment: "positive",
    trending: true,
    isVerified: true,
    isSubscriber: true,
    aiInsight: "Series enthusiasm",
    engagementScore: 88,
    influence: "high",
    location: "Tokyo, Japan",
    hasReplied: true
  },
  {
    id: 5,
    author: "David Kim",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face",
    comment: "Mind blown! 🤯 Never thought about using hooks this way. Definitely trying this in my next project. Thanks for the inspo!",
    video: "React Server Components Explained",
    time: "6 hours ago",
    likes: 76,
    replies: 12,
    isPinned: false,
    isHearted: true,
    sentiment: "positive",
    trending: true,
    isVerified: false,
    isSubscriber: true,
    aiInsight: "Implementation intent",
    engagementScore: 92,
    influence: "medium",
    location: "Seoul, South Korea",
    hasReplied: false
  }
];

const liveMetrics = {
  commentsPerHour: 156,
  avgResponseTime: "12 minutes",
  topEmoji: "🔥",
  peakHour: "2-3 PM EST",
  sentimentTrend: "+12%"
};

export default function CommentsPage() {
  const [selectedFilter, setSelectedFilter] = useState("needs_attention");
  const [hoveredComment, setHoveredComment] = useState<number | null>(null);
  const [showAIInsights, setShowAIInsights] = useState(true);
  const [liveData, setLiveData] = useState(liveMetrics);
  const [selectedComments, setSelectedComments] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<"triage" | "detailed">("triage");

  useEffect(() => {
    // Simulate live updates
    const interval = setInterval(() => {
      setLiveData(prev => ({
        ...prev,
        commentsPerHour: prev.commentsPerHour + Math.floor(Math.random() * 5),
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-emerald-300 bg-emerald-500/20';
      case 'negative': return 'text-red-300 bg-red-500/20';
      default: return 'text-blue-300 bg-blue-500/20';
    }
  };

  const getInfluenceColor = (influence: string) => {
    switch (influence) {
      case 'high': return 'from-purple-500 to-pink-500';
      case 'medium': return 'from-blue-500 to-cyan-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-700 to-purple-900">
      <div className="p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="relative">
                  <ChatBubbleOvalLeftIcon className="w-8 h-8 text-purple-400" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                </div>
                <h1 className="text-4xl font-bold text-white">Comments</h1>
                <SparklesIcon className="w-6 h-6 text-amber-400" />
              </div>
              <p className="text-lg text-gray-300">Engage with your community and build lasting connections</p>
            </div>
            
            {/* Live Stats */}
            <div className="flex items-center gap-6">
              <div className="text-center p-4 bg-white/10 backdrop-blur-xl rounded-xl shadow-lg border border-white/10">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <EyeIcon className="w-5 h-5 text-purple-300" />
                  <p className="text-2xl font-bold text-white">2.4K</p>
                </div>
                <p className="text-sm text-gray-300">New Today</p>
              </div>
              <div className="text-center p-4 bg-white/10 backdrop-blur-xl rounded-xl shadow-lg border border-white/10">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <ArrowTrendingUpIcon className="w-5 h-5 text-emerald-300" />
                  <p className="text-2xl font-bold text-emerald-300">89%</p>
                </div>
                <p className="text-sm text-gray-300">Positive</p>
              </div>
              <div className="text-center p-4 bg-white/10 backdrop-blur-xl rounded-xl shadow-lg border border-white/10">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <StarIcon className="w-5 h-5 text-amber-300" />
                  <p className="text-2xl font-bold text-amber-300">4.8</p>
                </div>
                <p className="text-sm text-gray-300">Avg Rating</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Bar */}
        <div className="mb-8 p-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-1">Comment Insights</h3>
              <p className="text-purple-100">Your latest video "React Server Components" is generating buzz! 🚀</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold">+156%</p>
                <p className="text-xs text-purple-200">Engagement</p>
              </div>
              <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors backdrop-blur-sm">
                View Details
              </button>
            </div>
          </div>
        </div>

        {/* Workflow Navigation & Actions */}
        <div className="mb-8 space-y-4">
          {/* Primary Actions Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* View Mode Toggle */}
              <div className="flex items-center bg-white/10 backdrop-blur-xl rounded-xl p-1 border border-white/10">
                <button
                  onClick={() => setViewMode("triage")}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    viewMode === "triage" 
                      ? "bg-purple-600 text-white shadow-lg" 
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  Triage
                </button>
                <button
                  onClick={() => setViewMode("detailed")}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    viewMode === "detailed" 
                      ? "bg-purple-600 text-white shadow-lg" 
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  Detailed
                </button>
              </div>

              {/* Quick Search */}
              <div className="relative group">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-300" />
                <input
                  type="text"
                  placeholder="Search comments..."
                  className="pl-10 pr-4 py-3 bg-white/10 backdrop-blur-xl border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 text-white placeholder-gray-300 w-80"
                />
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedComments.length > 0 && (
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xl rounded-xl p-3 border border-white/10">
                <span className="text-white font-medium">{selectedComments.length} selected</span>
                <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                  Approve All
                </button>
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                  Delete All
                </button>
                <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                  Mark as Spam
                </button>
              </div>
            )}
          </div>

          {/* Priority Filters */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {[
              { 
                label: "Needs Attention", 
                count: "23", 
                active: selectedFilter === "needs_attention",
                color: "bg-red-500",
                description: "Flagged, reported, or spam"
              },
              { 
                label: "Questions", 
                count: "45", 
                active: selectedFilter === "questions",
                color: "bg-blue-500",
                description: "Comments asking questions"
              },
              { 
                label: "Positive", 
                count: "156", 
                active: selectedFilter === "positive",
                color: "bg-emerald-500",
                description: "Praise and positive feedback"
              },
              { 
                label: "Unanswered", 
                count: "89", 
                active: selectedFilter === "unanswered",
                color: "bg-amber-500",
                description: "Haven't replied yet"
              },
              { 
                label: "From Subscribers", 
                count: "78", 
                active: selectedFilter === "subscribers",
                color: "bg-purple-500",
                description: "Comments from subscribers"
              },
              { 
                label: "All Comments", 
                count: "2.4K", 
                active: selectedFilter === "all",
                color: "bg-gray-500",
                description: "All comments"
              }
            ].map((filter) => (
              <button
                key={filter.label}
                onClick={() => setSelectedFilter(filter.label.toLowerCase().replace(" ", "_"))}
                className={`group relative px-4 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-3 whitespace-nowrap ${
                  filter.active
                    ? "bg-white/15 text-white shadow-lg border-2 border-white/30"
                    : "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"
                }`}
              >
                <div className={`w-3 h-3 rounded-full ${filter.color} ${filter.active ? 'animate-pulse' : ''}`}></div>
                <span>{filter.label}</span>
                <span className="text-xs px-2 py-1 bg-white/20 rounded-full">{filter.count}</span>
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black/90 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                  {filter.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Comments Feed */}
        <div className="space-y-4">
          {mockComments.map((comment) => (
            viewMode === "triage" ? (
              // Triage Mode - Efficient Workflow View
              <div
                key={comment.id}
                className="group relative bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-200"
                onMouseEnter={() => setHoveredComment(comment.id)}
                onMouseLeave={() => setHoveredComment(null)}
              >
                <div className="flex items-center gap-4">
                  {/* Selection Checkbox */}
                  <input
                    type="checkbox"
                    checked={selectedComments.includes(comment.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedComments([...selectedComments, comment.id]);
                      } else {
                        setSelectedComments(selectedComments.filter(id => id !== comment.id));
                      }
                    }}
                    className="w-4 h-4 rounded border-2 border-white/30 bg-white/10 text-purple-600 focus:ring-purple-500 focus:ring-2"
                  />

                  {/* Priority Indicator */}
                  <div className={`w-3 h-3 rounded-full ${
                    comment.sentiment === 'negative' ? 'bg-red-500' :
                    comment.sentiment === 'positive' ? 'bg-emerald-500' :
                    'bg-amber-500'
                  }`}></div>

                  {/* Author & Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <img
                        src={comment.avatar}
                        alt={comment.author}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="font-medium text-white text-sm">{comment.author}</span>
                      {comment.isVerified && <CheckCircleIcon className="w-4 h-4 text-blue-400" />}
                      {comment.isSubscriber && <StarSolidIcon className="w-4 h-4 text-purple-400" />}
                      <span className="text-xs text-gray-400">• {comment.time}</span>
                      <span className="text-xs text-gray-500">on "{comment.video}"</span>
                    </div>
                    <p className="text-gray-200 text-sm line-clamp-2">{comment.comment}</p>
                  </div>

                  {/* Quick Stats */}
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <HeartIcon className="w-4 h-4" />
                      <span>{comment.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ChatBubbleOvalLeftIcon className="w-4 h-4" />
                      <span>{comment.replies}</span>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs ${
                      comment.hasReplied ? 'bg-green-500/20 text-green-300' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {comment.hasReplied ? 'Replied' : 'Pending'}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className={`flex items-center gap-2 transition-all duration-200 ${
                    hoveredComment === comment.id ? "opacity-100" : "opacity-60"
                  }`}>
                    <button className="p-2 text-emerald-400 hover:bg-emerald-500/20 rounded-lg transition-colors" title="Approve">
                      <CheckCircleIcon className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors" title="Reply">
                      <PaperAirplaneIcon className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors" title="Delete">
                      <XCircleIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              // Detailed Mode - Full Information View
              <div
                key={comment.id}
                className="group relative bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl hover:shadow-purple-500/20 hover:bg-white/10 transition-all duration-300 transform hover:scale-[1.02]"
                onMouseEnter={() => setHoveredComment(comment.id)}
                onMouseLeave={() => setHoveredComment(null)}
              >
                {/* Trending Badge */}
                {comment.trending && (
                  <div className="absolute -top-2 -right-2 px-3 py-1.5 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white text-xs font-bold rounded-full shadow-xl flex items-center gap-1 animate-pulse z-20">
                    <FireSolidIcon className="w-3 h-3" />
                    <span>Trending</span>
                  </div>
                )}

                {/* Pinned Badge */}
                {comment.isPinned && (
                  <div className="absolute -top-2 -left-2 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-full shadow-xl flex items-center gap-1 z-20">
                    <span>📌</span>
                    <span>Pinned</span>
                  </div>
                )}

                {/* Detailed content - same as before but condensed */}
                <div className="relative z-10 flex gap-6">
                  {/* Enhanced Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className={`absolute -inset-1 rounded-full bg-gradient-to-r ${getInfluenceColor(comment.influence)} p-0.5 animate-pulse opacity-60`}>
                      <div className="w-full h-full bg-slate-900 rounded-full"></div>
                    </div>
                    <img
                      src={comment.avatar}
                      alt={comment.author}
                      className="relative w-16 h-16 rounded-full object-cover ring-2 ring-white/30"
                    />
                    
                    {/* Verification Badge */}
                    {comment.isVerified && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center ring-2 ring-slate-900">
                        <CheckCircleIcon className="w-4 h-4 text-white" />
                      </div>
                    )}
                    
                    {/* Subscriber Badge */}
                    {comment.isSubscriber && (
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center ring-2 ring-slate-900">
                        <StarSolidIcon className="w-4 h-4 text-white" />
                      </div>
                    )}

                    {/* Sentiment Indicator */}
                    <div className={`absolute -bottom-1 -left-1 w-5 h-5 rounded-full border-2 border-slate-900 ${getSentimentColor(comment.sentiment)}`}></div>
                  </div>
                  
                  {/* Enhanced Content */}
                  <div className="flex-1 min-w-0">
                    {/* Author Header with Enhanced Info */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-white text-xl">{comment.author}</h3>
                        {comment.isVerified && (
                          <CheckCircleIcon className="w-5 h-5 text-blue-400" />
                        )}
                        {comment.isSubscriber && (
                          <StarSolidIcon className="w-5 h-5 text-purple-400" />
                        )}
                      </div>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-400">{comment.time}</span>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-400">{comment.location}</span>
                    </div>

                    {/* AI Insights & Engagement Score */}
                    {showAIInsights && (
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                          <LightBulbIcon className="w-4 h-4" />
                          <span className="font-medium">{comment.aiInsight}</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                          <span className="font-bold">{comment.engagementScore}%</span>
                          <span>Engagement</span>
                        </div>
                        <div className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                          comment.influence === 'high' ? 'bg-purple-500/20 text-purple-300' :
                          comment.influence === 'medium' ? 'bg-blue-500/20 text-blue-300' :
                          'bg-gray-500/20 text-gray-300'
                        }`}>
                          {comment.influence} influence
                        </div>
                      </div>
                    )}
                    
                    {/* Enhanced Comment */}
                    <p className="text-gray-200 text-lg leading-relaxed mb-4 font-medium">{comment.comment}</p>
                    
                    {/* Video Context */}
                    <div className="flex items-center gap-6 text-sm text-gray-400 mb-4">
                      <span className="flex items-center gap-2 font-medium">
                        <span>📺</span>
                        <span>on "{comment.video}"</span>
                      </span>
                    </div>

                    {/* Enhanced Sentiment Analysis */}
                    {comment.sentiment === 'positive' && (
                      <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl backdrop-blur-sm">
                        <div className="flex items-center gap-3 text-emerald-300">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">⭐</span>
                            <span className="font-bold">Positive feedback detected</span>
                          </div>
                          <span className="text-sm opacity-75">• High engagement potential</span>
                        </div>
                      </div>
                    )}
                    
                    {/* Enhanced Action Bar */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <button className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                          comment.isHearted 
                            ? "bg-red-500/20 text-red-300 hover:bg-red-500/30 shadow-lg shadow-red-500/20" 
                            : "bg-white/10 text-gray-300 hover:bg-white/15 backdrop-blur-xl"
                        }`}>
                          {comment.isHearted ? (
                            <HeartSolidIcon className="w-5 h-5" />
                          ) : (
                            <HeartIcon className="w-5 h-5" />
                          )}
                          <span className="font-bold">{comment.likes}</span>
                          <span className="text-sm opacity-75">likes</span>
                        </button>
                        
                        <button className="flex items-center gap-2 px-6 py-3 bg-white/10 text-gray-300 hover:bg-white/15 rounded-xl transition-all backdrop-blur-xl font-semibold transform hover:scale-105">
                          <ChatBubbleOvalLeftIcon className="w-5 h-5" />
                          <span className="font-bold">{comment.replies}</span>
                          <span className="text-sm opacity-75">replies</span>
                        </button>

                        {/* Creator Response Status */}
                        {comment.hasReplied ? (
                          <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-300 rounded-xl text-sm font-medium">
                            <CheckCircleIcon className="w-4 h-4" />
                            <span>You replied</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/20 text-amber-300 rounded-xl text-sm font-medium">
                            <ClockIcon className="w-4 h-4" />
                            <span>Awaiting response</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Enhanced Quick Actions */}
                      <div className={`flex items-center gap-3 transition-all duration-300 ${
                        hoveredComment === comment.id ? "opacity-100 transform scale-100" : "opacity-0 transform scale-95"
                      }`}>
                        <button className="p-3 text-gray-400 hover:text-emerald-300 hover:bg-emerald-500/20 rounded-xl transition-all backdrop-blur-xl transform hover:scale-110">
                          <CheckCircleIcon className="w-6 h-6" />
                        </button>
                        <button className="p-3 text-gray-400 hover:text-red-300 hover:bg-red-500/20 rounded-xl transition-all backdrop-blur-xl transform hover:scale-110">
                          <XCircleIcon className="w-6 h-6" />
                        </button>
                        <button className="p-3 text-gray-400 hover:text-amber-300 hover:bg-amber-500/20 rounded-xl transition-all backdrop-blur-xl transform hover:scale-110">
                          <FlagIcon className="w-6 h-6" />
                        </button>
                        <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all font-bold transform hover:scale-105">
                          <PaperAirplaneIcon className="w-5 h-5" />
                          <span>Reply</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          ))}
        </div>

        {/* AI Insights Dashboard */}
        <div className="mt-12 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Real-time Analytics */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-3xl blur-lg opacity-20"></div>
              <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl">
                    <ChartBarIcon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Live Analytics</h3>
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-2xl p-4 text-center">
                    <p className="text-3xl font-black text-cyan-300">{liveData.commentsPerHour}</p>
                    <p className="text-sm text-gray-300">Comments/Hour</p>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-4 text-center">
                    <p className="text-3xl font-black text-emerald-300">{liveData.avgResponseTime}</p>
                    <p className="text-sm text-gray-300">Avg Response</p>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-4 text-center">
                    <p className="text-3xl font-black text-amber-300">{liveData.topEmoji}</p>
                    <p className="text-sm text-gray-300">Top Emoji</p>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-4 text-center">
                    <p className="text-3xl font-black text-purple-300">{liveData.sentimentTrend}</p>
                    <p className="text-sm text-gray-300">Sentiment</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Smart Moderation Tools */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-3xl blur-lg opacity-20"></div>
              <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl">
                    <SparklesIcon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Smart Moderation</h3>
                  <BoltIcon className="w-5 h-5 text-amber-400" />
                </div>
                
                <div className="space-y-4">
                  <button className="w-full flex items-center justify-between p-4 bg-emerald-500/20 hover:bg-emerald-500/30 rounded-2xl transition-colors group">
                    <div className="flex items-center gap-3">
                      <CheckCircleIcon className="w-5 h-5 text-emerald-300" />
                      <span className="text-white font-semibold">Auto-approve positive comments</span>
                    </div>
                    <div className="w-12 h-6 bg-emerald-500 rounded-full relative">
                      <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                    </div>
                  </button>
                  
                  <button className="w-full flex items-center justify-between p-4 bg-red-500/20 hover:bg-red-500/30 rounded-2xl transition-colors group">
                    <div className="flex items-center gap-3">
                      <XCircleIcon className="w-5 h-5 text-red-300" />
                      <span className="text-white font-semibold">Flag suspicious activity</span>
                    </div>
                    <div className="w-12 h-6 bg-red-500 rounded-full relative">
                      <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                    </div>
                  </button>
                  
                  <button className="w-full flex items-center justify-between p-4 bg-blue-500/20 hover:bg-blue-500/30 rounded-2xl transition-colors group">
                    <div className="flex items-center gap-3">
                      <LightBulbIcon className="w-5 h-5 text-blue-300" />
                      <span className="text-white font-semibold">AI response suggestions</span>
                    </div>
                    <div className="w-12 h-6 bg-blue-500 rounded-full relative">
                      <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Premium Action Center */}
        <div className="mt-12 mb-12">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 rounded-3xl blur-lg opacity-30"></div>
            <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-violet-500 to-pink-500 rounded-2xl">
                    <GiftIcon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Creator Toolkit</h3>
                  <CursorArrowRaysIcon className="w-5 h-5 text-purple-300" />
                </div>
                <button onClick={() => setShowAIInsights(!showAIInsights)} className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                  showAIInsights ? 'bg-purple-600 text-white' : 'bg-white/10 text-gray-300'
                }`}>
                  {showAIInsights ? 'Hide' : 'Show'} AI Insights
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="group p-6 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl hover:shadow-xl hover:shadow-emerald-500/20 transition-all transform hover:scale-105">
                  <div className="flex flex-col items-center gap-3">
                    <div className="text-4xl">🎯</div>
                    <span className="text-white font-bold">Bulk Reply</span>
                    <span className="text-emerald-100 text-sm">Respond to multiple comments</span>
                  </div>
                </button>
                
                <button className="group p-6 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl hover:shadow-xl hover:shadow-blue-500/20 transition-all transform hover:scale-105">
                  <div className="flex flex-col items-center gap-3">
                    <div className="text-4xl">🤖</div>
                    <span className="text-white font-bold">AI Assistant</span>
                    <span className="text-blue-100 text-sm">Generate smart responses</span>
                  </div>
                </button>
                
                <button className="group p-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl hover:shadow-xl hover:shadow-purple-500/20 transition-all transform hover:scale-105">
                  <div className="flex flex-col items-center gap-3">
                    <div className="text-4xl">📊</div>
                    <span className="text-white font-bold">Export Data</span>
                    <span className="text-purple-100 text-sm">Download analytics</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Load More */}
        <div className="mt-12 text-center">
          <div className="relative inline-block">
            <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-xl opacity-50"></div>
            <button className="relative px-12 py-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-2xl hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 transform hover:scale-105">
              <span className="flex items-center gap-3">
                <span className="text-lg">Load More Comments</span>
                <ArrowTrendingUpIcon className="w-6 h-6" />
              </span>
            </button>
          </div>
          <div className="mt-6 flex items-center justify-center gap-6 text-gray-400">
            <span className="text-lg">Showing 5 of 2,486 comments</span>
            <span className="text-2xl">•</span>
            <span className="flex items-center gap-2">
              <EyeIcon className="w-5 h-5" />
              <span>89% engagement rate</span>
            </span>
            <span className="text-2xl">•</span>
            <span className="flex items-center gap-2">
              <StarIcon className="w-5 h-5 text-amber-400" />
              <span>4.8 avg rating</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}