'use client';

import { useEffect } from 'react';
import { LandingHero } from '@/components/landing/landing-hero';
import { LandingFeatures } from '@/components/landing/landing-features';
import { LandingChains } from '@/components/landing/landing-chains';
import { LandingCTA } from '@/components/landing/landing-cta';
import { SiteHeader } from '@/components/landing/site-header';
import { SiteFooter } from '@/components/landing/site-footer';
import AnimatedBackground from '@/components/landing/animated-background';
import { usePrivy } from '@privy-io/react-auth';

export default function Home() {
  const { login, ready, authenticated } = usePrivy();

  useEffect(() => {
    if (ready && !authenticated) {
      login();
    }
  }, [ready, authenticated, login]);

  return (
    <div className="relative flex min-h-screen flex-col bg-background text-foreground overflow-x-hidden">
      <AnimatedBackground />
      <SiteHeader />
      <main className="z-10 flex-1">
        <LandingHero />
        <LandingFeatures />
        <LandingChains />
        <LandingCTA />
      </main>
      <SiteFooter />
    </div>
  );
}

