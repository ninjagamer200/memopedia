import { NextRequest, NextResponse } from 'next/server';
import { Meme } from '@/lib/meme-types';

// Meme API: https://api.imgflip.com/ and https://meme-api.com/

async function fetchFromMemeApi(skip: number, take: number): Promise<Meme[]> {
  try {
    // Using meme-api.com which pulls from Reddit
    const response = await fetch('https://meme-api.com/gimme/memes/10', {
      method: 'GET',
      headers: {
        'User-Agent': 'MemoPedia/1.0',
      },
      next: { revalidate: 60 }, // Cache for 60 seconds
    });

    if (!response.ok) {
      throw new Error('Meme API request failed');
    }

    const data = await response.json();
    const memes: Meme[] = (data.memes || []).map((meme: any, index: number) => ({
      id: `${meme.postLink.replace(/\//g, '_')}_${index}`,
      title: meme.title || 'Untitled Meme',
      url: meme.url,
      thumbnail: meme.preview?.[0] || meme.url,
      type: meme.url.includes('.mp4') || meme.url.includes('.webm') ? 'video' : 'image',
      source: 'reddit',
      subreddit: meme.subreddit || 'memes',
      postLink: meme.postLink,
    }));

    return memes;
  } catch (error) {
    console.error('[v0] Error fetching from meme API:', error);
    return [];
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const skip = parseInt(searchParams.get('skip') || '0', 10);
  const take = parseInt(searchParams.get('take') || '10', 10);

  try {
    const memes = await fetchFromMemeApi(skip, take);

    return NextResponse.json({
      memes,
      totalCount: memes.length,
      skip,
      take,
    });
  } catch (error) {
    console.error('[v0] API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch memes', memes: [] },
      { status: 500 }
    );
  }
}
