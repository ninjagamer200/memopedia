'use client';

import { useState, useEffect } from 'react';
import { MemeCard } from './MemeCard';
import { ArrowLeft } from 'lucide-react';
import type { Meme } from '@/lib/meme-types';

interface SavedMemesProps {
  onBack: () => void;
}

export function SavedMemes({ onBack }: SavedMemesProps) {
  const [savedMemes, setSavedMemes] = useState<Meme[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Delay to ensure localStorage is fully synced
    const timer = setTimeout(() => {
      try {
        // Get saved meme IDs from localStorage (using correct key)
        const favoritesData = localStorage.getItem('MemeOPedia_favorites') || '{}';
        const favoriteIds = Object.keys(JSON.parse(favoritesData) as Record<string, boolean>);

        // Get all memes from localStorage
        const allMemes = localStorage.getItem('allMemes') || '[]';
        const memes = JSON.parse(allMemes) as Meme[];

        // Filter to only saved memes
        const filtered = memes.filter(meme => favoriteIds.includes(meme.id));

        setSavedMemes(filtered);
      } catch (error) {
        console.error('[v0] Error loading saved memes:', error);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  return (
    <div className="w-full h-screen bg-black text-white flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b border-white/10 bg-black/50 backdrop-blur">
        <button
          onClick={onBack}
          className="flex items-center gap-2 hover:text-yellow-400 transition-colors"
          aria-label="Back to feed"
        >
          <ArrowLeft size={24} />
          <span className="text-lg font-medium">Back</span>
        </button>
        <h1 className="text-2xl font-bold ml-auto">
          Saved Memes ({savedMemes.length})
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {savedMemes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <p className="text-2xl font-bold text-center">No saved memes yet!</p>
            <p className="text-gray-400 text-center">Click the star to save your favorite memes</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {savedMemes.map(meme => (
              <div key={meme.id} className="flex flex-col gap-2">
                <div className="bg-black/50 rounded-lg overflow-hidden aspect-square">
                  <img
                    src={`https://images.weserv.nl/?url=${encodeURIComponent(meme.url.replace(/^https?:\/\//, ''))}&n=-1`}
                    alt={meme.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-sm line-clamp-2">{meme.title}</p>
                <p className="text-xs text-gray-500">r/{meme.subreddit}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
