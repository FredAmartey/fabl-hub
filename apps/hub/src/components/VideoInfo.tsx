"use client";

import { useState } from 'react';
import { Video } from '@fabl/types';
import { Avatar } from './Avatar';
import { Button } from './Button';
import { formatDistanceToNow } from 'date-fns';
import { formatViewCount } from '@/lib/utils';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';

interface VideoInfoProps {
  video: Video;
}

export function VideoInfo({ video }: VideoInfoProps) {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = async () => {
    try {
      const response = await fetch(`/api/channels/${video.creatorId}/subscribe`, {
        method: isSubscribed ? 'DELETE' : 'POST',
      });
      
      if (response.ok) {
        setIsSubscribed(!isSubscribed);
      }
    } catch (error) {
      console.error('Failed to update subscription:', error);
    }
  };

  const description = video.description || 'No description available.';
  const shouldTruncate = description.length > 200;
  const displayDescription = showFullDescription || !shouldTruncate
    ? description
    : description.slice(0, 200) + '...';

  return (
    <div className="space-y-4">
      {/* Title and Stats */}
      <div>
        <h1 className="text-2xl font-bold mb-2">{video.title}</h1>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <span>{formatViewCount(video.views)} views</span>
          <span>•</span>
          <span>{formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}</span>
          {video.aiRatio && video.aiRatio > 0.3 && (
            <>
              <span>•</span>
              <span className="text-purple-400">
                {Math.round(video.aiRatio * 100)}% AI Generated
              </span>
            </>
          )}
        </div>
      </div>

      {/* Channel Info */}
      <div className="flex items-center justify-between py-4 border-t border-b border-gray-800">
        <div className="flex items-center gap-4">
          <Avatar
            src={video.creator?.image}
            alt={video.creator?.name || 'Creator'}
            size="md"
          />
          <div>
            <h3 className="font-medium">{video.creator?.name || 'Anonymous'}</h3>
            <p className="text-sm text-gray-400">
              {video.creator?.subscriberCount || 0} subscribers
            </p>
          </div>
        </div>
        
        <Button
          variant={isSubscribed ? "outline" : "primary"}
          onClick={handleSubscribe}
        >
          {isSubscribed ? 'Subscribed' : 'Subscribe'}
        </Button>
      </div>

      {/* Description */}
      <div className="bg-gray-800/50 rounded-lg p-4">
        <p className="whitespace-pre-wrap">{displayDescription}</p>
        
        {shouldTruncate && (
          <button
            onClick={() => setShowFullDescription(!showFullDescription)}
            className="mt-2 flex items-center gap-1 text-sm text-purple-400 hover:text-purple-300 transition-colors"
          >
            {showFullDescription ? (
              <>
                Show less
                <ChevronUpIcon className="w-4 h-4" />
              </>
            ) : (
              <>
                Show more
                <ChevronDownIcon className="w-4 h-4" />
              </>
            )}
          </button>
        )}
        
        {/* Tags */}
        {video.tags && video.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {video.tags.map((tag) => (
              <a
                key={tag}
                href={`/search?q=${encodeURIComponent(tag)}`}
                className="text-xs bg-purple-500/20 hover:bg-purple-500/30 px-2 py-1 rounded transition-colors"
              >
                #{tag}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}