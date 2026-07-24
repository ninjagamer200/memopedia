'use client';

import { useState, useEffect } from 'react';
import { Heart, Star, Share2 } from 'lucide-react';
import { isLiked, isFavorited, saveLike, saveFavorite } from '@/lib/storage';

interface ActionBarProps {
  memeId: string;
  onLikeChange?: (liked: boolean) => void;
  onFavoriteChange?: (favorited: boolean) => void;
}

export function ActionBar({ memeId, onLikeChange, onFavoriteChange }: ActionBarProps) {
  const [liked, setLiked] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setLiked(isLiked(memeId));
    setFavorited(isFavorited(memeId));
  }, [memeId]);

  const handleLike = () => {
    const newState = !liked;
    setLiked(newState);
    saveLike(memeId, newState);
    onLikeChange?.(newState);
  };

  const handleFavorite = () => {
    const newState = !favorited;
    setFavorited(newState);
    saveFavorite(memeId, newState);
    onFavoriteChange?.(newState);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Check out this meme on MemoPedia!',
          text: 'Found an amazing meme on MemoPedia',
          url: window.location.href,
        });
      } catch (err) {
        console.log('[v0] Share cancelled or failed');
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (!mounted) return null;

  return (
    <div className="absolute right-4 bottom-20 flex flex-col gap-4 z-10">
      <button
        onClick={handleLike}
        className="flex flex-col items-center gap-1 p-2 rounded-full hover:bg-black/20 transition-colors"
        aria-label={liked ? 'Unlike' : 'Like'}
      >
        <Heart
          size={28}
          className={`transition-all ${
            liked ? 'fill-red-500 text-red-500' : 'text-white'
          }`}
        />
        <span className="text-xs text-white font-medium">
          {liked ? 'Liked' : 'Like'}
        </span>
      </button>

      <button
        onClick={handleFavorite}
        className="flex flex-col items-center gap-1 p-2 rounded-full hover:bg-black/20 transition-colors"
        aria-label={favorited ? 'Remove favorite' : 'Add favorite'}
      >
        <Star
          size={28}
          className={`transition-all ${
            favorited ? 'fill-yellow-400 text-yellow-400' : 'text-white'
          }`}
        />
        <span className="text-xs text-white font-medium">
          {favorited ? 'Saved' : 'Save'}
        </span>
      </button>

      <button
        onClick={handleShare}
        className="flex flex-col items-center gap-1 p-2 rounded-full hover:bg-black/20 transition-colors"
        aria-label="Share"
      >
        <Share2 size={28} className="text-white" />
        <span className="text-xs text-white font-medium">Share</span>
      </button>
    </div>
  );
}
