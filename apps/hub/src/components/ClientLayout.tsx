"use client";

import { useState, useEffect } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { AnimatedBackground } from "./AnimatedBackground";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="bg-[#0f0a1e] text-white min-h-screen">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-t-purple-500 border-b-purple-500 border-l-transparent border-r-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <AnimatedBackground />
      <div className="relative z-10 min-h-screen">
        <Header onMenuClick={toggleSidebar} />
        <div className="flex">
          <Sidebar isOpen={sidebarOpen} />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </>
  );
}
