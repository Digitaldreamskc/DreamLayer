import { createPublicClient, http } from 'viem';
import { mainnet, base, optimism } from 'viem/chains';

// Custom chain config for Story (since it might not be in viem/chains)
const storyChain = {
    id: 1513, // Story's chain ID
    name: 'Story',
    network: 'story',
    nativeCurrency: {
        decimals: 18,
        name: 'Story',
        symbol: 'STORY',
    },
    rpcUrls: {
        default: {
            http: ['https://story-mainnet.g.alchemy.com/v2'],
        },
        public: {
            http: ['https://story-mainnet.g.alchemy.com/v2'],
        },
    },
} as const;

// Single Alchemy API key works for all chains
const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_KEY;

const clients = {
    ethereum: createPublicClient({
        chain: mainnet,
        transport: http(`https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`),
    }),
    base: createPublicClient({
        chain: base,
        transport: http(`https://base-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`),
    }),
    optimism: createPublicClient({
        chain: optimism,
        transport: http(`https://opt-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`),
    }),
    story: createPublicClient({
        chain: storyChain,
        transport: http(`https://story-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`),
    }),
};

export type SupportedChain = keyof typeof clients;

export async function getBlockData(chain: SupportedChain, blockNumber: bigint) {
    const client = clients[chain];
    if (!client) {
        throw new Error(`Unsupported chain: ${chain}`);
    }
    return await client.getBlock({ blockNumber });
}

// Helper function to get all supported chains
export function getSupportedChains(): SupportedChain[] {
    return Object.keys(clients) as SupportedChain[];
}