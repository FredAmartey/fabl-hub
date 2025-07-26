"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  PlayIcon,
  EyeIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ClockIcon,
  SparklesIcon,
  RocketLaunchIcon,
  LightBulbIcon,
  GlobeAltIcon,
  UserGroupIcon,
  HeartIcon,
  ChatBubbleLeftRightIcon,
  ArrowUpRightIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/outline";

export default function StudioDashboard() {
  const [greeting, setGreeting] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    setCurrentTime(
      new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    );

    // Simulate upload progress
    const timer = setInterval(() => {
      setUploadProgress((prev) => (prev < 100 ? prev + 1 : 0));
    }, 50);

    return () => clearInterval(timer);
  }, []);

  const stats = [
    {
      label: "Total Views",
      value: "1.2M",
      change: "+12.5%",
      trend: "up",
      icon: EyeIcon,
      gradient: "from-blue-500 to-cyan-500",
      period: "vs last month",
    },
    {
      label: "Watch Time",
      value: "847h",
      change: "+8.3%",
      trend: "up",
      icon: ClockIcon,
      gradient: "from-purple-500 to-pink-500",
      period: "this month",
    },
    {
      label: "Revenue",
      value: "$2,840",
      change: "+23.1%",
      trend: "up",
      icon: CurrencyDollarIcon,
      gradient: "from-green-500 to-emerald-500",
      period: "this month",
    },
    {
      label: "Subscribers",
      value: "45.2K",
      change: "+5.7%",
      trend: "up",
      icon: UserGroupIcon,
      gradient: "from-orange-500 to-red-500",
      period: "new this week",
    },
  ];

  const quickActions = [
    {
      title: "Upload Video",
      description: "Share your latest creation",
      icon: VideoCameraIcon,
      color: "from-purple-500 to-pink-500",
      action: "upload",
    },
    {
      title: "Go Live",
      description: "Connect with your audience",
      icon: RocketLaunchIcon,
      color: "from-red-500 to-orange-500",
      action: "live",
    },
    {
      title: "Create Short",
      description: "Quick vertical content",
      icon: SparklesIcon,
      color: "from-blue-500 to-cyan-500",
      action: "short",
    },
    {
      title: "Analytics",
      description: "View detailed insights",
      icon: ChartBarIcon,
      color: "from-green-500 to-emerald-500",
      action: "analytics",
    },
  ];

  const recentVideos = [
    {
      id: 1,
      title: "Building a Modern React App",
      thumbnail:
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300&h=200&auto=format&fit=crop",
      views: "23.4K",
      likes: "1.2K",
      comments: "89",
      uploadDate: "2 days ago",
      status: "published",
      duration: "15:42",
    },
    {
      id: 2,
      title: "Next.js 14 Features Deep Dive",
      thumbnail:
        "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=300&h=200&auto=format&fit=crop",
      views: "18.7K",
      likes: "956",
      comments: "67",
      uploadDate: "5 days ago",
      status: "published",
      duration: "22:15",
    },
    {
      id: 3,
      title: "TypeScript Tips for Beginners",
      thumbnail:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&auto=format&fit=crop",
      views: "31.2K",
      likes: "1.8K",
      comments: "124",
      uploadDate: "1 week ago",
      status: "published",
      duration: "18:33",
    },
  ];

  const insights = [
    {
      title: "Peak Viewing Time",
      value: "8-10 PM",
      description: "Your audience is most active during evening hours",
      icon: ClockIcon,
      trend: "info",
    },
    {
      title: "Top Performing Tag",
      value: "#javascript",
      description: "Videos with this tag get 40% more views",
      icon: LightBulbIcon,
      trend: "success",
    },
    {
      title: "Audience Geography",
      value: "North America",
      description: "68% of your viewers are from this region",
      icon: GlobeAltIcon,
      trend: "info",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <div className="min-h-screen p-8 space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden"
      >
        <div className="relative z-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-2">
            {greeting}, Alex! ✨
          </h1>
          <p className="text-lg text-white/60 font-medium">{currentTime}</p>
          <p className="text-white/50 mt-1">Ready to create something amazing today?</p>
        </div>

        {/* Floating elements */}
        <motion.div
          animate={{
            y: [0, -10, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-0 right-20 w-16 h-16 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl"
        />
      </motion.div>

      {/* Stats Grid - Bento Layout */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            variants={itemVariants}
            whileHover={{
              scale: 1.02,
              y: -4,
              transition: { type: "spring", stiffness: 400, damping: 25 },
            }}
            className="group relative overflow-hidden"
          >
            <div className="relative p-6 backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl hover:border-white/20 transition-all duration-500">
              {/* Gradient overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl`}
              />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-2xl bg-gradient-to-br ${stat.gradient}`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div
                    className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                      stat.trend === "up"
                        ? "text-green-400 bg-green-500/20"
                        : "text-red-400 bg-red-500/20"
                    }`}
                  >
                    {stat.trend === "up" ? (
                      <ArrowTrendingUpIcon className="w-3 h-3" />
                    ) : (
                      <ArrowTrendingDownIcon className="w-3 h-3" />
                    )}
                    {stat.change}
                  </div>
                </div>

                <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
                <p className="text-sm text-white/60 font-medium">{stat.label}</p>
                <p className="text-xs text-white/40 mt-1">{stat.period}</p>
              </div>

              {/* Shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 opacity-0 group-hover:opacity-100"
                animate={{
                  x: ["-100%", "200%"],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  repeatDelay: 3,
                }}
              />
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Quick Actions - Left Column */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="xl:col-span-1"
        >
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <RocketLaunchIcon className="w-5 h-5 text-purple-400" />
              Quick Actions
            </h2>

            <div className="space-y-3">
              {quickActions.map((action, index) => (
                <motion.button
                  key={action.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full group"
                >
                  <div
                    className={`relative overflow-hidden p-4 rounded-2xl bg-gradient-to-r ${action.color} hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300`}
                  >
                    <div className="flex items-center gap-3">
                      <action.icon className="w-6 h-6 text-white" />
                      <div className="text-left">
                        <h3 className="font-semibold text-white">{action.title}</h3>
                        <p className="text-sm text-white/80">{action.description}</p>
                      </div>
                      <ArrowUpRightIcon className="w-4 h-4 text-white/60 ml-auto group-hover:text-white transition-colors" />
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Upload Progress */}
            {uploadProgress > 0 && uploadProgress < 100 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-6 p-4 bg-white/5 rounded-2xl border border-white/10"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-white">Uploading video...</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <motion.div
                    className="h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-xs text-white/60 mt-1">{uploadProgress}% complete</p>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Recent Videos - Right Columns */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="xl:col-span-2"
        >
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <PlayIcon className="w-5 h-5 text-blue-400" />
                Recent Videos
              </h2>
              <button className="text-sm text-white/60 hover:text-white transition-colors">
                View all
              </button>
            </div>

            <div className="space-y-4">
              {recentVideos.map((video, index) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.01, x: 4 }}
                  className="group p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative flex-shrink-0 w-24 h-16">
                      <Image
                        src={video.thumbnail}
                        alt={video.title}
                        fill
                        className="rounded-xl object-cover"
                      />
                      <div className="absolute bottom-1 right-1 bg-black/80 px-1.5 py-0.5 rounded text-xs font-medium text-white z-10">
                        {video.duration}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white truncate group-hover:text-purple-200 transition-colors">
                        {video.title}
                      </h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-white/60">
                        <span className="flex items-center gap-1">
                          <EyeIcon className="w-4 h-4" />
                          {video.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <HeartIcon className="w-4 h-4" />
                          {video.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <ChatBubbleLeftRightIcon className="w-4 h-4" />
                          {video.comments}
                        </span>
                      </div>
                      <p className="text-xs text-white/40 mt-1">{video.uploadDate}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                        {video.status}
                      </span>
                      <ArrowUpRightIcon className="w-4 h-4 text-white/40 group-hover:text-white/60 transition-colors" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Insights Section */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6"
      >
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <LightBulbIcon className="w-5 h-5 text-yellow-400" />
          AI-Powered Insights
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {insights.map((insight, index) => (
            <motion.div
              key={insight.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20">
                  <insight.icon className="w-5 h-5 text-yellow-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1">{insight.title}</h3>
                  <p className="text-lg font-bold text-purple-200 mb-2">{insight.value}</p>
                  <p className="text-sm text-white/60 leading-relaxed">{insight.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
