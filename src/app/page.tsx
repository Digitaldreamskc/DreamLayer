import { LandingHero } from '@/components/landing/landing-hero';
import { LandingFeatures } from '@/components/landing/landing-features';
import { LandingChains } from '@/components/landing/landing-chains';
import { LandingCTA } from '@/components/landing/landing-cta';
import { SiteHeader } from '@/components/landing/site-header';
import { SiteFooter } from '@/components/landing/site-footer';

export default function Home() {
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
    );
}
