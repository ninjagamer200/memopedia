'use client';

export function LoadingCard() {
  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center overflow-hidden snap-center">
      {/* Shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
      
      <div className="relative z-10 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-700 rounded-full animate-pulse" />
        <div className="w-48 h-4 mx-auto mb-2 bg-gray-700 rounded animate-pulse" />
        <div className="w-32 h-4 mx-auto bg-gray-700 rounded animate-pulse" />
      </div>
    </div>
  );
}
