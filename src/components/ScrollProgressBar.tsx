import React, { useState, useEffect } from 'react';

export const ScrollProgressBar: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
          if (totalHeight > 0) {
            const currentScroll = window.scrollY;
            const progress = Math.min(100, Math.max(0, (currentScroll / totalHeight) * 100));
            setScrollProgress(progress);
            setIsVisible(currentScroll > 40);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div 
      className={`fixed top-0 left-0 right-0 z-50 h-[3px] bg-black/40 pointer-events-none transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      aria-hidden="true"
    >
      {/* Active Gradient Fill Bar */}
      <div
        className="h-full bg-gradient-to-r from-purple-500 via-indigo-400 to-cyan-400 shadow-[0_0_10px_rgba(168,85,247,0.8)] transition-[width] duration-150 ease-out relative"
        style={{ width: `${scrollProgress}%` }}
      >
        {/* Glow point at the leading edge */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_8px_#38bdf8] -mr-1" />
      </div>
    </div>
  );
};
