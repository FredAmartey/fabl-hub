"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  ChatBubbleLeftRightIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
  HeartIcon,
  ExclamationTriangleIcon,
  CheckIcon,
  XMarkIcon,
  EllipsisHorizontalIcon,
  UserIcon,
  ClockIcon,
  EyeIcon,
  FlagIcon
} from "@heroicons/react/24/outline";
import { CustomSelect } from "@/components/ui/custom-select";

export default function CommentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedComments, setSelectedComments] = useState<number[]>([]);

  const filterOptions = [
    { value: 'all', label: 'All Comments' },
    { value: 'pending', label: 'Pending Review' },
    { value: 'approved', label: 'Approved' },
    { value: 'spam', label: 'Marked as Spam' },
    { value: 'reported', label: 'Reported' }
  ];

  const comments = [
    {
      id: 1,
      author: {
        name: "Alex Chen",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&auto=format&fit=crop&crop=faces",
        verified: true
      },
      content: "This is exactly what I was looking for! The explanation of React Server Components is crystal clear. Thank you for making such quality content!",
      video: {
        title: "React Server Components Explained",
        thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=60&h=40&auto=format&fit=crop"
      },
      timestamp: "2 hours ago",
      likes: 24,
      replies: 3,
      status: "approved",
      sentiment: "positive"
    },
    {
      id: 2,
      author: {
        name: "Sarah Johnson",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&auto=format&fit=crop&crop=faces",
        verified: false
      },
      content: "Could you please make a follow-up video about error boundaries in Next.js? I'm struggling with implementing them properly in my project.",
      video: {
        title: "Building a Modern Web App with Next.js 14",
        thumbnail: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=60&h=40&auto=format&fit=crop"
      },
      timestamp: "5 hours ago",
      likes: 12,
      replies: 1,
      status: "approved",
      sentiment: "neutral"
    },
    {
      id: 3,
      author: {
        name: "SpamBot123",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&auto=format&fit=crop&crop=faces",
        verified: false
      },
      content: "🔥🔥 AMAZING CRYPTO OPPORTUNITY!!! 💰💰 Click my profile for FREE MONEY!!! Don't miss out!!!",
      video: {
        title: "TypeScript Best Practices 2024",
        thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=60&h=40&auto=format&fit=crop"
      },
      timestamp: "1 day ago",
      likes: 0,
      replies: 0,
      status: "spam",
      sentiment: "negative"
    },
    {
      id: 4,
      author: {
        name: "DevMaster92",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&auto=format&fit=crop&crop=faces",
        verified: false
      },
      content: "This content seems inappropriate and doesn't match the video topic. Please review.",
      video: {
        title: "AI Integration Tutorial - Part 1",
        thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=60&h=40&auto=format&fit=crop"
      },
      timestamp: "2 days ago",
      likes: 3,
      replies: 0,
      status: "reported",
      sentiment: "negative"
    },
    {
      id: 5,
      author: {
        name: "TechEnthusiast",
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=40&h=40&auto=format&fit=crop&crop=faces",
        verified: true
      },
      content: "Waiting for approval... This tutorial helped me solve a major bug in my production app. The section about state management is particularly valuable.",
      video: {
        title: "Live Coding: Building a SaaS Dashboard",
        thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=60&h=40&auto=format&fit=crop"
      },
      timestamp: "3 days ago",
      likes: 8,
      replies: 2,
      status: "pending",
      sentiment: "positive"
    }
  ];

  const getStatusBadge = (status: string) => {
    const badges = {
      approved: { bg: "bg-green-500/20", text: "text-green-400", icon: CheckIcon },
      pending: { bg: "bg-yellow-500/20", text: "text-yellow-400", icon: ClockIcon },
      spam: { bg: "bg-red-500/20", text: "text-red-400", icon: XMarkIcon },
      reported: { bg: "bg-orange-500/20", text: "text-orange-400", icon: FlagIcon }
    };
    
    const badge = badges[status as keyof typeof badges];
    const Icon = badge.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        <Icon className="w-3 h-3" />
        {status}
      </span>
    );
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <HeartIcon className="w-4 h-4 text-green-400" />;
      case 'negative':
        return <ExclamationTriangleIcon className="w-4 h-4 text-red-400" />;
      default:
        return <ChatBubbleLeftRightIcon className="w-4 h-4 text-gray-400" />;
    }
  };

  const handleSelectComment = (commentId: number) => {
    setSelectedComments(prev =>
      prev.includes(commentId)
        ? prev.filter(id => id !== commentId)
        : [...prev, commentId]
    );
  };

  const filteredComments = comments.filter(comment => {
    const matchesSearch = comment.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         comment.author.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || comment.status === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-studio-background text-studio-text-primary font-afacad">
      <div className="p-xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-xl h-20 border-b border-studio-border pb-xl"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-studio-surface rounded-base border border-studio-border">
              <ChatBubbleLeftRightIcon className="w-6 h-6 text-studio-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-studio-text-primary">Comments Management</h1>
              <p className="text-sm text-studio-text-secondary mt-1">
                Moderate and engage with your community
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {selectedComments.length > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 bg-studio-surface border border-studio-border rounded-base">
                <span className="text-sm text-studio-text-secondary">{selectedComments.length} selected</span>
                <button className="px-3 py-1.5 bg-green-500/20 text-green-400 rounded text-xs font-medium hover:bg-green-500/30 transition-colors">
                  Approve
                </button>
                <button className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded text-xs font-medium hover:bg-red-500/30 transition-colors">
                  Delete
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-xl"
        >
          <div className="bg-studio-surface border border-studio-border rounded-xl p-6 hover:border-studio-primary/50 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <ChatBubbleLeftRightIcon className="w-5 h-5 text-blue-400" />
              <h3 className="text-sm font-medium text-studio-text-secondary">Total Comments</h3>
            </div>
            <p className="text-2xl font-semibold text-studio-text-primary">1,247</p>
            <p className="text-xs text-studio-text-muted mt-1">+23 this week</p>
          </div>

          <div className="bg-studio-surface border border-studio-border rounded-xl p-6 hover:border-studio-primary/50 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <ClockIcon className="w-5 h-5 text-yellow-400" />
              <h3 className="text-sm font-medium text-studio-text-secondary">Pending Review</h3>
            </div>
            <p className="text-2xl font-semibold text-studio-text-primary">12</p>
            <p className="text-xs text-studio-text-muted mt-1">Needs attention</p>
          </div>

          <div className="bg-studio-surface border border-studio-border rounded-xl p-6 hover:border-studio-primary/50 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <FlagIcon className="w-5 h-5 text-orange-400" />
              <h3 className="text-sm font-medium text-studio-text-secondary">Reported</h3>
            </div>
            <p className="text-2xl font-semibold text-studio-text-primary">3</p>
            <p className="text-xs text-studio-text-muted mt-1">Community reports</p>
          </div>

          <div className="bg-studio-surface border border-studio-border rounded-xl p-6 hover:border-studio-primary/50 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <HeartIcon className="w-5 h-5 text-green-400" />
              <h3 className="text-sm font-medium text-studio-text-secondary">Engagement Rate</h3>
            </div>
            <p className="text-2xl font-semibold text-studio-text-primary">87%</p>
            <p className="text-xs text-studio-text-muted mt-1">Positive sentiment</p>
          </div>

          <div className="bg-studio-surface border border-studio-border rounded-xl p-6 hover:border-studio-primary/50 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <XMarkIcon className="w-5 h-5 text-red-400" />
              <h3 className="text-sm font-medium text-studio-text-secondary">Spam Blocked</h3>
            </div>
            <p className="text-2xl font-semibold text-studio-text-primary">89</p>
            <p className="text-xs text-studio-text-muted mt-1">Auto-filtered</p>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-4 mb-6"
        >
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-studio-text-muted" />
            <input
              type="text"
              placeholder="Search comments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-studio-surface border border-studio-border rounded-base text-studio-text-primary placeholder-studio-text-muted focus:outline-none focus:border-studio-primary text-sm"
            />
          </div>

          <CustomSelect
            options={filterOptions}
            placeholder="Filter by status"
            defaultValue="all"
            onChange={(value) => setFilterType(value)}
            className="w-48"
          />
        </motion.div>

        {/* Comments List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-studio-surface border border-studio-border rounded-xl overflow-hidden"
        >
          <div className="divide-y divide-studio-border">
            {filteredComments.map((comment, index) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className={`p-6 hover:bg-studio-background/50 transition-colors ${
                  selectedComments.includes(comment.id) ? 'bg-studio-primary/5 border-l-4 border-studio-primary' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <input
                    type="checkbox"
                    checked={selectedComments.includes(comment.id)}
                    onChange={() => handleSelectComment(comment.id)}
                    className="mt-1 w-4 h-4 rounded border-studio-border text-studio-primary focus:ring-studio-primary focus:ring-offset-0"
                  />

                  <img
                    src={comment.author.avatar}
                    alt={comment.author.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-sm font-medium text-studio-text-primary">{comment.author.name}</h3>
                      {comment.author.verified && (
                        <CheckIcon className="w-4 h-4 text-blue-400" />
                      )}
                      <span className="text-xs text-studio-text-muted">•</span>
                      <span className="text-xs text-studio-text-muted">{comment.timestamp}</span>
                      {getStatusBadge(comment.status)}
                    </div>

                    <p className="text-sm text-studio-text-primary mb-3 leading-relaxed">
                      {comment.content}
                    </p>

                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-2">
                        <img
                          src={comment.video.thumbnail}
                          alt={comment.video.title}
                          className="w-12 h-8 rounded object-cover"
                        />
                        <span className="text-xs text-studio-text-muted max-w-48 truncate">
                          {comment.video.title}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <HandThumbUpIcon className="w-4 h-4 text-studio-text-muted" />
                          <span className="text-xs text-studio-text-muted">{comment.likes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ChatBubbleLeftRightIcon className="w-4 h-4 text-studio-text-muted" />
                          <span className="text-xs text-studio-text-muted">{comment.replies} replies</span>
                        </div>
                        {getSentimentIcon(comment.sentiment)}
                      </div>

                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-studio-background rounded-lg transition-colors">
                          <EyeIcon className="w-4 h-4 text-studio-text-muted" />
                        </button>
                        <button className="p-2 hover:bg-studio-background rounded-lg transition-colors">
                          <EllipsisHorizontalIcon className="w-4 h-4 text-studio-text-muted" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredComments.length === 0 && (
            <div className="p-12 text-center">
              <ChatBubbleLeftRightIcon className="w-12 h-12 text-studio-text-muted mx-auto mb-4" />
              <h3 className="text-lg font-medium text-studio-text-primary mb-2">No comments found</h3>
              <p className="text-sm text-studio-text-muted">
                {searchQuery || filterType !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Comments will appear here as they come in'}
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}