'use client';

import dynamic from 'next/dynamic';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const ParticleBackground = dynamic(() => import('@/components/ParticleBackground'), {
  ssr: false
});

export default function Home() {
  const { isConnected } = useAccount();
  const router = useRouter();

  useEffect(() => {
    const redirect = async () => {
      if (isConnected) {
        console.log('Wallet connected, redirecting to dashboard...');
        await router.push('/dashboard');
      }
    };
    
    redirect();
  }, [isConnected, router]);

  return (
    <div className="min-h-screen bg-black">
      <ParticleBackground />
      <main className="relative z-20 flex min-h-screen flex-col items-center justify-center gap-8 p-24">
        <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
          DreamLayer
        </h1>
        <ConnectButton />
      </main>
    </div>
  );
}