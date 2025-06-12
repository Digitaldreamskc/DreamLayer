'use client';

import Sidebar from '@/components/sidebar';
import { useEffect, useState } from 'react';
import ParticleBackground from '@/components/ParticleBackground';
import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/700.css';


export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen relative">
      <ParticleBackground />
      <div className="flex relative z-10">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}