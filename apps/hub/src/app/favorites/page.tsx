import React from "react";
import { Button } from "../../components/Button";
import { VideoCard } from "../../components/VideoCard";
import { HeartIcon } from "lucide-react";

export default function FavoritesPage() {
  const favoriteVideos = [
    {
      id: 3,
      title: "AI Generated Music: Symphony of Digital Emotions",
      channel: "Harmonic AI",
      views: "2.3M",
      timestamp: "2 weeks ago",
      thumbnail:
        "https://images.unsplash.com/photo-1614149162883-504ce4d13909?q=80&w=800&auto=format&fit=crop",
      avatar:
        "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&auto=format&fit=crop&crop=faces",
      duration: "8:17",
      trending: true,
    },
    {
      id: 6,
      title: "Digital Art Evolution: From Pixels to Neural Networks",
      channel: "ArtMatrix",
      views: "932K",
      timestamp: "1 day ago",
      thumbnail:
        "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=800&auto=format&fit=crop",
      avatar:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&auto=format&fit=crop&crop=faces",
      duration: "22:14",
      trending: true,
    },
  ];

  return (
    <div className="px-6 pt-6">
      <div className="mb-6 flex items-center">
        <HeartIcon className="w-8 h-8 text-pink-400 mr-3" />
        <div>
          <h1 className="text-2xl font-bold font-afacad bg-gradient-to-r from-purple-500 to-blue-400 bg-clip-text text-transparent inline-block">
            Favorites
          </h1>
          <p className="text-gray-400 mt-1">Your favorite AI-generated content</p>
        </div>
      </div>

      {favoriteVideos.length > 0 ? (
        <>
          <div className="flex justify-between mb-4">
            <span className="text-sm text-gray-400">{favoriteVideos.length} videos</span>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">
                Sort by
              </Button>
              <Button variant="ghost" size="sm">
                Filter
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoriteVideos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-16">
          <HeartIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-xl font-medium mb-2">Your Favorites list is empty</h2>
          <p className="text-gray-400 mb-6">Add videos you love to your favorites</p>
          <Button variant="primary">Browse Videos</Button>
        </div>
      )}
    </div>
  );
}
