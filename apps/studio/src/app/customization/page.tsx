"use client";

import { useState } from "react";
import {
  PaintBrushIcon,
  SwatchIcon,
  PhotoIcon,
  AdjustmentsHorizontalIcon,
  EyeIcon,
  StarIcon,
  CheckIcon,
  XMarkIcon,
  SparklesIcon,
  FaceSmileIcon,
  CubeIcon,
  BeakerIcon,
  ColorSwatchIcon,
  PencilIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

export default function CustomizationPage() {
  const [selectedTheme, setSelectedTheme] = useState("cosmic");
  const [selectedCategory, setSelectedCategory] = useState("themes");
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const themes = [
    {
      id: "cosmic",
      name: "Cosmic Dreams",
      preview: "🌌",
      colors: ["#667eea", "#764ba2"],
      gradient: "from-indigo-500 via-purple-500 to-pink-500",
      installed: true,
      featured: true
    },
    {
      id: "sunset",
      name: "Sunset Vibes",
      preview: "🌅",
      colors: ["#ff7e5f", "#feb47b"],
      gradient: "from-orange-400 via-red-400 to-pink-400",
      installed: true,
      featured: false
    },
    {
      id: "ocean",
      name: "Ocean Depths",
      preview: "🌊",
      colors: ["#2193b0", "#6dd5ed"],
      gradient: "from-blue-500 via-cyan-500 to-teal-500",
      installed: false,
      featured: true
    },
    {
      id: "forest",
      name: "Forest Magic",
      preview: "🌲",
      colors: ["#11998e", "#38ef7d"],
      gradient: "from-emerald-500 via-green-500 to-teal-500",
      installed: false,
      featured: false
    },
    {
      id: "neon",
      name: "Neon Nights",
      preview: "🌃",
      colors: ["#ee0979", "#ff6a00"],
      gradient: "from-pink-500 via-purple-500 to-indigo-500",
      installed: false,
      featured: true
    },
    {
      id: "minimal",
      name: "Minimal Clean",
      preview: "⚪",
      colors: ["#f7fafc", "#edf2f7"],
      gradient: "from-gray-100 via-gray-200 to-gray-300",
      installed: true,
      featured: false
    }
  ];

  const brandingElements = [
    {
      id: "logo",
      name: "Channel Logo",
      type: "image",
      current: "🎯",
      description: "Your main brand identifier",
      lastUpdated: "2 days ago"
    },
    {
      id: "banner",
      name: "Channel Banner",
      type: "image",
      current: "🎨",
      description: "Header image for your channel",
      lastUpdated: "1 week ago"
    },
    {
      id: "watermark",
      name: "Video Watermark",
      type: "image",
      current: "💎",
      description: "Subtle brand mark on videos",
      lastUpdated: "3 days ago"
    },
    {
      id: "intro",
      name: "Intro Animation",
      type: "video",
      current: "✨",
      description: "Opening sequence for videos",
      lastUpdated: "5 days ago"
    }
  ];

  const customizations = [
    {
      category: "Layout",
      options: [
        { name: "Sidebar Position", value: "Left", options: ["Left", "Right", "Hidden"] },
        { name: "Content Width", value: "Wide", options: ["Narrow", "Medium", "Wide", "Full"] },
        { name: "Card Style", value: "Rounded", options: ["Square", "Rounded", "Circular"] }
      ]
    },
    {
      category: "Typography",
      options: [
        { name: "Font Family", value: "Inter", options: ["Inter", "Roboto", "Poppins", "Open Sans"] },
        { name: "Font Size", value: "Medium", options: ["Small", "Medium", "Large", "Extra Large"] },
        { name: "Font Weight", value: "Bold", options: ["Light", "Regular", "Medium", "Bold"] }
      ]
    },
    {
      category: "Animations",
      options: [
        { name: "Page Transitions", value: "Smooth", options: ["None", "Fast", "Smooth", "Bouncy"] },
        { name: "Hover Effects", value: "Enabled", options: ["Disabled", "Subtle", "Enabled", "Enhanced"] },
        { name: "Loading Animations", value: "Fun", options: ["Simple", "Elegant", "Fun", "Minimal"] }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-gradient-to-r from-cyan-300 to-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-delayed"></div>
      </div>

      <div className="relative z-10 p-8 lg:p-12 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 rounded-3xl blur-xl opacity-50"></div>
                <div className="relative p-4 bg-gradient-to-br from-pink-500 to-purple-500 rounded-3xl">
                  <PaintBrushIcon className="w-10 h-10 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
                  Style Studio
                </h1>
                <p className="text-xl text-gray-600 font-light mt-1">Make it uniquely yours</p>
              </div>
              <span className="text-4xl ml-4">🎨</span>
            </div>
            
            {/* Quick Actions */}
            <div className="flex items-center gap-3">
              <button className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <div className="relative flex items-center gap-2 bg-white px-6 py-3 rounded-xl shadow-lg">
                  <EyeIcon className="w-5 h-5 text-gray-700" />
                  <span className="font-bold text-gray-900">Preview</span>
                </div>
              </button>
              <button className="group relative transform hover:scale-105 transition-all duration-300">
                <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full blur-lg opacity-70 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative px-8 py-3 bg-white rounded-full shadow-xl">
                  <span className="font-bold text-gray-900">Save Changes ✨</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Category Navigation */}
        <div className="mb-8">
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {[
              { id: "themes", label: "Themes", icon: "🎭" },
              { id: "branding", label: "Branding", icon: "🏷️" },
              { id: "layout", label: "Layout", icon: "📐" },
              { id: "advanced", label: "Advanced", icon: "⚙️" }
            ].map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-3 px-6 py-3 rounded-full font-bold transition-all duration-300 whitespace-nowrap ${
                  selectedCategory === category.id
                    ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg transform scale-105"
                    : "bg-white/80 text-gray-700 hover:bg-white hover:shadow-md"
                }`}
              >
                <span className="text-xl">{category.icon}</span>
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Themes Section */}
        {selectedCategory === "themes" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-black text-gray-900">Theme Gallery</h2>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search themes..."
                    className="pl-10 pr-4 py-2 bg-white/80 backdrop-blur-xl rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
                  />
                </div>
                <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                  Featured
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {themes.map((theme) => (
                <div
                  key={theme.id}
                  className="group relative transform hover:-translate-y-2 transition-all duration-300"
                  onMouseEnter={() => setHoveredItem(theme.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <div className={`absolute -inset-1 bg-gradient-to-r ${theme.gradient} rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity`}></div>
                  
                  <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden shadow-xl">
                    {/* Theme Preview */}
                    <div className={`relative h-48 bg-gradient-to-br ${theme.gradient} p-6`}>
                      <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-4 right-4 w-24 h-24 bg-white/20 rounded-full"></div>
                        <div className="absolute bottom-4 left-4 w-32 h-32 bg-white/10 rounded-full"></div>
                      </div>
                      
                      <div className="relative z-10 flex flex-col justify-between h-full">
                        <div className="flex items-start justify-between">
                          <span className="text-5xl transform group-hover:scale-110 transition-transform duration-500">
                            {theme.preview}
                          </span>
                          
                          {theme.featured && (
                            <div className="px-3 py-1.5 rounded-full bg-amber-500 text-white font-bold text-sm flex items-center gap-1">
                              <StarIcon className="w-4 h-4" />
                              Featured
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {theme.colors.map((color, i) => (
                            <div
                              key={i}
                              className="w-6 h-6 rounded-full border-2 border-white/50"
                              style={{ backgroundColor: color }}
                            ></div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Hover Actions */}
                      {hoveredItem === theme.id && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <div className="flex items-center gap-3">
                            <button className="w-14 h-14 bg-white rounded-full flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-500">
                              <EyeIcon className="w-6 h-6 text-gray-900" />
                            </button>
                            {!theme.installed && (
                              <button className="w-14 h-14 bg-white rounded-full flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-500 delay-100">
                                <PlusIcon className="w-6 h-6 text-gray-900" />
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Theme Info */}
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{theme.name}</h3>
                        {theme.installed ? (
                          <div className="flex items-center gap-1 text-emerald-600 font-bold">
                            <CheckIcon className="w-5 h-5" />
                            <span className="text-sm">Installed</span>
                          </div>
                        ) : (
                          <button className="px-4 py-1 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold rounded-lg text-sm hover:shadow-lg transition-all">
                            Install
                          </button>
                        )}
                      </div>
                      
                      {selectedTheme === theme.id && (
                        <div className="mt-4 p-3 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border border-pink-200">
                          <div className="flex items-center gap-2 text-pink-700 font-bold">
                            <CheckIcon className="w-5 h-5" />
                            <span>Currently Active</span>
                          </div>
                        </div>
                      )}
                      
                      {theme.installed && selectedTheme !== theme.id && (
                        <button
                          onClick={() => setSelectedTheme(theme.id)}
                          className="w-full mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors"
                        >
                          Apply Theme
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Branding Section */}
        {selectedCategory === "branding" && (
          <div>
            <h2 className="text-3xl font-black text-gray-900 mb-6">Brand Identity 🎭</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {brandingElements.map((element) => (
                <div
                  key={element.id}
                  className="group relative"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-pink-400 to-purple-400 rounded-3xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity"></div>
                  
                  <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-white/50 shadow-lg">
                    <div className="flex items-start gap-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl flex items-center justify-center text-4xl">
                        {element.current}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{element.name}</h3>
                        <p className="text-gray-600 mb-3">{element.description}</p>
                        <p className="text-sm text-gray-500 mb-4">Last updated: {element.lastUpdated}</p>
                        
                        <div className="flex items-center gap-3">
                          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transition-all">
                            <PhotoIcon className="w-5 h-5" />
                            Upload New
                          </button>
                          <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                            <PencilIcon className="w-5 h-5 text-gray-700" />
                          </button>
                          <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                            <TrashIcon className="w-5 h-5 text-gray-700" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Layout & Advanced Sections */}
        {(selectedCategory === "layout" || selectedCategory === "advanced") && (
          <div>
            <h2 className="text-3xl font-black text-gray-900 mb-6">
              {selectedCategory === "layout" ? "Layout Settings 📐" : "Advanced Options ⚙️"}
            </h2>
            
            <div className="space-y-8">
              {customizations.map((section) => (
                <div key={section.category} className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-pink-400 to-purple-400 rounded-3xl blur-lg opacity-10"></div>
                  
                  <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-white/50 shadow-lg">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <span className="text-3xl">
                        {section.category === "Layout" ? "📐" : 
                         section.category === "Typography" ? "✍️" : "🎬"}
                      </span>
                      {section.category}
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {section.options.map((option) => (
                        <div key={option.name} className="space-y-3">
                          <label className="text-lg font-bold text-gray-900">{option.name}</label>
                          <div className="relative">
                            <select className="w-full p-4 bg-white/80 backdrop-blur-xl rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-300 appearance-none font-medium">
                              {option.options.map((opt) => (
                                <option key={opt} value={opt} selected={opt === option.value}>
                                  {opt}
                                </option>
                              ))}
                            </select>
                            <AdjustmentsHorizontalIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
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