'use client';

import './globals.css';
import { Providers } from '@/components/providers';
import LayoutWrapper from '@/components/layout-wrapper';
import ParticleBackground from '@/components/ParticleBackground';
import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/700.css';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className="font-sans" suppressHydrationWarning>
                <Providers>
                    <ParticleBackground />
                    <LayoutWrapper>
                        {children}
                    </LayoutWrapper>
                </Providers>
            </body>
        </html>
    );
}
