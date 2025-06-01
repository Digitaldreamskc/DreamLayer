'use client';

import React, { ReactNode, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, cookieToInitialState, type Config } from 'wagmi';
import { createAppKit } from '@reown/appkit/react';
import { config, projectId, adapters, metadata, networks } from '@/config';
import { mainnet } from '@reown/appkit/networks';
import { ToastProvider } from '@/components/ToastProvider';

// Create query client with proper configuration
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 3,
            retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
            staleTime: 1000 * 60 * 5, // 5 minutes
        },
    },
});

// Initialize AppKit outside the component render cycle
let appKitInitialized = false;

export default function ClientProviders({
    children,
    cookies,
}: {
    children: ReactNode;
    cookies?: string | null;
}) {
    const initialState = cookieToInitialState(config as Config, cookies || null);

    useEffect(() => {
        if (!appKitInitialized && projectId) {
            try {
                createAppKit({
                    adapters: [adapters.wagmi, adapters.solana],
                    projectId: projectId,
                    networks: [...networks.evm, ...networks.solana],
                    defaultNetwork: mainnet,
                    metadata: {
                        ...metadata,
                    },
                    features: { 
                        analytics: true,
                        socials: ['google', 'x', 'github', 'discord', 'apple'],
                        onramp: true,
                        email: true,
                        emailShowWallets: true
                    },
                    // Add additional configuration for better reliability
                    themeMode: 'dark',
                    themeVariables: {
                        '--w3m-font-family': 'Inter, sans-serif',
                        '--w3m-border-radius-master': '12px',
                    },
                });
                appKitInitialized = true;
                console.log('AppKit initialized successfully with project ID:', projectId);
            } catch (error) {
                console.error("Error initializing AppKit:", error);
                // Don't throw the error - let the app continue without social login
            }
        } else if (!projectId) {
            console.error('Project ID is missing - AppKit cannot be initialized');
        }
    }, []);

    return (
        <WagmiProvider config={config as Config} initialState={initialState}>
            <QueryClientProvider client={queryClient}>
                <ToastProvider />
                {children}
            </QueryClientProvider>
        </WagmiProvider>
    );
}
