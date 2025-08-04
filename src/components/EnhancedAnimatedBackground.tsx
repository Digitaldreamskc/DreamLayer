'use client';

import { useEffect, useState, useRef, useCallback } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  type: 'orb' | 'geometric' | 'line';
  rotation?: number;
  rotationSpeed?: number;
}

interface FloatingShape {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  drift: { x: number; y: number };
  opacity: number;
  color: string;
}

interface EnhancedAnimatedBackgroundProps {
  intensity?: 'low' | 'medium' | 'high';
  enableInteraction?: boolean;
  colorScheme?: 'blue' | 'purple' | 'multi';
}

export default function EnhancedAnimatedBackground({ 
  intensity = 'medium',
  enableInteraction = true,
  colorScheme = 'multi'
}: EnhancedAnimatedBackgroundProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [floatingShapes, setFloatingShapes] = useState<FloatingShape[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const animationRef = useRef<number>();
  const containerRef = useRef<HTMLDivElement>(null);

  const getColorScheme = useCallback(() => {
    switch (colorScheme) {
      case 'blue':
        return [
          { from: 'rgb(59, 130, 246, 0.1)', to: 'rgb(6, 182, 212, 0.1)' },
          { from: 'rgb(37, 99, 235, 0.05)', to: 'rgb(8, 145, 178, 0.05)' },
          { from: 'rgb(96, 165, 250, 0.15)', to: 'rgb(34, 211, 238, 0.15)' }
        ];
      case 'purple':
        return [
          { from: 'rgb(168, 85, 247, 0.1)', to: 'rgb(236, 72, 153, 0.1)' },
          { from: 'rgb(147, 51, 234, 0.05)', to: 'rgb(219, 39, 119, 0.05)' },
          { from: 'rgb(196, 181, 253, 0.15)', to: 'rgb(251, 113, 133, 0.15)' }
        ];
      default:
        return [
          { from: 'rgb(59, 130, 246, 0.1)', to: 'rgb(6, 182, 212, 0.1)' },
          { from: 'rgb(168, 85, 247, 0.1)', to: 'rgb(236, 72, 153, 0.1)' },
          { from: 'rgb(16, 185, 129, 0.1)', to: 'rgb(20, 184, 166, 0.1)' },
          { from: 'rgb(245, 158, 11, 0.1)', to: 'rgb(249, 115, 22, 0.1)' }
        ];
    }
  }, [colorScheme]);

  const getParticleCount = useCallback(() => {
    switch (intensity) {
      case 'low': return 25;
      case 'medium': return 40;
      case 'high': return 60;
      default: return 40;
    }
  }, [intensity]);

  const getShapeCount = useCallback(() => {
    switch (intensity) {
      case 'low': return 8;
      case 'medium': return 12;
      case 'high': return 18;
      default: return 12;
    }
  }, [intensity]);

  useEffect(() => {
    const colors = getColorScheme();
    const particleCount = getParticleCount();
    const shapeCount = getShapeCount();

    // Initialize particles
    const newParticles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      const colorIndex = Math.floor(Math.random() * colors.length);
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        vx: (Math.random() - 0.5) * 0.1,
        vy: (Math.random() - 0.5) * 0.1,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.8 + 0.2,
        color: `linear-gradient(135deg, ${colors[colorIndex].from}, ${colors[colorIndex].to})`,
        type: ['orb', 'geometric', 'line'][Math.floor(Math.random() * 3)] as 'orb' | 'geometric' | 'line',
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 2,
      });
    }
    setParticles(newParticles);

    // Initialize floating shapes
    const newShapes: FloatingShape[] = [];
    for (let i = 0; i < shapeCount; i++) {
      const colorIndex = Math.floor(Math.random() * colors.length);
      newShapes.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 80 + 40,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 0.5,
        drift: {
          x: (Math.random() - 0.5) * 0.02,
          y: (Math.random() - 0.5) * 0.02,
        },
        opacity: Math.random() * 0.1 + 0.05,
        color: `linear-gradient(135deg, ${colors[colorIndex].from}, ${colors[colorIndex].to})`,
      });
    }
    setFloatingShapes(newShapes);
  }, [getColorScheme, getParticleCount, getShapeCount]);

  // Handle mouse movement for interaction
  useEffect(() => {
    if (!enableInteraction) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      return () => container.removeEventListener('mousemove', handleMouseMove);
    }
  }, [enableInteraction]);

  // Animation loop
  useEffect(() => {
    const animate = () => {
      setParticles(prevParticles =>
        prevParticles.map(particle => {
          let newX = particle.x + particle.vx;
          let newY = particle.y + particle.vy;
          let newVx = particle.vx;
          let newVy = particle.vy;

          // Boundary bouncing
          if (newX <= 0 || newX >= 100) {
            newVx = -newVx;
            newX = Math.max(0, Math.min(100, newX));
          }
          if (newY <= 0 || newY >= 100) {
            newVy = -newVy;
            newY = Math.max(0, Math.min(100, newY));
          }

          // Mouse interaction
          if (enableInteraction) {
            const distanceToMouse = Math.sqrt(
              Math.pow(newX - mousePosition.x, 2) + Math.pow(newY - mousePosition.y, 2)
            );
            if (distanceToMouse < 15) {
              const angle = Math.atan2(newY - mousePosition.y, newX - mousePosition.x);
              const force = (15 - distanceToMouse) / 15;
              newVx += Math.cos(angle) * force * 0.02;
              newVy += Math.sin(angle) * force * 0.02;
            }
          }

          // Damping
          newVx *= 0.99;
          newVy *= 0.99;

          return {
            ...particle,
            x: newX,
            y: newY,
            vx: newVx,
            vy: newVy,
            rotation: (particle.rotation || 0) + (particle.rotationSpeed || 0),
          };
        })
      );

      setFloatingShapes(prevShapes =>
        prevShapes.map(shape => ({
          ...shape,
          x: shape.x + shape.drift.x,
          y: shape.y + shape.drift.y,
          rotation: shape.rotation + shape.rotationSpeed,
        }))
      );

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [mousePosition, enableInteraction]);

  const renderParticle = (particle: Particle) => {
    const baseStyle = {
      position: 'absolute' as const,
      left: `${particle.x}%`,
      top: `${particle.y}%`,
      opacity: particle.opacity,
      transform: `translate(-50%, -50%) rotate(${particle.rotation || 0}deg)`,
      background: particle.color,
      filter: 'blur(1px)',
    };

    switch (particle.type) {
      case 'orb':
        return (
          <div
            key={particle.id}
            style={{
              ...baseStyle,
              width: `${Math.ceil(particle.size * 4)}px`,
              height: `${Math.ceil(particle.size * 4)}px`,
              borderRadius: '50%',
            }}
          />
        );
      case 'geometric':
        return (
          <div
            key={particle.id}
            style={{
              ...baseStyle,
              width: `${Math.ceil(particle.size * 6)}px`,
              height: `${Math.ceil(particle.size * 6)}px`,
              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
            }}
          />
        );
      case 'line':
        return (
          <div
            key={particle.id}
            style={{
              ...baseStyle,
              width: `${particle.size * 12}px`,
              height: '2px',
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 1 }}
    >
      {/* Base gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900/20 to-purple-900/20" />
      
      {/* Floating shapes */}
      {floatingShapes.map(shape => (
        <div
          key={shape.id}
          className="absolute rounded-full blur-3xl"
          style={{
            left: `${shape.x}%`,
            top: `${shape.y}%`,
            width: `${shape.size}px`,
            height: `${shape.size}px`,
            opacity: shape.opacity,
            transform: `translate(-50%, -50%) rotate(${shape.rotation}deg)`,
            background: shape.color,
          }}
        />
      ))}

      {/* Animated particles */}
      {particles.map(renderParticle)}

      {/* Additional overlay effects */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-slate-900/30" />
      
      {/* Interactive glow effect */}
      {enableInteraction && (
        <div
          className="absolute rounded-full blur-3xl transition-all duration-300 ease-out pointer-events-none"
          style={{
            left: `${mousePosition.x}%`,
            top: `${mousePosition.y}%`,
            transform: 'translate(-50%, -50%)',
            width: '384px',
            height: '384px',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, rgba(168, 85, 247, 0.05) 50%, transparent 100%)',
          }}
        />
      )}
    </div>
  );
}
