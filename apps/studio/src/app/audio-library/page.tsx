"use client";

import { useState } from "react";
import {
  MusicalNoteIcon,
  SpeakerWaveIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PlayIcon,
  PauseIcon,
  HeartIcon,
  BookmarkIcon,
  ClockIcon,
  UserGroupIcon,
  StarIcon,
  CloudArrowDownIcon,
  TagIcon,
  VolumeXIcon,
  AdjustmentsHorizontalIcon,
  PlusIcon,
  MicrophoneIcon,
  WaveformIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon, BookmarkIcon as BookmarkSolidIcon } from "@heroicons/react/24/solid";

export default function AudioLibraryPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [playingTrack, setPlayingTrack] = useState<string | null>(null);
  const [hoveredTrack, setHoveredTrack] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { id: "all", name: "All Tracks", count: 1247, emoji: "🎵" },
    { id: "music", name: "Music", count: 834, emoji: "🎶" },
    { id: "sfx", name: "Sound Effects", count: 289, emoji: "🔊" },
    { id: "voice", name: "Voiceovers", count: 124, emoji: "🎤" },
    { id: "ambient", name: "Ambient", count: 156, emoji: "🌿" },
    { id: "royalty-free", name: "Royalty Free", count: 943, emoji: "✅" }
  ];

  const audioTracks = [
    {
      id: "1",
      title: "Epic Cinematic Trailer",
      artist: "Audio Hero",
      duration: "2:34",
      genre: "Cinematic",
      mood: "Epic",
      tempo: "Medium",
      key: "C Major",
      bpm: 120,
      downloads: 1847,
      likes: 423,
      preview: "epic-preview.mp3",
      price: "Free",
      tags: ["Epic", "Trailer", "Cinematic", "Orchestra"],
      waveform: "🎼",
      color: "from-purple-500 to-pink-500",
      isLiked: true,
      isBookmarked: false,
      category: "music"
    },
    {
      id: "2",
      title: "Upbeat Corporate Background",
      artist: "Studio Sounds",
      duration: "3:12",
      genre: "Corporate",
      mood: "Upbeat",
      tempo: "Fast",
      key: "G Major",
      bpm: 140,
      downloads: 2934,
      likes: 567,
      preview: "corporate-preview.mp3",
      price: "$4.99",
      tags: ["Corporate", "Upbeat", "Business", "Motivational"],
      waveform: "📈",
      color: "from-blue-500 to-cyan-500",
      isLiked: false,
      isBookmarked: true,
      category: "music"
    },
    {
      id: "3",
      title: "Explosion Sound Effect",
      artist: "SFX Masters",
      duration: "0:03",
      genre: "Sound Effect",
      mood: "Intense",
      tempo: "N/A",
      key: "N/A",
      bpm: 0,
      downloads: 3421,
      likes: 234,
      preview: "explosion-preview.mp3",
      price: "Free",
      tags: ["Explosion", "Action", "Boom", "Impact"],
      waveform: "💥",
      color: "from-red-500 to-orange-500",
      isLiked: false,
      isBookmarked: false,
      category: "sfx"
    },
    {
      id: "4",
      title: "Peaceful Nature Ambience",
      artist: "Nature Sounds",
      duration: "10:00",
      genre: "Ambient",
      mood: "Peaceful",
      tempo: "Slow",
      key: "N/A",
      bpm: 60,
      downloads: 1567,
      likes: 789,
      preview: "nature-preview.mp3",
      price: "$2.99",
      tags: ["Nature", "Peaceful", "Birds", "Forest"],
      waveform: "🌲",
      color: "from-emerald-500 to-teal-500",
      isLiked: true,
      isBookmarked: true,
      category: "ambient"
    },
    {
      id: "5",
      title: "Professional Voiceover Male",
      artist: "Voice Talent Pro",
      duration: "1:45",
      genre: "Voiceover",
      mood: "Professional",
      tempo: "Medium",
      key: "N/A",
      bpm: 0,
      downloads: 892,
      likes: 156,
      preview: "voice-preview.mp3",
      price: "$9.99",
      tags: ["Voiceover", "Male", "Professional", "Clear"],
      waveform: "🎙️",
      color: "from-indigo-500 to-purple-500",
      isLiked: false,
      isBookmarked: false,
      category: "voice"
    },
    {
      id: "6",
      title: "Retro Synthwave Beat",
      artist: "Synth Master",
      duration: "4:23",
      genre: "Electronic",
      mood: "Nostalgic",
      tempo: "Medium",
      key: "Am",
      bpm: 110,
      downloads: 2156,
      likes: 634,
      preview: "synth-preview.mp3",
      price: "$6.99",
      tags: ["Synthwave", "Retro", "80s", "Electronic"],
      waveform: "🌆",
      color: "from-pink-500 to-purple-500",
      isLiked: true,
      isBookmarked: false,
      category: "music"
    }
  ];

  const filteredTracks = audioTracks.filter(track => {
    const matchesCategory = selectedCategory === "all" || track.category === selectedCategory;
    const matchesSearch = track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         track.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         track.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const togglePlay = (trackId: string) => {
    setPlayingTrack(playingTrack === trackId ? null : trackId);
  };

  const toggleLike = (trackId: string) => {
    // Handle like toggle
  };

  const toggleBookmark = (trackId: string) => {
    // Handle bookmark toggle
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-300 to-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-300 to-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-delayed"></div>
      </div>

      <div className="relative z-10 p-8 lg:p-12 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl blur-xl opacity-50"></div>
                <div className="relative p-4 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-3xl">
                  <MusicalNoteIcon className="w-10 h-10 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
                  Audio Vault
                </h1>
                <p className="text-xl text-gray-600 font-light mt-1">Your sonic playground</p>
              </div>
              <span className="text-4xl ml-4">🎧</span>
            </div>
            
            {/* Upload Button */}
            <button className="group relative transform hover:scale-105 transition-all duration-300">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full blur-lg opacity-70 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative flex items-center gap-3 bg-white px-8 py-4 rounded-full shadow-xl">
                <PlusIcon className="w-6 h-6 text-purple-600" />
                <span className="font-bold text-gray-900">Upload Audio</span>
                <span className="text-2xl">🎵</span>
              </div>
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 relative group">
              <MagnifyingGlassIcon className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
              <input
                type="text"
                placeholder="Search tracks, artists, moods..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-5 bg-white/80 backdrop-blur-xl rounded-2xl text-lg placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-purple-200 shadow-lg transition-all"
              />
            </div>
            
            <button className="p-5 bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-xl transition-all">
              <FunnelIcon className="w-6 h-6 text-gray-700" />
            </button>
            
            <button className="p-5 bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-xl transition-all">
              <AdjustmentsHorizontalIcon className="w-6 h-6 text-gray-700" />
            </button>
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-3 px-6 py-3 rounded-full font-bold transition-all duration-300 whitespace-nowrap ${
                  selectedCategory === category.id
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg transform scale-105"
                    : "bg-white/80 text-gray-700 hover:bg-white hover:shadow-md"
                }`}
              >
                <span className="text-xl">{category.emoji}</span>
                {category.name}
                <span className="text-sm opacity-75">({category.count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="group relative transform hover:-translate-y-2 transition-all duration-300">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
            <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-white/50">
              <div className="flex items-center justify-between mb-4">
                <MusicalNoteIcon className="w-8 h-8 text-purple-600" />
                <span className="text-3xl">🎵</span>
              </div>
              <p className="text-3xl font-black text-gray-900">1,247</p>
              <p className="text-gray-600">Total Tracks</p>
            </div>
          </div>

          <div className="group relative transform hover:-translate-y-2 transition-all duration-300">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
            <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-white/50">
              <div className="flex items-center justify-between mb-4">
                <CloudArrowDownIcon className="w-8 h-8 text-blue-600" />
                <span className="text-3xl">⬇️</span>
              </div>
              <p className="text-3xl font-black text-gray-900">12.4K</p>
              <p className="text-gray-600">Downloads</p>
            </div>
          </div>

          <div className="group relative transform hover:-translate-y-2 transition-all duration-300">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
            <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-white/50">
              <div className="flex items-center justify-between mb-4">
                <HeartIcon className="w-8 h-8 text-emerald-600" />
                <span className="text-3xl">❤️</span>
              </div>
              <p className="text-3xl font-black text-gray-900">3.2K</p>
              <p className="text-gray-600">Favorites</p>
            </div>
          </div>

          <div className="group relative transform hover:-translate-y-2 transition-all duration-300">
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-orange-400 rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
            <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-white/50">
              <div className="flex items-center justify-between mb-4">
                <ClockIcon className="w-8 h-8 text-amber-600" />
                <span className="text-3xl">⏱️</span>
              </div>
              <p className="text-3xl font-black text-gray-900">47h</p>
              <p className="text-gray-600">Total Duration</p>
            </div>
          </div>
        </div>

        {/* Audio Tracks Grid */}
        <div className="space-y-4">
          {filteredTracks.map((track) => (
            <div
              key={track.id}
              className="group relative"
              onMouseEnter={() => setHoveredTrack(track.id)}
              onMouseLeave={() => setHoveredTrack(null)}
            >
              <div className={`absolute -inset-1 bg-gradient-to-r ${track.color} rounded-3xl blur-lg opacity-0 group-hover:opacity-20 transition-opacity`}></div>
              
              <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-white/50 shadow-lg">
                <div className="flex items-center gap-6">
                  {/* Play Button & Waveform */}
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => togglePlay(track.id)}
                      className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                        playingTrack === track.id
                          ? `bg-gradient-to-br ${track.color} text-white shadow-lg`
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      {playingTrack === track.id ? (
                        <PauseIcon className="w-8 h-8" />
                      ) : (
                        <PlayIcon className="w-8 h-8 ml-1" />
                      )}
                    </button>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-4xl">{track.waveform}</span>
                      <div className="hidden md:flex items-center gap-1">
                        {[...Array(20)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-1 bg-gradient-to-t ${track.color} rounded-full transition-all duration-300`}
                            style={{ 
                              height: `${Math.random() * 40 + 20}px`,
                              opacity: playingTrack === track.id ? 1 : 0.3
                            }}
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Track Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 truncate">{track.title}</h3>
                        <p className="text-gray-600">{track.artist}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">{track.price}</p>
                        <p className="text-sm text-gray-600">{track.duration}</p>
                      </div>
                    </div>
                    
                    {/* Track Details */}
                    <div className="flex items-center gap-6 text-sm text-gray-600 mb-3">
                      <span className="flex items-center gap-1">
                        <TagIcon className="w-4 h-4" />
                        {track.genre}
                      </span>
                      <span className="flex items-center gap-1">
                        <SpeakerWaveIcon className="w-4 h-4" />
                        {track.mood}
                      </span>
                      {track.bpm > 0 && (
                        <span className="flex items-center gap-1">
                          <WaveformIcon className="w-4 h-4" />
                          {track.bpm} BPM
                        </span>
                      )}
                      {track.key !== "N/A" && (
                        <span className="flex items-center gap-1">
                          <MusicalNoteIcon className="w-4 h-4" />
                          {track.key}
                        </span>
                      )}
                    </div>
                    
                    {/* Tags */}
                    <div className="flex items-center gap-2 mb-4">
                      {track.tags.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    {/* Stats & Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <CloudArrowDownIcon className="w-4 h-4" />
                          {track.downloads.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <HeartIcon className="w-4 h-4" />
                          {track.likes}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleLike(track.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          {track.isLiked ? (
                            <HeartSolidIcon className="w-6 h-6 text-red-500" />
                          ) : (
                            <HeartIcon className="w-6 h-6 text-gray-600" />
                          )}
                        </button>
                        <button
                          onClick={() => toggleBookmark(track.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          {track.isBookmarked ? (
                            <BookmarkSolidIcon className="w-6 h-6 text-blue-500" />
                          ) : (
                            <BookmarkIcon className="w-6 h-6 text-gray-600" />
                          )}
                        </button>
                        <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl hover:shadow-lg transition-all">
                          Download
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
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