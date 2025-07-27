"use client";

import { useState } from "react";
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
} from "@heroicons/react/24/outline";

export default function StudioDashboard() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50"
      onMouseMove={handleMouseMove}
    >
      {/* Dynamic Gradient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-[600px] h-[600px] rounded-full opacity-40"
          style={{
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, transparent 70%)',
            left: `${mousePosition.x * 0.5}%`,
            top: `${mousePosition.y * 0.5}%`,
            transform: 'translate(-50%, -50%)',
            transition: 'all 0.3s ease-out',
          }}
        />
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-gradient-to-r from-violet-300 to-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute top-3/4 -right-48 w-96 h-96 bg-gradient-to-r from-blue-300 to-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-delayed"></div>
      </div>

      <div className="relative z-10 p-8 lg:p-12 max-w-7xl mx-auto">
        {/* Header with Floating Elements */}
        <div className="mb-16 relative">
          <div className="absolute -top-6 -left-6 text-8xl opacity-10 rotate-12">✨</div>
          <div className="absolute -bottom-4 right-0 text-6xl opacity-10 -rotate-12">🎬</div>
          
          <div className="flex items-start gap-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-pink-600 rounded-3xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
              <div className="relative p-4 bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 rounded-3xl shadow-2xl transform group-hover:scale-105 transition-transform">
                <SparklesIcon className="w-10 h-10 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
                Studio Command Center
              </h1>
              <p className="text-xl text-gray-600 font-light">Where magic happens, one frame at a time</p>
            </div>
          </div>
        </div>

        {/* Floating Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div 
            className="group relative transform hover:-translate-y-2 transition-all duration-300"
            onMouseEnter={() => setHoveredCard('views')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-3xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
            <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-white/50 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-purple-400 rounded-2xl blur-lg opacity-50"></div>
                    <div className="relative p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl">
                      <EyeIcon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full font-medium">
                    <ArrowTrendingUpIcon className="w-4 h-4" />
                    <span className="text-sm">+12%</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-4xl font-black text-gray-900">1.2M</p>
                  <p className="text-gray-600 font-medium">Total Views</p>
                  <div className="h-1 bg-gray-100 rounded-full overflow-hidden mt-3">
                    <div className="h-full w-3/4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div 
            className="group relative transform hover:-translate-y-2 transition-all duration-300"
            onMouseEnter={() => setHoveredCard('engagement')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-3xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
            <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-white/50 overflow-hidden">
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-200 to-cyan-200 rounded-full translate-y-16 -translate-x-16 opacity-50"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-400 rounded-2xl blur-lg opacity-50"></div>
                    <div className="relative p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl">
                      <ChartBarIcon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-orange-100 text-orange-700 px-3 py-1.5 rounded-full font-medium">
                    <FireIcon className="w-4 h-4" />
                    <span className="text-sm">Hot!</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-4xl font-black text-gray-900">8.4%</p>
                  <p className="text-gray-600 font-medium">Engagement Rate</p>
                  <div className="flex gap-1 mt-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className={`h-8 w-2 rounded-full ${i < 4 ? 'bg-gradient-to-t from-blue-500 to-cyan-500' : 'bg-gray-200'}`}></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div 
            className="group relative transform hover:-translate-y-2 transition-all duration-300"
            onMouseEnter={() => setHoveredCard('subscribers')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-3xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
            <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-white/50 overflow-hidden">
              <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-emerald-200 to-teal-200 rounded-full -translate-y-12 -translate-x-12 opacity-50"></div>
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-emerald-200 to-teal-200 rounded-full translate-y-12 translate-x-12 opacity-50"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-emerald-400 rounded-2xl blur-lg opacity-50"></div>
                    <div className="relative p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl">
                      <UserGroupIcon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-purple-100 text-purple-700 px-3 py-1.5 rounded-full font-medium">
                    <SparklesIcon className="w-4 h-4" />
                    <span className="text-sm">New!</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-4xl font-black text-gray-900">2.8K</p>
                  <p className="text-gray-600 font-medium">New Subscribers</p>
                  <div className="flex -space-x-2 mt-3">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 border-2 border-white"></div>
                    ))}
                    <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600">+</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div 
            className="group relative transform hover:-translate-y-2 transition-all duration-300"
            onMouseEnter={() => setHoveredCard('revenue')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-400 rounded-3xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
            <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-white/50 overflow-hidden">
              <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-gradient-to-br from-amber-200 to-orange-200 rounded-full opacity-30"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-amber-400 rounded-2xl blur-lg opacity-50"></div>
                    <div className="relative p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl">
                      <CurrencyDollarIcon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full font-medium">
                    <ArrowTrendingUpIcon className="w-4 h-4" />
                    <span className="text-sm">+18%</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-4xl font-black text-gray-900">$2,847</p>
                  <p className="text-gray-600 font-medium">Revenue</p>
                  <div className="mt-3 text-3xl">💸</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Creative Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Create Content Card - Floating Design */}
          <div className="group relative transform hover:scale-105 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-600 rounded-3xl blur-2xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
            <div className="relative bg-gradient-to-br from-violet-600 via-purple-600 to-pink-600 rounded-3xl p-8 overflow-hidden">
              {/* Decorative Elements */}
              <div className="absolute top-4 right-4 text-6xl opacity-20 rotate-12">🎥</div>
              <div className="absolute bottom-4 left-4 text-4xl opacity-20 -rotate-12">✨</div>
              <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              
              <div className="relative z-10">
                <div className="inline-flex p-4 bg-white/20 backdrop-blur-xl rounded-2xl mb-6 transform group-hover:rotate-3 transition-transform">
                  <VideoCameraIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-black text-white mb-3">Create Magic ✨</h3>
                <p className="text-purple-100 mb-6 text-lg leading-relaxed">
                  Your next viral hit is just a click away. Let's make something extraordinary!
                </p>
                <button className="group/btn relative overflow-hidden bg-white text-purple-700 px-8 py-4 rounded-full font-bold hover:shadow-2xl transition-all duration-300">
                  <span className="relative z-10">Start Creating</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-200 to-purple-200 transform translate-y-full group-hover/btn:translate-y-0 transition-transform"></div>
                  <CursorArrowRaysIcon className="inline-block w-5 h-5 ml-2 group-hover/btn:rotate-12 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* Analytics Card - Data Visualization */}
          <div className="group relative transform hover:scale-105 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl blur-2xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
            <div className="relative bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-600 rounded-3xl p-8 overflow-hidden">
              {/* Decorative Chart Elements */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute bottom-0 left-0 right-0 flex items-end justify-around h-32 px-4">
                  <div className="w-8 h-16 bg-white/30 rounded-t"></div>
                  <div className="w-8 h-24 bg-white/30 rounded-t"></div>
                  <div className="w-8 h-20 bg-white/30 rounded-t"></div>
                  <div className="w-8 h-28 bg-white/30 rounded-t"></div>
                  <div className="w-8 h-12 bg-white/30 rounded-t"></div>
                </div>
              </div>
              
              <div className="relative z-10">
                <div className="inline-flex p-4 bg-white/20 backdrop-blur-xl rounded-2xl mb-6 transform group-hover:-rotate-3 transition-transform">
                  <ChartBarIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-black text-white mb-3">Data Paradise 📊</h3>
                <p className="text-blue-100 mb-6 text-lg leading-relaxed">
                  Numbers that tell stories. Insights that inspire action.
                </p>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-white/20 backdrop-blur rounded-2xl p-3 text-center transform hover:scale-110 transition-transform">
                    <p className="text-2xl font-bold text-white">92%</p>
                    <p className="text-blue-100 text-sm">Happy</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur rounded-2xl p-3 text-center transform hover:scale-110 transition-transform">
                    <p className="text-2xl font-bold text-white">4.8⭐</p>
                    <p className="text-blue-100 text-sm">Stars</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur rounded-2xl p-3 text-center transform hover:scale-110 transition-transform">
                    <p className="text-2xl font-bold text-white">∞</p>
                    <p className="text-blue-100 text-sm">Potential</p>
                  </div>
                </div>
                <button className="group/btn relative overflow-hidden bg-white text-blue-700 px-8 py-4 rounded-full font-bold hover:shadow-2xl transition-all duration-300">
                  <span className="relative z-10">Explore Analytics</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-200 to-blue-200 transform translate-x-full group-hover/btn:translate-x-0 transition-transform"></div>
                  <ArrowTrendingUpIcon className="inline-block w-5 h-5 ml-2 group-hover/btn:rotate-45 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity - Playful List */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-3xl blur-lg opacity-20"></div>
          <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-white/50">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <h2 className="text-3xl font-black text-gray-900">Fresh Off The Press</h2>
                <span className="text-2xl animate-bounce">🎬</span>
              </div>
              <button className="text-purple-600 hover:text-purple-700 font-bold hover:underline decoration-wavy underline-offset-4">View All →</button>
            </div>
          
            <div className="space-y-4">
              {[
                { 
                  title: "Building a Design System from Scratch", 
                  views: "12.4K", 
                  time: "2 hrs ago", 
                  status: "Live",
                  thumbnail: "🎨",
                  trend: "+24%"
                },
                { 
                  title: "React Server Components Deep Dive", 
                  views: "8.2K", 
                  time: "5 hrs ago", 
                  status: "Processing",
                  thumbnail: "⚛️",
                  trend: "+18%"
                },
                { 
                  title: "TypeScript Best Practices 2024", 
                  views: "6.7K", 
                  time: "1 day ago", 
                  status: "Published",
                  thumbnail: "📘",
                  trend: "+12%"
                },
              ].map((video, i) => (
                <div key={i} className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative flex items-center gap-4 p-5 bg-white/50 backdrop-blur rounded-2xl border border-gray-100 hover:border-purple-200 transition-all duration-300 cursor-pointer">
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-200 to-pink-200 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 group-hover:rotate-3 transition-all">
                        {video.thumbnail}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 group-hover:text-purple-700 transition-colors text-lg">
                        {video.title}
                      </h3>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="flex items-center gap-1 text-sm text-gray-600">
                          <EyeIcon className="w-4 h-4" />
                          {video.views}
                        </span>
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm text-gray-500">{video.time}</span>
                        <span className="text-sm font-medium text-emerald-600">{video.trend}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className={`px-4 py-2 rounded-full text-sm font-bold ${
                        video.status === 'Live' 
                          ? 'bg-red-500 text-white animate-pulse' 
                          : video.status === 'Published'
                          ? 'bg-gradient-to-r from-green-400 to-emerald-400 text-white'
                          : 'bg-gradient-to-r from-yellow-400 to-amber-400 text-white'
                      }`}>
                        {video.status}
                      </div>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                        <EllipsisVerticalIcon className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
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