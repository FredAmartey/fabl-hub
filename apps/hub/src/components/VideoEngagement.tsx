"use client";

import { useState } from 'react';
import { Video } from '@fabl/types';
import { ThumbsUpIcon, ThumbsDownIcon, ShareIcon, BookmarkIcon, FlagIcon } from 'lucide-react';
import { formatNumber } from '@/lib/utils';

interface VideoEngagementProps {
  video: Video;
}

export function VideoEngagement({ video }: VideoEngagementProps) {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const handleLike = async () => {
    try {
      if (liked) {
        await fetch(`/api/videos/${video.id}/like`, { method: 'DELETE' });
        setLiked(false);
      } else {
        await fetch(`/api/videos/${video.id}/like`, { method: 'POST' });
        setLiked(true);
        setDisliked(false);
      }
    } catch (error) {
      console.error('Failed to update like:', error);
    }
  };

  const handleDislike = async () => {
    try {
      if (disliked) {
        await fetch(`/api/videos/${video.id}/dislike`, { method: 'DELETE' });
        setDisliked(false);
      } else {
        await fetch(`/api/videos/${video.id}/dislike`, { method: 'POST' });
        setDisliked(true);
        setLiked(false);
      }
    } catch (error) {
      console.error('Failed to update dislike:', error);
    }
  };

  const handleSave = async () => {
    try {
      if (saved) {
        await fetch(`/api/videos/${video.id}/save`, { method: 'DELETE' });
        setSaved(false);
      } else {
        await fetch(`/api/videos/${video.id}/save`, { method: 'POST' });
        setSaved(true);
      }
    } catch (error) {
      console.error('Failed to save video:', error);
    }
  };

  const handleShare = (platform?: string) => {
    const url = `${window.location.origin}/watch/${video.id}`;
    const text = `Check out "${video.title}" on Fabl`;

    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
    } else {
      // Copy to clipboard
      navigator.clipboard.writeText(url);
      setShowShareMenu(false);
    }
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Like/Dislike */}
      <div className="flex items-center bg-gray-800/50 rounded-full overflow-hidden">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 px-4 py-2 hover:bg-gray-700/50 transition-colors ${
            liked ? 'text-purple-400' : ''
          }`}
        >
          <ThumbsUpIcon className="w-5 h-5" />
          <span>{formatNumber((video.likes || 0) + (liked ? 1 : 0))}</span>
        </button>
        
        <div className="w-px h-6 bg-gray-700" />
        
        <button
          onClick={handleDislike}
          className={`flex items-center gap-2 px-4 py-2 hover:bg-gray-700/50 transition-colors ${
            disliked ? 'text-purple-400' : ''
          }`}
        >
          <ThumbsDownIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Share */}
      <div className="relative">
        <button
          onClick={() => setShowShareMenu(!showShareMenu)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-full transition-colors"
        >
          <ShareIcon className="w-5 h-5" />
          <span>Share</span>
        </button>

        {showShareMenu && (
          <div className="absolute top-full mt-2 right-0 bg-gray-800 rounded-lg shadow-xl border border-gray-700 py-2 min-w-[200px] z-10">
            <button
              onClick={() => handleShare('twitter')}
              className="w-full px-4 py-2 text-left hover:bg-gray-700 transition-colors"
            >
              Share on Twitter
            </button>
            <button
              onClick={() => handleShare('facebook')}
              className="w-full px-4 py-2 text-left hover:bg-gray-700 transition-colors"
            >
              Share on Facebook
            </button>
            <button
              onClick={() => handleShare()}
              className="w-full px-4 py-2 text-left hover:bg-gray-700 transition-colors"
            >
              Copy link
            </button>
          </div>
        )}
      </div>

      {/* Save */}
      <button
        onClick={handleSave}
        className={`flex items-center gap-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-full transition-colors ${
          saved ? 'text-purple-400' : ''
        }`}
      >
        <BookmarkIcon className="w-5 h-5" />
        <span>{saved ? 'Saved' : 'Save'}</span>
      </button>

      {/* Report */}
      <button
        className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-full transition-colors"
      >
        <FlagIcon className="w-5 h-5" />
        <span>Report</span>
      </button>
    </div>
  );
}