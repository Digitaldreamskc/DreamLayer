// src/components/Hero.tsx
'use client';

import React from 'react';

export default function Hero() {
  return (
    <section className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 via-accent-400 to-cyber-500 text-white px-6 py-24">
      <div className="max-w-4xl text-center space-y-6 animate-fade-in">
        <h1 className="text-4xl md:text-6xl font-heading font-bold leading-tight drop-shadow-glow">
          Welcome to DreamLayer
        </h1>
        <p className="text-lg md:text-xl font-light text-white/90">
          A digital canvas for creators, collectors, and communities to connect on-chain.
        </p>
        <div className="flex justify-center gap-4 pt-6">
          <button className="px-6 py-3 rounded-xl bg-white text-black font-semibold shadow-cyber hover:scale-105 transition-transform">
            Connect Wallet
          </button>
          <button className="px-6 py-3 rounded-xl border border-white text-white hover:bg-white hover:text-black transition">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
}
