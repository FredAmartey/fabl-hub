"use client";

import { useQuery } from '@tanstack/react-query';
import { Comment } from '@fabl/types';
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

// Mock data for development
function generateMockComments(videoId: string): Comment[] {
  const comments: Comment[] = [
    {
      id: '1',
      videoId,
      userId: 'user1',
      content: 'Great video! Really helped me understand the concept.',
      likes: 42,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
      user: {
        id: 'user1',
        name: 'Alex Chen',
        email: 'alex@example.com',
        username: 'alexchen',
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
        subscriberCount: 1500,
        isVerified: true,
        createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
      },
    },
    {
      id: '2',
      videoId,
      userId: 'user2',
      content: 'Thanks for the tutorial! Can you make a follow-up on advanced techniques?',
      likes: 15,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
      user: {
        id: 'user2',
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        username: 'sarahj',
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
        subscriberCount: 850,
        isVerified: false,
        createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
      },
    },
    {
      id: '3',
      videoId,
      userId: 'user3',
      parentId: '1',
      content: 'I agree! This was super helpful.',
      likes: 3,
      createdAt: new Date(Date.now() - 1000 * 60 * 30),
      updatedAt: new Date(Date.now() - 1000 * 60 * 30),
      user: {
        id: 'user3',
        name: 'Mike Davis',
        email: 'mike@example.com',
        username: 'miked',
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
        subscriberCount: 250,
        isVerified: false,
        createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      },
    },
  ];

  return comments;
}

export function useComments(videoId: string) {
  return useQuery({
    queryKey: ['comments', videoId],
    queryFn: async () => {
      // Use mock data for now
      if (process.env.NODE_ENV === 'development') {
        return generateMockComments(videoId);
      }

      const response = await apiClient.getComments(videoId);
      if (response.success) {
        return response.data;
      }
      throw new Error(response.error || 'Failed to fetch comments');
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}