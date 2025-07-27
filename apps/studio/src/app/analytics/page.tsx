"use client";

import { useState } from "react";
import {
  ChartBarIcon,
  EyeIcon,
  UserGroupIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarIcon,
  GlobeAltIcon,
  CurrencyDollarIcon,
  ChevronDownIcon,
  SparklesIcon,
  FireIcon,
  BoltIcon,
  TrophyIcon,
} from "@heroicons/react/24/outline";

const analyticsData = {
  overview: {
    totalViews: "1,284,592",
    totalWatchTime: "4,283 hours",
    subscribers: "12,847",
    engagement: "8.4%",
    revenue: "$2,847.50"
  },
  recentVideos: [
    {
      title: "Building a Modern Web App",
      views: "125,632",
      watchTime: "2h 34m",
      engagement: "12.3%",
      revenue: "$284.50",
      trend: "+24%",
      emoji: "🚀"
    },
    {
      title: "React Server Components",
      views: "94,234",
      watchTime: "1h 47m",
      engagement: "9.8%",
      revenue: "$198.20",
      trend: "+18%",
      emoji: "⚛️"
    },
    {
      title: "TypeScript Best Practices",
      views: "67,891",
      watchTime: "1h 23m",
      engagement: "11.2%",
      revenue: "$156.30",
      trend: "+15%",
      emoji: "📘"
    }
  ],
  topCountries: [
    { country: "United States", percentage: 34, views: "436,841", emoji: "🇺🇸" },
    { country: "United Kingdom", percentage: 18, views: "231,227", emoji: "🇬🇧" },
    { country: "Canada", percentage: 12, views: "154,151", emoji: "🇨🇦" },
    { country: "Germany", percentage: 8, views: "102,767", emoji: "🇩🇪" },
    { country: "Australia", percentage: 6, views: "77,075", emoji: "🇦🇺" }
  ]
};

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("28d");
  const [selectedMetric, setSelectedMetric] = useState("views");
  const [hoveredStat, setHoveredStat] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -right-48 w-96 h-96 bg-gradient-to-r from-cyan-300 to-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute bottom-1/4 -left-48 w-96 h-96 bg-gradient-to-r from-purple-300 to-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-delayed"></div>
      </div>

      <div className="relative z-10 p-8 lg:p-12 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl blur-xl opacity-50"></div>
                <div className="relative p-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl">
                  <ChartBarIcon className="w-10 h-10 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
                  Analytics Central
                </h1>
                <p className="text-xl text-gray-600 font-light mt-1">Your success story in numbers</p>
              </div>
              <span className="text-4xl ml-4">📊</span>
            </div>
            
            {/* Period Selector */}
            <div className="flex items-center gap-3">
              <button className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <div className="relative flex items-center gap-2 bg-white px-6 py-3 rounded-xl shadow-lg">
                  <CalendarIcon className="w-5 h-5 text-gray-700" />
                  <span className="font-bold text-gray-900">Last 28 days</span>
                  <ChevronDownIcon className="w-4 h-4 text-gray-600" />
                </div>
              </button>
              <button className="group relative transform hover:scale-105 transition-all duration-300">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-lg opacity-70 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative px-8 py-3 bg-white rounded-full shadow-xl">
                  <span className="font-bold text-gray-900">Export Report 📈</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Metrics Cards - Floating Design */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          {[
            { 
              label: "Total Views", 
              value: analyticsData.overview.totalViews, 
              icon: EyeIcon, 
              trend: "+12.5%", 
              color: "from-purple-500 to-pink-500",
              emoji: "👀",
              isPositive: true
            },
            { 
              label: "Watch Time", 
              value: analyticsData.overview.totalWatchTime, 
              icon: ClockIcon, 
              trend: "+8.3%", 
              color: "from-blue-500 to-cyan-500",
              emoji: "⏰",
              isPositive: true
            },
            { 
              label: "Subscribers", 
              value: analyticsData.overview.subscribers, 
              icon: UserGroupIcon, 
              trend: "+15.7%", 
              color: "from-emerald-500 to-teal-500",
              emoji: "👥",
              isPositive: true
            },
            { 
              label: "Engagement", 
              value: analyticsData.overview.engagement, 
              icon: BoltIcon, 
              trend: "-2.1%", 
              color: "from-amber-500 to-orange-500",
              emoji: "⚡",
              isPositive: false
            },
            { 
              label: "Revenue", 
              value: analyticsData.overview.revenue, 
              icon: CurrencyDollarIcon, 
              trend: "+18.9%", 
              color: "from-indigo-500 to-purple-500",
              emoji: "💰",
              isPositive: true
            }
          ].map((stat, index) => (
            <div
              key={stat.label}
              className="group relative transform hover:-translate-y-2 transition-all duration-300"
              onMouseEnter={() => setHoveredStat(stat.label)}
              onMouseLeave={() => setHoveredStat(null)}
            >
              <div className={`absolute -inset-1 bg-gradient-to-r ${stat.color} rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity`}></div>
              
              <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-white/50 overflow-hidden">
                {/* Decorative Corner */}
                <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${stat.color} rounded-full opacity-20`}></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 bg-gradient-to-br ${stat.color} rounded-2xl`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-3xl">{stat.emoji}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-3xl font-black text-gray-900">{stat.value}</p>
                    <p className="text-gray-600 font-medium">{stat.label}</p>
                    
                    <div className={`flex items-center gap-1 text-sm font-bold ${
                      stat.isPositive ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      {stat.isPositive ? (
                        <ArrowTrendingUpIcon className="w-4 h-4" />
                      ) : (
                        <ArrowTrendingDownIcon className="w-4 h-4" />
                      )}
                      <span>{stat.trend}</span>
                    </div>
                  </div>
                  
                  {hoveredStat === stat.label && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Performance Chart - Creative Visualization */}
          <div className="lg:col-span-2 relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-3xl blur-lg opacity-20"></div>
            <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-white/50">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <h2 className="text-3xl font-black text-gray-900">Performance Art</h2>
                  <span className="text-2xl animate-pulse">📈</span>
                </div>
                <div className="flex items-center gap-2">
                  {["Views", "Watch Time", "Revenue"].map((metric) => (
                    <button
                      key={metric}
                      onClick={() => setSelectedMetric(metric.toLowerCase().replace(" ", ""))}
                      className={`px-4 py-2 rounded-full font-bold text-sm transition-all duration-300 ${
                        selectedMetric === metric.toLowerCase().replace(" ", "")
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {metric}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Creative Chart Visualization */}
              <div className="h-80 relative">
                <div className="absolute inset-0 flex items-end justify-around px-4">
                  {[65, 80, 45, 90, 70, 85, 55, 95, 75].map((height, i) => (
                    <div key={i} className="flex-1 mx-1 group cursor-pointer">
                      <div 
                        className="bg-gradient-to-t from-purple-500 to-pink-500 rounded-t-3xl relative overflow-hidden transition-all duration-500 hover:from-purple-600 hover:to-pink-600"
                        style={{ height: `${height}%` }}
                      >
                        <div className="absolute inset-0 bg-white/20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="bg-black/80 text-white px-3 py-1 rounded-lg text-sm font-bold whitespace-nowrap">
                            {height}k views
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 text-center mt-2">Day {i + 1}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Top Locations - Fun World Map */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-3xl blur-lg opacity-20"></div>
            <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-white/50">
              <div className="flex items-center gap-3 mb-6">
                <GlobeAltIcon className="w-8 h-8 text-blue-600" />
                <h2 className="text-2xl font-black text-gray-900">Global Reach</h2>
                <span className="text-2xl">🌍</span>
              </div>
              
              <div className="space-y-4">
                {analyticsData.topCountries.map((country, index) => (
                  <div key={country.country} className="group">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{country.emoji}</span>
                        <div>
                          <p className="font-bold text-gray-900">{country.country}</p>
                          <p className="text-sm text-gray-600">{country.views} views</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
                          {country.percentage}%
                        </p>
                      </div>
                    </div>
                    <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${country.percentage}%` }}
                      >
                        <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Video Performance Table - Playful Design */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 rounded-3xl blur-lg opacity-20"></div>
          <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/50">
            <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h2 className="text-3xl font-black text-gray-900">Top Performers</h2>
                  <TrophyIcon className="w-8 h-8 text-amber-500" />
                </div>
                <button className="text-purple-600 font-bold hover:underline decoration-wavy underline-offset-4">
                  View All Videos →
                </button>
              </div>
            </div>
            
            <div className="p-8">
              <div className="space-y-4">
                {analyticsData.recentVideos.map((video, index) => (
                  <div 
                    key={index} 
                    className="group relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative flex items-center gap-6 p-6 bg-white/50 backdrop-blur rounded-2xl border border-gray-100 hover:border-purple-200 transition-all duration-300">
                      {/* Rank Badge */}
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-black text-white bg-gradient-to-br ${
                        index === 0 ? 'from-amber-500 to-orange-500' :
                        index === 1 ? 'from-gray-400 to-gray-500' :
                        'from-orange-400 to-amber-400'
                      }`}>
                        #{index + 1}
                      </div>
                      
                      {/* Video Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-3xl">{video.emoji}</span>
                          <h3 className="text-xl font-bold text-gray-900">{video.title}</h3>
                        </div>
                        <div className="flex items-center gap-6 text-sm">
                          <div className="flex items-center gap-2">
                            <EyeIcon className="w-4 h-4 text-gray-600" />
                            <span className="font-medium text-gray-700">{video.views} views</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <ClockIcon className="w-4 h-4 text-gray-600" />
                            <span className="font-medium text-gray-700">{video.watchTime}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FireIcon className="w-4 h-4 text-orange-500" />
                            <span className="font-bold text-orange-600">{video.engagement}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Revenue & Trend */}
                      <div className="text-right">
                        <p className="text-2xl font-black text-gray-900">{video.revenue}</p>
                        <div className="flex items-center justify-end gap-1 text-emerald-600 font-bold mt-1">
                          <ArrowTrendingUpIcon className="w-5 h-5" />
                          <span>{video.trend}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
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