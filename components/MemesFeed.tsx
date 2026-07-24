'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Meme } from '@/lib/meme-types';
import { fetchMemes } from '@/lib/meme-fetcher';
import { MemeCard } from './MemeCard';
import { LoadingCard } from './LoadingCard';

export function MemesFeed() {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();

  // Initial load
  useEffect(() => {
    const loadInitialMemes = async () => {
      try {
        const initialMemes = await fetchMemes(0, 10);
        setMemes(initialMemes);
        setLoading(false);
      } catch (error) {
        console.error('[v0] Failed to load initial memes:', error);
        setLoading(false);
      }
    };

    loadInitialMemes();
  }, []);

  // Load more memes when near the end
  const loadMoreMemes = useCallback(async () => {
    if (isLoadingMore || memes.length === 0) return;

    setIsLoadingMore(true);
    try {
      const newMemes = await fetchMemes(memes.length, 10);
      if (newMemes.length > 0) {
        setMemes(prev => [...prev, ...newMemes]);
      }
    } catch (error) {
      console.error('[v0] Failed to load more memes:', error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [memes.length, isLoadingMore]);

  // Handle scroll with intersection observer
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const index = Array.from(container.children).indexOf(entry.target as Element);
            setCurrentIndex(index);

            // Load more when user is near the end
            if (index >= memes.length - 3) {
              loadMoreMemes();
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    Array.from(container.children).forEach(child => observer.observe(child));

    return () => observer.disconnect();
  }, [memes.length, loadMoreMemes]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault();
        setCurrentIndex(prev => Math.min(prev + 1, memes.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setCurrentIndex(prev => Math.max(prev - 1, 0));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [memes.length]);

  // Scroll to current index
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const children = Array.from(container.children);
    if (children[currentIndex]) {
      (children[currentIndex] as HTMLElement).scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [currentIndex]);

  if (loading) {
    return (
      <div ref={containerRef} className="w-full h-screen overflow-y-scroll snap-mandatory snap-y">
        <LoadingCard />
        <LoadingCard />
        <LoadingCard />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-screen overflow-y-scroll snap-mandatory snap-y scroll-smooth"
      style={{ scrollBehavior: 'smooth' }}
    >
      {memes.map((meme, index) => (
        <MemeCard
          key={meme.id}
          meme={meme}
          isVisible={index === currentIndex}
        />
      ))}
      {isLoadingMore && <LoadingCard />}
    </div>
  );
}
