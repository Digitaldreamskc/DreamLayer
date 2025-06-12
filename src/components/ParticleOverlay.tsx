'use client';

import { useEffect, useRef } from 'react';

interface ParticleOverlayProps {
  intensity?: 'low' | 'medium' | 'high';
}

export default function ParticleOverlay({ intensity = 'medium' }: ParticleOverlayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLElement[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const particlesContainer = containerRef.current;
    const particleCount = intensity === 'low' ? 40 : intensity === 'medium' ? 80 : 120;
    
    // Clear existing particles
    particlesContainer.innerHTML = '';
    particlesRef.current = [];

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      createParticle();
    }

    function createParticle() {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      // Random size (small)
      const size = Math.random() * 3 + 1;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.position = 'absolute';
      particle.style.background = 'hsl(180, 100%, 80%)';
      particle.style.borderRadius = '50%';
      particle.style.pointerEvents = 'none';
      particle.style.mixBlendMode = 'screen';
      
      // Initial position
      resetParticle(particle);
      
      particlesContainer.appendChild(particle);
      particlesRef.current.push(particle);
      
      // Animate
      animateParticle(particle);
    }

    function resetParticle(particle: HTMLElement) {
      // Random position
      const posX = Math.random() * 100;
      const posY = Math.random() * 100;
      
      particle.style.left = `${posX}%`;
      particle.style.top = `${posY}%`;
      particle.style.opacity = '0';
      
      return {
        x: posX,
        y: posY
      };
    }

    function animateParticle(particle: HTMLElement) {
      // Initial position
      const pos = resetParticle(particle);
      
      // Random animation properties
      const duration = Math.random() * 10 + 10;
      const delay = Math.random() * 5;
      
      // Animate with CSS transitions
      setTimeout(() => {
        particle.style.transition = `all ${duration}s linear`;
        particle.style.opacity = (Math.random() * 0.3 + 0.1).toString();
        
        // Move in a slight direction
        const moveX = pos.x + (Math.random() * 20 - 10);
        const moveY = pos.y - Math.random() * 30; // Move upwards
        
        particle.style.left = `${moveX}%`;
        particle.style.top = `${moveY}%`;
        
        // Reset after animation completes
        setTimeout(() => {
          if (particle.parentNode) {
            animateParticle(particle);
          }
        }, duration * 1000);
      }, delay * 1000);
    }

    // Mouse interaction
    function handleMouseMove(e: MouseEvent) {
      // Create particles at mouse position
      const mouseX = (e.clientX / window.innerWidth) * 100;
      const mouseY = (e.clientY / window.innerHeight) * 100;
      
      // Create temporary particle
      const particle = document.createElement('div');
      particle.className = 'particle temp-particle';
      
      // Small size
      const size = Math.random() * 4 + 2;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.position = 'absolute';
      particle.style.background = 'hsl(180, 100%, 80%)';
      particle.style.borderRadius = '50%';
      particle.style.pointerEvents = 'none';
      particle.style.mixBlendMode = 'screen';
      
      // Position at mouse
      particle.style.left = `${mouseX}%`;
      particle.style.top = `${mouseY}%`;
      particle.style.opacity = '0.6';
      
      particlesContainer.appendChild(particle);
      
      // Animate outward
      setTimeout(() => {
        particle.style.transition = 'all 2s ease-out';
        particle.style.left = `${mouseX + (Math.random() * 10 - 5)}%`;
        particle.style.top = `${mouseY + (Math.random() * 10 - 5)}%`;
        particle.style.opacity = '0';
        
        // Remove after animation
        setTimeout(() => {
          if (particle.parentNode) {
            particle.remove();
          }
        }, 2000);
      }, 10);
      
      // Subtle movement of gradient spheres
      const spheres = document.querySelectorAll('.gradient-sphere');
      const moveX = (e.clientX / window.innerWidth - 0.5) * 5;
      const moveY = (e.clientY / window.innerHeight - 0.5) * 5;
      
      spheres.forEach(sphere => {
        const element = sphere as HTMLElement;
        element.style.transform = `translate(${moveX}px, ${moveY}px)`;
      });
    }

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      // Clean up particles
      particlesRef.current.forEach(particle => {
        if (particle.parentNode) {
          particle.remove();
        }
      });
      particlesRef.current = [];
    };
  }, [intensity]);

  return (
    <div 
      ref={containerRef}
      id="particles-container"
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 2 }}
    />
  );
}
