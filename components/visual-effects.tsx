'use client';

import React, { useEffect, useRef, useCallback } from 'react';

// Interactive glowing bubbles component
export const GlowingBubbles = () => {
  return null;
};

// Interactive grid background with high performance
export const InteractiveGrid = () => {
  const gridRef = useRef<HTMLDivElement>(null);
  const pointerActive = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const rafId = useRef<number | null>(null);

  // Animation loop for smoothness
  const animate = useCallback(() => {
    if (!pointerActive.current || !gridRef.current) return;
    gridRef.current.style.setProperty('--x-pos', `${lastPos.current.x}px`);
    gridRef.current.style.setProperty('--y-pos', `${lastPos.current.y}px`);
    rafId.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = grid.getBoundingClientRect();
      lastPos.current.x = e.clientX - rect.left;
      lastPos.current.y = e.clientY - rect.top;
    };

    const handlePointerEnter = () => {
      pointerActive.current = true;
      if (!rafId.current) rafId.current = requestAnimationFrame(animate);
    };

    const handlePointerLeave = () => {
      pointerActive.current = false;
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
    };

    grid.addEventListener('pointermove', handlePointerMove);
    grid.addEventListener('pointerenter', handlePointerEnter);
    grid.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      grid.removeEventListener('pointermove', handlePointerMove);
      grid.removeEventListener('pointerenter', handlePointerEnter);
      grid.removeEventListener('pointerleave', handlePointerLeave);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
    };
  }, [animate]);

  return (
    <div
      ref={gridRef}
      className="fixed inset-0 z-0 pointer-events-none bg-grid-light dark:bg-grid-dark bg-[length:50px_50px] opacity-40 dark:opacity-20 will-change-[background-position]"
      style={{
        backgroundImage: "url('/grid.svg')",
        backgroundPosition: "calc(50% + var(--x-pos, 0) / 50) calc(50% + var(--y-pos, 0) / 50)",
        transition: "background-position 0.08s linear",
      }}
    >
      <div
        className="absolute inset-0 bg-gradient-radial from-blue-500/5 dark:from-blue-400/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 will-change-[opacity]"
        style={{
          backgroundPosition: "calc(50% + var(--x-pos, 0) / 10) calc(50% + var(--y-pos, 0) / 10)",
          backgroundSize: "120% 120%"
        }}
      />
    </div>
  );
};

// Combines all visual effects into one component with performance optimizations
export const VisualEffects: React.FC = () => {
  return (
    <>
      <InteractiveGrid />
    </>
  );
};

export default VisualEffects;
