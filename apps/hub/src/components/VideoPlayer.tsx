"use client";

import { useRef, useEffect, useState } from 'react';
import MuxPlayer from '@mux/mux-player-react';
import { Video } from '@fabl/types';
import { PlayIcon, PauseIcon, VolumeIcon, Volume2Icon, SettingsIcon, MaximizeIcon } from 'lucide-react';

interface VideoPlayerProps {
  video: Video;
}

export function VideoPlayer({ video }: VideoPlayerProps) {
  const playerRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Increment view count on mount
  useEffect(() => {
    const incrementView = async () => {
      try {
        await fetch(`/api/videos/${video.id}/view`, {
          method: 'POST',
        });
      } catch (error) {
        console.error('Failed to increment view count:', error);
      }
    };
    
    incrementView();
  }, [video.id]);

  // For development, use a demo video if no Mux playback ID
  const playbackId = video.muxPlaybackId || 'LvZ1O8vZHEecmv02kBQG00AjgapWqWRXHF8ByNWXDCIAE';

  const handlePlayPause = () => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.pause();
      } else {
        playerRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMuteToggle = () => {
    if (playerRef.current) {
      playerRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (playerRef.current) {
      const current = playerRef.current.currentTime || 0;
      const total = playerRef.current.duration || 0;
      setProgress((current / total) * 100);
      setDuration(total);
    }
  };

  const handleFullscreen = () => {
    if (playerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        playerRef.current.requestFullscreen();
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative aspect-video bg-black rounded-xl overflow-hidden group">
      <MuxPlayer
        ref={playerRef}
        playbackId={playbackId}
        metadata={{
          video_id: video.id,
          video_title: video.title,
          viewer_user_id: 'anonymous',
        }}
        streamType="on-demand"
        autoPlay={false}
        muted={isMuted}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
        onLoadedData={() => setIsLoading(false)}
        className="w-full h-full"
        style={{
          '--controls': 'none',
        } as React.CSSProperties}
      />

      {/* Custom Controls Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {/* Play/Pause Button */}
        <button
          onClick={handlePlayPause}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-16 h-16 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors">
            {isPlaying ? (
              <PauseIcon className="w-8 h-8 text-white" />
            ) : (
              <PlayIcon className="w-8 h-8 text-white ml-1" />
            )}
          </div>
        </button>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="h-1 bg-white/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-purple-500 transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Play/Pause */}
              <button
                onClick={handlePlayPause}
                className="text-white hover:text-purple-400 transition-colors"
              >
                {isPlaying ? (
                  <PauseIcon className="w-6 h-6" />
                ) : (
                  <PlayIcon className="w-6 h-6" />
                )}
              </button>

              {/* Volume */}
              <button
                onClick={handleMuteToggle}
                className="text-white hover:text-purple-400 transition-colors"
              >
                {isMuted ? (
                  <VolumeIcon className="w-6 h-6" />
                ) : (
                  <Volume2Icon className="w-6 h-6" />
                )}
              </button>

              {/* Time */}
              <span className="text-white text-sm">
                {formatTime(progress * duration / 100)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-4">
              {/* Settings */}
              <button className="text-white hover:text-purple-400 transition-colors">
                <SettingsIcon className="w-6 h-6" />
              </button>

              {/* Fullscreen */}
              <button
                onClick={handleFullscreen}
                className="text-white hover:text-purple-400 transition-colors"
              >
                <MaximizeIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="w-12 h-12 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}