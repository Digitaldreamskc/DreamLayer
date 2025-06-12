'use client';

import { useEffect, useState } from 'react';

interface SimpleAnimatedBackgroundProps {
  intensity?: 'low' | 'medium' | 'high';
}

export default function SimpleAnimatedBackground({ 
  intensity = 'medium'
}: SimpleAnimatedBackgroundProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const getParticleCount = () => {
    switch (intensity) {
      case 'low': return 3;
      case 'medium': return 5;
      case 'high': return 8;
      default: return 5;
    }
  };

  const particles = Array.from({ length: getParticleCount() }, (_, i) => ({
    id: i,
    size: Math.random() * 100 + 50,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
  }));

  if (!isLoaded) return null;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
      {/* Base gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900/20 to-purple-900/20" />
      
      {/* Simple floating shapes */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute rounded-full opacity-10 blur-3xl animate-pulse"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(168, 85, 247, 0.3))',
            transform: 'translate(-50%, -50%)',
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-slate-900/30" />
    </div>
  );
}
