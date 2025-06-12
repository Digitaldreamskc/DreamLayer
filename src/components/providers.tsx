'use client';

import { ThemeProvider } from 'next-themes';
import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { config, chains } from '@/config/wagmiConfig';
import '@rainbow-me/rainbowkit/styles.css';
import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WalletProvider } from '@/lib/wallet';

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <ThemeProvider 
            attribute="class" 
            defaultTheme="dark" 
            enableSystem={false}
            forcedTheme="dark"
          >
            <WalletProvider>
              {!mounted ? (
                <div style={{ visibility: 'hidden' }}>
                  {children}
                </div>
              ) : (
                children
              )}
            </WalletProvider>
          </ThemeProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}