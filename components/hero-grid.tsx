'use client';

import React from 'react';

// Optimized static grid for landing page (no mousemove, no highlight, no blur)
export const HeroGrid = () => {
  // Use a much smaller grid for performance
  const cols = 12;
  const rows = 6;
  return (
    <div className="relative w-full h-full overflow-hidden pointer-events-none">
      <div 
        className="absolute inset-0 z-0 grid"
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
          width: '100%',
          height: '100%',
        }}
      >
        {Array.from({ length: cols * rows }).map((_, i) => (
          <div 
            key={i} 
            className="border border-slate-300/10 dark:border-white/10"
            style={{ minHeight: 0, minWidth: 0 }}
          />
        ))}
      </div>
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/0 dark:from-slate-900/0 to-background opacity-70 pointer-events-none" />
      {/* Glow effects */}
      <div className="absolute top-1/4 left-1/4 w-[200px] h-[200px] rounded-full bg-blue-400/10 dark:bg-blue-400/20 blur-[60px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[150px] h-[150px] rounded-full bg-purple-400/10 dark:bg-purple-500/20 blur-[50px] pointer-events-none" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] rounded-full bg-gradient-radial from-cyan-400/5 dark:from-cyan-400/10 to-transparent blur-[70px] opacity-70 pointer-events-none" style={{ animationDelay: '2s' }} />
    </div>
  );
};

export default HeroGrid;
