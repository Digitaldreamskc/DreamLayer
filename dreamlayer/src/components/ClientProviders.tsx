'use client';

import { ReactNode, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, cookieToInitialState, type Config } from 'wagmi';
import { 
    createAppKit, 
    useAppKit, 
    useAppKitState, 
    useAppKitEvents,
    useAppKitAccount,
    useAppKitNetwork,
    useAppKitTheme
} from '@reown/appkit/react';
import { config, networks, projectId, adapters, metadata } from '@/config';
import { mainnet } from '@reown/appkit/networks';
import { ToastProvider } from './ToastProvider';
import { showToast } from '@/utils/toast';

// Create query client with proper configuration
const queryClient = new QueryClient();

// Initialize AppKit outside the component
if (!projectId) {
    console.error("AppKit Initialization Error: Project ID is missing.");
} else {
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
        themeMode: 'dark',
        themeVariables: {
            '--w3m-font-family': 'Inter, sans-serif',
            '--w3m-border-radius-master': '12px',
        },
    });
    console.log('AppKit initialized successfully with project ID:', projectId);
}

export default function ClientProviders({
    children,
    cookies,
}: {
    children: ReactNode;
    cookies?: string | null;
}) {
    const initialState = cookieToInitialState(config as Config, cookies || null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    // Use AppKit hooks for state management
    const { open, close } = useAppKit();
    const { open: isModalOpen, selectedNetworkId } = useAppKitState();
    const { address, isConnected, status } = useAppKitAccount();
    const { caipNetwork, chainId } = useAppKitNetwork();
    const { themeMode, setThemeMode } = useAppKitTheme();

    // Set loading state based on connection status
    useEffect(() => {
        if (status !== 'connecting') {
            setIsLoading(false);
        }
    }, [status]);

    // Handle connection errors
    useEffect(() => {
        if (error) {
            showToast.error('Connection Error', error.message);
        }
    }, [error]);

    return (
        <WagmiProvider config={config as Config} initialState={initialState}>
            <QueryClientProvider client={queryClient}>
                <ToastProvider>
                    {isLoading ? (
                        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
                            <div className="bg-white/10 p-6 rounded-xl border border-white/20">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-4"></div>
                                <p className="text-white text-center">Connecting wallet...</p>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
                            <div className="bg-white/10 p-6 rounded-xl border border-white/20">
                                <p className="text-red-400 mb-4">{error.message}</p>
                                <button 
                                    onClick={() => window.location.reload()}
                                    className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-colors"
                                >
                                    Retry
                                </button>
                            </div>
                        </div>
                    ) : (
                        children
                    )}
                </ToastProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}
