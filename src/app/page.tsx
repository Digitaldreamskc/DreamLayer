'use client'

import { usePrivy } from '@privy-io/react-auth'

import { LandingHero } from '@/components/landing/landing-hero'
import { LandingFeatures } from '@/components/landing/landing-features'
import { LandingChains } from '@/components/landing/landing-chains'
import { LandingCTA } from '@/components/landing/landing-cta'
import { SiteHeader } from '@/components/landing/site-header'
import { SiteFooter } from '@/components/landing/site-footer'
import { useEffect } from 'react'

export default function Home() {
    const { ready, authenticated, login } = usePrivy()

    useEffect(() => {
        if (ready && !authenticated) {
            login() // 👈 This triggers the Privy wallet login modal
        }
    }, [ready, authenticated, login])

    return (
        <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1">
                <LandingHero />
                <LandingFeatures />
                <LandingChains />
                <LandingCTA />
            </main>
            <SiteFooter />
        </div>
    )
}
