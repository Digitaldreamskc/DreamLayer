"use client";

import ParticleBackground from '@/components/ParticleBackground';
import { DynamicNFTDashboard } from '@/components/DynamicNFTDashboard';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import LayoutWrapper from '@/components/layout-wrapper';

export default function EventsPage() {
  const { isConnected } = useAccount();
  const router = useRouter();

  // Redirect to home if not connected
  useEffect(() => {
    if (!isConnected) {
      router.push('/');
    }
  }, [isConnected, router]);

  if (!isConnected) {
    return null;
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <ParticleBackground />
      
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-thin text-white tracking-tight leading-none mb-8">
              Events
            </h1>
            <div className="w-32 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent mx-auto animate-pulse mb-8" />
            <p className="text-xl md:text-2xl text-white/70 font-light max-w-3xl mx-auto leading-relaxed">
              Join exclusive Web3 events, earn rewards, and connect with the community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Event cards remain the same */}
            {/* Event 1 */}
            <div className="group relative overflow-hidden rounded-3xl bg-white/[0.02] backdrop-blur-xl border border-white/10 p-8 transition-all duration-500 hover:bg-white/[0.04] hover:border-white/20 cursor-pointer">
              {/* Event 1 content remains the same */}
            </div>

            {/* Event 2 */}
            <div className="group relative overflow-hidden rounded-3xl bg-white/[0.02] backdrop-blur-xl border border-white/10 p-8 transition-all duration-500 hover:bg-white/[0.04] hover:border-white/20 cursor-pointer">
              {/* Event 2 content remains the same */}
            </div>

            {/* Event 3 */}
            <div className="group relative overflow-hidden rounded-3xl bg-white/[0.02] backdrop-blur-xl border border-white/10 p-8 transition-all duration-500 hover:bg-white/[0.04] hover:border-white/20 cursor-pointer">
              {/* Event 3 content remains the same */}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}