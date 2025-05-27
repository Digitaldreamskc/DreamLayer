import { mainnet, arbitrum, sepolia } from '@reown/appkit/networks'
import type { AppKitNetwork } from '@reown/appkit/networks'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { createConfig, http } from 'wagmi'
import { cookieStorage, createStorage } from 'wagmi'
import type { Chain } from 'viem'

// Get projectId from https://cloud.reown.com
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID

if (!projectId) {
  console.error('NEXT_PUBLIC_PROJECT_ID is not defined. Please set it in your environment variables.')
  throw new Error('Project ID is not defined')
}

export const metadata = {
  name: 'DreamLayer',
  description: 'DreamLayer - Digital Dreams Network',
  url: 'https://6835502--dreamlayer.netlify.app',
  icons: ['https://avatars.githubusercontent.com/u/179229932']
}

// for custom networks visit -> https://docs.reown.com/appkit/react/core/custom-networks
export const networks: [Chain, ...Chain[]] = [mainnet, arbitrum, sepolia]

// Create Wagmi adapter with proper configuration
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: true,
  projectId,
  networks
})

// Export the Wagmi config
export const config = wagmiAdapter.wagmiConfig
