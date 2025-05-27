'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import Navbar from '@/components/Navbar';
import AnimatedBackground from '@/components/AnimatedBackground';
import AnimatedSection from '@/components/AnimatedSection';

export default function AccountPage() {
  const { isConnected, isConnecting } = useAccount();
  const router = useRouter();

  useEffect(() => {
    // If not connected and not connecting, redirect to home
    if (!isConnected && !isConnecting) {
      router.push('/');
    }
  }, [isConnected, isConnecting, router]);

  // Show loading state while checking connection
  if (isConnecting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 relative overflow-hidden">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-white text-xl">Connecting wallet...</div>
        </div>
      </div>
    );
  }

  // If not connected, don't render the page content
  if (!isConnected) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 relative overflow-hidden">
      <AnimatedBackground />
      <Navbar />
      
      <main className="pt-20">
        <section className="relative py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <AnimatedSection animation="fade-in">
              <div className="text-center mb-16">
                <div className="space-y-4 mb-8">
                  <h1 className="text-7xl md:text-8xl lg:text-9xl font-thin text-white tracking-tight leading-none">
                    Account
                  </h1>
                  <div className="w-32 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent mx-auto animate-pulse" />
                </div>
                <p className="text-xl md:text-2xl text-white/70 font-light max-w-3xl mx-auto leading-relaxed">
                  Manage your digital assets and preferences
                </p>
              </div>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                <h2 className="text-2xl font-semibold text-white mb-4">Wallet</h2>
                <p className="text-white/60">
                  View and manage your connected wallet
                </p>
              </div>
              <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                <h2 className="text-2xl font-semibold text-white mb-4">Settings</h2>
                <p className="text-white/60">
                  Customize your experience and preferences
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
