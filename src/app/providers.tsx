'use client';

import { ThemeProvider } from 'next-themes';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PrivyProvider } from '@privy-io/react-auth';
import { base } from 'viem/chains';
import { Toaster } from '@/components/ui/use-toast';
import { WalletProvider } from '@/lib/wallet';

// Define Story Protocol Aeneid Testnet
const storyTestnet = {
    id: 1315,
    name: 'Story Protocol Aeneid Testnet',
    nativeCurrency: {
        decimals: 18,
        name: 'Story',
        symbol: 'STORY',
    },
    rpcUrls: {
        default: {
            http: ['https://aeneid-rpc.storyprotocol.io'],
        },
    },
    blockExplorers: {
        default: {
            name: 'Story Explorer',
            url: 'https://aeneid.storyprotocol.io',
        },
    },
    testnet: true,
} as const;

const wagmiConfig = createConfig({
    chains: [base, storyTestnet],
    transports: {
        [base.id]: http('https://mainnet.base.org'),
        [storyTestnet.id]: http('https://aeneid-rpc.storyprotocol.io'),
    },
    ssr: true,
});

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            <WagmiProvider config={wagmiConfig}>
                <PrivyProvider
                    appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
                    config={{
                        appearance: {
                            theme: 'dark',
                            accentColor: '#6366f1',
                            logo: undefined
                        },
                        embeddedWallets: {
                            createOnLogin: 'users-without-wallets',
                            requireUserPasswordOnCreate: false
                        },
                        loginMethods: ['wallet', 'email'],
                        supportedChains: [base, storyTestnet],
                        // Add these to help with WalletConnect issues
                        defaultChain: base,
                        // Reduce WalletConnect timeout
                        walletConnectCloudProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
                    }}
                >
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        enableColorScheme={false}
                    >
                        <WalletProvider>
                            {children}
                            <Toaster />
                        </WalletProvider>
                    </ThemeProvider>
                </PrivyProvider>
            </WagmiProvider>
        </QueryClientProvider>
    );
}