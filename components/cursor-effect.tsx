'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const CursorEffect = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setIsActive(true);
    };

    const handleMouseLeave = () => {
      setIsActive(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseleave', handleMouseLeave);

    // Clean up event listeners
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <AnimatePresence>
      {isActive && (
        <>
          {/* Main cursor effect */}
          <motion.div
            className="fixed pointer-events-none z-50 mix-blend-difference"
            animate={{
              x: mousePosition.x - 8,
              y: mousePosition.y - 8,
              scale: 1,
              opacity: 0.8,
            }}
            initial={{
              opacity: 0,
              scale: 0.5,
            }}
            exit={{
              opacity: 0,
              scale: 0,
            }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 28,
              mass: 0.5,
            }}
            style={{
              width: '24px',
              height: '24px',
            }}
          >
            <div className="w-full h-full rounded-full bg-white" />
          </motion.div>

          {/* Trailing effect */}
          <motion.div
            className="fixed pointer-events-none z-50 mix-blend-difference"
            animate={{
              x: mousePosition.x - 30,
              y: mousePosition.y - 30,
              scale: 1,
              opacity: 0.2,
            }}
            initial={{
              opacity: 0,
              scale: 0.5,
            }}
            exit={{
              opacity: 0,
              scale: 0,
            }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 30,
              mass: 1.2,
              delay: 0.08,
            }}
            style={{
              width: '100px',
              height: '100px',
            }}
          >
            <div className="w-full h-full rounded-full bg-white opacity-50 blur-sm" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CursorEffect;
