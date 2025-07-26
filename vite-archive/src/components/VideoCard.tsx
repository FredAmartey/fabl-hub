import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PlayIcon } from 'lucide-react';
interface VideoProps {
  video: {
    id: number;
    title: string;
    channel: string;
    views: string;
    timestamp: string;
    thumbnail: string;
    avatar: string;
    duration: string;
    trending?: boolean;
  };
}
export function VideoCard({
  video
}: VideoProps) {
  const [isHovered, setIsHovered] = useState(false);
  return <Link to={`/video/${video.id}`} className="group relative rounded-xl overflow-hidden bg-[#1a1230] hover:bg-[#241a38] transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20 block" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <div className="relative aspect-video overflow-hidden">
        <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className={`
          absolute inset-0 bg-gradient-to-t from-black/70 to-transparent 
          flex items-center justify-center
          transition-opacity duration-300
          ${isHovered ? 'opacity-100' : 'opacity-0'}
        `}>
          <div className="w-16 h-16 rounded-full bg-purple-500/80 flex items-center justify-center backdrop-blur-sm transform transition-transform duration-300 group-hover:scale-110">
            <PlayIcon className="w-8 h-8 text-white" />
          </div>
        </div>
        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
          {video.duration}
        </div>
        {video.trending && <div className="absolute top-2 left-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white text-xs px-3 py-1 rounded-full flex items-center">
            <span className="animate-pulse mr-1">●</span> Trending
          </div>}
      </div>
      <div className="p-3 flex">
        <div className="mr-3 flex-shrink-0">
          <div className={`w-9 h-9 rounded-full overflow-hidden ${isHovered ? 'ring-2 ring-purple-500' : ''} transition-all`}>
            <img src={video.avatar} alt={video.channel} className="w-full h-full object-cover" />
          </div>
        </div>
        <div>
          <h3 className="font-medium text-sm mb-1 line-clamp-2 group-hover:text-purple-300 transition-colors">
            {video.title}
          </h3>
          <p className="text-xs text-gray-400 mb-1 hover:text-purple-400 transition-colors">
            {video.channel}
          </p>
          <div className="flex items-center text-xs text-gray-500">
            <span>{video.views} views</span>
            <span className="mx-1">•</span>
            <span>{video.timestamp}</span>
          </div>
        </div>
      </div>
      <div className={`
        absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600 
        transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left
      `}></div>
    </Link>;
}