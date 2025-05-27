'use client';

import { useEffect, useRef } from 'react';

class MobileParticleSystem {
    private container: HTMLElement;
    private particles: any[];
    private maxParticles: number;
    private touchParticles: any[];
    private maxTouchParticles: number;
    private animationId: number | null;
    private lastTouchTime: number;
    private touchThrottle: number;

    constructor(container: HTMLElement) {
        this.container = container;
        this.particles = [];
        this.maxParticles = this.isMobile() ? 30 : 60;
        this.touchParticles = [];
        this.maxTouchParticles = 10;
        this.animationId = null;
        this.lastTouchTime = 0;
        this.touchThrottle = 100;

        this.init();
    }

    private isMobile(): boolean {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               (navigator.maxTouchPoints && navigator.maxTouchPoints > 2);
    }

    private init(): void {
        this.createParticles();
        this.bindEvents();
        this.animate();
    }

    private createParticles(): void {
        for (let i = 0; i < this.maxParticles; i++) {
            this.createParticle();
        }
    }

    private createParticle(): void {
        const particle = {
            element: document.createElement('div'),
            x: Math.random() * 100,
            y: Math.random() * 100,
            vx: (Math.random() - 0.5) * 0.2,
            vy: (Math.random() - 0.5) * 0.2,
            life: Math.random() * 10 + 5,
            maxLife: Math.random() * 10 + 5,
            size: Math.random() * 2 + 1
        };

        particle.element.className = 'particle';
        particle.element.style.cssText = `
            position: absolute;
            width: ${particle.size}px;
            height: ${particle.size}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            pointer-events: none;
            will-change: transform, opacity;
            transform: translate3d(${particle.x}%, ${particle.y}%, 0);
        `;

        this.container.appendChild(particle.element);
        this.particles.push(particle);
    }

    private bindEvents(): void {
        if (this.isMobile()) {
            document.addEventListener('touchstart', this.handleTouch.bind(this), { passive: true });
            document.addEventListener('touchmove', this.handleTouch.bind(this), { passive: true });
        } else {
            document.addEventListener('mousemove', this.handleMouse.bind(this));
        }

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAnimation();
            } else {
                this.resumeAnimation();
            }
        });
    }

    private handleTouch(e: TouchEvent): void {
        const now = Date.now();
        if (now - this.lastTouchTime < this.touchThrottle) return;
        this.lastTouchTime = now;

        const touch = e.touches[0];
        if (!touch) return;

        const rect = this.container.getBoundingClientRect();
        const x = ((touch.clientX - rect.left) / rect.width) * 100;
        const y = ((touch.clientY - rect.top) / rect.height) * 100;

        this.createTouchParticle(x, y);
    }

    private handleMouse(e: MouseEvent): void {
        const rect = this.container.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        if (Math.random() > 0.7) {
            this.createTouchParticle(x, y);
        }
    }

    private createTouchParticle(x: number, y: number): void {
        if (this.touchParticles.length >= this.maxTouchParticles) {
            const oldParticle = this.touchParticles.shift();
            oldParticle.element.remove();
        }

        const particle = {
            element: document.createElement('div'),
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            life: 2,
            maxLife: 2,
            size: Math.random() * 3 + 2
        };

        particle.element.className = 'touch-particle';
        particle.element.style.cssText = `
            position: absolute;
            width: ${particle.size}px;
            height: ${particle.size}px;
            background: rgba(138, 43, 226, 0.6);
            border-radius: 50%;
            pointer-events: none;
            will-change: transform, opacity;
            transform: translate3d(${particle.x}%, ${particle.y}%, 0);
        `;

        this.container.appendChild(particle.element);
        this.touchParticles.push(particle);
    }

    private animate(): void {
        this.updateParticles();
        this.updateTouchParticles();
        this.animationId = requestAnimationFrame(this.animate.bind(this));
    }

    private updateParticles(): void {
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;

            if (particle.x > 100) particle.x = -5;
            if (particle.x < -5) particle.x = 100;
            if (particle.y > 100) particle.y = -5;
            if (particle.y < -5) particle.y = 100;

            particle.life -= 0.016;
            if (particle.life <= 0) {
                particle.life = particle.maxLife;
                particle.x = Math.random() * 100;
                particle.y = Math.random() * 100;
            }

            const opacity = Math.min(particle.life / particle.maxLife, 1) * 0.3;

            particle.element.style.transform = `translate3d(${particle.x}%, ${particle.y}%, 0)`;
            particle.element.style.opacity = opacity.toString();
        });
    }

    private updateTouchParticles(): void {
        this.touchParticles = this.touchParticles.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= 0.016;
            particle.vx *= 0.98;
            particle.vy *= 0.98;

            if (particle.life <= 0) {
                particle.element.remove();
                return false;
            }

            const opacity = particle.life / particle.maxLife;
            particle.element.style.transform = `translate3d(${particle.x}%, ${particle.y}%, 0)`;
            particle.element.style.opacity = opacity.toString();

            return true;
        });
    }

    private pauseAnimation(): void {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    private resumeAnimation(): void {
        if (!this.animationId) {
            this.animate();
        }
    }

    public destroy(): void {
        this.pauseAnimation();
        this.particles.forEach(p => p.element.remove());
        this.touchParticles.forEach(p => p.element.remove());
        this.particles = [];
        this.touchParticles = [];
    }
}

export default function ParticleBackground() {
    const containerRef = useRef<HTMLDivElement>(null);
    const particleSystemRef = useRef<MobileParticleSystem | null>(null);

    useEffect(() => {
        if (containerRef.current) {
            particleSystemRef.current = new MobileParticleSystem(containerRef.current);
        }

        return () => {
            if (particleSystemRef.current) {
                particleSystemRef.current.destroy();
            }
        };
    }, []);

    return (
        <div 
            ref={containerRef}
            className="fixed inset-0 pointer-events-none z-0"
            style={{ background: 'transparent' }}
        />
    );
}
