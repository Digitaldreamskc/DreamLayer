'use client';

import { useEffect, useRef } from 'react';

class SimpleParticleSystem {
    private container: HTMLElement;
    private particles: any[];
    private animationId: number | null;

    constructor(container: HTMLElement) {
        this.container = container;
        this.particles = [];
        this.animationId = null;
        this.init();
    }

    private init(): void {
        // Create 10 particles
        for (let i = 0; i < 10; i++) {
            this.createParticle();
        }
        this.animate();
    }

    private createParticle(): void {
        const particle = {
            element: document.createElement('div'),
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            speedX: (Math.random() - 0.5) * 2,
            speedY: (Math.random() - 0.5) * 2,
            size: Math.random() * 10 + 5 // 5-15px
        };

        particle.element.style.cssText = `
            position: absolute;
            width: ${particle.size}px;
            height: ${particle.size}px;
            background: rgba(255, 255, 255, 0.7);
            border-radius: 50%;
            pointer-events: none;
            transform: translate(${particle.x}px, ${particle.y}px);
        `;

        this.container.appendChild(particle.element);
        this.particles.push(particle);
    }

    private animate = (): void => {
        this.particles.forEach(particle => {
            // Update position
            particle.x += particle.speedX;
            particle.y += particle.speedY;

            // Wrap around screen
            if (particle.x > window.innerWidth) particle.x = 0;
            if (particle.x < 0) particle.x = window.innerWidth;
            if (particle.y > window.innerHeight) particle.y = 0;
            if (particle.y < 0) particle.y = window.innerHeight;

            // Update particle position
            particle.element.style.transform = `translate(${particle.x}px, ${particle.y}px)`;
        });

        this.animationId = requestAnimationFrame(this.animate);
    };

    public destroy(): void {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        this.particles.forEach(p => p.element.remove());
        this.particles = [];
    }
}

export default function ParticleBackground() {
    const containerRef = useRef<HTMLDivElement>(null);
    const systemRef = useRef<SimpleParticleSystem | null>(null);

    useEffect(() => {
        if (containerRef.current) {
            systemRef.current = new SimpleParticleSystem(containerRef.current);
        }

        return () => {
            if (systemRef.current) {
                systemRef.current.destroy();
            }
        };
    }, []);

    return (
        <div 
            ref={containerRef}
            style={{ 
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 1,
                pointerEvents: 'none',
                overflow: 'hidden'
            }}
        />
    );
}