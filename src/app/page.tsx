'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';

import { LandingHero } from '@/components/landing/landing-hero';
import { LandingFeatures } from '@/components/landing/landing-features';
import { LandingChains } from '@/components/landing/landing-chains';
import { LandingCTA } from '@/components/landing/landing-cta';
import { SiteHeader } from '@/components/landing/site-header';
import { SiteFooter } from '@/components/landing/site-footer';
import AnimatedBackground from '@/components/AnimatedBackground';

export default function Home() {
    const { login, ready, authenticated } = usePrivy();
    const router = useRouter();
    const hasAttemptedLogin = useRef(false);

    useEffect(() => {
        if (!ready) return;

        if (!authenticated && !hasAttemptedLogin.current) {
            hasAttemptedLogin.current = true;
            login();
        } else if (authenticated) {
            router.push('/home');
        }
    }, [ready, authenticated, login, router]);

    if (!ready) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
                Loading...
            </div>
        );
    }

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
