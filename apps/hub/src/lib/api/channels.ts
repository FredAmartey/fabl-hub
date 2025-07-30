import { User, Video, VideoStatus } from '@fabl/types';
import { APIClient } from '@fabl/utils';

// Create apiClient instance
const apiClient = new APIClient({ 
  baseURL: process.env.NEXT_PUBLIC_API_URL || '',
  getAuthToken: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  }
});

// Extend User type for channel data
export interface Channel extends User {
  description?: string;
  totalViews?: number;
  videoCount?: number;
  location?: string;
  links?: { title: string; url: string }[];
  bannerUrl?: string;
}

export async function getChannelByUsername(username: string): Promise<Channel | null> {
  try {
    // TODO: Replace with real API call
    // For now, return mock data for development
    const mockChannel: Channel = {
      id: 'user_1',
      email: `${username}@example.com`,
      name: username === 'alexneural' ? 'Alex Neural' : username.charAt(0).toUpperCase() + username.slice(1),
      username,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      channelName: username === 'alexneural' ? 'Neural Networks' : `${username}'s Channel`,
      subscriberCount: Math.floor(Math.random() * 50000) + 1000,
      isVerified: username === 'alexneural',
      createdAt: new Date('2023-01-15'),
      updatedAt: new Date(),
      description: `Welcome to my channel! I create content about technology, programming, and machine learning. 
      
Subscribe to stay updated with my latest videos and tutorials. I upload new content every week!

Business inquiries: ${username}@example.com`,
      totalViews: Math.floor(Math.random() * 1000000) + 100000,
      videoCount: Math.floor(Math.random() * 100) + 10,
      location: 'San Francisco, CA',
      links: [
        { title: 'Twitter', url: `https://twitter.com/${username}` },
        { title: 'GitHub', url: `https://github.com/${username}` },
        { title: 'Website', url: `https://example.com/${username}` },
      ],
      bannerUrl: `https://picsum.photos/seed/${username}-banner/1200/300`,
    };
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return mockChannel;
  } catch (error) {
    console.error('Error fetching channel:', error);
    return null;
  }
}

export async function getChannelVideos(channelId: string): Promise<Video[]> {
  try {
    // TODO: Replace with real API call
    // For now, return mock data for development
    const mockVideos: Video[] = Array.from({ length: 12 }, (_, i) => ({
      id: `${channelId}_video_${i}`,
      creatorId: channelId,
      title: [
        'Building a Neural Network from Scratch',
        'Understanding Transformer Architecture',
        'Deploying ML Models to Production',
        'Python Tips and Tricks for Data Science',
        'Introduction to Computer Vision',
        'Natural Language Processing Basics',
        'Deep Learning with PyTorch',
        'TensorFlow Advanced Techniques',
        'Machine Learning Project Ideas',
        'AI Ethics and Responsible Development',
        'Optimizing Model Performance',
        'Real-time ML Applications',
      ][i] || `Video ${i + 1}`,
      description: 'This is a sample video description.',
      thumbnailUrl: `https://picsum.photos/seed/video-${channelId}-${i}/1280/720`,
      videoUrl: '',
      muxPlaybackId: 'LvZ1O8vZHEecmv02kBQG00AjgapWqWRXHF8ByNWXDCIAE',
      duration: Math.floor(Math.random() * 1200) + 300,
      status: VideoStatus.PUBLISHED,
      views: Math.floor(Math.random() * 100000),
      likes: Math.floor(Math.random() * 5000),
      monetizationEnabled: true,
      aiRatio: Math.random() * 0.5,
      isApproved: true,
      publishedAt: new Date(Date.now() - (i + 1) * 7 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - (i + 1) * 8 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - (i + 1) * 7 * 24 * 60 * 60 * 1000),
    }));
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return mockVideos;
  } catch (error) {
    console.error('Error fetching channel videos:', error);
    return [];
  }
}