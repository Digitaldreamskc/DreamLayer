'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import ParticleBackground from '@/components/ParticleBackground';

export default function TestPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <ParticleBackground />
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center space-y-8">
        <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
          DreamLayer
        </h1>
        <ConnectButton />
      </div>
    </div>
  );
}