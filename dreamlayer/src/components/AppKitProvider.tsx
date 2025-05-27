'use client';

import { ReactNode, useEffect, useState, createContext, useContext } from 'react';
import { createAppKit } from '@reown/appkit/react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { mainnet, base } from '@reown/appkit/networks';
import { cookieStorage, createStorage } from 'wagmi';

const projectId = 'd13359d3507a0afecaff0dedaf9d4065';

// Context to provide openModal and readiness
const AppKitModalContext = createContext<{ openModal: (() => void) | undefined, isAppKitReady: boolean }>({ openModal: undefined, isAppKitReady: false });

export function useAppKitModal() {
  return useContext(AppKitModalContext);
}

export function AppKitProvider({ children }: { children: ReactNode }) {
  const [openModal, setOpenModal] = useState<(() => void) | undefined>(undefined);
  const [isAppKitReady, setIsAppKitReady] = useState(false);

  useEffect(() => {
    // Only initialize on client
    if (typeof window !== 'undefined') {
      // Create adapter for EVM (Ethereum + Base)
      const wagmiAdapter = new WagmiAdapter({
        storage: createStorage({ storage: cookieStorage }),
        ssr: true,
        projectId,
        networks: [mainnet, base],
      });
      
      const appkit = createAppKit({
        adapters: [wagmiAdapter],
        projectId,
        networks: [mainnet, base],
        defaultNetwork: mainnet,
        metadata: {
          name: 'Dream Layer',
          description: 'Web3 Community Platform for Events, Learning, and IP Creation',
          url: window.location.origin,
          icons: ['https://dreamlayer.xyz/icon.png'],
        },
        features: {
          analytics: true,
          email: false,
          socials: [],
        },
      });
      
      // Wait for AppKit to register the modal
      setTimeout(() => {
        setOpenModal(() => () => appkit.open());
        setIsAppKitReady(true);
        console.log('AppKit initialized');
      }, 500);
    }
  }, []);

  return (
    <AppKitModalContext.Provider value={{ openModal, isAppKitReady }}>
      {children}
    </AppKitModalContext.Provider>
  );
}
