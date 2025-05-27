import { createAppKit } from '@reown/appkit/react';
import { SolanaAdapter } from '@reown/appkit-adapter-solana';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { solana, solanaDevnet, mainnet, base } from '@reown/appkit/networks';

const projectId = "d13359d3507a0afecaff0dedaf9d4065";

if (!projectId) {
  throw new Error('Project ID is required');
}

// Create the Solana adapter
const solanaAdapter = new SolanaAdapter();

// Create the Wagmi adapter for EVM chains (Ethereum, Base)
const wagmiAdapter = new WagmiAdapter({
  networks: [mainnet, base],
  projectId,
});

// Initialize AppKit with multi-chain configuration
const appkit = createAppKit({
  adapters: [solanaAdapter, wagmiAdapter],
  projectId,
  networks: [mainnet, base, solana, solanaDevnet],
  defaultNetwork: mainnet,
  metadata: {
    name: "Dream Layer",
    description: "Your multi-chain gateway to Web3 events, learning, and IP creation",
    url: "http://localhost:3002",
    icons: ['https://dreamlayer.xyz/icon.png'],
  },
  features: {
    analytics: true,
  }
});

// Export the initialized instance
export { appkit };
