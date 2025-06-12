'use client';

import { DashboardNav } from '@/components/dashboard-nav';
import ParticleBackground from '@/components/ParticleBackground';
import { usePathname } from 'next/navigation';
import { Providers } from '@/components/providers';

export default function ProvidersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showNav = pathname.startsWith('/dashboard') || 
                 pathname.startsWith('/nfts') || 
                 pathname.startsWith('/creative-studio');

  return (
    <Providers>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 relative overflow-hidden">
        <ParticleBackground />
        <div className="flex flex-col md:flex-row relative z-10">
          {showNav && (
            <div className="w-full md:w-64 bg-card/50 backdrop-blur-sm border-r border-white/10 h-auto md:min-h-screen">
              <DashboardNav />
            </div>
          )}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </Providers>
  );
}