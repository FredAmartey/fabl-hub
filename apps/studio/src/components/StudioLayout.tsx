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
  Cog6ToothIcon,
  Bars3Icon,
  ArrowUpTrayIcon,
  BellIcon,
  MagnifyingGlassIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";

const navigationItems = [
  { name: "Dashboard", href: "/", icon: HomeIcon },
  { name: "Content", href: "/content", icon: PlayIcon },
  { name: "Analytics", href: "/analytics", icon: ChartBarIcon },
  { name: "Comments", href: "/comments", icon: ChatBubbleLeftRightIcon },
  { name: "Revenue", href: "/revenue", icon: CurrencyDollarIcon },
  { name: "Settings", href: "/settings", icon: Cog6ToothIcon },
];

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-slate-900">
      {/* Sidebar */}
      <aside
        className={cn(
          "bg-slate-900 border-r border-slate-800 transition-all duration-200",
          sidebarOpen ? "w-64" : "w-16"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center px-4 border-b border-slate-800">
            <Link href="/" className="flex items-center gap-2">
              <div className="text-2xl font-bold">
                <span className="text-white">studio</span>
                <span className="text-violet-500">.</span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-4">
            <ul className="space-y-1 px-3">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        isActive
                          ? "bg-slate-800 text-white"
                          : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                      )}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      {sidebarOpen && <span>{item.name}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Upload Button */}
          <div className="p-4 border-t border-slate-800">
            <Link href="/upload">
              <button className="w-full bg-violet-600 hover:bg-violet-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors">
                <ArrowUpTrayIcon className="w-4 h-4" />
                {sidebarOpen && <span>Upload</span>}
              </button>
            </Link>
          </div>

          {/* Profile Section */}
          <div className="p-4 border-t border-slate-800">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="w-full flex items-center gap-3 hover:bg-slate-800/50 p-2 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                <span className="text-sm font-medium text-white">A</span>
              </div>
              {sidebarOpen && (
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-white">Alex Creator</p>
                  <p className="text-xs text-slate-400">@alexcreates</p>
                </div>
              )}
            </button>

            {/* Profile Dropdown */}
            {profileOpen && sidebarOpen && (
              <div className="absolute bottom-20 left-4 right-4 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-50">
                <Link href="/profile" className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white">
                  <UserIcon className="inline w-4 h-4 mr-2" />
                  Profile
                </Link>
                <Link href="/help" className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white">
                  <QuestionMarkCircleIcon className="inline w-4 h-4 mr-2" />
                  Help
                </Link>
                <button className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white border-t border-slate-700">
                  <ArrowRightOnRectangleIcon className="inline w-4 h-4 mr-2" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-slate-400 hover:text-white"
            >
              <Bars3Icon className="w-5 h-5" />
            </button>

            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search your content..."
                className="w-96 pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <button className="text-slate-400 hover:text-white relative">
              <BellIcon className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-slate-950">
          {children}
        </main>
      </div>
    </div>
  );
}