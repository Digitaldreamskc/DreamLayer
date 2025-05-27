import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { mainnet, base } from '@reown/appkit/networks';
import { cookieStorage, createStorage } from 'wagmi';

const projectId = 'd13359d3507a0afecaff0dedaf9d4065';

// Create the Wagmi adapter with Base and Ethereum mainnet support
const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({ storage: cookieStorage }),
  ssr: true,
  projectId,
  networks: [mainnet, base],
});

// Export the Wagmi config
export const wagmiConfig = wagmiAdapter.wagmiConfig;
