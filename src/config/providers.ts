import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { SUPPORTED_CHAINS, DEFAULT_CHAIN } from './wallet'

export const wagmiConfig = getDefaultConfig({
  appName: 'DreamLayer',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,
  chains: SUPPORTED_CHAINS,
  ssr: true,
})

export const rainbowKitConfig = {
  initialChain: DEFAULT_CHAIN,
  showRecentTransactions: true,
  coolMode: true,
}