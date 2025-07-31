import { User, Video } from '@fabl/types';
import { apiClient } from '@/lib/api-client';

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
    // Get user by username - API endpoint expects username identifier
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'}/api/users/${username}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('User not found');
    }
    
    const user = await response.json();
    
    // Extend with channel-specific data
    const channel: Channel = {
      ...user.data,
      // These fields might come from the API in the future
      description: user.data.bio || '',
      totalViews: 0, // TODO: Aggregate from videos
      videoCount: 0, // TODO: Get from API
      location: '',
      links: [],
      bannerUrl: user.data.bannerUrl || '',
    };
    
    return channel;
  } catch (error) {
    console.error('Error fetching channel:', error);
    return null;
  }
}

export async function getChannelVideos(channelId: string): Promise<Video[]> {
  try {
    const response = await apiClient.getVideos({ creatorId: channelId, status: 'PUBLISHED' });
    return response.data || [];
  } catch (error) {
    console.error('Error fetching channel videos:', error);
    return [];
  }
}