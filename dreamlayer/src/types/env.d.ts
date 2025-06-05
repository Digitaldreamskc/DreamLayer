declare namespace NodeJS {
    interface ProcessEnv {
        NEXT_PUBLIC_ALCHEMY_API_KEY: string;
        FACTORY_CONTRACT_ADDRESS_MAINNET: string;
        NFT_IMPLEMENTATION_ADDRESS_MAINNET: string;
        FACTORY_CONTRACT_ADDRESS_TESTNET: string;
        NFT_IMPLEMENTATION_ADDRESS_TESTNET: string;
    }
}