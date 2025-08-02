"use client";

import React, { useState } from "react";
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
  BoltIcon,
  PlayIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  ShareIcon,
  ArrowDownTrayIcon,
  SparklesIcon,
  FireIcon,
  MagnifyingGlassIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  LightBulbIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";

const analyticsData = {
  overview: {
    views: { value: "1,284,592", change: "+12.5%", trend: "up" },
    watchTime: { value: "4,283 hours", change: "+8.3%", trend: "up" },
    subscribers: { value: "12,847", change: "+15.7%", trend: "up" },
    engagement: { value: "8.4%", change: "-2.1%", trend: "down" },
    retention: { value: "42%", change: "+5.2%", trend: "up" },
    ctr: { value: "6.8%", change: "+1.4%", trend: "up" }
  },
  insights: [
    {
      type: "success",
      title: "Viral Content Detected! 🔥",
      description: "Thursday's video gained 45.6K views with 58% retention - your best performance yet!",
      action: "Analyze what made this content successful"
    },
    {
      type: "info", 
      title: "Momentum Building",
      description: "Wednesday-Thursday saw a 621 new subscriber spike from viral exposure",
      action: "Post follow-up content while trending"
    },
    {
      type: "warning",
      title: "Capitalize on Success",
      description: "Weekend views dropped 65% from Thursday peak - strike while the iron is hot",
      action: "Upload similar content within 48 hours"
    }
  ],
  retentionGraph: [
    { time: "0:00", retention: 100 },
    { time: "0:15", retention: 85 },
    { time: "0:30", retention: 72 },
    { time: "1:00", retention: 58 },
    { time: "2:00", retention: 45 },
    { time: "3:00", retention: 38 },
    { time: "5:00", retention: 32 },
    { time: "10:00", retention: 25 }
  ],
  topVideos: [
    {
      title: "Building a Modern Web App",
      thumbnail: "video-1",
      views: "125,632",
      retention: "52%",
      engagement: "12.3%",
      ctr: "8.2%",
      duration: "15:42",
      published: "3 days ago",
      trend: "+24%",
      insights: ["High retention", "Strong CTR"]
    },
    {
      title: "React Server Components Explained", 
      thumbnail: "video-2",
      views: "94,234",
      retention: "48%",
      engagement: "9.8%",
      ctr: "7.1%",
      duration: "12:18",
      published: "1 week ago",
      trend: "+18%",
      insights: ["Good engagement", "Above avg retention"]
    },
    {
      title: "TypeScript Best Practices",
      thumbnail: "video-3", 
      views: "67,891",
      retention: "39%",
      engagement: "11.2%",
      ctr: "5.4%",
      duration: "9:56",
      published: "2 weeks ago",
      trend: "+15%",
      insights: ["Strong engagement"]
    }
  ],
  audienceInsights: {
    demographics: [
      { age: "18-24", percentage: 28, color: "bg-blue-500" },
      { age: "25-34", percentage: 42, color: "bg-purple-500" },
      { age: "35-44", percentage: 20, color: "bg-emerald-500" },
      { age: "45-54", percentage: 7, color: "bg-orange-500" },
      { age: "55+", percentage: 3, color: "bg-gray-500" }
    ],
    topCountries: [
      { country: "United States", percentage: 34, views: "436,841", flag: "🇺🇸" },
      { country: "United Kingdom", percentage: 18, views: "231,227", flag: "🇬🇧" },
      { country: "Canada", percentage: 12, views: "154,151", flag: "🇨🇦" },
      { country: "Germany", percentage: 8, views: "102,767", flag: "🇩🇪" },
      { country: "Australia", percentage: 6, views: "77,075", flag: "🇦🇺" }
    ]
  },
  chartData: [
    { day: "Mon", views: 2420, subscribers: 12, engagement: 2.1, retention: 25 },
    { day: "Tue", views: 4340, subscribers: 28, engagement: 3.8, retention: 31 },
    { day: "Wed", views: 28900, subscribers: 234, engagement: 12.4, retention: 68 }, // Viral day
    { day: "Thu", views: 45600, subscribers: 387, engagement: 15.8, retention: 58 }, // Peak performance - matches AI insights
    { day: "Fri", views: 23800, subscribers: 156, engagement: 9.7, retention: 46 }, // Cooling down
    { day: "Sat", views: 16200, subscribers: 98, engagement: 7.9, retention: 42 },
    { day: "Sun", views: 19500, subscribers: 124, engagement: 8.5, retention: 44 }  // Weekend recovery
  ]
};

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("28d");
  const [selectedChart, setSelectedChart] = useState("views");
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const getInsightIcon = (type: string) => {
    switch(type) {
      case "success": return CheckCircleIcon;
      case "warning": return ExclamationTriangleIcon;
      case "info": return LightBulbIcon;
      default: return LightBulbIcon;
    }
  };

  const getInsightColor = (type: string) => {
    switch(type) {
      case "success": return "text-emerald-600 bg-emerald-50";
      case "warning": return "text-orange-600 bg-orange-50";
      case "info": return "text-blue-600 bg-blue-50";
      default: return "text-blue-600 bg-blue-50";
    }
  };

  return (
    <div className="min-h-screen" style={{backgroundColor: '#FFFAFA'}}>
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header with Key Insights */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="relative">
                  <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center">
                    <span className="text-white text-sm">📊</span>
                  </div>
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
              </div>
              <p className="text-gray-600 flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                Live data • Updated 2 minutes ago
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <button 
                  onClick={() => setShowPeriodDropdown(!showPeriodDropdown)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
                  style={{backgroundColor: '#FFFAFA'}}
                >
                  <CalendarIcon className="w-4 h-4" />
                  <span>Last 28 days</span>
                  <ChevronDownIcon className="w-4 h-4" />
                </button>
                
                {showPeriodDropdown && (
                  <div className="absolute right-0 top-full mt-1 w-48 rounded-lg shadow-lg border border-gray-200 z-20" style={{backgroundColor: '#FFFAFA'}}>
                    <div className="py-1">
                      {["7d", "28d", "90d", "1y"].map((period) => (
                        <button
                          key={period}
                          onClick={() => {setSelectedPeriod(period); setShowPeriodDropdown(false);}}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                            selectedPeriod === period ? "text-purple-600 font-medium" : "text-gray-700"
                          }`}
                        >
                          Last {period === "7d" ? "7 days" : period === "28d" ? "28 days" : period === "90d" ? "90 days" : "year"}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <button className="group relative transform hover:scale-105 transition-all duration-300">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <div className="relative flex items-center gap-2 backdrop-blur-xl px-4 py-2 rounded-xl shadow-lg border border-white/50" style={{backgroundColor: '#FFFAFA'}}>
                  <ArrowDownTrayIcon className="w-4 h-4 text-purple-600" />
                  <span className="font-medium text-gray-900">Export Report</span>
                </div>
              </button>
            </div>
          </div>

          {/* AI-Powered Insights Banner */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl border border-purple-200 p-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-500 rounded-lg">
                <SparklesIcon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">🚀 AI Insights - Viral Alert!</h3>
                <p className="text-sm text-gray-600 mb-3">You're experiencing a viral moment! Thursday's content hit 45.6K views with exceptional 58% retention. The algorithm is favoring your content right now.</p>
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1 text-emerald-600 font-medium">
                    <CheckCircleIcon className="w-3 h-3" />
                    +442% views this week
                  </span>
                  <span className="flex items-center gap-1 text-orange-600 font-medium">
                    <FireIcon className="w-3 h-3" />
                    Trending in your niche
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics - Optimized for 5-second scan */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {[
            { 
              label: "Views", 
              value: analyticsData.overview.views.value, 
              icon: EyeIcon, 
              change: analyticsData.overview.views.change,
              trend: analyticsData.overview.views.trend,
              color: "text-blue-600",
              bgColor: "bg-blue-50"
            },
            { 
              label: "Watch Time", 
              value: analyticsData.overview.watchTime.value, 
              icon: ClockIcon, 
              change: analyticsData.overview.watchTime.change,
              trend: analyticsData.overview.watchTime.trend,
              color: "text-purple-600",
              bgColor: "bg-purple-50"
            },
            { 
              label: "Subscribers", 
              value: analyticsData.overview.subscribers.value, 
              icon: UserGroupIcon, 
              change: analyticsData.overview.subscribers.change,
              trend: analyticsData.overview.subscribers.trend,
              color: "text-emerald-600",
              bgColor: "bg-emerald-50"
            },
            { 
              label: "Viewer Interactions", 
              value: analyticsData.overview.engagement.value, 
              icon: HeartIcon, 
              change: analyticsData.overview.engagement.change,
              trend: analyticsData.overview.engagement.trend,
              color: "text-pink-600",
              bgColor: "bg-pink-50"
            },
            { 
              label: "Watch Completion", 
              value: analyticsData.overview.retention.value, 
              icon: BoltIcon, 
              change: analyticsData.overview.retention.change,
              trend: analyticsData.overview.retention.trend,
              color: "text-orange-600",
              bgColor: "bg-orange-50"
            },
            { 
              label: "Click-Through Rate", 
              value: analyticsData.overview.ctr.value, 
              icon: MagnifyingGlassIcon, 
              change: analyticsData.overview.ctr.change,
              trend: analyticsData.overview.ctr.trend,
              color: "text-indigo-600",
              bgColor: "bg-indigo-50"
            }
          ].map((stat) => (
            <div key={stat.label} className="group">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 ${stat.bgColor} rounded-lg`}>
                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-medium ${
                    stat.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {stat.trend === 'up' ? (
                      <ArrowTrendingUpIcon className="w-3 h-3" />
                    ) : (
                      <ArrowTrendingDownIcon className="w-3 h-3" />
                    )}
                    <span className="text-sm font-medium">{stat.change}</span>
                  </div>
                </div>
                
                <div>
                  <p className="text-xl font-bold text-gray-900 mb-1">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Enhanced Performance Chart */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-indigo-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-xl">
                      <ChartBarIcon className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Performance Trends</h2>
                      <p className="text-sm text-gray-600">Interactive 7-day analysis</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-white rounded-xl p-1 shadow-sm">
                    {[
                      { key: "views", label: "Views" },
                      { key: "subscribers", label: "Subscribers" },
                      { key: "engagement", label: "Interactions" },
                      { key: "retention", label: "Completion" }
                    ].map((metric) => (
                      <button
                        key={metric.key}
                        onClick={() => setSelectedChart(metric.key)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          selectedChart === metric.key
                            ? "bg-purple-500 text-white shadow-md transform scale-105"
                            : "text-gray-600 hover:bg-purple-50 hover:text-purple-700"
                        }`}
                      >
                        {metric.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="p-6 pt-16 pb-6">
                {/* Chart Area with Grid */}
                <div className="relative h-80 overflow-visible">
                  {/* Dynamic Y-Axis Grid */}
                  <div className="absolute inset-0 flex flex-col justify-between">
                    {(() => {
                      const allValues = analyticsData.chartData.map(d => {
                        switch(selectedChart) {
                          case 'subscribers': return d.subscribers;
                          case 'engagement': return d.engagement;
                          case 'retention': return d.retention;
                          default: return d.views;
                        }
                      });
                      const maxValue = Math.max(...allValues);
                      const yAxisLabels = [];
                      for (let i = 4; i >= 0; i--) {
                        const labelValue = Math.round((maxValue / 4) * i);
                        yAxisLabels.push(labelValue);
                      }
                      return yAxisLabels.map((labelValue, i) => (
                        <div key={i} className="flex items-center">
                          <span className="text-xs text-gray-400 w-12 text-right">{labelValue.toLocaleString()}</span>
                          <div className="flex-1 h-px bg-gray-100 ml-2"></div>
                        </div>
                      ));
                    })()}
                  </div>
                  
                  {/* Chart Bars */}
                  <div className="absolute inset-0 pl-14 flex items-end justify-between gap-3">
                    {analyticsData.chartData.map((data, index) => {
                      const getValue = () => {
                        switch(selectedChart) {
                          case 'subscribers': return data.subscribers;
                          case 'engagement': return data.engagement;
                          case 'retention': return data.retention;
                          default: return data.views;
                        }
                      };
                      
                      const value = getValue();
                      const allValues = analyticsData.chartData.map(d => {
                        switch(selectedChart) {
                          case 'subscribers': return d.subscribers;
                          case 'engagement': return d.engagement;
                          case 'retention': return d.retention;
                          default: return d.views;
                        }
                      });
                      
                      const maxValue = Math.max(...allValues);
                      const minValue = Math.min(...allValues);
                      
                      // Better scaling algorithm with minimum height for visibility
                      const maxHeightPx = 280;
                      const minHeightPx = 8; // Minimum visible height
                      const range = maxValue - minValue;
                      
                      let heightPx;
                      if (range === 0) {
                        heightPx = maxHeightPx / 2; // All values the same
                      } else {
                        // Scale based on actual value relative to max
                        heightPx = Math.max((value / maxValue) * maxHeightPx, minHeightPx);
                      }
                      
                      // Get color based on metric
                      const getColor = () => {
                        switch(selectedChart) {
                          case 'subscribers': return 'from-emerald-500 to-emerald-400';
                          case 'engagement': return 'from-pink-500 to-pink-400';
                          case 'retention': return 'from-orange-500 to-orange-400';
                          default: return 'from-purple-500 to-purple-400';
                        }
                      };
                      
                      return (
                        <div key={data.day} className="flex flex-col items-center flex-1 group relative">
                          {/* Bar */}
                          <div 
                            className={`w-full bg-gradient-to-t ${getColor()} rounded-t-lg cursor-pointer relative transition-all duration-200 hover:brightness-110`}
                            style={{ height: `${heightPx}px` }}
                          >
                            {/* Detailed tooltip on hover */}
                            <div className="absolute -top-24 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-4 py-3 rounded-xl text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap z-50 pointer-events-none shadow-2xl">
                              <div className="text-center mb-2">
                                <div className="font-bold text-white">{data.day}</div>
                                <div className="text-purple-300 capitalize">
                                  {selectedChart === 'engagement' ? 'Interactions' : 
                                   selectedChart === 'retention' ? 'Completion' : 
                                   selectedChart}: {Math.round(value).toLocaleString()}
                                </div>
                              </div>
                              <div className="border-t border-gray-600 pt-2 space-y-1">
                                <div className="flex justify-between gap-3">
                                  <span className="text-gray-400">Views:</span>
                                  <span className="text-blue-300">{data.views.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between gap-3">
                                  <span className="text-gray-400">Subscribers:</span>
                                  <span className="text-emerald-300">+{data.subscribers}</span>
                                </div>
                                <div className="flex justify-between gap-3">
                                  <span className="text-gray-400">Interactions:</span>
                                  <span className="text-pink-300">{data.engagement}%</span>
                                </div>
                                <div className="flex justify-between gap-3">
                                  <span className="text-gray-400">Completion:</span>
                                  <span className="text-orange-300">{data.retention}%</span>
                                </div>
                              </div>
                              {/* Tooltip Arrow */}
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-3 h-3 bg-gray-900 rotate-45"></div>
                            </div>
                          </div>
                          
                          {/* Day Label */}
                          <div className="mt-3 text-center">
                            <p className="text-sm font-medium text-gray-700">{data.day}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                {/* Chart Legend */}
                <div className="mt-6 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${
                        selectedChart === 'subscribers' ? 'from-emerald-500 to-emerald-400' :
                        selectedChart === 'engagement' ? 'from-pink-500 to-pink-400' :
                        selectedChart === 'retention' ? 'from-orange-500 to-orange-400' :
                        'from-purple-500 to-purple-400'
                      }`}></div>
                      <span className="text-gray-600 capitalize font-medium">
                        {selectedChart === 'engagement' ? 'Interactions' : 
                         selectedChart === 'retention' ? 'Completion' : 
                         selectedChart}
                      </span>
                    </div>
                    <div className="text-gray-400">•</div>
                    <span className="text-gray-600">Last 7 days</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500">
                    <span>Hover for details</span>
                    <div className="w-4 h-4 border border-gray-300 rounded flex items-center justify-center">
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Audience Insights */}
          <div>
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm h-full">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <UserGroupIcon className="w-6 h-6 text-purple-600" />
                  <h2 className="text-xl font-bold text-gray-900">Audience</h2>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Age Distribution</h4>
                    <div className="space-y-2">
                      {analyticsData.audienceInsights.demographics.map((demo, index) => (
                        <div key={demo.age} className="flex items-center gap-3">
                          <div className="w-12 text-sm text-gray-600">{demo.age}</div>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`${demo.color} h-2 rounded-full transition-all duration-1000 ease-out`}
                              style={{ width: `${demo.percentage}%` }}
                            ></div>
                          </div>
                          <div className="w-8 text-sm font-medium text-gray-900">{demo.percentage}%</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Top Locations</h4>
                    <div className="space-y-3">
                      {analyticsData.audienceInsights.topCountries.slice(0, 3).map((country, index) => (
                        <div key={country.country} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{country.flag}</span>
                            <div>
                              <p className="text-base font-medium text-gray-900">{country.country}</p>
                              <p className="text-sm text-gray-600">{country.views} views</p>
                            </div>
                          </div>
                          <div className="text-base font-bold text-gray-900">{country.percentage}%</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Performing Content */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FireIcon className="w-6 h-6 text-orange-600" />
                  <h2 className="text-xl font-bold text-gray-900">Top Performing Videos</h2>
                </div>
                <button className="text-purple-600 hover:text-purple-700 font-medium text-sm">
                  View all →
                </button>
              </div>
            </div>
            
            <div className="divide-y divide-gray-100">
              {analyticsData.topVideos.map((video, index) => (
                <div key={index} className="p-6 hover:bg-gray-50/50 transition-colors">
                  <div className="flex gap-4">
                    {/* Video Thumbnail */}
                    <div className="flex-shrink-0">
                      <div className="w-40 h-24 bg-gray-200 rounded-lg overflow-hidden border border-gray-300 relative group">
                        <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                          <PlayIcon className="w-8 h-8 text-gray-500 group-hover:text-purple-600 transition-colors" />
                        </div>
                        <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
                          {video.duration}
                        </div>
                        <div className="absolute top-1 left-1 bg-orange-500 text-white text-xs px-1 rounded font-bold">
                          #{index + 1}
                        </div>
                      </div>
                    </div>

                    {/* Video Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{video.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{video.published}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="text-xs text-gray-600 mb-1">Views</div>
                          <div className="font-semibold text-gray-900">{video.views}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-600 mb-1">Avg. Watch Time</div>
                          <div className="font-semibold text-emerald-600">{video.retention} of video</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-600 mb-1">Viewers Who Interacted</div>
                          <div className="font-semibold text-blue-600">{video.engagement} of viewers</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-600 mb-1">Thumbnail Clicks</div>
                          <div className="font-semibold text-purple-600">{video.ctr} clicked</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-3">
                        {video.insights.map((insight, i) => (
                          <span key={i} className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full font-medium">
                            {insight}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Performance Indicator */}
                    <div className="text-right flex flex-col justify-center">
                      <div className="flex flex-col items-end gap-1 mb-2">
                        <div className="flex items-center gap-1 text-emerald-600 font-bold text-lg">
                          <ArrowTrendingUpIcon className="w-5 h-5" />
                          <span>{video.trend}</span>
                        </div>
                        <span className="text-xs text-gray-600">vs last week</span>
                      </div>
                      <button 
                        onClick={() => setSelectedVideo(video)}
                        className="text-xs text-purple-600 hover:text-purple-700 font-medium"
                      >
                        View analytics →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actionable Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {analyticsData.insights.map((insight, index) => {
            const IconComponent = getInsightIcon(insight.type);
            return (
              <div key={index} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${getInsightColor(insight.type)}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{insight.title}</h4>
                    <p className="text-sm text-gray-600 mb-3">{insight.description}</p>
                    <button className="text-sm font-medium text-purple-600 hover:text-purple-700">
                      {insight.action} →
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Video Analytics Modal */}
        {selectedVideo && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-8 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-indigo-50">
                <div className="flex items-center gap-6">
                  <div className="w-32 h-20 bg-gray-200 rounded-lg overflow-hidden border border-gray-300 relative group">
                    <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                      <PlayIcon className="w-8 h-8 text-gray-500" />
                    </div>
                    <div className="absolute bottom-1 right-1 bg-black/80 text-white text-sm px-2 py-1 rounded">
                      {selectedVideo.duration}
                    </div>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">{selectedVideo.title}</h2>
                    <p className="text-lg text-gray-600">Published {selectedVideo.published}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-700"
                >
                  <span className="sr-only">Close</span>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-8 overflow-y-auto max-h-[calc(90vh-180px)]">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                  {/* Key Metrics */}
                  <div className="lg:col-span-3">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      {[
                        { 
                          label: "Views", 
                          value: selectedVideo.views, 
                          icon: EyeIcon, 
                          color: "text-blue-600",
                          bgColor: "bg-blue-50"
                        },
                        { 
                          label: "Average Watch Time", 
                          value: `${selectedVideo.retention} of video watched`, 
                          icon: BoltIcon, 
                          color: "text-orange-600",
                          bgColor: "bg-orange-50"
                        },
                        { 
                          label: "Viewer Engagement", 
                          value: `${selectedVideo.engagement} liked, commented, or shared`, 
                          icon: HeartIcon, 
                          color: "text-pink-600",
                          bgColor: "bg-pink-50"
                        },
                        { 
                          label: "Thumbnail Performance", 
                          value: `${selectedVideo.ctr} clicked when they saw it`, 
                          icon: MagnifyingGlassIcon, 
                          color: "text-indigo-600",
                          bgColor: "bg-indigo-50"
                        }
                      ].map((stat) => (
                        <div key={stat.label} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 ${stat.bgColor} rounded-lg`}>
                              <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            <div className="flex items-center gap-1 text-sm font-medium text-emerald-600">
                              <ArrowTrendingUpIcon className="w-4 h-4" />
                              <span>{selectedVideo.trend} vs last week</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-lg font-bold text-gray-900 mb-1">{stat.label}</p>
                            <p className="text-sm text-gray-600">{stat.value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Detailed Analytics Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Audience Retention */}
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <ClockIcon className="w-7 h-7 text-purple-600" />
                      Audience Retention
                    </h3>
                    <div className="space-y-5">
                      {analyticsData.retentionGraph.slice(0, 5).map((point, index) => (
                        <div key={point.time} className="flex items-center gap-4">
                          <div className="w-16 text-base text-gray-600 font-medium">{point.time}</div>
                          <div className="flex-1 bg-gray-200 rounded-full h-3">
                            <div 
                              className="bg-gradient-to-r from-purple-500 to-purple-400 h-3 rounded-full transition-all duration-1000 ease-out"
                              style={{ width: `${point.retention}%` }}
                            ></div>
                          </div>
                          <div className="w-12 text-base font-bold text-gray-900">{point.retention}%</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Traffic Sources */}
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <GlobeAltIcon className="w-7 h-7 text-blue-600" />
                      Traffic Sources
                    </h3>
                    <div className="space-y-6">
                      {[
                        { source: "YouTube search", percentage: 42, views: "52,865", color: "bg-blue-500" },
                        { source: "Suggested videos", percentage: 28, views: "35,277", color: "bg-purple-500" },
                        { source: "Browse features", percentage: 18, views: "22,674", color: "bg-emerald-500" },
                        { source: "External", percentage: 12, views: "15,116", color: "bg-orange-500" }
                      ].map((traffic, index) => (
                        <div key={traffic.source} className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`w-4 h-4 ${traffic.color} rounded-full`}></div>
                            <div>
                              <p className="text-base font-semibold text-gray-900">{traffic.source}</p>
                              <p className="text-sm text-gray-600">{traffic.views} views ({traffic.percentage}% of total)</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Comments & Engagement */}
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <ChatBubbleLeftIcon className="w-7 h-7 text-green-600" />
                      Engagement Breakdown
                    </h3>
                    <div className="space-y-5">
                      {[
                        { metric: "Likes", value: "8,234", icon: HeartIcon, color: "text-red-500" },
                        { metric: "Comments", value: "1,456", icon: ChatBubbleLeftIcon, color: "text-blue-500" },
                        { metric: "Shares", value: "892", icon: ShareIcon, color: "text-green-500" },
                        { metric: "Saves", value: "3,124", icon: ArrowDownTrayIcon, color: "text-purple-500" }
                      ].map((engagement) => (
                        <div key={engagement.metric} className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <engagement.icon className={`w-6 h-6 ${engagement.color}`} />
                            <span className="text-base font-semibold text-gray-900">{engagement.metric}</span>
                          </div>
                          <span className="text-lg font-bold text-gray-900">{engagement.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Performance Insights */}
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <LightBulbIcon className="w-7 h-7 text-yellow-600" />
                      Performance Insights
                    </h3>
                    <div className="space-y-4">
                      {selectedVideo.insights.map((insight, index) => (
                        <div key={index} className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                          <p className="text-base font-medium text-emerald-800">{insight}</p>
                        </div>
                      ))}
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-base font-medium text-blue-800">Peak viewing time: 2:15-3:30</p>
                      </div>
                      <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                        <p className="text-base font-medium text-orange-800">Audience drop-off at 5:00 mark</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}