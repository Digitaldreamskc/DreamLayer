'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';

interface AnimatedBackgroundProps {
  intensity?: 'low' | 'medium' | 'high';
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: string;
}

export default function AnimatedBackground({ 
  intensity = 'medium'
}: AnimatedBackgroundProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const getParticleCount = useCallback(() => {
    switch (intensity) {
      case 'low': return 15;
      case 'medium': return 25;
      case 'high': return 40;
      default: return 25;
    }
  }, [intensity]);

  const colors = useMemo(() => [
    'rgba(59, 130, 246, 0.6)',   // Blue
    'rgba(168, 85, 247, 0.6)',   // Purple
    'rgba(16, 185, 129, 0.6)',   // Emerald
    'rgba(244, 63, 94, 0.6)',    // Rose
    'rgba(251, 191, 36, 0.6)',   // Amber
  ], []);

  useEffect(() => {
    const particleCount = getParticleCount();
    const newParticles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    setParticles(newParticles);
    setIsLoaded(true);
  }, [getParticleCount, colors]);

  useEffect(() => {
    if (!isLoaded) return;

    const animateParticles = () => {
      setParticles(prevParticles =>
        prevParticles.map(particle => ({
          ...particle,
          x: (particle.x + particle.speedX + 100) % 100,
          y: (particle.y + particle.speedY + 100) % 100,
        }))
      );
    };

    const interval = setInterval(animateParticles, 50);
    return () => clearInterval(interval);
  }, [isLoaded]);

  if (!isLoaded) return null;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
      {/* Base gradient background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/20 via-transparent to-purple-900/20" />
        <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-emerald-900/10 to-transparent" />
      </div>
      
      {/* Animated floating particles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute rounded-full blur-sm"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            opacity: particle.opacity,
            transform: 'translate(-50%, -50%)',
            transition: 'all 0.1s linear',
          }}
        />
      ))}

      {/* Large floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-blue-400/10 to-purple-400/10 blur-3xl animate-pulse" 
           style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-gradient-to-r from-emerald-400/10 to-blue-400/10 blur-3xl animate-pulse" 
           style={{ animationDuration: '12s', animationDelay: '2s' }} />
      <div className="absolute top-1/2 right-1/3 w-64 h-64 rounded-full bg-gradient-to-r from-purple-400/10 to-pink-400/10 blur-3xl animate-pulse" 
           style={{ animationDuration: '10s', animationDelay: '4s' }} />

      {/* Overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-slate-900/30" />
    </div>
  );
}
