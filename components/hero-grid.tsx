'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// Function to generate a deterministic blur value based on index
const getBlurValue = (index: number) => {
  // Use a pattern based on index to create consistent blur values
  return ((index % 5) * 0.05).toFixed(2);
};

// Function to generate a deterministic highlight opacity based on index
const getHighlightOpacity = (index: number, intensity = 0) => {
  return `calc(${intensity} * ${(1 - Math.min(index / 10, 1)).toFixed(2)} * 0.8)`;
};

export const HeroGrid = () => {
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
      
      // Add dynamic highlight based on cursor position
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const distanceFromCenter = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
      const maxDistance = Math.sqrt(Math.pow(rect.width, 2) + Math.pow(rect.height, 2)) / 2;
      const intensity = 1 - Math.min(distanceFromCenter / maxDistance, 1);
      
      grid.style.setProperty('--highlight-intensity', intensity.toString());
    };
    
    // Add mousemove event listener
    window.addEventListener('mousemove', handleMouseMove);
    
    // Clean up
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  // Pre-calculate grid dimensions for SSR
  const gridHeight = '1000px';
  const gridWidth = '1000px';
  
  return (
    <div className="relative w-full h-full overflow-hidden pointer-events-none">
      {/* Grid container with perspective effect */}
      <div 
        ref={gridRef}
        className="absolute inset-0 z-0"
        style={{
          perspective: '1000px',
          perspectiveOrigin: 'calc(50% + var(--x-pos, 0) / 20) calc(50% + var(--y-pos, 0) / 20)',
        }}
      >
        {/* Main grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="w-full h-full grid grid-cols-24 lg:grid-cols-32 grid-rows-16"
          style={{
            transform: 'rotateX(var(--rotateX, 5deg)) rotateY(var(--rotateY, -5deg)) translateZ(0)',
            transformStyle: 'preserve-3d',
            willChange: 'transform',
            // Using fixed values for SSR
            '--rotateX': '0deg',
            '--rotateY': '0deg',
            '--grid-height': gridHeight,
            '--grid-width': gridWidth,
          } as React.CSSProperties}
        >
          {/* Generate grid cells with deterministic values */}
          {Array.from({ length: 24 * 16 }).map((_, i) => {
            const blurValue = getBlurValue(i);
            
            return (
              <div 
                key={i} 
                className="relative border border-slate-300/3 dark:border-white/3"
                style={{
                  backdropFilter: `blur(${blurValue}px)`,
                }}
              >
                {/* Cell highlight effect with deterministic values */}
                <div 
                  className="absolute inset-0 bg-gradient-radial from-blue-400/5 dark:from-blue-400/10 to-transparent"
                  style={{
                    opacity: 'var(--highlight-opacity, 0)',
                    pointerEvents: 'none',
                  }}
                  data-highlight={getHighlightOpacity(i)}
                />
              </div>
            );
          })}
        </motion.div>
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/0 dark:from-slate-900/0 to-background opacity-70 pointer-events-none" />
        
        {/* Glow effects */}
        <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] rounded-full bg-blue-400/10 dark:bg-blue-400/20 blur-[80px] animate-pulse-slow pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[250px] h-[250px] rounded-full bg-purple-400/10 dark:bg-purple-500/20 blur-[70px] animate-pulse-slow pointer-events-none" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-gradient-radial from-cyan-400/5 dark:from-cyan-400/10 to-transparent blur-[100px] opacity-70 animate-pulse-slow pointer-events-none" style={{ animationDelay: '2s' }} />
      </div>
    </div>
  );
};

export default HeroGrid;
