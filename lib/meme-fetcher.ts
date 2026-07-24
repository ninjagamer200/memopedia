import { Meme } from './meme-types';

export async function fetchMemes(skip: number = 0, take: number = 10): Promise<Meme[]> {
  try {
    const response = await fetch(
      `/api/memes?skip=${skip}&take=${take}`,
      {
        method: 'GET',
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch memes');
    }

    const data = await response.json();
    return data.memes || [];
  } catch (error) {
    console.error('[v0] Error fetching memes:', error);
    return [];
  }
}

// Check if a URL is a video
export function isVideoUrl(url: string): boolean {
  const videoExtensions = ['.mp4', '.webm', '.mov', '.avi', '.mkv'];
  const lowerUrl = url.toLowerCase();
  return videoExtensions.some(ext => lowerUrl.includes(ext));
}

// Get supported video types
export function getVideoType(url: string): string {
  if (url.includes('.mp4')) return 'video/mp4';
  if (url.includes('.webm')) return 'video/webm';
  if (url.includes('.mov')) return 'video/quicktime';
  return 'video/mp4';
}
