'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import AnimatedBackground from '@/components/AnimatedBackground';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 relative overflow-hidden">
      <AnimatedBackground />
      <Navbar />
      
      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <h1 className="text-7xl md:text-8xl lg:text-9xl font-thin text-white tracking-tight leading-none mb-8">
            404
          </h1>
          <div className="w-32 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent mx-auto mb-8 animate-pulse" />
          <p className="text-xl md:text-2xl text-white/70 font-light max-w-3xl mx-auto leading-relaxed mb-12">
            Oops! The page you're looking for doesn't exist.
          </p>
          <Link 
            href="/"
            className="inline-block px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-semibold text-lg uppercase tracking-wider transition-all duration-300 transform hover:scale-105"
          >
            Return Home
          </Link>
        </div>
      </main>
    </div>
  );
} 