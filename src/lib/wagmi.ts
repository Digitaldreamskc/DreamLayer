import { createConfig, http } from 'wagmi'
import { base, baseGoerli } from 'wagmi/chains'
import { injected, metaMask, walletConnect } from 'wagmi/connectors'

// Create wagmi config
export const config = createConfig({
  chains: [base, baseGoerli],
  connectors: [
    metaMask(),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',
    }),
    injected(),
  ],
  transports: {
    [base.id]: http(),
    [baseGoerli.id]: http(),
  },
});