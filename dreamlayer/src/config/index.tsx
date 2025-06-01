import { mainnet, base, solana } from '@reown/appkit/networks'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { createConfig, http } from 'wagmi'
import { cookieStorage, createStorage } from 'wagmi'
import type { Chain } from 'viem'
import { solanaAdapter, solanaNetworks } from './solana'

// Get projectId from https://cloud.reown.com
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID

// Debug logging
console.log('Project ID from env:', projectId ? 'Found' : 'Not found')

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

// Define supported EVM networks
export const evmNetworks: [Chain, ...Chain[]] = [mainnet, base]

// Create Wagmi adapter with proper configuration
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: true,
  projectId,
  networks: evmNetworks,
  features: {
    analytics: true,
    socials: ['google', 'x', 'github', 'discord', 'apple'],
    onramp: true,
    email: true,
    emailShowWallets: true
  }
})

// Export the Wagmi config
export const config = wagmiAdapter.wagmiConfig

// Export all adapters and networks
export const adapters = {
  wagmi: wagmiAdapter,
  solana: solanaAdapter
}

export const networks = {
  evm: evmNetworks,
  solana: [solana]
}
