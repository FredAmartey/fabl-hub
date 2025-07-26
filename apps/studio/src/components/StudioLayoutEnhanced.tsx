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
  { name: "Dashboard", href: "/studio", icon: Home, color: "text-sky-400" },
  { name: "Upload", href: "/studio/upload", icon: Upload, color: "text-green-400" },
  { name: "Content", href: "/studio/content", icon: PlaySquare, color: "text-purple-400" },
  { name: "Playlists", href: "/studio/playlists", icon: FolderOpen, color: "text-orange-400" },
  { name: "Analytics", href: "/studio/analytics", icon: BarChart3, color: "text-blue-400" },
  { name: "Comments", href: "/studio/comments", icon: MessageSquare, color: "text-pink-400" },
  { name: "Subtitles", href: "/studio/subtitles", icon: Languages, color: "text-cyan-400" },
  { name: "Monetization", href: "/studio/monetization", icon: DollarSign, color: "text-green-400" },
  { name: "Customization", href: "/studio/customization", icon: Palette, color: "text-yellow-400" },
  { name: "Audio Library", href: "/studio/audio-library", icon: Music, color: "text-red-400" },
  { name: "Settings", href: "/studio/settings", icon: Settings, color: "text-gray-400" },
];

export default function StudioLayoutEnhanced({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  return (
    <TooltipProvider>
      <div className="flex h-screen bg-background">
        {/* Enhanced Sidebar */}
        <motion.aside
          initial={false}
          animate={{ width: sidebarOpen ? 280 : 80 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="relative flex flex-col bg-[#120c24]/80 backdrop-blur-md border-r border-purple-500/30 shadow-[0_0_20px_rgba(147,51,234,0.2)]"
        >
          {/* Enhanced Header with gradient and glow */}
          <div className="sticky top-0 z-10 bg-gradient-to-r from-[#0f0a1e]/80 to-[#1a1230]/80 backdrop-blur-lg border-b border-purple-500/30 shadow-[0_4px_6px_-1px_rgba(147,51,234,0.2)]">
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
                    <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-blue-500">
                      <Sparkles className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                      Creator Studio
                    </h1>
                  </motion.div>
                ) : (
                  <motion.div
                    key="logo-mini"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="p-2 rounded-lg bg-gradient-to-br from-primary to-blue-500"
                  >
                    <Sparkles className="w-5 h-5 text-primary-foreground" />
                  </motion.div>
                )}
              </AnimatePresence>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="hover:bg-primary/10"
              >
                {sidebarOpen ? (
                  <ChevronLeft className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Navigation with enhanced styling */}
          <ScrollArea className="flex-1 py-4">
            <nav className="space-y-1 px-3">
              {navigationItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href === "/studio/upload" && pathname.startsWith("/studio/upload"));
                const Icon = item.icon;

                return (
                  <Tooltip key={item.name} delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          "relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                          isActive
                            ? "bg-gradient-to-r from-purple-500/10 to-blue-500/10 text-white shadow-md shadow-purple-500/20"
                            : "text-muted-foreground hover:text-foreground hover:bg-purple-500/10"
                        )}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="activeTab"
                            className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/10 to-blue-500/10"
                            initial={false}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          />
                        )}

                        <div
                          className={cn(
                            "relative z-10 p-2 rounded-md transition-all",
                            isActive
                              ? "bg-purple-500/20 shadow-sm shadow-purple-500/30"
                              : "group-hover:bg-purple-500/10"
                          )}
                        >
                          <Icon
                            className={cn("w-5 h-5", isActive ? "text-purple-400" : item.color)}
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
          <div className="sticky bottom-0 border-t bg-gradient-to-r from-[#0f0a1e]/80 to-[#1a1230]/80 backdrop-blur-lg shadow-[0_-4px_6px_-1px_rgba(147,51,234,0.2)]">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 p-4 h-auto hover:bg-muted"
                >
                  <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                    <AvatarImage src="data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='avatar' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%239333ea' /%3E%3Cstop offset='100%25' style='stop-color:%23ec4899' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='40' height='40' rx='20' fill='url(%23avatar)' /%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='white' font-family='Arial' font-size='16' font-weight='bold'%3EU%3C/text%3E%3C/svg%3E" />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-blue-500 text-primary-foreground">
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
                        <p className="text-sm font-medium">Your Channel</p>
                        <p className="text-xs text-muted-foreground">@yourchannel</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {sidebarOpen && <MoreVertical className="w-4 h-4 text-muted-foreground" />}
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
          <header className="sticky top-0 z-10 h-16 border-b bg-[#0f0a1e]/80 backdrop-blur-lg shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)]">
            <div className="flex items-center justify-between h-full px-6">
              <div className="flex items-center gap-4 flex-1">
                <div className="relative max-w-md flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search your content..."
                    className="w-full pl-10 pr-4 py-2 bg-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
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
          <main className="flex-1 overflow-y-auto bg-[#0f0a1e]">
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
