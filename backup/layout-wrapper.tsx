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
    return (
        <div className="min-h-screen relative flex">
            <Sidebar />
            <div className="flex-1 pl-64">
                <ParticleBackground />
                {children}
            </div>
        </div>
    );
