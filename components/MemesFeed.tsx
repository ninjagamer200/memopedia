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
  const [seenMemeIds, setSeenMemeIds] = useState<Set<string>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();
  const fetchedMemesRef = useRef<Map<string, Meme>>(new Map());

  // Load seen meme IDs from localStorage on mount
  useEffect(() => {
    const seen = localStorage.getItem('seenMemeIds');
    if (seen) {
      try {
        setSeenMemeIds(new Set(JSON.parse(seen)));
      } catch (error) {
        console.error('[v0] Error loading seen memes:', error);
      }
    }
  }, []);

  // Initial load
  useEffect(() => {
    const loadInitialMemes = async () => {
      try {
        // Fetch more memes to have a pool of fresh ones
        const initialMemes = await fetchMemes(0, 30);
        
        // Store all fetched memes for reference
        initialMemes.forEach(meme => fetchedMemesRef.current.set(meme.id, meme));
        
        // Separate unseen and seen memes
        const unseenMemes = initialMemes.filter(m => !seenMemeIds.has(m.id));
        const seenMemesList = initialMemes.filter(m => seenMemeIds.has(m.id));
        
        // Prioritize unseen memes, then add seen ones if needed
        const prioritized = [...unseenMemes.slice(0, 10), ...seenMemesList.slice(0, 5)];
        
        setMemes(prioritized);
        localStorage.setItem('allMemes', JSON.stringify(prioritized));
        setLoading(false);
      } catch (error) {
        console.error('[v0] Failed to load initial memes:', error);
        setLoading(false);
      }
    };

    loadInitialMemes();
  }, [seenMemeIds]);

  // Load more memes when near the end
  const loadMoreMemes = useCallback(async () => {
    if (isLoadingMore || memes.length === 0) return;

    setIsLoadingMore(true);
    try {
      const newMemes = await fetchMemes(memes.length, 20);
      if (newMemes.length > 0) {
        // Store fetched memes in ref for later use
        newMemes.forEach(meme => fetchedMemesRef.current.set(meme.id, meme));
        
        setMemes(prev => {
          // Separate unseen and seen from new batch
          const unseenBatch = newMemes.filter(m => !seenMemeIds.has(m.id));
          const seenBatch = newMemes.filter(m => seenMemeIds.has(m.id));
          
          // Prioritize unseen, fill with seen if needed
          const toAdd = [...unseenBatch, ...seenBatch].slice(0, 15);
          const updated = [...prev, ...toAdd];
          
          localStorage.setItem('allMemes', JSON.stringify(updated));
          return updated;
        });
      }
    } catch (error) {
      console.error('[v0] Failed to load more memes:', error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [memes.length, isLoadingMore, seenMemeIds]);

  // Handle scroll with intersection observer - mark as seen when scrolling past
  useEffect(() => {
    const container = containerRef.current;
    if (!container || memes.length === 0) return;

    let lastSeenIndex = -1;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const index = Array.from(container.children).indexOf(entry.target as Element);
          const meme = memes[index];
          
          if (entry.isIntersecting) {
            setCurrentIndex(index);

            // Load more when user is near the end
            if (index >= memes.length - 3) {
              loadMoreMemes();
            }
          } else if (!entry.isIntersecting && meme) {
            // Mark as seen when no longer visible (scrolled out of view)
            if (lastSeenIndex < index) {
              setSeenMemeIds(prev => {
                const updated = new Set(prev);
                updated.add(meme.id);
                // Save to localStorage
                localStorage.setItem('seenMemeIds', JSON.stringify(Array.from(updated)));
                return updated;
              });
              lastSeenIndex = index;
            }
          }
        });
      },
      { threshold: 0.01 }
    );

    Array.from(container.children).forEach(child => observer.observe(child));

    return () => observer.disconnect();
  }, [memes, loadMoreMemes]);

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
