'use client';

import { useState } from 'react';
import { MemesFeed } from '@/components/MemesFeed'
import { SavedMemes } from '@/components/SavedMemes'

export default function Page() {
  const [showSaved, setShowSaved] = useState(false);

  return (
    <main className="w-full h-screen bg-black overflow-hidden">
      {showSaved ? (
        <SavedMemes onBack={() => setShowSaved(false)} />
      ) : (
        <>
          {/* Header with Saved button */}
          <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 bg-black/50 backdrop-blur border-b border-white/10">
            <h1 className="text-2xl font-bold text-white">MemoPedia</h1>
            <button
              onClick={() => setShowSaved(true)}
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-lg transition-colors"
            >
              💾 Saved
            </button>
          </div>
          <div className="pt-16">
            <MemesFeed />
          </div>
        </>
      )}
    </main>
  )
}
