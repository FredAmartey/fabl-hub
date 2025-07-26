"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  UserIcon,
  SettingsIcon,
  VideoIcon,
  ThumbsUpIcon,
  BellIcon,
  ShareIcon,
  UsersIcon,
} from "lucide-react";
import { Button } from "../../components/Button";
import { VideoCard } from "../../components/VideoCard";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("videos");

  const user = {
    name: "Alex Neural",
    username: "alexneural",
    avatar:
      "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=150&h=150&auto=format&fit=crop&crop=faces",
    banner:
      "https://images.unsplash.com/photo-1614149162883-504ce4d13909?q=80&w=1200&auto=format&fit=crop",
    bio: "AI enthusiast and digital creator. I make videos exploring the creative potential of artificial intelligence and neural networks.",
    subscribers: "12.4K",
    joined: "March 2022",
    location: "Digital Realm",
    links: {
      website: "https://example.com",
      twitter: "@alexneural",
      instagram: "@alex.neural",
    },
  };

  const userVideos = [
    {
      id: 101,
      title: "Creating Digital Art with Neural Style Transfer",
      channel: "Alex Neural",
      views: "8.2K",
      timestamp: "2 weeks ago",
      thumbnail:
        "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=800&auto=format&fit=crop",
      avatar: user.avatar,
      duration: "18:42",
    },
    {
      id: 102,
      title: "How I Made This Music with AI",
      channel: "Alex Neural",
      views: "12.5K",
      timestamp: "1 month ago",
      thumbnail:
        "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=800&auto=format&fit=crop",
      avatar: user.avatar,
      duration: "22:18",
    },
    {
      id: 103,
      title: "Neural Networks Explained: A Visual Guide",
      channel: "Alex Neural",
      views: "32.7K",
      timestamp: "3 months ago",
      thumbnail:
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop",
      avatar: user.avatar,
      duration: "15:24",
    },
    {
      id: 104,
      title: "The Future of AI Art Generation",
      channel: "Alex Neural",
      views: "18.3K",
      timestamp: "5 months ago",
      thumbnail:
        "https://images.unsplash.com/photo-1617791160536-598cf32026fb?q=80&w=800&auto=format&fit=crop",
      avatar: user.avatar,
      duration: "28:05",
    },
  ];

  const playlists = [
    {
      id: 1,
      title: "AI Art Tutorials",
      videos: 8,
      thumbnail:
        "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: 2,
      title: "Neural Music Experiments",
      videos: 5,
      thumbnail:
        "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: 3,
      title: "AI Technology Explained",
      videos: 12,
      thumbnail:
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop",
    },
  ];

  const likedVideos = [
    {
      id: 3,
      title: "AI Generated Music: Symphony of Digital Emotions",
      channel: "Harmonic AI",
      views: "2.3M",
      timestamp: "2 weeks ago",
      thumbnail:
        "https://images.unsplash.com/photo-1614149162883-504ce4d13909?q=80&w=800&auto=format&fit=crop",
      avatar:
        "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&auto=format&fit=crop&crop=faces",
      duration: "8:17",
    },
    {
      id: 6,
      title: "Digital Art Evolution: From Pixels to Neural Networks",
      channel: "ArtMatrix",
      views: "932K",
      timestamp: "1 day ago",
      thumbnail:
        "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=800&auto=format&fit=crop",
      avatar:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&auto=format&fit=crop&crop=faces",
      duration: "22:14",
    },
  ];

  const tabContent = {
    videos: (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {userVideos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    ),
    playlists: (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {playlists.map((playlist) => (
          <Link
            key={playlist.id}
            href={`/playlist/${playlist.id}`}
            className="group relative block"
          >
            <div className="aspect-video rounded-xl overflow-hidden bg-[#1a1230] relative">
              <img
                src={playlist.thumbnail}
                alt={playlist.title}
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-3 left-3 right-3">
                <h3 className="font-medium text-sm group-hover:text-purple-300 transition-colors">
                  {playlist.title}
                </h3>
                <p className="text-xs text-gray-400 mt-1">{playlist.videos} videos</p>
              </div>
              <div className="absolute top-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded flex items-center">
                <div className="w-3 h-3 mr-1" />
                Playlist
              </div>
            </div>
          </Link>
        ))}
      </div>
    ),
    about: (
      <div className="bg-[#1a1230] rounded-xl p-6">
        <h3 className="font-medium mb-4">About</h3>
        <p className="text-gray-300 mb-6">{user.bio}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-400 mb-3">Stats</h4>
            <ul className="space-y-2">
              <li className="flex items-center text-sm">
                <UsersIcon className="w-4 h-4 mr-2 text-purple-400" />
                <span className="text-gray-400">Subscribers:</span>
                <span className="ml-auto">{user.subscribers}</span>
              </li>
              <li className="flex items-center text-sm">
                <VideoIcon className="w-4 h-4 mr-2 text-purple-400" />
                <span className="text-gray-400">Videos:</span>
                <span className="ml-auto">{userVideos.length}</span>
              </li>
              <li className="flex items-center text-sm">
                <div className="w-4 h-4 mr-2 text-purple-400" />
                <span className="text-gray-400">Playlists:</span>
                <span className="ml-auto">{playlists.length}</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-400 mb-3">Details</h4>
            <ul className="space-y-2">
              <li className="flex items-start text-sm">
                <span className="text-gray-400 mr-2 w-20">Joined:</span>
                <span>{user.joined}</span>
              </li>
              <li className="flex items-start text-sm">
                <span className="text-gray-400 mr-2 w-20">Location:</span>
                <span>{user.location}</span>
              </li>
              <li className="flex items-start text-sm">
                <span className="text-gray-400 mr-2 w-20">Links:</span>
                <div className="flex flex-col space-y-1">
                  <a href="#" className="text-purple-400 hover:underline">
                    {user.links.website}
                  </a>
                  <a href="#" className="text-purple-400 hover:underline">
                    {user.links.twitter}
                  </a>
                  <a href="#" className="text-purple-400 hover:underline">
                    {user.links.instagram}
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    ),
    liked: (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {likedVideos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    ),
  };

  return (
    <div className="pb-12">
      {/* Banner */}
      <div className="relative h-48 md:h-64 overflow-hidden">
        <img src={user.banner} alt="Profile banner" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0a1e] to-transparent"></div>
      </div>

      {/* Profile Info */}
      <div className="px-6">
        <div className="flex flex-col md:flex-row items-start md:items-end -mt-16 md:-mt-20 relative z-10 mb-6">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-[#0f0a1e] bg-[#0f0a1e] mr-4">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-400 flex items-center justify-center">
                <UserIcon className="w-12 h-12 text-white" />
              </div>
            )}
          </div>
          <div className="mt-4 md:mt-0 flex-1">
            <h1 className="text-2xl font-bold font-afacad">{user.name}</h1>
            <p className="text-gray-400">@{user.username}</p>
            <p className="text-gray-400 mt-1">{user.subscribers} subscribers</p>
          </div>
          <div className="flex mt-4 md:mt-0 space-x-2">
            <Button variant="primary">Subscribe</Button>
            <Button variant="ghost" size="icon">
              <BellIcon className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <ShareIcon className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <SettingsIcon className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-700 mb-6">
          <div className="flex overflow-x-auto">
            <button
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                activeTab === "videos"
                  ? "border-purple-500 text-white"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
              onClick={() => setActiveTab("videos")}
            >
              <VideoIcon className="w-4 h-4 inline-block mr-1" />
              Videos
            </button>
            <button
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                activeTab === "playlists"
                  ? "border-purple-500 text-white"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
              onClick={() => setActiveTab("playlists")}
            >
              <div className="w-4 h-4 inline-block mr-1" />
              Playlists
            </button>
            <button
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                activeTab === "liked"
                  ? "border-purple-500 text-white"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
              onClick={() => setActiveTab("liked")}
            >
              <ThumbsUpIcon className="w-4 h-4 inline-block mr-1" />
              Liked
            </button>
            <button
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                activeTab === "about"
                  ? "border-purple-500 text-white"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
              onClick={() => setActiveTab("about")}
            >
              <UserIcon className="w-4 h-4 inline-block mr-1" />
              About
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {tabContent[activeTab as keyof typeof tabContent]}
      </div>
    </div>
  );
}
