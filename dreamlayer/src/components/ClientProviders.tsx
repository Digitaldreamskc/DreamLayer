'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, cookieToInitialState } from 'wagmi';
import { config, initializeAppKit } from '@/config/unified-appkit';

const queryClient = new QueryClient();

// Initialize AppKit on client side
if (typeof window !== 'undefined') {
  initializeAppKit();
}

export default function ClientProviders({
  children,
}: {
  children: ReactNode;
}) {
  const [initialState, setInitialState] = useState<any>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Get cookies on the client side
    try {
      const cookies = typeof document !== 'undefined' ? document.cookie : '';
      const state = cookieToInitialState(config, cookies);
      setInitialState(state || {});
    } catch (error) {
      console.error('Error setting initial state:', error);
      setInitialState({});
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Render children immediately to prevent blank pages
  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
