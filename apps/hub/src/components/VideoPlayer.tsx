"use client";

import { useRef, useEffect, useState } from 'react';
import MuxPlayer from '@mux/mux-player-react';
import { Video } from '@fabl/types';
import { PlayIcon, PauseIcon, VolumeIcon, Volume2Icon, SettingsIcon, MaximizeIcon, AlertCircleIcon } from 'lucide-react';
import { useUser } from '@/hooks/api/use-user';

interface VideoPlayerProps {
  video: Video;
}

export function VideoPlayer({ video }: VideoPlayerProps) {
  const { data: user } = useUser();
  const playerRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [viewTracked, setViewTracked] = useState(false);

  // Track view after significant watch time (30 seconds or 30% of video)
  useEffect(() => {
    if (!viewTracked && currentTime > 0 && duration > 0) {
      const watchTimeThreshold = Math.min(30, duration * 0.3); // 30 seconds or 30% of video
      
      if (currentTime >= watchTimeThreshold) {
        const incrementView = async () => {
          try {
            const response = await fetch(`/api/videos/${video.id}/view`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                watchTime: currentTime,
                userId: user?.id || null,
              }),
            });
            
            if (response.ok) {
              setViewTracked(true);
              console.log('View tracked for video:', video.id);
            }
          } catch (error) {
            console.error('Failed to increment view count:', error);
          }
        };
        
        incrementView();
      }
    }
  }, [currentTime, duration, viewTracked, video.id, user?.id]);

  // Check if video has valid Mux playback ID
  const playbackId = video.muxPlaybackId
  
  // Handle missing playback ID
  if (!playbackId) {
    return (
      <div className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden flex items-center justify-center">
        <div className="text-center p-8">
          <AlertCircleIcon className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
          <h3 className="text-white font-semibold mb-2">Video Processing</h3>
          <p className="text-gray-400 text-sm">This video is still being processed. Please check back later.</p>
        </div>
      </div>
    )
  }

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
      setCurrentTime(current);
      setProgress((current / total) * 100);
      if (total > 0 && duration !== total) {
        setDuration(total);
      }
    }
  };

  const handleError = (error: any) => {
    console.error('Video player error:', error);
    setHasError(true);
    setIsLoading(false);
    setErrorMessage('Unable to load video. Please try again later.');
  };

  const handleLoadStart = () => {
    setIsLoading(true);
    setHasError(false);
    setErrorMessage('');
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
      {!hasError ? (
        <MuxPlayer
          ref={playerRef}
          playbackId={playbackId}
          metadata={{
            video_id: video.id,
            video_title: video.title,
            viewer_user_id: user?.id || 'anonymous',
          }}
          streamType="on-demand"
          autoPlay={false}
          muted={isMuted}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onTimeUpdate={handleTimeUpdate}
          onLoadStart={handleLoadStart}
          onLoadedData={() => setIsLoading(false)}
          onError={handleError}
          className="w-full h-full"
          style={{
            '--controls': 'none',
          } as React.CSSProperties}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-900">
          <div className="text-center p-8">
            <AlertCircleIcon className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-white font-semibold mb-2">Video Unavailable</h3>
            <p className="text-gray-400 text-sm mb-4">{errorMessage}</p>
            <button
              onClick={() => {
                setHasError(false);
                setIsLoading(true);
              }}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

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
                {formatTime(currentTime)} / {formatTime(duration)}
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