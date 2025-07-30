"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { PlayIcon } from "lucide-react";
import type { Video } from "@fabl/types";
import { formatNumber, formatDate, formatDuration } from "@fabl/utils";

interface VideoCardProps {
  video: Video;
  priority?: boolean;
  variant?: 'vertical' | 'horizontal';
  size?: 'sm' | 'md' | 'lg';
}

export function VideoCard({ video, priority = false, variant = 'vertical', size = 'md' }: VideoCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  if (variant === 'horizontal') {
    return (
      <Link
        href={`/watch/${video.id}`}
        className="group flex gap-3 rounded-lg overflow-hidden hover:bg-gray-800/50 transition-colors p-2"
      >
        <div className={`relative ${size === 'sm' ? 'w-40 h-24' : 'w-48 h-28'} flex-shrink-0 rounded-lg overflow-hidden`}>
          {video.thumbnailUrl ? (
            <Image
              src={video.thumbnailUrl}
              alt={video.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 40vw, 192px"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-900/20 to-blue-900/20 flex items-center justify-center">
              <PlayIcon className="w-8 h-8 text-purple-400/50" />
            </div>
          )}
          <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
            {formatDuration(video.duration)}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`font-medium ${size === 'sm' ? 'text-sm' : 'text-base'} line-clamp-2 mb-1`}>
            {video.title}
          </h3>
          <p className="text-xs text-gray-400 line-clamp-1 mb-1">
            {video.creator?.name || 'Anonymous'}
          </p>
          <div className="flex items-center text-xs text-gray-500">
            <span>{formatNumber(video.views)} views</span>
            <span className="mx-1">•</span>
            <span>{formatDate(video.publishedAt || video.createdAt)}</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/watch/${video.id}`}
      prefetch={true}
      className="group relative rounded-xl overflow-hidden bg-[#1a1230] hover:bg-[#241a38] transition-colors transition-transform transition-shadow duration-200 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20 block select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        WebkitTapHighlightColor: "transparent",
        touchAction: "manipulation",
      }}
    >
      <div className="relative aspect-video overflow-hidden bg-slate-800">
        {video.thumbnailUrl ? (
          <Image
            src={video.thumbnailUrl}
            alt={video.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            priority={priority}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900/20 to-blue-900/20">
            <PlayIcon className="w-12 h-12 text-purple-400/50" />
          </div>
        )}
        <div
          className={`
          absolute inset-0 bg-gradient-to-t from-black/70 to-transparent 
          flex items-center justify-center
          transition-opacity duration-300
          ${isHovered ? "opacity-100" : "opacity-0"}
        `}
        >
          <div className="w-16 h-16 rounded-full bg-purple-500/80 flex items-center justify-center backdrop-blur-sm transform transition-transform duration-300 group-hover:scale-110">
            <PlayIcon className="w-8 h-8 text-white" />
          </div>
        </div>
        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
          {formatDuration(video.duration)}
        </div>
        {video.views > 100000 && (
          <div className="absolute top-2 left-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white text-xs px-3 py-1 rounded-full flex items-center">
            <span className="animate-pulse mr-1">●</span> Trending
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-medium text-sm mb-1 line-clamp-2 group-hover:text-purple-300 transition-colors">
          {video.title}
        </h3>
        <div className="flex items-center text-xs text-gray-500">
          <span>{formatNumber(video.views)} views</span>
          <span className="mx-1">•</span>
          <span>{formatDate(video.publishedAt || video.createdAt)}</span>
        </div>
      </div>
      <div
        className={`
        absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600 
        transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left
      `}
      ></div>
    </Link>
  );
}