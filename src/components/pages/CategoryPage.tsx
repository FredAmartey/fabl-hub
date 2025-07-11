import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { VideoCard } from '../VideoCard';
export function CategoryPage() {
  const {
    categoryId
  } = useParams<{
    categoryId: string;
  }>();
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [categoryIcon, setCategoryIcon] = useState('');
  useEffect(() => {
    // Map route parameter to display name and description
    switch (categoryId) {
      case 'ai-cinematics':
        setCategoryName('AI Cinematics');
        setCategoryDescription('Computer-generated films and visual narratives');
        setCategoryIcon('yellow-400');
        break;
      case 'neural-dreams':
        setCategoryName('Neural Dreams');
        setCategoryDescription('Surreal and dreamlike AI-generated visuals');
        setCategoryIcon('purple-400');
        break;
      case 'synthetic-stories':
        setCategoryName('Synthetic Stories');
        setCategoryDescription('AI-crafted narratives and storytelling');
        setCategoryIcon('blue-400');
        break;
      case 'visual-wonders':
        setCategoryName('Visual Wonders');
        setCategoryDescription('Stunning AI-generated visual experiences');
        setCategoryIcon('green-400');
        break;
      case 'ai-music':
        setCategoryName('AI Music');
        setCategoryDescription('Computer-composed and generated music');
        setCategoryIcon('pink-400');
        break;
      case 'digital-art':
        setCategoryName('Digital Art');
        setCategoryDescription('AI-assisted artistic creations');
        setCategoryIcon('orange-400');
        break;
      case 'robot-creations':
        setCategoryName('Robot Creations');
        setCategoryDescription('Content created by physical AI systems');
        setCategoryIcon('teal-400');
        break;
      default:
        setCategoryName('Category');
        setCategoryDescription('AI-generated content');
        setCategoryIcon('gray-400');
    }
  }, [categoryId]);
  // Sample videos filtered by category
  const categoryVideos = [{
    id: 1,
    title: 'Neural Dream Journey Through Ancient Civilizations',
    channel: 'AI Wanderer',
    views: '1.2M',
    timestamp: '3 days ago',
    thumbnail: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=800&auto=format&fit=crop',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&auto=format&fit=crop&crop=faces',
    duration: '10:23',
    trending: true
  }, {
    id: 2,
    title: 'Synthetic Storytelling: The Last Cosmic Voyager',
    channel: 'StoryForge AI',
    views: '856K',
    timestamp: '1 week ago',
    thumbnail: 'https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?q=80&w=800&auto=format&fit=crop',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&auto=format&fit=crop&crop=faces',
    duration: '15:42'
  }, {
    id: 10,
    title: `Exploring ${categoryName}: A Deep Dive`,
    channel: 'AI Explorer',
    views: '542K',
    timestamp: '1 week ago',
    thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop',
    avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=150&h=150&auto=format&fit=crop&crop=faces',
    duration: '18:30'
  }, {
    id: 11,
    title: `The Future of ${categoryName} Technology`,
    channel: 'Tech Forward',
    views: '328K',
    timestamp: '3 days ago',
    thumbnail: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=800&auto=format&fit=crop',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&auto=format&fit=crop&crop=faces',
    duration: '12:45'
  }];
  return <div className="px-6 pt-6">
      <div className="mb-6">
        <h1 className={`text-2xl font-bold bg-gradient-to-r from-purple-500 to-blue-400 bg-clip-text text-transparent inline-block`}>
          {categoryName}
        </h1>
        <p className="text-gray-400 mt-1">{categoryDescription}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categoryVideos.map(video => <VideoCard key={video.id} video={video} />)}
      </div>
    </div>;
}