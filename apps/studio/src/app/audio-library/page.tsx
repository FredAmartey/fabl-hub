"use client";

import React from "react";
import {
  MusicalNoteIcon,
  SparklesIcon,
  ClockIcon,
  CubeTransparentIcon,
} from "@heroicons/react/24/outline";

export default function AudioLibraryPage() {
  const comingSoonFeatures = [
    {
      icon: MusicalNoteIcon,
      title: "Music Library",
      description: "Browse and organize your royalty-free music collection",
      color: "from-purple-500 to-pink-500",
      emoji: "🎵"
    },
    {
      icon: SparklesIcon,
      title: "Sound Effects",
      description: "Professional sound effects for every type of content", 
      color: "from-blue-500 to-cyan-500",
      emoji: "🔊"
    },
    {
      icon: CubeTransparentIcon,
      title: "Audio Waveforms",
      description: "Visual waveform displays with real-time playback",
      color: "from-emerald-500 to-teal-500",
      emoji: "📊"
    },
    {
      icon: ClockIcon,
      title: "Smart Organization",
      description: "Auto-categorize by genre, mood, and duration",
      color: "from-amber-500 to-orange-500",
      emoji: "🏷️"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Central pulsing effect */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-blue-200/30 via-blue-300/20 to-transparent rounded-full animate-pulse-soft"></div>
        
        {/* Floating orbs */}
        <div className="absolute top-1/2 -left-48 w-96 h-96 bg-gradient-to-r from-blue-300/40 to-indigo-300/40 rounded-full mix-blend-multiply filter blur-3xl animate-float"></div>
        <div className="absolute bottom-1/3 -right-48 w-96 h-96 bg-gradient-to-r from-indigo-300/40 to-blue-400/40 rounded-full mix-blend-multiply filter blur-3xl animate-float-delayed"></div>
      </div>

      <div className="relative z-10 p-8 lg:p-12 max-w-6xl mx-auto">
        {/* Enhanced Header */}
        <div className="mb-16">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="relative">
                  <MusicalNoteIcon className="w-8 h-8 text-blue-600" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900">Audio Library</h1>
              </div>
              <p className="text-lg text-gray-600">
                Your comprehensive audio management hub is coming soon. Organize, discover, and integrate the perfect sounds for your content.
              </p>
            </div>
          </div>
        </div>

        {/* Coming Soon Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {comingSoonFeatures.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="group relative overflow-hidden"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="absolute -inset-1 bg-gradient-to-r opacity-20 group-hover:opacity-30 blur-sm transition-opacity duration-300 rounded-3xl" 
                     style={{ backgroundImage: `linear-gradient(135deg, ${feature.color.split(' ')[1]}, ${feature.color.split(' ')[3]})` }}></div>
                <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-white/50 group-hover:shadow-2xl transition-all duration-500 group-hover:scale-[1.02]">
                  <div className="flex items-start gap-6">
                    <div className={`p-4 rounded-2xl bg-gradient-to-br ${feature.color} shadow-lg`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-bold text-gray-900">{feature.title}</h3>
                        <span className="text-2xl">{feature.emoji}</span>
                      </div>
                      <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Development Timeline */}
        <div className="text-center bg-white/60 backdrop-blur-xl rounded-3xl p-12 border border-white/50">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full font-bold mb-6">
            <ClockIcon className="w-5 h-5" />
            <span>Coming Q2 2025</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Audio Library Development</h2>
          <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
            We're building a comprehensive audio management system that will revolutionize how creators organize and discover audio content. 
            Stay tuned for updates on our development progress.
          </p>
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
          @keyframes pulse-soft {
            0%, 100% {
              opacity: 0.15;
              transform: translate(-50%, -50%) scale(1);
            }
            50% {
              opacity: 0.25;
              transform: translate(-50%, -50%) scale(1.1);
            }
          }
          .animate-float {
            animation: float 8s ease-in-out infinite;
          }
          .animate-float-delayed {
            animation: float-delayed 8s ease-in-out infinite;
            animation-delay: 2s;
          }
          .animate-pulse-soft {
            animation: pulse-soft 4s ease-in-out infinite;
          }
          .bg-gradient-radial {
            background: radial-gradient(circle, var(--tw-gradient-from), var(--tw-gradient-via), var(--tw-gradient-to));
          }
        `}</style>
      </div>
    </div>
  );
}