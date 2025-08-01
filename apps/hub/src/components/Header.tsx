"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  MenuIcon,
  BellIcon,
  UserIcon,
  UploadIcon,
  SparklesIcon,
  LogOutIcon,
  SettingsIcon,
  HelpCircleIcon,
  ThumbsUpIcon,
  MessageCircleIcon,
  UserPlusIcon,
  ChevronRightIcon,
  VideoIcon,
  Loader2Icon,
} from "lucide-react";
import { Button } from "./Button";
import { SearchBox } from "./SearchBox";
import { useNotifications, useMarkNotificationRead } from "@/hooks/api/use-notifications";
import { formatDate } from "@fabl/utils";
import { useUser as useClerkUser, SignInButton, useClerk } from "@clerk/nextjs";
import { ApiHealthStatus } from "./ApiHealthStatus";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);


  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch user data and notifications
  const { user: clerkUser, isLoaded: clerkLoaded, isSignedIn } = useClerkUser();
  const { signOut } = useClerk();
  const { data: notifications, isLoading: notificationsLoading } = useNotifications();
  const markAsRead = useMarkNotificationRead();

  const unreadCount = notifications?.filter(n => !n.read).length || 0;


  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "LIKE":
        return <ThumbsUpIcon className="w-4 h-4 text-red-400" />;
      case "COMMENT":
        return <MessageCircleIcon className="w-4 h-4 text-blue-400" />;
      case "SUBSCRIBE":
        return <UserPlusIcon className="w-4 h-4 text-green-400" />;
      case "MENTION":
        return <MessageCircleIcon className="w-4 h-4 text-purple-400" />;
      case "UPLOAD":
        return <VideoIcon className="w-4 h-4 text-yellow-400" />;
      default:
        return <BellIcon className="w-4 h-4 text-gray-400" />;
    }
  };

  const handleNotificationClick = (notificationId: string) => {
    markAsRead.mutate(notificationId);
    setNotificationsOpen(false);
    // Navigate to related content if needed
  };

  const handleMarkAllAsRead = () => {
    notifications?.filter(n => !n.read).forEach(n => {
      markAsRead.mutate(n.id);
    });
  };

  return (
    <header className="sticky top-0 z-20 w-full bg-[#0f0a1e]/80 backdrop-blur-md border-b border-purple-500/20 px-4 py-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-full hover:bg-purple-500/20 transition-colors"
          >
            <MenuIcon className="w-6 h-6" />
          </button>
          <Link href="/" prefetch={true} className="flex items-center">
            <span className="text-3xl font-bold font-afacad">
              <span
                style={{
                  background: "linear-gradient(90deg, #6366f1, #a855f7, #ec4899)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                fabl
              </span>
              <span className="text-white">.tv</span>
            </span>
            <SparklesIcon className="w-5 h-5 ml-1 text-purple-400 animate-pulse" />
          </Link>
        </div>

        <SearchBox className="flex-1 max-w-2xl mx-4" />
        
        <div className="mr-4">
          <ApiHealthStatus />
        </div>

        <div className="flex items-center gap-2">
          {isSignedIn ? (
            <a
              href={process.env.NEXT_PUBLIC_STUDIO_URL || "http://localhost:3001"}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-2">
                <UploadIcon className="w-4 h-4" />
                Upload
              </Button>
            </a>
          ) : (
            <SignInButton mode="modal">
              <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-2">
                <UploadIcon className="w-4 h-4" />
                Upload
              </Button>
            </SignInButton>
          )}

          {/* Notifications Dropdown - Only show when signed in */}
          {isSignedIn && (
            <div className="relative" ref={notificationsRef}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setNotificationsOpen(!notificationsOpen);
                setProfileOpen(false);
              }}
              className="relative"
            >
              <BellIcon className="w-5 h-5" />
              {mounted && unreadCount > 0 && (
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </Button>
            {mounted && notificationsOpen && (
              <div className="absolute right-0 mt-2 w-[334px] bg-[#1a1230] border border-purple-500/30 rounded-xl shadow-lg shadow-purple-500/20 overflow-hidden z-30">
                <div className="flex items-center justify-between p-3 border-b border-purple-500/20">
                  <h3 className="font-medium">Notifications</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs"
                    onClick={handleMarkAllAsRead}
                    disabled={unreadCount === 0}
                  >
                    Mark all as read
                  </Button>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notificationsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2Icon className="w-6 h-6 animate-spin text-purple-400" />
                    </div>
                  ) : notifications && notifications.length > 0 ? (
                    notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`
                        p-3 hover:bg-purple-500/10 transition-colors cursor-pointer
                        ${notification.read ? "" : "bg-[#241a38]"}
                        border-b border-purple-500/10
                      `}
                      onClick={() => handleNotificationClick(notification.id)}
                    >
                      <div className="flex items-start">
                        <div className="flex-1 min-w-0 overflow-hidden">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="text-sm break-words">
                                <span className="text-gray-300">{notification.message}</span>
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                {formatDate(notification.createdAt)}
                              </div>
                            </div>
                            <div className="flex-shrink-0">
                              {getNotificationIcon(notification.type)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <BellIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No notifications yet</p>
                  </div>
                )}
                </div>
                <Link
                  href="/notifications"
                  prefetch={true}
                  className="block p-3 text-center text-sm font-medium text-purple-400 hover:bg-purple-500/10 transition-colors border-t border-purple-500/20"
                  onClick={() => setNotificationsOpen(false)}
                >
                  <div className="flex items-center justify-center">
                    See all notifications
                    <ChevronRightIcon className="w-4 h-4 ml-1" />
                  </div>
                </Link>
              </div>
            )}
          </div>
          )}

          {/* User Profile Dropdown - Show sign in button when not authenticated */}
          {!clerkLoaded ? (
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-blue-400 flex items-center justify-center animate-pulse">
              <Loader2Icon className="w-5 h-5 text-white animate-spin" />
            </div>
          ) : isSignedIn ? (
            <div className="relative" ref={profileRef}>
            <button
              onClick={() => {
                setProfileOpen(!profileOpen);
                setNotificationsOpen(false);
              }}
              className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-blue-400 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform overflow-hidden"
            >
              {clerkUser?.imageUrl ? (
                <img
                  src={clerkUser.imageUrl}
                  alt={clerkUser.firstName || "Profile"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserIcon className="w-5 h-5 text-white" />
              )}
            </button>
            {mounted && profileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-[#1a1230] border border-purple-500/30 rounded-xl shadow-lg shadow-purple-500/20 overflow-hidden z-30">
                <div className="p-4 border-b border-purple-500/20">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full overflow-hidden mr-3 bg-gradient-to-br from-purple-500 to-blue-400">
                      {clerkUser?.imageUrl ? (
                        <img
                          src={clerkUser.imageUrl}
                          alt={clerkUser.firstName || "Profile"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <UserIcon className="w-6 h-6 text-white" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{clerkUser?.firstName || clerkUser?.username || "User"}</div>
                      <div className="text-xs text-gray-400">@{clerkUser?.username || clerkUser?.emailAddresses[0]?.emailAddress?.split('@')[0] || "user"}</div>
                    </div>
                  </div>
                  <Link
                    href="/profile"
                    className="mt-3 block w-full py-1.5 text-center text-sm bg-purple-500/20 hover:bg-purple-500/30 rounded-lg transition-colors"
                    onClick={() => setProfileOpen(false)}
                  >
                    View Profile
                  </Link>
                </div>
                <div className="py-1">
                  <a
                    href={process.env.NEXT_PUBLIC_STUDIO_URL || "http://localhost:3001"}
                    className="flex items-center px-4 py-2 text-sm hover:bg-purple-500/10 transition-colors"
                    onClick={() => setProfileOpen(false)}
                  >
                    <UploadIcon className="w-4 h-4 mr-3 text-purple-400" />
                    Upload Video
                  </a>
                  <Link
                    href="/settings"
                    className="flex items-center px-4 py-2 text-sm hover:bg-purple-500/10 transition-colors"
                    onClick={() => setProfileOpen(false)}
                  >
                    <SettingsIcon className="w-4 h-4 mr-3 text-purple-400" />
                    Settings
                  </Link>
                  <Link
                    href="/help"
                    className="flex items-center px-4 py-2 text-sm hover:bg-purple-500/10 transition-colors"
                    onClick={() => setProfileOpen(false)}
                  >
                    <HelpCircleIcon className="w-4 h-4 mr-3 text-purple-400" />
                    Help & Support
                  </Link>
                </div>
                <div className="border-t border-purple-500/20 py-1">
                  <button
                    className="flex items-center px-4 py-2 text-sm hover:bg-purple-500/10 transition-colors w-full text-left"
                    onClick={() => {
                      setProfileOpen(false);
                      signOut();
                    }}
                  >
                    <LogOutIcon className="w-4 h-4 mr-3 text-purple-400" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
          ) : (
            <SignInButton mode="modal">
              <Button variant="primary" size="sm">
                Sign In
              </Button>
            </SignInButton>
          )}
        </div>
      </div>
    </header>
  );
}
