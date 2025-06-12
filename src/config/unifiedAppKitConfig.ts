import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { mainnet, arbitrum, base } from '@reown/appkit/networks'



// 1. Get projectId from https://cloud.reown.com
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!

// 2. Create a metadata object - optional
const metadata = {
    name: 'DreamLayer',
    description: 'AppKit Example',
    url: 'https://web3modal.com', // origin must match your domain & subdomain
    icons: ['https://avatars.githubusercontent.com/u/37784886']
}

// 3. Set up Wagmi Adapter
export const wagmiAdapter = new WagmiAdapter({
    alchemy: process.env.NEXT_PUBLIC_ALCHEMY_KEY!,
    networks: [mainnet, arbitrum, base],
    projectId
})

// 4. Create modal
export const appKit = createAppKit({
    adapters: [wagmiAdapter],
    networks: [mainnet, arbitrum, base],
    metadata,
    projectId,
    features: {
        analytics: true
    }
})