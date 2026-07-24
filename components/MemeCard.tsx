'use client';

import { Meme } from '@/lib/meme-types';
import { ActionBar } from './ActionBar';
import { useState } from 'react';

interface MemeCardProps {
  meme: Meme;
  isVisible: boolean;
}

export function MemeCard({ meme, isVisible }: MemeCardProps) {
  const [mediaError, setMediaError] = useState(false);
  const isVideo = meme.type === 'video';

  return (
    <div className="relative w-full h-screen bg-black flex items-center justify-center overflow-hidden snap-center">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40 z-0" />

      {/* Media Container */}
      <div className="relative w-full h-full flex items-center justify-center z-5">
        {mediaError ? (
          <div className="flex flex-col items-center justify-center gap-4 p-8">
            <div className="text-white text-center">
              <p className="text-lg font-semibold mb-2">Unable to load meme</p>
              <p className="text-sm text-gray-400">{meme.title}</p>
            </div>
          </div>
        ) : isVideo ? (
          <video
            src={meme.url}
            controls
            loop
            autoPlay={isVisible}
            muted
            className="max-w-full max-h-full w-auto h-auto object-contain"
            onError={() => setMediaError(true)}
            crossOrigin="anonymous"
          />
        ) : (
          <img
            src={`https://images.weserv.nl/?url=${encodeURIComponent(meme.url.replace(/^https?:\/\//, ''))}&n=-1`}
            alt={meme.title}
            className="max-w-full max-h-full w-auto h-auto object-contain"
            onError={() => setMediaError(true)}
            crossOrigin="anonymous"
          />
        )}
      </div>

      {/* Title Overlay */}
      <div className="absolute bottom-24 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent z-10">
        <p className="text-white font-semibold text-sm line-clamp-2">
          {meme.title}
        </p>
        {meme.subreddit && (
          <p className="text-gray-300 text-xs mt-1">r/{meme.subreddit}</p>
        )}
      </div>

      {/* Action Bar */}
      <ActionBar memeId={meme.id} />
    </div>
  );
}
