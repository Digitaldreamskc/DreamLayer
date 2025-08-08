'use client';

import { NFTMinter } from '@/components/NFTMinter';
import AnimatedBackground from '@/components/AnimatedBackground';
import Navbar from '@/components/Navbar';

export default function CreateMintPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 relative overflow-hidden">
      <AnimatedBackground />
      <Navbar />
      <main className="pt-24 relative z-10 container mx-auto px-4">
        <h1 className="text-4xl font-bold text-white text-center mb-10">
          Mint Your Dynamic NFT
        </h1>
        <div className="max-w-3xl mx-auto">
          <NFTMinter />
        </div>
      </main>
    </div>
  );
}
