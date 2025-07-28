"use client";

import React, { useState, useEffect } from "react";
import {
  ChatBubbleOvalLeftIcon,
  HeartIcon,
  CheckCircleIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
  PaperAirplaneIcon,
  ClockIcon,
  ChevronDownIcon,
  AdjustmentsHorizontalIcon,
  ShieldCheckIcon,
  BellIcon,
  EyeIcon,
  TrashIcon,
  PlusIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";
import { FireIcon as FireSolidIcon, StarIcon as StarSolidIcon, HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";

const mockComments = [
  {
    id: 1,
    author: "Sarah Chen",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
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
    hasReplied: false,
    priority: "high"
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
    hasReplied: false,
    priority: "medium"
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
    hasReplied: false,
    priority: "high"
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
    hasReplied: true,
    priority: "medium"
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
    hasReplied: false,
    priority: "low"
  }
];

export default function CommentsPage() {
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedComments, setSelectedComments] = useState<number[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showModerationModal, setShowModerationModal] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [heartedComments, setHeartedComments] = useState<number[]>(
    // Initialize with comments that are already hearted in mock data
    mockComments.filter(c => c.isHearted).map(c => c.id)
  );
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filterBy, setFilterBy] = useState("all");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  
  // Moderation settings state
  const [moderationSettings, setModerationSettings] = useState({
    autoApproveSubscribers: true,
    holdAllForReview: false,
    spamDetection: true,
    keywordFilters: ["spam", "bot", "fake"],
    commentVisibility: "public",
    emailNotifications: true,
    pushNotifications: false,
    moderationThreshold: "medium"
  });

  const getFilteredComments = () => {
    let filtered = mockComments;
    
    // Apply tab filter
    switch (selectedTab) {
      case "unresponded":
        filtered = filtered.filter(c => !c.hasReplied);
        break;
      case "mentions":
        filtered = filtered.filter(c => c.comment.includes("@") || c.comment.toLowerCase().includes("your channel") || c.comment.toLowerCase().includes("you"));
        break;
      case "subscribers":
        filtered = filtered.filter(c => c.isSubscriber);
        break;
      case "all":
      default:
        // Show all comments
        break;
    }
    
    // Apply additional filter
    switch (filterBy) {
      case "hearted":
        filtered = filtered.filter(c => c.isHearted || heartedComments.includes(c.id));
        break;
      case "pinned":
        filtered = filtered.filter(c => c.isPinned);
        break;
      case "questions":
        filtered = filtered.filter(c => c.comment.includes("?"));
        break;
      case "all":
      default:
        // Show all comments
        break;
    }
    
    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(c => 
        c.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply sorting
    switch (sortBy) {
      case "oldest":
        filtered = [...filtered].reverse();
        break;
      case "likes":
        filtered = [...filtered].sort((a, b) => b.likes - a.likes);
        break;
      case "replies":
        filtered = [...filtered].sort((a, b) => b.replies - a.replies);
        break;
      case "newest":
      default:
        // Already in newest order
        break;
    }
    
    return filtered;
  };

  const toggleCommentSelection = (id: number) => {
    setSelectedComments(prev => 
      prev.includes(id) 
        ? prev.filter(c => c !== id)
        : [...prev, id]
    );
  };

  const selectAllVisible = () => {
    const visibleIds = getFilteredComments().map(c => c.id);
    setSelectedComments(visibleIds);
  };

  const clearSelection = () => {
    setSelectedComments([]);
  };

  const toggleHeart = (commentId: number) => {
    setHeartedComments(prev => 
      prev.includes(commentId) 
        ? prev.filter(id => id !== commentId)
        : [...prev, commentId]
    );
  };

  const startReply = (commentId: number) => {
    setReplyingTo(commentId);
    setReplyText("");
  };

  const cancelReply = () => {
    setReplyingTo(null);
    setReplyText("");
  };

  const submitReply = () => {
    // Here you would handle the reply submission
    console.log(`Replying to comment ${replyingTo} with: ${replyText}`);
    setReplyingTo(null);
    setReplyText("");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdown !== null) {
        setOpenDropdown(null);
      }
      if (showSortDropdown) {
        setShowSortDropdown(false);
      }
      if (showFilterDropdown) {
        setShowFilterDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown, showSortDropdown, showFilterDropdown]);


  const filteredComments = getFilteredComments();

  // Calculate counts for tabs
  const allCount = mockComments.length;
  const unrespondedCount = mockComments.filter(c => !c.hasReplied).length;
  const mentionsCount = mockComments.filter(c => c.comment.includes("@") || c.comment.toLowerCase().includes("your channel") || c.comment.toLowerCase().includes("you")).length;
  const subscribersCount = mockComments.filter(c => c.isSubscriber).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-indigo-100">
      {/* Cool Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-gradient-to-r from-blue-300/40 to-indigo-300/40 rounded-full mix-blend-multiply filter blur-3xl animate-float"></div>
        <div className="absolute bottom-1/3 -right-48 w-96 h-96 bg-gradient-to-r from-indigo-300/40 to-blue-300/40 rounded-full mix-blend-multiply filter blur-3xl animate-float-delayed"></div>
      </div>

      <div className="relative z-10 p-8 lg:p-12 max-w-6xl mx-auto">
        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="relative">
                  <ChatBubbleOvalLeftIcon className="w-8 h-8 text-blue-600" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                </div>
                <h1 className="text-4xl font-bold text-gray-900">Comments</h1>
              </div>
              <p className="text-lg text-gray-600">
                Manage comments across your videos • {mockComments.filter(c => !c.hasReplied).length} need responses
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowModerationModal(true)}
                className="group relative transform hover:scale-105 transition-all duration-300"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <div className="relative flex items-center gap-2 backdrop-blur-xl px-4 py-2 rounded-xl shadow-lg border border-white/50" style={{backgroundColor: '#FFFAFA'}}>
                  <AdjustmentsHorizontalIcon className="w-4 h-4 text-emerald-600" />
                  <span className="font-medium text-gray-900">Moderation</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Navigation with Search */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {[
                  { key: "all", label: "All", count: allCount },
                  { key: "unresponded", label: "Unresponded", count: unrespondedCount },
                  { key: "mentions", label: "Mentions", count: mentionsCount },
                  { key: "subscribers", label: "Subscribers", count: subscribersCount }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setSelectedTab(tab.key)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                      selectedTab === tab.key
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {tab.label}
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      selectedTab === tab.key
                        ? "bg-blue-100 text-blue-600"
                        : "bg-gray-100 text-gray-500"
                    }`}>
                      {tab.count}
                    </span>
                  </button>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative group flex-1 max-w-md">
                <div className="relative flex items-center">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors z-10" />
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all w-full text-gray-900 placeholder-gray-500"
                    style={{backgroundColor: '#FFFAFA'}}
                  />
                </div>
              </div>

              {/* Sort By */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowSortDropdown(!showSortDropdown);
                    setShowFilterDropdown(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
                  style={{backgroundColor: '#FFFAFA'}}
                >
                  <span>Sort by</span>
                  <ChevronDownIcon className="w-4 h-4" />
                </button>
                
                {showSortDropdown && (
                  <div className="absolute right-0 top-full mt-1 w-48 rounded-lg shadow-lg border border-gray-200 z-20" style={{backgroundColor: '#FFFAFA'}}>
                    <div className="py-1">
                      <button
                        onClick={() => {setSortBy("newest"); setShowSortDropdown(false);}}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${sortBy === "newest" ? "text-blue-600 font-medium" : "text-gray-700"}`}
                      >
                        Newest first
                      </button>
                      <button
                        onClick={() => {setSortBy("oldest"); setShowSortDropdown(false);}}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${sortBy === "oldest" ? "text-blue-600 font-medium" : "text-gray-700"}`}
                      >
                        Oldest first
                      </button>
                      <button
                        onClick={() => {setSortBy("likes"); setShowSortDropdown(false);}}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${sortBy === "likes" ? "text-blue-600 font-medium" : "text-gray-700"}`}
                      >
                        Most liked
                      </button>
                      <button
                        onClick={() => {setSortBy("replies"); setShowSortDropdown(false);}}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${sortBy === "replies" ? "text-blue-600 font-medium" : "text-gray-700"}`}
                      >
                        Most replies
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Filter */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowFilterDropdown(!showFilterDropdown);
                    setShowSortDropdown(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
                  style={{backgroundColor: '#FFFAFA'}}
                >
                  <FunnelIcon className="w-4 h-4" />
                  <span>Filter</span>
                </button>
                
                {showFilterDropdown && (
                  <div className="absolute right-0 top-full mt-1 w-48 rounded-lg shadow-lg border border-gray-200 z-20" style={{backgroundColor: '#FFFAFA'}}>
                    <div className="py-1">
                      <button
                        onClick={() => {setFilterBy("all"); setShowFilterDropdown(false);}}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${filterBy === "all" ? "text-blue-600 font-medium" : "text-gray-700"}`}
                      >
                        All comments
                      </button>
                      <button
                        onClick={() => {setFilterBy("hearted"); setShowFilterDropdown(false);}}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${filterBy === "hearted" ? "text-blue-600 font-medium" : "text-gray-700"}`}
                      >
                        Hearted only
                      </button>
                      <button
                        onClick={() => {setFilterBy("pinned"); setShowFilterDropdown(false);}}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${filterBy === "pinned" ? "text-blue-600 font-medium" : "text-gray-700"}`}
                      >
                        Pinned only
                      </button>
                      <button
                        onClick={() => {setFilterBy("questions"); setShowFilterDropdown(false);}}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${filterBy === "questions" ? "text-blue-600 font-medium" : "text-gray-700"}`}
                      >
                        Contains Questions
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>

        {/* Clean Comments List - YouTube Style */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-200/20 to-purple-200/20 rounded-2xl blur-lg"></div>
          <div className="relative rounded-2xl border border-white/50 shadow-lg overflow-hidden" style={{backgroundColor: '#FFFAF0'}}>
            
            {/* Header with bulk selection */}
            {selectedComments.length > 0 && (
              <div className="bg-blue-50 border-b border-blue-200 px-6 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={clearSelection}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Clear selection
                    </button>
                    <span className="text-sm text-blue-700">{selectedComments.length} selected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                      Approve
                    </button>
                    <button className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                      Delete
                    </button>
                    <button className="px-3 py-1.5 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors">
                      Mark as Spam
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Comments List */}
            <div className="divide-y divide-gray-100">
              {filteredComments.map((comment) => {
                const isSelected = selectedComments.includes(comment.id);
                
                return (
                  <div 
                    key={comment.id}
                    className={`group px-4 py-4 transition-all duration-200 ${
                      isSelected 
                        ? 'bg-teal-200/90' 
                        : 'hover:bg-gray-50/50'
                    }`}
                  >
                    <div className="flex gap-3">
                      {/* Selection Checkbox */}
                      <div className="flex-shrink-0 pt-1">
                        <button
                          onClick={() => toggleCommentSelection(comment.id)}
                          className={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center ${
                            isSelected
                              ? 'bg-blue-600 border-blue-600'
                              : 'border-gray-300 hover:border-blue-400'
                          }`}
                          style={!isSelected ? {backgroundColor: 'transparent'} : undefined}
                        >
                          {isSelected && (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </button>
                      </div>

                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        <div className="relative">
                          <img
                            src={comment.avatar}
                            alt={comment.author}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          {comment.isSubscriber && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                              <StarSolidIcon className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Comment Content */}
                      <div className="flex-1 min-w-0">
                        {/* Author and timestamp */}
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-gray-900 text-base">{comment.author}</h3>
                          <span className="text-sm text-gray-500">• {comment.time}</span>
                          {comment.isPinned && (
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                              PINNED
                            </span>
                          )}
                        </div>

                        {/* Comment text */}
                        <p className="text-gray-800 text-base leading-relaxed mb-2">{comment.comment}</p>

                        {/* Action buttons */}
                        <div className="flex items-center gap-4">
                          <button 
                            onClick={() => startReply(comment.id)}
                            className="flex items-center gap-2 px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium"
                          >
                            Reply
                          </button>
                          <button 
                            onClick={() => toggleHeart(comment.id)}
                            className="flex items-center gap-1 text-sm hover:bg-gray-100 rounded-lg px-2 py-1 transition-colors"
                          >
                            {heartedComments.includes(comment.id) ? (
                              <HeartSolidIcon className="w-4 h-4 text-red-500" />
                            ) : (
                              <HeartIcon className="w-4 h-4 text-gray-600" />
                            )}
                            <span className={`${heartedComments.includes(comment.id) ? 'text-red-500' : 'text-gray-600'}`}>
                              {heartedComments.includes(comment.id) ? comment.likes + 1 : comment.likes}
                            </span>
                          </button>
                          {comment.replies > 0 && (
                            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                              {comment.replies} replies
                            </button>
                          )}
                          
                          {/* More actions menu */}
                          <div className="ml-auto relative">
                            <button 
                              onClick={() => setOpenDropdown(openDropdown === comment.id ? null : comment.id)}
                              className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-all"
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                              </svg>
                            </button>
                            
                            {openDropdown === comment.id && (
                              <div className="absolute right-0 top-full mt-1 w-48 rounded-lg shadow-lg border border-gray-200 z-20" style={{backgroundColor: '#FFFAFA'}}>
                                <div className="py-1">
                                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                    Pin comment
                                  </button>
                                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                    Hide comment
                                  </button>
                                  <div className="border-t border-gray-100"></div>
                                  <button className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 transition-colors">
                                    Always approve comments from this user
                                  </button>
                                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                    Hide user from channel
                                  </button>
                                  <div className="border-t border-gray-100"></div>
                                  <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                                    Report
                                  </button>
                                  <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                                    Delete comment
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Reply Interface */}
                        {replyingTo === comment.id && (
                          <div className="mt-4 border-t border-gray-200 pt-4">
                            <div className="flex gap-3">
                              {/* Creator avatar (you) */}
                              <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                                  <span className="text-white text-sm font-medium">Y</span>
                                </div>
                              </div>
                              
                              {/* Reply form */}
                              <div className="flex-1">
                                <textarea
                                  value={replyText}
                                  onChange={(e) => setReplyText(e.target.value)}
                                  placeholder="Add a reply..."
                                  className="w-full p-2 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
                                  style={{backgroundColor: '#FFFAFA'}}
                                  rows={2}
                                  autoFocus
                                />
                                
                                {/* Reply buttons */}
                                <div className="flex justify-end gap-2 mt-2">
                                  <button
                                    onClick={cancelReply}
                                    className="px-4 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={submitReply}
                                    disabled={!replyText.trim()}
                                    className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                                      replyText.trim() 
                                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    }`}
                                  >
                                    Reply
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Video thumbnail */}
                      <div className="flex-shrink-0">
                        <div className="w-40 h-24 bg-gray-200 rounded-lg overflow-hidden border border-gray-300">
                          <div className="relative w-full h-full">
                            {/* Video placeholder */}
                            <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                              <svg className="w-12 h-12 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                                <path d="M8 7v6l4-3-4-3z" />
                              </svg>
                            </div>
                            {/* Video title below */}
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-gray-600 font-medium leading-tight w-40 line-clamp-2">
                          {comment.video}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Empty State */}
            {filteredComments.length === 0 && (
              <div className="text-center py-12">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-full blur-2xl opacity-50"></div>
                  </div>
                  <ChatBubbleOvalLeftIcon className="relative w-12 h-12 text-gray-400 mx-auto mb-4" />
                </div>
                <p className="text-gray-600 mb-4">No comments found</p>
                <button 
                  onClick={() => setSelectedTab("all")}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium rounded-lg hover:shadow-lg transition-all"
                >
                  View all comments
                </button>
              </div>
            )}

            {/* Pagination */}
            <div className="bg-gray-50/50 px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  1–{filteredComments.length} of {mockComments.length}
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-white/50 transition-all">
                    <ChevronDownIcon className="w-4 h-4 rotate-90" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-white/50 transition-all">
                    <ChevronDownIcon className="w-4 h-4 -rotate-90" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Moderation Settings Modal */}
        {showModerationModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowModerationModal(false)}
            />
            
            {/* Modal Content */}
            <div className="relative w-full max-w-2xl max-h-[90vh] bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 rounded-3xl shadow-2xl overflow-hidden">
              {/* Modal Header */}
              <div className="relative z-10 p-6 border-b border-white/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <ShieldCheckIcon className="w-8 h-8 text-emerald-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Moderation Settings</h2>
                      <p className="text-gray-600">Configure how comments are managed on your channel</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowModerationModal(false)}
                    className="p-2 hover:bg-gray-100/50 rounded-full transition-colors"
                  >
                    <XCircleIcon className="w-6 h-6 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="relative z-10 p-6 overflow-y-auto max-h-[70vh]">
                <div className="space-y-6">
                  
                  {/* Auto-moderation Section */}
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-2xl blur-lg opacity-10"></div>
                    <div className="relative backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-lg" style={{backgroundColor: '#FFFAFA'}}>
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <ShieldCheckIcon className="w-5 h-5 text-emerald-600" />
                        Auto-moderation
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-medium text-gray-900">Auto-approve comments from subscribers</span>
                            <p className="text-sm text-gray-600">Automatically approve comments from your subscribers</p>
                          </div>
                          <button
                            onClick={() => setModerationSettings({...moderationSettings, autoApproveSubscribers: !moderationSettings.autoApproveSubscribers})}
                            className={`w-12 h-6 rounded-full relative transition-colors ${
                              moderationSettings.autoApproveSubscribers ? 'bg-emerald-500' : 'bg-gray-300'
                            }`}
                          >
                            <div className={`w-5 h-5 rounded-full absolute top-0.5 transition-transform ${
                              moderationSettings.autoApproveSubscribers ? 'translate-x-6' : 'translate-x-0.5'
                            }`} style={{backgroundColor: '#FFFAFA'}} />
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-medium text-gray-900">Hold all comments for manual review</span>
                            <p className="text-sm text-gray-600">All comments must be manually approved before showing</p>
                          </div>
                          <button
                            onClick={() => setModerationSettings({...moderationSettings, holdAllForReview: !moderationSettings.holdAllForReview})}
                            className={`w-12 h-6 rounded-full relative transition-colors ${
                              moderationSettings.holdAllForReview ? 'bg-emerald-500' : 'bg-gray-300'
                            }`}
                          >
                            <div className={`w-5 h-5 rounded-full absolute top-0.5 transition-transform ${
                              moderationSettings.holdAllForReview ? 'translate-x-6' : 'translate-x-0.5'
                            }`} style={{backgroundColor: '#FFFAFA'}} />
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-medium text-gray-900">Auto-detect spam and inappropriate content</span>
                            <p className="text-sm text-gray-600">Use AI to automatically filter problematic comments</p>
                          </div>
                          <button
                            onClick={() => setModerationSettings({...moderationSettings, spamDetection: !moderationSettings.spamDetection})}
                            className={`w-12 h-6 rounded-full relative transition-colors ${
                              moderationSettings.spamDetection ? 'bg-emerald-500' : 'bg-gray-300'
                            }`}
                          >
                            <div className={`w-5 h-5 rounded-full absolute top-0.5 transition-transform ${
                              moderationSettings.spamDetection ? 'translate-x-6' : 'translate-x-0.5'
                            }`} style={{backgroundColor: '#FFFAFA'}} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Keyword Filters Section */}
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-red-400 to-pink-400 rounded-2xl blur-lg opacity-10"></div>
                    <div className="relative backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-lg" style={{backgroundColor: '#FFFAFA'}}>
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <TrashIcon className="w-5 h-5 text-red-600" />
                        Keyword Filters
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">Comments containing these words will be automatically hidden</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {moderationSettings.keywordFilters.map((keyword, index) => (
                          <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                            {keyword}
                            <button
                              onClick={() => {
                                const newFilters = moderationSettings.keywordFilters.filter((_, i) => i !== index);
                                setModerationSettings({...moderationSettings, keywordFilters: newFilters});
                              }}
                              className="hover:text-red-900"
                            >
                              <XCircleIcon className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          id="keyword-input"
                          placeholder="Add keyword..."
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-red-300 focus:border-red-300"
                          style={{backgroundColor: '#FFFAFA'}}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && e.target.value.trim()) {
                              const newKeyword = e.target.value.trim();
                              if (!moderationSettings.keywordFilters.includes(newKeyword)) {
                                setModerationSettings({
                                  ...moderationSettings, 
                                  keywordFilters: [...moderationSettings.keywordFilters, newKeyword]
                                });
                              }
                              e.target.value = '';
                            }
                          }}
                        />
                        <button 
                          onClick={() => {
                            const input = document.getElementById('keyword-input') as HTMLInputElement;
                            const newKeyword = input.value.trim();
                            if (newKeyword && !moderationSettings.keywordFilters.includes(newKeyword)) {
                              setModerationSettings({
                                ...moderationSettings, 
                                keywordFilters: [...moderationSettings.keywordFilters, newKeyword]
                              });
                              input.value = '';
                            }
                          }}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          <PlusIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Visibility & Notifications Section */}
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-2xl blur-lg opacity-10"></div>
                    <div className="relative backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-lg" style={{backgroundColor: '#FFFAFA'}}>
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <EyeIcon className="w-5 h-5 text-blue-600" />
                        Visibility & Notifications
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Comment visibility</label>
                          <select
                            value={moderationSettings.commentVisibility}
                            onChange={(e) => setModerationSettings({...moderationSettings, commentVisibility: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
                            style={{backgroundColor: '#FFFAFA'}}
                          >
                            <option value="public">Public - Anyone can see and comment</option>
                            <option value="subscribers">Subscribers only - Only subscribers can comment</option>
                            <option value="disabled">Disabled - Comments are turned off</option>
                          </select>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-medium text-gray-900">Email notifications</span>
                            <p className="text-sm text-gray-600">Get notified about new comments via email</p>
                          </div>
                          <button
                            onClick={() => setModerationSettings({...moderationSettings, emailNotifications: !moderationSettings.emailNotifications})}
                            className={`w-12 h-6 rounded-full relative transition-colors ${
                              moderationSettings.emailNotifications ? 'bg-blue-500' : 'bg-gray-300'
                            }`}
                          >
                            <div className={`w-5 h-5 rounded-full absolute top-0.5 transition-transform ${
                              moderationSettings.emailNotifications ? 'translate-x-6' : 'translate-x-0.5'
                            }`} style={{backgroundColor: '#FFFAFA'}} />
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-medium text-gray-900">Push notifications</span>
                            <p className="text-sm text-gray-600">Get instant notifications about new comments</p>
                          </div>
                          <button
                            onClick={() => setModerationSettings({...moderationSettings, pushNotifications: !moderationSettings.pushNotifications})}
                            className={`w-12 h-6 rounded-full relative transition-colors ${
                              moderationSettings.pushNotifications ? 'bg-blue-500' : 'bg-gray-300'
                            }`}
                          >
                            <div className={`w-5 h-5 rounded-full absolute top-0.5 transition-transform ${
                              moderationSettings.pushNotifications ? 'translate-x-6' : 'translate-x-0.5'
                            }`} style={{backgroundColor: '#FFFAFA'}} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Modal Footer */}
              <div className="relative z-10 p-6 border-t border-white/20">
                <div className="flex gap-3">
                  <button 
                    onClick={() => setShowModerationModal(false)}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                  >
                    Save Settings
                  </button>
                  <button 
                    onClick={() => setShowModerationModal(false)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
                  >
                    Cancel
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