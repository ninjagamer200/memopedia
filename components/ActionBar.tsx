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
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Check out this meme on MemoPedia!',
          text: 'Found an amazing meme on MemoPedia',
          url: window.location.href,
        });
      } else {
        // Desktop fallback: copy current page URL to clipboard
        const url = window.location.href;
        await navigator.clipboard.writeText(url);
        alert('Link copied to clipboard! Share with friends now!');
      }
    } catch (err) {
      // If anything fails, try copying the URL again
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      } catch {
        alert('Try right-clicking to copy the URL to share!');
      }
    }
  };

  if (!mounted) return null;

  return (
    <div className="absolute right-4 bottom-20 flex flex-col gap-4 z-50 pointer-events-auto">
      <button
        onClick={handleLike}
        className="flex flex-col items-center gap-1 p-3 rounded-full hover:bg-white/10 transition-all cursor-pointer pointer-events-auto active:scale-95"
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
        className="flex flex-col items-center gap-1 p-3 rounded-full hover:bg-white/10 transition-all cursor-pointer pointer-events-auto active:scale-95"
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
        className="flex flex-col items-center gap-1 p-3 rounded-full hover:bg-white/10 transition-all cursor-pointer pointer-events-auto active:scale-95"
        aria-label="Share"
      >
        <Share2 size={28} className="text-white" />
        <span className="text-xs text-white font-medium">Share</span>
      </button>
    </div>
  );
}
