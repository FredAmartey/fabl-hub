"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useUser, useClerk } from "@clerk/nextjs";
import {
  HomeIcon,
  PlayIcon,
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  CurrencyDollarIcon,
  FolderIcon,
  LanguageIcon,
  PaintBrushIcon,
  MusicalNoteIcon,
  SparklesIcon,
  CloudArrowUpIcon,
  UserCircleIcon,
  CogIcon,
  PencilIcon,
  XMarkIcon,
  ArrowLeftOnRectangleIcon,
  ArrowsRightLeftIcon,
  ExclamationCircleIcon,
  ComputerDesktopIcon,
  ChatBubbleLeftEllipsisIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";
import ChannelSettingsSimple from "./ChannelSettingsSimple";
import CustomDropdown from "./CustomDropdown";
import ToggleSwitch from "./ToggleSwitch";
import UploadWizard from "./UploadWizard";
import UploadProgressTracker from "./UploadProgressTracker";
import { UploadProvider } from "../contexts/UploadContext";

const navigationItems = [
  { name: "Dashboard", href: "/", icon: HomeIcon },
  { name: "Content", href: "/content", icon: PlayIcon },
  { name: "Playlists", href: "/playlists", icon: FolderIcon },
  { name: "Analytics", href: "/analytics", icon: ChartBarIcon },
  { name: "Monetization", href: "/monetization", icon: CurrencyDollarIcon },
  { name: "Comments", href: "/comments", icon: ChatBubbleLeftRightIcon },
  { name: "Subtitles", href: "/subtitles", icon: LanguageIcon },
  { name: "Customization", href: "/customization", icon: PaintBrushIcon },
  { name: "Audio Library", href: "/audio-library", icon: MusicalNoteIcon },
];

interface UploadFile {
  id: string
  name: string
  size: number
  type: string
  progress: number
  status: 'uploading' | 'processing' | 'completed' | 'error'
  thumbnail?: string
}

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [uploadQueue, setUploadQueue] = useState<UploadFile[]>([]);
  const [showProgressTracker, setShowProgressTracker] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (isLoaded && !isSignedIn && pathname !== '/sign-in' && pathname !== '/sign-up') {
      router.push('/sign-in');
    }
  }, [isLoaded, isSignedIn, pathname, router]);

  // Lock body scroll when modal is open
  React.useEffect(() => {
    if (showUploadModal || showSettingsModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showUploadModal, showSettingsModal]);

  // Close user menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showUserMenu && !target.closest('[data-user-menu]')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu]);

  // Show loading state while checking authentication
  if (!isLoaded) {
    return (
      <div className="flex h-screen bg-[#0a0a0f] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 via-pink-400 to-amber-300 flex items-center justify-center shadow-lg animate-pulse">
            <SparklesIcon className="w-6 h-6 text-white" />
          </div>
          <div className="text-gray-400 text-sm">Loading Studio...</div>
        </div>
      </div>
    );
  }

  // Don't show the layout for sign-in/sign-up pages or when not authenticated
  if (!isSignedIn || pathname === '/sign-in' || pathname === '/sign-up') {
    return (
      <UploadProvider openUploadModal={() => {}}>
        {children}
      </UploadProvider>
    );
  }

  const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setProfilePicture(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMultipleUploads = (files: UploadFile[]) => {
    console.log('handleMultipleUploads called with', files.length, 'files');
    setUploadQueue(files);
    setShowProgressTracker(true);
    
    // Simulate upload progress for each file
    files.forEach((file) => {
      simulateUploadProgress(file.id);
    });
  };

  const simulateUploadProgress = (fileId: string) => {
    let currentProgress = 0;
    
    const interval = setInterval(() => {
      currentProgress += Math.random() * 15 + 10; // Increment by 10-25% each time
      
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
      }
      
      setUploadQueue(prev => prev.map(file => {
        if (file.id === fileId) {
          return { 
            ...file, 
            progress: currentProgress, 
            status: currentProgress >= 100 ? 'completed' : 'uploading'
          };
        }
        return file;
      }));
    }, 300);
  };

  const handleEditVideo = (fileId: string) => {
    // Navigate to individual video editor
    // This would open a single-video wizard for the specific file
    console.log('Edit video:', fileId);
  };

  const handleRemoveFile = (fileId: string) => {
    setUploadQueue(prev => prev.filter(file => file.id !== fileId));
  };


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

        {/* Profile */}
        <div className="px-6 pt-6 pb-6 flex flex-col items-center">
          <div className="relative group">
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePictureChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              title="Change profile picture"
            />
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-pink-500 via-pink-400 to-amber-300 flex items-center justify-center shadow-lg overflow-hidden">
              {user?.imageUrl ? (
                <img 
                  src={user.imageUrl} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : profilePicture ? (
                <img 
                  src={profilePicture} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserCircleIcon className="w-14 h-14 text-white" />
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-gray-800 rounded-full border-2 border-[#0a0a0f] flex items-center justify-center group-hover:bg-gray-700 transition-colors pointer-events-none">
              <PencilIcon className="w-4 h-4 text-gray-400 group-hover:text-white" />
            </div>
          </div>
          <div className="mt-4 text-center">
            <p className="text-lg font-semibold text-white">Your channel</p>
            <p className="text-sm text-gray-500">{user?.firstName || user?.username || 'Loading...'}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 pt-1 pb-4 overflow-y-auto">
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
          <button 
            onClick={() => setShowUploadModal(true)}
            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all duration-200 shadow-lg"
          >
            <CloudArrowUpIcon className="w-5 h-5" />
            <span className="text-sm">Upload</span>
          </button>
          <button
            onClick={() => setShowSettingsModal(true)}
            className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 flex-shrink-0 bg-gray-800/50 hover:bg-gray-800/70 text-gray-400 hover:text-white"
          >
            <CogIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Profile */}
        <div className="border-t border-gray-800/50 px-4 pt-6 pb-4">
          <div className="w-full flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center">
                <Image
                  src="/fabl.png"
                  alt="Fabl Logo"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0a0a0f]" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold text-white"> Studio</p>
              <p className="text-xs text-gray-500">All systems operational</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-[#0a0a0f] relative">
          <UploadProvider openUploadModal={() => setShowUploadModal(true)}>
            {children}
          </UploadProvider>
        </main>
        
        {/* Floating User Menu */}
        <div className="fixed top-6 right-6 z-50" data-user-menu>
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 via-pink-400 to-amber-300 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 relative overflow-hidden"
            >
              <div className="absolute inset-0 rounded-full bg-white p-0.5">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-pink-500 via-pink-400 to-amber-300 flex items-center justify-center">
                  {user?.imageUrl ? (
                    <img 
                      src={user.imageUrl} 
                      alt="Profile" 
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : profilePicture ? (
                    <img 
                      src={profilePicture} 
                      alt="Profile" 
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <UserCircleIcon className="w-6 h-6 text-white" />
                  )}
                </div>
              </div>
            </button>
            
            {showUserMenu && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-white/95 backdrop-blur-xl border border-white/50 rounded-2xl shadow-2xl overflow-hidden">
                {/* User Info */}
                <div className="p-4 border-b border-gray-200/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 via-pink-400 to-amber-300 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {user?.imageUrl ? (
                        <img 
                          src={user.imageUrl} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : profilePicture ? (
                        <img 
                          src={profilePicture} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <UserCircleIcon className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{user?.firstName || user?.username || 'User'}</p>
                      <p className="text-xs text-gray-500 truncate">@{user?.username || user?.emailAddresses[0]?.emailAddress?.split('@')[0] || 'user'}</p>
                    </div>
                  </div>
                </div>
                
                {/* Menu Items */}
                <div className="py-2">
                  <button className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-100/50 transition-colors flex items-center gap-3">
                    <UserCircleIcon className="w-4 h-4 text-gray-500" />
                    Your channel
                  </button>
                  
                  <a 
                    href={process.env.NEXT_PUBLIC_HUB_URL || "http://localhost:3000"}
                    className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-100/50 transition-colors flex items-center gap-3 block"
                  >
                    <ArrowTopRightOnSquareIcon className="w-4 h-4 text-gray-500" />
                    Go to fabl.tv
                  </a>
                  
                  <button className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-100/50 transition-colors flex items-center gap-3">
                    <ArrowsRightLeftIcon className="w-4 h-4 text-gray-500" />
                    Switch account
                  </button>
                  
                  <div className="border-t border-gray-200/50 my-2"></div>
                  
                  <button 
                    onClick={() => signOut()}
                    className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-100/50 transition-colors flex items-center gap-3"
                  >
                    <ArrowLeftOnRectangleIcon className="w-4 h-4 text-gray-500" />
                    Sign out
                  </button>
                  
                  <div className="border-t border-gray-200/50 my-2"></div>
                  
                  <div className="px-4 py-2">
                    <p className="text-xs font-medium text-gray-500 mb-2">Appearance: Device theme</p>
                    <div className="flex items-center gap-2">
                      <ComputerDesktopIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-600">Device theme</span>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200/50 my-2"></div>
                  
                  <button className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-100/50 transition-colors flex items-center gap-3">
                    <ChatBubbleLeftEllipsisIcon className="w-4 h-4 text-gray-500" />
                    Send feedback
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowUploadModal(false)}
          />
          
          {/* Modal Content */}
          <div className="relative w-full max-w-4xl h-[85vh] bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-1/2 -left-24 w-48 h-48 bg-gradient-to-r from-indigo-300 to-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
              <div className="absolute bottom-1/3 -right-24 w-48 h-48 bg-gradient-to-r from-pink-300 to-rose-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-delayed"></div>
            </div>

            {/* Upload Wizard */}
            <div className="relative z-10 flex-1 flex flex-col min-h-0">
              <UploadWizard 
                onClose={() => setShowUploadModal(false)}
                onMultipleUploads={handleMultipleUploads}
              />
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowSettingsModal(false)}
          />
          
          {/* Modal Content */}
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 rounded-3xl shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="relative z-10 p-6 border-b border-white/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <CogIcon className="w-8 h-8 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
                    <p className="text-gray-600">Manage your account and preferences</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="p-2 hover:bg-gray-100/50 rounded-full transition-colors"
                >
                  <XMarkIcon className="w-6 h-6 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="relative z-10 p-6 overflow-y-auto max-h-[70vh]">
              <SettingsModalContent onClose={() => setShowSettingsModal(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Upload Progress Tracker */}
      <UploadProgressTracker
        files={uploadQueue}
        onClose={() => setShowProgressTracker(false)}
        onEditVideo={handleEditVideo}
        onRemoveFile={handleRemoveFile}
        isVisible={showProgressTracker}
      />
    </div>
  );
}


// Settings Modal Content Component
function SettingsModalContent({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState("general");
  
  // Upload defaults state
  const [visibility, setVisibility] = useState("public");
  const [category, setCategory] = useState("entertainment");
  const [language, setLanguage] = useState("en");
  
  // General settings state
  const [currency, setCurrency] = useState("USD");
  const [autoSaveDrafts, setAutoSaveDrafts] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  
  // Upload defaults toggles
  const [enableMonetization, setEnableMonetization] = useState(false);
  const [autoGenerateSubtitles, setAutoGenerateSubtitles] = useState(true);
  
  // Permissions toggles
  const [allowComments, setAllowComments] = useState(true);
  const [allowLikesDislikes, setAllowLikesDislikes] = useState(true);
  const [allowEmbedding, setAllowEmbedding] = useState(true);
  const [showSubscriberCount, setShowSubscriberCount] = useState(false);
  const [commentModeration, setCommentModeration] = useState("none");

  const currencyOptions = [
    { value: "USD", label: "USD ($)", icon: "🇺🇸" },
    { value: "EUR", label: "EUR (€)", icon: "🇪🇺" },
    { value: "GBP", label: "GBP (£)", icon: "🇬🇧" },
    { value: "CAD", label: "CAD (C$)", icon: "🇨🇦" },
    { value: "AUD", label: "AUD (A$)", icon: "🇦🇺" },
    { value: "JPY", label: "JPY (¥)", icon: "🇯🇵" },
    { value: "KRW", label: "KRW (₩)", icon: "🇰🇷" },
    { value: "CNY", label: "CNY (¥)", icon: "🇨🇳" },
    { value: "INR", label: "INR (₹)", icon: "🇮🇳" },
    { value: "BRL", label: "BRL (R$)", icon: "🇧🇷" }
  ];

  const visibilityOptions = [
    { value: "public", label: "Public - Everyone can see", icon: "🌍" },
    { value: "unlisted", label: "Unlisted - Only with link", icon: "🔗" },
    { value: "private", label: "Private - Only you", icon: "🔒" }
  ];

  const categoryOptions = [
    { value: "entertainment", label: "Entertainment", icon: "🎬" },
    { value: "education", label: "Education", icon: "📚" },
    { value: "gaming", label: "Gaming", icon: "🎮" },
    { value: "music", label: "Music", icon: "🎵" },
    { value: "technology", label: "Technology", icon: "💻" },
    { value: "lifestyle", label: "Lifestyle", icon: "✨" },
    { value: "sports", label: "Sports", icon: "⚽" },
    { value: "news", label: "News & Politics", icon: "📰" }
  ];

  const languageOptions = [
    { value: "en", label: "English", icon: "🇺🇸" },
    { value: "es", label: "Spanish", icon: "🇪🇸" },
    { value: "fr", label: "French", icon: "🇫🇷" },
    { value: "de", label: "German", icon: "🇩🇪" },
    { value: "it", label: "Italian", icon: "🇮🇹" },
    { value: "pt", label: "Portuguese", icon: "🇧🇷" },
    { value: "ja", label: "Japanese", icon: "🇯🇵" },
    { value: "ko", label: "Korean", icon: "🇰🇷" },
    { value: "zh", label: "Chinese", icon: "🇨🇳" },
    { value: "hi", label: "Hindi", icon: "🇮🇳" }
  ];

  const commentModerationOptions = [
    { value: "none", label: "No moderation", icon: "✅" },
    { value: "hold_potentially_inappropriate", label: "Hold potentially inappropriate comments", icon: "⚠️" },
    { value: "hold_all", label: "Hold all comments for review", icon: "🔒" }
  ];

  const tabs = [
    { id: "general", name: "General", icon: "⚙️" },
    { id: "channel", name: "Channel", icon: "📺" },
    { id: "upload", name: "Upload defaults", icon: "📤" },
    { id: "permissions", name: "Permissions", icon: "🔒" },
  ];

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-white/50 rounded-xl">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === tab.id
                ? "bg-white text-purple-600 shadow-md"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <span>{tab.icon}</span>
            {tab.name}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-pink-400 to-purple-400 rounded-2xl blur-lg opacity-10"></div>
        <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-lg">
          {activeTab === "general" && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">General Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 mr-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                    <p className="text-sm text-gray-600">Choose your preferred currency for monetization and analytics</p>
                  </div>
                  <div className="w-40">
                    <CustomDropdown
                      options={currencyOptions}
                      value={currency}
                      onChange={setCurrency}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium text-gray-900">Auto-save drafts</span>
                    <p className="text-sm text-gray-600">Automatically save your work as you edit</p>
                  </div>
                  <ToggleSwitch
                    checked={autoSaveDrafts}
                    onChange={setAutoSaveDrafts}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium text-gray-900">Email notifications</span>
                    <p className="text-sm text-gray-600">Receive updates about your channel via email</p>
                  </div>
                  <ToggleSwitch
                    checked={emailNotifications}
                    onChange={setEmailNotifications}
                  />
                </div>
              </div>
            </div>
          )}
          
          {activeTab === "channel" && (
            <ChannelSettingsSimple />
          )}

          {activeTab === "upload" && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Upload Defaults</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Default Visibility</label>
                  <CustomDropdown
                    options={visibilityOptions}
                    value={visibility}
                    onChange={setVisibility}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Default Category</label>
                  <CustomDropdown
                    options={categoryOptions}
                    value={category}
                    onChange={setCategory}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Default Language</label>
                  <CustomDropdown
                    options={languageOptions}
                    value={language}
                    onChange={setLanguage}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium text-gray-900">Enable monetization by default</span>
                    <p className="text-sm text-gray-600">Automatically enable monetization for new uploads</p>
                  </div>
                  <ToggleSwitch
                    checked={enableMonetization}
                    onChange={setEnableMonetization}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium text-gray-900">Auto-generate subtitles</span>
                    <p className="text-sm text-gray-600">Automatically create subtitles for new uploads</p>
                  </div>
                  <ToggleSwitch
                    checked={autoGenerateSubtitles}
                    onChange={setAutoGenerateSubtitles}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "permissions" && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Permissions</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium text-gray-900">Allow comments</span>
                    <p className="text-sm text-gray-600">Let viewers comment on your videos</p>
                  </div>
                  <ToggleSwitch
                    checked={allowComments}
                    onChange={setAllowComments}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium text-gray-900">Allow likes/dislikes</span>
                    <p className="text-sm text-gray-600">Show like and dislike buttons on videos</p>
                  </div>
                  <ToggleSwitch
                    checked={allowLikesDislikes}
                    onChange={setAllowLikesDislikes}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium text-gray-900">Allow embedding</span>
                    <p className="text-sm text-gray-600">Let others embed your videos on their websites</p>
                  </div>
                  <ToggleSwitch
                    checked={allowEmbedding}
                    onChange={setAllowEmbedding}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium text-gray-900">Show subscriber count</span>
                    <p className="text-sm text-gray-600">Display your subscriber count publicly</p>
                  </div>
                  <ToggleSwitch
                    checked={showSubscriberCount}
                    onChange={setShowSubscriberCount}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Comment moderation</label>
                  <CustomDropdown
                    options={commentModerationOptions}
                    value={commentModeration}
                    onChange={setCommentModeration}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-3">
        <button 
          onClick={onClose}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
        >
          Save Changes
        </button>
        <button 
          onClick={onClose}
          className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
        >
          Cancel
        </button>
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
  );
}
