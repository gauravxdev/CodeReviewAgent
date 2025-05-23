'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  opacity: number;
  delay: number;
  duration: number;
}

export const ParticleEffect = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Colors for particles in light and dark mode
  const colors = {
    light: [
      'rgba(59, 130, 246, 0.6)', // blue
      'rgba(16, 185, 129, 0.6)', // emerald
      'rgba(139, 92, 246, 0.6)', // purple
      'rgba(14, 165, 233, 0.6)',  // sky
      'rgba(236, 72, 153, 0.6)'  // pink
    ],
    dark: [
      'rgba(96, 165, 250, 0.7)', // blue
      'rgba(52, 211, 153, 0.7)', // emerald
      'rgba(167, 139, 250, 0.7)', // purple
      'rgba(56, 189, 248, 0.7)',  // sky
      'rgba(244, 114, 182, 0.7)'  // pink
    ]
  };
  
  // Generate initial particles
  useEffect(() => {
    // Create particles with random properties
    const createParticles = () => {
      const isDark = document.documentElement.classList.contains('dark');
      const particleColors = isDark ? colors.dark : colors.light;
      
      const newParticles = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 15 + 8, // Larger particles
        color: particleColors[Math.floor(Math.random() * particleColors.length)],
        opacity: Math.random() * 0.5 + 0.3,
        delay: Math.random() * 5,
        duration: Math.random() * 20 + 25 // Longer durations for smoother movement
      }));
      
      setParticles(newParticles);
    };
    
    createParticles();
    
    // Update particles when theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          createParticles();
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, [colors.dark, colors.light]);
  
  // Handle mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100
        });
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  // Calculate particle movement based on mouse position
  const getParticleMotion = (particleX: number, particleY: number) => {
    const dx = particleX - mousePosition.x;
    const dy = particleY - mousePosition.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Create interactive effect when mouse is close to particle
    if (distance < 25) { // Increased interaction radius
      const angle = Math.atan2(dy, dx);
      const force = (25 - distance) * 0.8; // Stronger force
      
      return {
        x: ['-5vw', '5vw', '-3vw', `calc(3vw + ${Math.cos(angle) * force}px)`, '-5vw'],
        y: ['-3vh', '5vh', `-5vh`, `calc(3vh + ${Math.sin(angle) * force}px)`, '-3vh'],
      };
    }
    
    // Default motion when mouse is far away - more subtle movement for smoothness
    return {
      x: ['-3vw', '3vw', '-2vw', '2vw', '-3vw'],
      y: ['-2vh', '3vh', '-3vh', '2vh', '-2vh'],
    };
  };
  
  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-10 overflow-hidden"
    >
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            opacity: particle.opacity,
            filter: `blur(${particle.size / 3}px)`,
          }}
          animate={getParticleMotion(particle.x, particle.y)}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut", // Smoother easing function
            type: "tween"
          }}
        />
      ))}
    </div>
  );
};

export default ParticleEffect;
