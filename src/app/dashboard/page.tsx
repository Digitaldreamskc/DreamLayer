"use client";

import { DynamicNFTDashboard } from '@/components/DynamicNFTDashboard';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
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
    <section className="py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-thin text-white tracking-tight leading-none mb-8">
            Dashboard
          </h1>
          <div className="w-32 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent mx-auto animate-pulse mb-8" />
          <p className="text-xl md:text-2xl text-white/70 font-light max-w-3xl mx-auto leading-relaxed">
            Manage your dynamic NFTs and digital assets
          </p>
        </div>

        <DynamicNFTDashboard />
      </div>
    </section>
  );
}