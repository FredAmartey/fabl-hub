"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Home,
  PlaySquare,
  FolderOpen,
  BarChart3,
  MessageSquare,
  Languages,
  DollarSign,
  Palette,
  Music,
  Settings,
  ChevronLeft,
  ChevronRight,
  Upload,
  Bell,
  Search,
  MoreVertical,
  LogOut,
  User,
  HelpCircle,
  Sparkles,
} from "lucide-react";

const navigationItems = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Upload", href: "/upload", icon: Upload },
  { name: "Content", href: "/content", icon: PlaySquare },
  { name: "Playlists", href: "/playlists", icon: FolderOpen },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Comments", href: "/comments", icon: MessageSquare },
  { name: "Subtitles", href: "/subtitles", icon: Languages },
  { name: "Monetization", href: "/monetization", icon: DollarSign },
  { name: "Customization", href: "/customization", icon: Palette },
  { name: "Audio Library", href: "/audio-library", icon: Music },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function StudioLayoutEnhanced({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  return (
    <TooltipProvider>
      <div className="flex h-screen bg-[#FAFAF8]">
        {/* Enhanced Sidebar */}
        <motion.aside
          initial={false}
          animate={{ width: sidebarOpen ? 280 : 80 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="relative flex flex-col bg-white border-r border-black/10"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 bg-white border-b border-black/10">
            <div className="flex items-center justify-between h-16 px-4">
              <AnimatePresence mode="wait">
                {sidebarOpen ? (
                  <motion.div
                    key="logo-full"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex items-center gap-2"
                  >
                    <div className="p-2 rounded-lg bg-black">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <h1 className="text-xl font-light text-black">
                      Fabl Studio
                    </h1>
                  </motion.div>
                ) : (
                  <motion.div
                    key="logo-mini"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="p-2 rounded-lg bg-black"
                  >
                    <Sparkles className="w-5 h-5 text-white" />
                  </motion.div>
                )}
              </AnimatePresence>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="hover:bg-black/5 text-black"
              >
                {sidebarOpen ? (
                  <ChevronLeft className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 py-4">
            <nav className="space-y-1 px-3">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <Tooltip key={item.name} delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          "relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                          isActive
                            ? "bg-black text-white"
                            : "text-gray-600 hover:text-black hover:bg-black/5"
                        )}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="activeTab"
                            className="absolute inset-0 rounded-lg bg-black"
                            initial={false}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          />
                        )}

                        <div
                          className={cn(
                            "relative z-10 p-2 rounded-md transition-all",
                            isActive
                              ? "bg-white/10"
                              : "group-hover:bg-black/5"
                          )}
                        >
                          <Icon
                            className={cn("w-5 h-5", isActive ? "text-white" : "text-gray-600")}
                          />
                        </div>

                        <AnimatePresence>
                          {sidebarOpen && (
                            <motion.span
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -10 }}
                              className="relative z-10"
                            >
                              {item.name}
                            </motion.span>
                          )}
                        </AnimatePresence>

                        {!sidebarOpen && (
                          <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-lg">
                            {item.name}
                          </div>
                        )}
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right" className={!sidebarOpen ? "hidden" : ""}>
                      <p>{item.name}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </nav>
          </ScrollArea>

          {/* Channel Profile Section */}
          <div className="sticky bottom-0 border-t border-black/10 bg-white">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 p-4 h-auto hover:bg-black/5 text-black"
                >
                  <Avatar className="h-10 w-10 ring-2 ring-black/10">
                    <AvatarImage src="data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='avatar' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%239333ea' /%3E%3Cstop offset='100%25' style='stop-color:%23ec4899' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='40' height='40' rx='20' fill='url(%23avatar)' /%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='white' font-family='Arial' font-size='16' font-weight='bold'%3EU%3C/text%3E%3C/svg%3E" />
                    <AvatarFallback className="bg-black text-white">
                      YC
                    </AvatarFallback>
                  </Avatar>
                  <AnimatePresence>
                    {sidebarOpen && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="flex-1 text-left"
                      >
                        <p className="text-sm font-medium text-black">Your Channel</p>
                        <p className="text-xs text-gray-500">@yourchannel</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {sidebarOpen && <MoreVertical className="w-4 h-4 text-gray-400" />}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  View Channel
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Account Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Help & Support
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </motion.aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar */}
          <header className="sticky top-0 z-10 h-16 border-b border-black/10 bg-white">
            <div className="flex items-center justify-between h-full px-6">
              <div className="flex items-center gap-4 flex-1">
                <div className="relative max-w-md flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search your content..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/20 text-black placeholder:text-gray-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="relative text-black hover:bg-black/5">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-black hover:bg-black/5">
                      <MoreVertical className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Upload className="mr-2 h-4 w-4" />
                      Quick Upload
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <BarChart3 className="mr-2 h-4 w-4" />
                      View Analytics
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      Studio Settings
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto bg-[#FAFAF8]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {children}
            </motion.div>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}