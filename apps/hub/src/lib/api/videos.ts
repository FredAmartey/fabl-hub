import { Video, VideoStatus } from '@fabl/types';
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

export async function getVideoById(id: string): Promise<Video | null> {
  try {
    // TODO: Replace with real API call
    // For now, return mock data for development
    const mockVideo: Video = {
      id,
      creatorId: 'user_1',
      title: 'Introduction to Machine Learning with TensorFlow',
      description: `In this comprehensive tutorial, we'll explore the fundamentals of machine learning using TensorFlow. 
      
We'll cover:
- Setting up your development environment
- Understanding neural networks
- Building your first model
- Training and evaluation techniques
- Deploying your model to production

Prerequisites:
- Basic Python knowledge
- Understanding of linear algebra (helpful but not required)
- Enthusiasm to learn!

Resources mentioned in this video:
- TensorFlow Documentation: https://tensorflow.org
- Course GitHub Repository: https://github.com/example/ml-course
- Discord Community: https://discord.gg/example`,
      thumbnailUrl: `https://picsum.photos/seed/${id}/1280/720`,
      videoUrl: '',
      muxPlaybackId: 'LvZ1O8vZHEecmv02kBQG00AjgapWqWRXHF8ByNWXDCIAE', // Demo video
      duration: 1245, // 20:45
      status: VideoStatus.PUBLISHED,
      views: 125430,
      likes: 3421,
      monetizationEnabled: true,
      aiRatio: 0.15,
      isApproved: true,
      publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      creator: {
        id: 'user_1',
        email: 'alex.neural@example.com',
        name: 'Alex Neural',
        username: 'alexneural',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
        channelName: 'Neural Networks',
        subscriberCount: 12450,
        isVerified: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      tags: ['machine-learning', 'tensorflow', 'python', 'ai', 'tutorial'],
    };
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return mockVideo;
  } catch (error) {
    console.error('Error fetching video:', error);
    return null;
  }
}