'use client';

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm border-t border-gray-800 text-center py-2 z-20">
      <p className="text-xs text-gray-400">
        © {currentYear} MemoPedia // Owned by{' '}
        <span className="text-gray-300">_________</span> // Developed by{' '}
        <span className="text-gray-300 font-semibold">Shiven Shukla</span>
      </p>
    </footer>
  );
}
