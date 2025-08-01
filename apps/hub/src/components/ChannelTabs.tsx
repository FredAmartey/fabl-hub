"use client";

import Link from 'next/link';

interface ChannelTabsProps {
  currentTab: string;
  username: string;
}

const tabs = [
  { id: 'videos', label: 'Videos' },
  { id: 'playlists', label: 'Playlists' },
  { id: 'about', label: 'About' },
];

export function ChannelTabs({ currentTab, username }: ChannelTabsProps) {

  return (
    <div className="border-b border-gray-800">
      <nav className="flex gap-8">
        {tabs.map((tab) => {
          const href = tab.id === 'videos' 
            ? `/channel/${username}` 
            : `/channel/${username}?tab=${tab.id}`;
          
          const isActive = tab.id === currentTab;

          return (
            <Link
              key={tab.id}
              href={href}
              className={`
                py-4 px-1 text-sm font-medium transition-colors relative
                ${isActive 
                  ? 'text-white' 
                  : 'text-gray-400 hover:text-gray-300'
                }
              `}
            >
              {tab.label}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500" />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}