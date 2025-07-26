"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  TrendingUpIcon,
  BookmarkIcon,
  ClockIcon,
  HeartIcon,
  FilmIcon,
  MusicIcon,
  PaletteIcon,
  StarIcon,
  MessageSquareIcon,
  BookOpenIcon,
  GamepadIcon,
  MicIcon,
  UserIcon,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
}

export function Sidebar({ isOpen }: SidebarProps) {
  const pathname = usePathname();

  const navigationItems = [
    {
      icon: <HomeIcon />,
      label: "Home",
      path: "/",
    },
    {
      icon: <TrendingUpIcon />,
      label: "Trending",
      path: "/trending",
    },
    {
      icon: <BookmarkIcon />,
      label: "Subscriptions",
      path: "/subscriptions",
    },
    {
      icon: <ClockIcon />,
      label: "Watch Later",
      path: "/watch-later",
    },
    {
      icon: <HeartIcon />,
      label: "Favorites",
      path: "/favorites",
    },
  ];

  const categoryItems = [
    {
      icon: <FilmIcon className="text-red-400" />,
      label: "Film & TV",
      path: "/category/film-tv",
    },
    {
      icon: <MusicIcon className="text-pink-400" />,
      label: "Music",
      path: "/category/music",
    },
    {
      icon: <GamepadIcon className="text-green-400" />,
      label: "Gaming",
      path: "/category/gaming",
    },
    {
      icon: <MicIcon className="text-cyan-400" />,
      label: "Podcasts",
      path: "/category/podcasts",
    },
    {
      icon: <UserIcon className="text-violet-400" />,
      label: "VTubers",
      path: "/category/vtubers",
    },
    {
      icon: <PaletteIcon className="text-orange-400" />,
      label: "Art & Experimental",
      path: "/category/art-experimental",
    },
    {
      icon: <StarIcon className="text-purple-400" />,
      label: "Brands",
      path: "/category/brands",
    },
    {
      icon: <MessageSquareIcon className="text-yellow-400" />,
      label: "Memes & Comedy",
      path: "/category/memes-comedy",
    },
    {
      icon: <BookOpenIcon className="text-blue-400" />,
      label: "Tutorials",
      path: "/category/tutorials",
    },
  ];

  return (
    <aside
      className={`
        ${isOpen ? "w-56" : "w-20"} 
        transition-[width] duration-150 ease-out 
        bg-[#120c24]/80 backdrop-blur-md 
        border-r border-purple-500/20
        overflow-hidden
        h-[calc(100vh-64px)]
        sticky top-[64px]
        z-10
      `}
    >
      <div className="py-4">
        <div className="px-4 mb-6">
          <h3 className={`text-sm font-medium text-gray-400 ${!isOpen && "text-center"}`}>
            {isOpen ? "For You" : "•••"}
          </h3>
        </div>
        {navigationItems.map((item) => (
          <NavItem
            key={item.path}
            icon={item.icon}
            label={item.label}
            path={item.path}
            isOpen={isOpen}
            active={pathname === item.path}
          />
        ))}
        
        <div className="px-4 mt-8 mb-4">
          <h3 className={`text-sm font-medium text-gray-400 ${!isOpen && "text-center"}`}>
            {isOpen ? "Explore" : "•••"}
          </h3>
        </div>
        {categoryItems.map((item) => (
          <NavItem
            key={item.path}
            icon={item.icon}
            label={item.label}
            path={item.path}
            isOpen={isOpen}
            active={pathname === item.path}
          />
        ))}
      </div>
    </aside>
  );
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  path: string;
  isOpen: boolean;
  active?: boolean;
}

function NavItem({ icon, label, path, isOpen, active }: NavItemProps) {
  // Check if this is a colored category icon
  const isColoredIcon = React.isValidElement(icon) && icon.props.className?.includes('text-');
  
  return (
    <Link
      href={path}
      prefetch={true}
      className={`
        flex items-center px-4 py-3 
        ${
          active
            ? "bg-purple-500/20 border-l-4 border-purple-500"
            : "hover:bg-purple-500/10 border-l-4 border-transparent"
        } 
        cursor-pointer
        transition-colors transition-[border-color] duration-75
        ${!isOpen && "justify-center"}
        relative
        select-none
      `}
      style={{
        WebkitTapHighlightColor: "transparent",
        touchAction: "manipulation",
      }}
    >
      <div
        className={`${
          isColoredIcon 
            ? "" // Keep original color for category icons
            : active ? "text-purple-400" : "text-gray-300"
        } ${!isOpen && "mx-auto"} pointer-events-none`}
      >
        {icon}
      </div>
      {isOpen && <span className="ml-3 text-sm pointer-events-none">{label}</span>}
    </Link>
  );
}
