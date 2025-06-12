'use client';

import Link from 'next/link';
import ParticleBackground from '@/components/ParticleBackground';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 relative overflow-hidden">
      <ParticleBackground />
      
      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <div className="space-y-4 mb-8">
            <h1 className="text-7xl md:text-8xl lg:text-9xl font-thin text-white tracking-tight leading-none">
              404
            </h1>
            <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 tracking-tight leading-none animate-pulse">
              Page Not Found
            </h2>
          </div>
          
          <div className="w-32 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent mx-auto mb-8 animate-pulse" />
          
          <p className="text-xl md:text-2xl text-white/70 font-light max-w-3xl mx-auto leading-relaxed mb-12">
            Oops! The page you're looking for doesn't exist.
          </p>
          
          <Link 
            href="/"
            className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold text-lg tracking-wider transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
          >
            Return Home
          </Link>
        </div>
      </main>
    </div>
  );
}