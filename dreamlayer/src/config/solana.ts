import { SolanaAdapter } from '@reown/appkit-adapter-solana'
import { solana } from '@reown/appkit/networks'
import type { AppKitNetwork } from '@reown/appkit/networks'

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

// Define supported Solana networks
export const solanaNetworks: [AppKitNetwork, ...AppKitNetwork[]] = [solana]

// Create Solana adapter
export const solanaAdapter = new SolanaAdapter({
  networks: solanaNetworks
})

// Export Solana configuration
export const solanaConfig = {
  adapter: solanaAdapter,
  networks: solanaNetworks,
  features: {
    analytics: true,
    socials: ['google', 'x', 'github', 'discord', 'apple'],
    onramp: true,
    email: true,
    emailShowWallets: true
  }
} 