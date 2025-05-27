import { createAppKit } from '@reown/appkit/react';
import { SolanaAdapter } from '@reown/appkit-adapter-solana';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { solana, solanaDevnet, mainnet, base, arbitrum, sepolia } from '@reown/appkit/networks';
import type { AppKitNetwork } from '@reown/appkit/networks';
import { cookieStorage, createStorage } from 'wagmi';

// Get projectId from environment
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || "d13359d3507a0afecaff0dedaf9d4065";

if (!projectId) {
  throw new Error('Project ID is required');
}

export const metadata = {
  name: "Dream Layer",
  description: "Your multi-chain gateway to Web3 events, learning, and IP creation",
  url: typeof window !== 'undefined' ? window.location.origin : "https://dreamlayer.xyz",
  icons: ['https://dreamlayer.xyz/icon.png'],
};

// Create the Solana adapter
export const solanaAdapter = new SolanaAdapter();

// Create the Wagmi adapter for EVM chains
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: true,
  projectId,
  networks: [mainnet, base, arbitrum, sepolia]
});

// Export networks for consistent use
export const networks: [AppKitNetwork, ...AppKitNetwork[]] = [mainnet, base, arbitrum, sepolia, solana, solanaDevnet];

// Initialize AppKit with unified multi-chain configuration
let appkit: any = null;

export const initializeAppKit = () => {
  if (!appkit) {
    appkit = createAppKit({
      adapters: [solanaAdapter, wagmiAdapter],
      projectId,
      networks,
      defaultNetwork: mainnet,
      metadata,
      features: {
        analytics: true,
      }
    });
  }
  return appkit;
};

// Export the Wagmi config
export const config = wagmiAdapter.wagmiConfig;

// Export for immediate use
export { appkit };
