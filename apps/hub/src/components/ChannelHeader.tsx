"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Channel } from '@/lib/api/channels';
import { Button } from './Button';
import { formatNumber } from '@/lib/utils';
import { CheckIcon, BellIcon, ShareIcon } from 'lucide-react';

interface ChannelHeaderProps {
  channel: Channel;
}

export function ChannelHeader({ channel }: ChannelHeaderProps) {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const handleSubscribe = async () => {
    try {
      // TODO: Implement actual API call
      await new Promise(resolve => setTimeout(resolve, 300));
      setIsSubscribed(!isSubscribed);
    } catch (error) {
      console.error('Failed to update subscription:', error);
    }
  };

  const handleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: channel.name,
        text: `Check out ${channel.name} on Fabl`,
        url: window.location.href,
      });
    } else {
      // Fallback to copying link
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="mb-8">
      {/* Banner */}
      {channel.bannerUrl && (
        <div className="relative h-48 md:h-64 rounded-xl overflow-hidden mb-4">
          <Image
            src={channel.bannerUrl}
            alt={`${channel.name} banner`}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Channel Info */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        {/* Avatar */}
        <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden flex-shrink-0">
          <Image
            src={channel.avatarUrl || ''}
            alt={channel.name}
            fill
            className="object-cover"
          />
          {channel.isVerified && (
            <div className="absolute bottom-0 right-0 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
              <CheckIcon className="w-4 h-4 text-white" />
            </div>
          )}
        </div>

        {/* Channel Details */}
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            {channel.name}
            {channel.isVerified && (
              <span className="text-purple-500">
                <CheckIcon className="w-6 h-6" />
              </span>
            )}
          </h1>
          <div className="flex items-center gap-4 text-gray-400 mt-1">
            <span>@{channel.username}</span>
            <span>•</span>
            <span>{formatNumber(channel.subscriberCount)} subscribers</span>
            <span>•</span>
            <span>{channel.videoCount} videos</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <div className="flex items-center">
            <Button
              variant={isSubscribed ? "outline" : "primary"}
              onClick={handleSubscribe}
              className="rounded-r-none"
            >
              {isSubscribed ? 'Subscribed' : 'Subscribe'}
            </Button>
            {isSubscribed && (
              <button
                onClick={handleNotifications}
                className={`h-10 px-3 rounded-r-lg border-l border-gray-700 transition-colors ${
                  notificationsEnabled
                    ? 'bg-purple-600 hover:bg-purple-700'
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                <BellIcon className={`w-5 h-5 ${notificationsEnabled ? 'text-white' : 'text-gray-400'}`} />
              </button>
            )}
          </div>
          
          <button
            onClick={handleShare}
            className="h-10 w-10 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors"
          >
            <ShareIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}