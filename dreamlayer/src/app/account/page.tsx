'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppKitAccount } from '@reown/appkit/react';
import Navbar from '@/components/Navbar';
import AnimatedBackground from '@/components/AnimatedBackground';
import AnimatedSection from '@/components/AnimatedSection';

export default function AccountPage() {
  const { isConnected, address } = useAppKitAccount();
  const router = useRouter();

  useEffect(() => {
    // If not connected, redirect to home
    if (!isConnected) {
      router.push('/');
    }
  }, [isConnected, router]);

  // Show loading state while checking connection
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 relative overflow-hidden">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-white text-xl">Please connect your wallet to view your account</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 relative overflow-hidden">
      <Navbar />
      <AnimatedBackground />
      
      <main className="container mx-auto px-4 py-8 relative z-10">
        <AnimatedSection>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h1 className="text-4xl font-bold text-white mb-6">Your Account</h1>
            
            <div className="space-y-6">
              <div>
                <h2 className="text-xl text-white/80 mb-2">Wallet Address</h2>
                <p className="text-white/60 font-mono">{address}</p>
              </div>
              
              <div>
                <h2 className="text-xl text-white/80 mb-2">Learning Progress</h2>
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white/80">Web3 Basics</span>
                      <span className="text-white/60">0%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full" style={{ width: '0%' }} />
                    </div>
                  </div>
                  
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white/80">Blockchain Development</span>
                      <span className="text-white/60">67%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 h-2 rounded-full" style={{ width: '67%' }} />
                    </div>
                  </div>
                  
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white/80">Smart Contracts</span>
                      <span className="text-white/60">100%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div className="bg-gradient-to-r from-green-600 to-emerald-600 h-2 rounded-full" style={{ width: '100%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </main>
    </div>
  );
}
