"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function StudioDashboard() {
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [hoveredVideo, setHoveredVideo] = useState<number | null>(null);

  // Simulated real-time data
  const [liveViewers, setLiveViewers] = useState(1847);
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveViewers(prev => prev + Math.floor(Math.random() * 10 - 5));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const metrics = {
    views: { value: "1.2M", label: "Total Views", detail: "847K from browse, 353K from search" },
    retention: { value: "68%", label: "Avg Retention", detail: "Best: 'How to Edit' at 84%" },
    revenue: { value: "$2.8K", label: "Est. Revenue", detail: "Ad revenue: $2.1K, Channel memberships: $700" },
    growth: { value: "+18%", label: "Growth Rate", detail: "5.7K new subscribers this week" },
  };

  const topVideos = [
    { 
      id: 1, 
      title: "The Future of AI Video Creation", 
      metrics: { views: "234K", retention: "72%", revenue: "$487" },
      thumbnail: "/api/placeholder/400/225",
      trend: "rising"
    },
    { 
      id: 2, 
      title: "Behind the Algorithm: How Views Work", 
      metrics: { views: "189K", retention: "81%", revenue: "$412" },
      thumbnail: "/api/placeholder/400/225",
      trend: "stable"
    },
    { 
      id: 3, 
      title: "Studio Setup Tour 2024", 
      metrics: { views: "156K", retention: "69%", revenue: "$378" },
      thumbnail: "/api/placeholder/400/225",
      trend: "declining"
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#1A1A1A] p-4 lg:p-12">
      {/* Editorial Header */}
      <header className="mb-16">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-7xl lg:text-9xl font-thin tracking-tight leading-none mb-2">
              Studio
            </h1>
            <div className="text-sm uppercase tracking-[0.3em] text-gray-500">
              Analytics & Performance
            </div>
          </div>
          <div className="text-right">
            <div className="text-5xl font-light tabular-nums">
              {liveViewers.toLocaleString()}
            </div>
            <div className="text-xs uppercase tracking-wider text-gray-500 mt-1">
              Live Now
            </div>
          </div>
        </div>
        
        {/* Horizontal Rule with Date */}
        <div className="border-t border-black/10 pt-4">
          <time className="text-xs uppercase tracking-wider text-gray-500">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </time>
        </div>
      </header>

      {/* Key Metrics - Editorial Grid */}
      <section className="mb-20">
        <h2 className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-8">
          Key Performance Indicators
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-black/10">
          {Object.entries(metrics).map(([key, metric]) => (
            <motion.div
              key={key}
              className="bg-[#FAFAF8] p-8 cursor-pointer relative overflow-hidden"
              onClick={() => setSelectedMetric(selectedMetric === key ? null : key)}
              whileHover={{ backgroundColor: "#F5F5F3" }}
            >
              <div className="relative z-10">
                <div className="text-4xl lg:text-5xl font-light mb-2">
                  {metric.value}
                </div>
                <div className="text-sm uppercase tracking-wider text-gray-600">
                  {metric.label}
                </div>
                
                <AnimatePresence>
                  {selectedMetric === key && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 pt-4 border-t border-black/10"
                    >
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {metric.detail}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Decorative number */}
              <div className="absolute -bottom-4 -right-4 text-[120px] font-thin text-black/5 leading-none select-none">
                {key === 'views' && '01'}
                {key === 'retention' && '02'}
                {key === 'revenue' && '03'}
                {key === 'growth' && '04'}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Top Performing Content - Magazine Layout */}
      <section className="mb-20">
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="text-xs uppercase tracking-[0.3em] text-gray-500">
            Top Performing Content
          </h2>
          <button className="text-xs uppercase tracking-wider text-gray-600 hover:text-black transition-colors">
            View All →
          </button>
        </div>

        <div className="space-y-px bg-black/10">
          {topVideos.map((video, index) => (
            <motion.article
              key={video.id}
              className="bg-[#FAFAF8] hover:bg-[#F5F5F3] transition-colors"
              onHoverStart={() => setHoveredVideo(video.id)}
              onHoverEnd={() => setHoveredVideo(null)}
            >
              <div className="grid grid-cols-12 gap-8 p-8">
                {/* Index */}
                <div className="col-span-1 text-5xl font-thin text-gray-300">
                  {String(index + 1).padStart(2, '0')}
                </div>

                {/* Content */}
                <div className="col-span-7">
                  <h3 className="text-2xl lg:text-3xl font-light leading-tight mb-4">
                    {video.title}
                  </h3>
                  
                  <div className="flex items-center gap-8 text-sm">
                    <div>
                      <span className="text-gray-500">Views</span>
                      <span className="ml-2 font-medium">{video.metrics.views}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Retention</span>
                      <span className="ml-2 font-medium">{video.metrics.retention}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Revenue</span>
                      <span className="ml-2 font-medium">{video.metrics.revenue}</span>
                    </div>
                  </div>
                </div>

                {/* Trend Indicator */}
                <div className="col-span-4 flex items-center justify-end">
                  <div className="text-right">
                    <div className={`text-sm uppercase tracking-wider ${
                      video.trend === 'rising' ? 'text-green-600' : 
                      video.trend === 'declining' ? 'text-red-600' : 
                      'text-gray-500'
                    }`}>
                      {video.trend}
                    </div>
                    
                    {/* Minimalist sparkline */}
                    <svg width="80" height="30" className="mt-2">
                      <path
                        d={video.trend === 'rising' ? 
                          "M0,25 L20,20 L40,15 L60,10 L80,5" : 
                          video.trend === 'declining' ?
                          "M0,5 L20,10 L40,15 L60,20 L80,25" :
                          "M0,15 L20,14 L40,15 L60,14 L80,15"
                        }
                        fill="none"
                        stroke={
                          video.trend === 'rising' ? '#16a34a' : 
                          video.trend === 'declining' ? '#dc2626' : 
                          '#9ca3af'
                        }
                        strokeWidth="1"
                        opacity="0.5"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Hover Preview */}
              <AnimatePresence>
                {hoveredVideo === video.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-black/10"
                  >
                    <div className="p-8 grid grid-cols-12 gap-8">
                      <div className="col-span-1"></div>
                      <div className="col-span-11">
                        <div className="bg-black/5 aspect-video rounded-sm"></div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Quick Actions - Minimal */}
      <section className="border-t border-black/10 pt-12">
        <div className="flex items-center gap-4">
          <motion.button
            className="px-8 py-4 bg-black text-white text-sm uppercase tracking-wider hover:bg-gray-800 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Upload New
          </motion.button>
          <motion.button
            className="px-8 py-4 border border-black/20 text-sm uppercase tracking-wider hover:border-black hover:bg-black hover:text-white transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            View Analytics
          </motion.button>
          <motion.button
            className="px-8 py-4 text-sm uppercase tracking-wider hover:text-gray-600 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Settings
          </motion.button>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-32 pt-8 border-t border-black/10">
        <div className="flex items-center justify-between text-xs uppercase tracking-wider text-gray-500">
          <div>Fabl Studio™</div>
          <div>Last sync: {new Date().toLocaleTimeString()}</div>
        </div>
      </footer>
    </div>
  );
}
