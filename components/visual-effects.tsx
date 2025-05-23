'use client';

import React, { useEffect, useRef } from 'react';

// Interactive glowing bubbles component
export const GlowingBubbles = () => {
  return null;
};

// Interactive grid background
export const InteractiveGrid = () => {
  const gridRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate distance from cursor to center of grid
      const rect = grid.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Update grid CSS variables for interactive effect
      grid.style.setProperty('--x-pos', `${x}px`);
      grid.style.setProperty('--y-pos', `${y}px`);
    };
    
    // Add mousemove event listener
    window.addEventListener('mousemove', handleMouseMove);
    
    // Clean up
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  return (
    <div 
      ref={gridRef}
      className="fixed inset-0 z-0 pointer-events-none bg-grid-light dark:bg-grid-dark bg-[length:50px_50px] opacity-40 dark:opacity-20"
      style={{
        backgroundImage: "url('/grid.svg')",
        backgroundPosition: "calc(50% + var(--x-pos, 0) / 50) calc(50% + var(--y-pos, 0) / 50)",
        transition: "background-position 0.3s ease-out",
      }}
    >
      {/* Subtle grid overlay glow effect */}
      <div className="absolute inset-0 bg-gradient-radial from-blue-500/5 dark:from-blue-400/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-1000 ease-in-out"
           style={{
             backgroundPosition: "calc(50% + var(--x-pos, 0) / 10) calc(50% + var(--y-pos, 0) / 10)",
             backgroundSize: "120% 120%"
           }}
      />
    </div>
  );
};

// Combines all visual effects into one component
export const VisualEffects: React.FC = () => {
  return (
    <>
      {/* All visual effects removed as requested */}
    </>
  );
};

export default VisualEffects;
