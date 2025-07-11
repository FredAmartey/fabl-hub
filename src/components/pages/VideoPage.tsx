import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ThumbsUpIcon, ThumbsDownIcon, ShareIcon, BookmarkIcon, MessageCircleIcon, HeartIcon } from 'lucide-react';
import { Button } from '../Button';
import { VideoCard } from '../VideoCard';
export function VideoPage() {
  const {
    videoId
  } = useParams<{
    videoId: string;
  }>();
  const [video, setVideo] = useState<any>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  useEffect(() => {
    // Simulating fetching video data based on ID
    const allVideos = [{
      id: 1,
      title: 'Neural Dream Journey Through Ancient Civilizations',
      channel: 'AI Wanderer',
      channelId: 'aiwanderer',
      views: '1.2M',
      likes: '45K',
      timestamp: '3 days ago',
      thumbnail: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=800&auto=format&fit=crop',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&auto=format&fit=crop&crop=faces',
      duration: '10:23',
      trending: true,
      description: 'Journey through ancient civilizations reimagined by our neural network. This AI-generated video explores what ancient Rome, Egypt, and Mesopotamia might have looked like, blending historical accuracy with artistic interpretation.',
      subscribers: '1.8M'
    }, {
      id: 2,
      title: 'Synthetic Storytelling: The Last Cosmic Voyager',
      channel: 'StoryForge AI',
      channelId: 'storyforge',
      views: '856K',
      likes: '32K',
      timestamp: '1 week ago',
      thumbnail: 'https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?q=80&w=800&auto=format&fit=crop',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&auto=format&fit=crop&crop=faces',
      duration: '15:42',
      description: 'The Last Cosmic Voyager is a fully AI-generated narrative about the final human expedition to the edge of the known universe. Our neural storytelling engine crafted this tale based on thousands of science fiction novels and scientific papers.'
    }, {
      id: 3,
      title: 'AI Generated Music: Symphony of Digital Emotions',
      channel: 'Harmonic AI',
      channelId: 'harmonic',
      views: '2.3M',
      likes: '89K',
      timestamp: '2 weeks ago',
      thumbnail: 'https://images.unsplash.com/photo-1614149162883-504ce4d13909?q=80&w=800&auto=format&fit=crop',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&auto=format&fit=crop&crop=faces',
      duration: '8:17',
      trending: true,
      description: "Experience the world's first fully AI-composed symphony. Our music generation system analyzed thousands of classical compositions to create this unique piece that captures the essence of human emotion through digital means."
    }];
    const foundVideo = allVideos.find(v => v.id.toString() === videoId);
    setVideo(foundVideo || null);
    // Reset interaction states when video changes
    setIsLiked(false);
    setIsSaved(false);
    setIsFavorite(false);
    // Scroll to top when video changes
    window.scrollTo(0, 0);
  }, [videoId]);
  if (!video) {
    return <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-purple-500 border-b-purple-500 border-l-transparent border-r-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading video...</p>
        </div>
      </div>;
  }
  // Related videos (simplified for demo)
  const relatedVideos = [{
    id: 4,
    title: 'Visual Wonder: Ocean Depths Reimagined',
    channel: 'DeepDream Studio',
    views: '647K',
    timestamp: '4 days ago',
    thumbnail: 'https://images.unsplash.com/photo-1551244072-5d12893278ab?q=80&w=800&auto=format&fit=crop',
    avatar: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=150&h=150&auto=format&fit=crop&crop=faces',
    duration: '12:05'
  }, {
    id: 5,
    title: 'Robot Creations: Future Architecture Concepts',
    channel: 'AI Builder',
    views: '1.5M',
    timestamp: '5 days ago',
    thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop',
    avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=150&h=150&auto=format&fit=crop&crop=faces',
    duration: '18:30'
  }, {
    id: 6,
    title: 'Digital Art Evolution: From Pixels to Neural Networks',
    channel: 'ArtMatrix',
    views: '932K',
    timestamp: '1 day ago',
    thumbnail: 'https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=800&auto=format&fit=crop',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&auto=format&fit=crop&crop=faces',
    duration: '22:14',
    trending: true
  }];
  return <div className="px-6 pt-6 pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Video Player */}
          <div className="aspect-video bg-[#0a0518] rounded-xl overflow-hidden relative group mb-4">
            <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover opacity-70" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-purple-500/80 flex items-center justify-center backdrop-blur-sm cursor-pointer hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-purple-500/50">
              <div className="h-full w-1/3 bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600"></div>
            </div>
            <div className="absolute bottom-4 right-4 bg-black/80 text-white text-xs px-2 py-1 rounded">
              {video.duration}
            </div>
          </div>
          {/* Video Info */}
          <h1 className="text-2xl font-bold mb-2">{video.title}</h1>
          <div className="flex flex-wrap items-center justify-between mb-4">
            <div className="flex items-center">
              <span className="text-gray-400 mr-2">{video.views} views</span>
              <span className="text-gray-400 mr-2">•</span>
              <span className="text-gray-400">{video.timestamp}</span>
            </div>
            <div className="flex items-center space-x-2 mt-2 sm:mt-0">
              <Button variant={isLiked ? 'primary' : 'ghost'} size="sm" onClick={() => setIsLiked(!isLiked)} className={isLiked ? 'from-purple-600 to-blue-500' : ''}>
                <ThumbsUpIcon className="w-4 h-4 mr-1" />
                {isLiked ? parseInt(video.likes.replace(/[^0-9]/g, '')) + 1 + 'K' : video.likes}
              </Button>
              <Button variant="ghost" size="sm">
                <ThumbsDownIcon className="w-4 h-4 mr-1" />
                Dislike
              </Button>
              <Button variant="ghost" size="sm">
                <ShareIcon className="w-4 h-4 mr-1" />
                Share
              </Button>
              <Button variant={isSaved ? 'primary' : 'ghost'} size="sm" onClick={() => setIsSaved(!isSaved)}>
                <BookmarkIcon className="w-4 h-4 mr-1" />
                {isSaved ? 'Saved' : 'Save'}
              </Button>
              <Button variant={isFavorite ? 'primary' : 'ghost'} size="sm" onClick={() => setIsFavorite(!isFavorite)}>
                <HeartIcon className="w-4 h-4 mr-1" />
                {isFavorite ? 'Favorited' : 'Favorite'}
              </Button>
            </div>
          </div>
          {/* Channel Info */}
          <div className="flex items-start justify-between p-4 bg-[#1a1230] rounded-xl mb-6">
            <div className="flex items-start">
              <Link to={`/channel/${video.channelId}`} className="mr-3 flex-shrink-0">
                <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-purple-500/30">
                  <img src={video.avatar} alt={video.channel} className="w-full h-full object-cover" />
                </div>
              </Link>
              <div>
                <Link to={`/channel/${video.channelId}`} className="font-medium hover:text-purple-400 transition-colors">
                  {video.channel}
                </Link>
                <div className="text-sm text-gray-400 mt-1">
                  {video.subscribers || '1.5M'} subscribers
                </div>
                <p className="text-sm text-gray-300 mt-3">
                  {video.description}
                </p>
              </div>
            </div>
            <Button variant="primary" size="sm">
              Subscribe
            </Button>
          </div>
          {/* Comments */}
          <div className="bg-[#1a1230] rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium flex items-center">
                <MessageCircleIcon className="w-5 h-5 mr-2 text-purple-400" />
                Comments
              </h3>
              <span className="text-sm text-gray-400">432</span>
            </div>
            <div className="flex mb-4">
              <div className="w-8 h-8 rounded-full overflow-hidden mr-3 flex-shrink-0">
                <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&auto=format&fit=crop&crop=faces" alt="Your avatar" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <input type="text" placeholder="Add a comment..." className="w-full bg-[#241a38] border border-purple-500/30 rounded-lg py-2 px-3 focus:outline-none focus:border-purple-500 transition-colors" />
              </div>
            </div>
            {/* Sample Comments */}
            <div className="space-y-4">
              <div className="flex">
                <div className="w-8 h-8 rounded-full overflow-hidden mr-3 flex-shrink-0">
                  <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&auto=format&fit=crop&crop=faces" alt="Commenter avatar" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="flex items-center">
                    <span className="font-medium mr-2">Alex Johnson</span>
                    <span className="text-xs text-gray-400">2 days ago</span>
                  </div>
                  <p className="text-sm mt-1">
                    This is absolutely mind-blowing! The AI has captured the
                    essence of these ancient civilizations in a way I've never
                    seen before.
                  </p>
                  <div className="flex items-center mt-2 text-xs text-gray-400">
                    <button className="flex items-center hover:text-white transition-colors">
                      <ThumbsUpIcon className="w-3 h-3 mr-1" />
                      124
                    </button>
                    <button className="flex items-center ml-3 hover:text-white transition-colors">
                      <ThumbsDownIcon className="w-3 h-3 mr-1" />
                    </button>
                    <button className="ml-3 hover:text-white transition-colors">
                      Reply
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex">
                <div className="w-8 h-8 rounded-full overflow-hidden mr-3 flex-shrink-0">
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&auto=format&fit=crop&crop=faces" alt="Commenter avatar" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="flex items-center">
                    <span className="font-medium mr-2">Maya Rivera</span>
                    <span className="text-xs text-gray-400">1 day ago</span>
                  </div>
                  <p className="text-sm mt-1">
                    The detail in this is incredible. I'm an archaeologist and
                    I'm impressed by how the AI has interpreted historical data
                    while still keeping artistic freedom.
                  </p>
                  <div className="flex items-center mt-2 text-xs text-gray-400">
                    <button className="flex items-center hover:text-white transition-colors">
                      <ThumbsUpIcon className="w-3 h-3 mr-1" />
                      87
                    </button>
                    <button className="flex items-center ml-3 hover:text-white transition-colors">
                      <ThumbsDownIcon className="w-3 h-3 mr-1" />
                    </button>
                    <button className="ml-3 hover:text-white transition-colors">
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Related Videos */}
        <div>
          <h3 className="font-medium mb-4">Related Videos</h3>
          <div className="space-y-4">
            {relatedVideos.map(video => <div key={video.id} className="flex">
                <Link to={`/video/${video.id}`} className="w-40 h-24 rounded-lg overflow-hidden flex-shrink-0 mr-2">
                  <div className="relative w-full h-full">
                    <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                    <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 py-0.5 rounded">
                      {video.duration}
                    </div>
                  </div>
                </Link>
                <div className="flex-1">
                  <Link to={`/video/${video.id}`} className="font-medium text-sm hover:text-purple-400 transition-colors line-clamp-2">
                    {video.title}
                  </Link>
                  <Link to={`/channel/${video.channel.toLowerCase().replace(/\s/g, '')}`} className="text-xs text-gray-400 hover:text-purple-400 transition-colors block mt-1">
                    {video.channel}
                  </Link>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <span>{video.views} views</span>
                    <span className="mx-1">•</span>
                    <span>{video.timestamp}</span>
                  </div>
                </div>
              </div>)}
          </div>
        </div>
      </div>
    </div>;
}