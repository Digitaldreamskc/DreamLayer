'use client';

import { ThemeProvider } from 'next-themes';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PrivyProvider } from '@privy-io/react-auth';
import { base } from 'viem/chains';

const wagmiConfig = createConfig({
    chains: [base],
    transports: {
        [base.id]: http('https://mainnet.base.org'), // or Alchemy
    },
    ssr: true,
});

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <PrivyProvider
            appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
            config={{
                appearance: {
                    theme: 'dark',
                },
                embeddedWallets: {
                    createOnLogin: 'users-without-wallets',
                },
            }}
        >
            <WagmiProvider config={wagmiConfig}>
                <QueryClientProvider client={queryClient}>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        enableColorScheme={false}
                    >
                        {children}
                    </ThemeProvider>
                </QueryClientProvider>
            </WagmiProvider>
        </PrivyProvider>
    );
}
