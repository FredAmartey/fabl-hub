import { Video } from '@fabl/types';
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
    const video = await apiClient.getVideo(id);
    return video;
  } catch (error) {
    console.error('Error fetching video:', error);
    return null;
  }
}