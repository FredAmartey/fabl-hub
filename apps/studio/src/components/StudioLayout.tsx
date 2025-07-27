"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  HomeIcon,
  PlayIcon,
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  CurrencyDollarIcon,
  BellIcon,
  FolderIcon,
  LanguageIcon,
  PaintBrushIcon,
  MusicalNoteIcon,
  SparklesIcon,
  CloudArrowUpIcon,
  UserCircleIcon,
  CogIcon,
} from "@heroicons/react/24/outline";

const navigationItems = [
  { name: "Dashboard", href: "/", icon: HomeIcon },
  { name: "Content", href: "/content", icon: PlayIcon },
  { name: "Playlists", href: "/playlists", icon: FolderIcon },
  { name: "Analytics", href: "/analytics", icon: ChartBarIcon },
  { name: "Comments", href: "/comments", icon: ChatBubbleLeftRightIcon },
  { name: "Subtitles", href: "/subtitles", icon: LanguageIcon },
  { name: "Monetization", href: "/monetization", icon: CurrencyDollarIcon },
  { name: "Customization", href: "/customization", icon: PaintBrushIcon },
  { name: "Audio Library", href: "/audio", icon: MusicalNoteIcon },
];

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-[#0a0a0f]">
      {/* Sidebar */}
      <aside className="w-[280px] bg-gradient-to-b from-[#0a0a0f] via-[#090514] to-[#130a22] border-r border-gray-800/30 flex flex-col">
        {/* Header */}
        <div className="h-16 border-b border-gray-800/50 flex items-center px-6">
          <Link href="/" className="flex items-center">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 via-pink-400 to-amber-300 flex items-center justify-center shadow-lg mr-3">
              <SparklesIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold text-gradient">fabl </span>
              <span className="text-2xl font-bold text-white"> Studio</span>
              <div className="text-xs text-gray-400">Creator Hub</div>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 pt-8 pb-4 overflow-y-auto">
          <ul className="space-y-2">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-white/15 text-white shadow-md border border-gray-400/40"
                        : "text-gray-400 hover:text-white hover:bg-gray-800/30"
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-5 h-5 flex-shrink-0",
                        isActive ? "text-white" : "text-gray-400"
                      )}
                    />
                    <span className="flex-1">{item.name}</span>
                    {isActive && (
                      <div className="w-2 h-2 rounded-full bg-gradient-to-br from-pink-300 to-purple-500" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Upload and Notification */}
        <div className="px-4 pb-4 flex gap-3">
          <Link href="/upload" className="flex-1">
            <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all duration-200 shadow-lg">
              <CloudArrowUpIcon className="w-5 h-5" />
              <span className="text-sm">Upload</span>
            </button>
          </Link>
          <Link href="/settings">
            <button
              className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 flex-shrink-0",
                pathname === "/settings"
                  ? "bg-gray-800/70 text-white border border-gray-400/40"
                  : "bg-gray-800/50 hover:bg-gray-800/70 text-gray-400 hover:text-white"
              )}
            >
              <CogIcon className="w-5 h-5" />
            </button>
          </Link>
        </div>

        {/* Profile */}
        <div className="border-t border-gray-800/50 px-4 pt-6 pb-4">
          <button className="w-full flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 via-pink-400 to-amber-300 flex items-center justify-center">
                <UserCircleIcon className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#0a0a0f]" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-base font-semibold text-white">Your Channel</p>
              <p className="text-sm text-gray-500">@yourchannel • 45.7K subs</p>
            </div>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b border-gray-800/50 bg-[#0a0a0f]/95 backdrop-blur-sm flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-white">
              {pathname === "/"
                ? "Dashboard"
                : pathname.slice(1).charAt(0).toUpperCase() + pathname.slice(2)}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2.5 rounded-xl hover:bg-gray-800/50 text-gray-400 hover:text-white transition-colors">
              <BellIcon className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-[#0a0a0f]">{children}</main>
      </div>
    </div>
  );
}
