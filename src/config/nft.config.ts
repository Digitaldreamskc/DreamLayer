export const NFT_CONFIG = {
    network: {
        mainnet: {
            chainId: 8453,
            name: 'Base',
            rpcUrl: `https://base-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
            factoryAddress: process.env.FACTORY_CONTRACT_ADDRESS_MAINNET,
            implementationAddress: process.env.NFT_IMPLEMENTATION_ADDRESS_MAINNET
        },
        testnet: {
            chainId: 84531,
            name: 'Base Goerli',
            rpcUrl: `https://base-goerli.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
            factoryAddress: process.env.FACTORY_CONTRACT_ADDRESS_TESTNET,
            implementationAddress: process.env.NFT_IMPLEMENTATION_ADDRESS_TESTNET
        }
    },
    
    // Irys configuration for decentralized storage
    irys: {
        node: 'https://node2.irys.xyz',
        token: 'matic',
        uploadEndpoint: 'https://upload.irys.xyz',
        defaultTags: [
            { name: 'Content-Type', value: 'application/json' },
            { name: 'App-Name', value: 'DreamLayer' },
            { name: 'Type', value: 'DynamicNFT-Metadata' }
        ]
    },

    // Contract deployment settings
    deployment: {
        gasLimit: 5000000,
        confirmations: 2,
        timeoutBlocks: 200
    },

    // Metadata standards
    metadata: {
        schema: {
            required: ['name', 'description', 'image'],
            properties: {
                name: { type: 'string' },
                description: { type: 'string' },
                image: { type: 'string' },
                attributes: { type: 'array' },
                dynamicFields: { type: 'object' }
            }
        },
        ipfsGateway: 'https://ipfs.io/ipfs/'
    }
}