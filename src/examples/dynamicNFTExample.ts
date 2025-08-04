// examples/dynamicNFTExample.ts
import { DynamicNFTInitializer } from '../services/DynamicNFTInitializer';
import { ethers } from 'ethers';

class DynamicNFTExample {
    private nftService: DynamicNFTInitializer;
    private collectionAddress?: string;

    constructor(isTestnet: boolean = true) {
        this.nftService = new DynamicNFTInitializer(isTestnet);
    }

    /**
     * Initialize the service with wallet
     */
    async initialize(privateKey: string) {
        try {
            console.log('Initializing service...');
            const services = await this.nftService.connect(privateKey);
            console.log('Service initialized successfully');
            
            // Get wallet balance
            const balance = await services.signer.getBalance();
            console.log('Wallet balance:', ethers.utils.formatEther(balance), 'ETH');
            
            // Get Irys balance
            const irysBalance = await this.nftService.getIrysBalance();
            console.log('Irys balance:', ethers.utils.formatEther(irysBalance));

            return services;
        } catch (error) {
            console.error('Failed to initialize:', error);
            throw error;
        }
    }

    /**
     * Deploy a new NFT collection
     */
    async deployCollection(name: string, symbol: string) {
        try {
            console.log(`Deploying collection: ${name} (${symbol})...`);
            
            const deployment = await this.nftService.deployCollection(name, symbol);
            this.collectionAddress = deployment.contractAddress;

            console.log('Collection deployed successfully:');
            console.log('- Contract Address:', deployment.contractAddress);
            console.log('- Transaction Hash:', deployment.transactionHash);
            console.log('- Owner:', deployment.owner);

            return deployment;
        } catch (error) {
            console.error('Failed to deploy collection:', error);
            throw error;
        }
    }

    /**
     * Upload and update NFT metadata
     */
    async handleMetadata(level: number = 1) {
        try {
            // Prepare initial metadata
            const metadata = {
                name: "Dynamic Game Character #1",
                description: "A character that levels up based on achievements",
                image: "https://example.com/character.png",
                attributes: [
                    {
                        trait_type: "Level",
                        value: level
                    },
                    {
                        trait_type: "Experience",
                        value: level * 100
                    },
                    {
                        trait_type: "Power",
                        value: Math.floor(level * 1.5)
                    }
                ],
                dynamicFields: {
                    lastUpdated: new Date().toISOString(),
                    achievementCount: level - 1,
                    gameVersion: "1.0.0"
                }
            };

            console.log('Uploading metadata to Irys...');
            const metadataUrl = await this.nftService.uploadMetadata(metadata);
            console.log('Metadata uploaded successfully:', metadataUrl);

            return metadataUrl;
        } catch (error) {
            console.error('Failed to handle metadata:', error);
            throw error;
        }
    }

    /**
     * Get all collections owned by a user
     */
    async getUserCollections(userAddress: string) {
        try {
            console.log(`Fetching collections for user: ${userAddress}...`);
            const collections = await this.nftService.getUserCollections(userAddress);
            
            console.log('User collections:');
            collections.forEach((address, index) => {
                console.log(`${index + 1}. ${address}`);
            });

            return collections;
        } catch (error) {
            console.error('Failed to fetch user collections:', error);
            throw error;
        }
    }

    /**
     * Fund Irys for metadata storage
     */
    async fundIrysStorage(amount: string) {
        try {
            console.log(`Funding Irys with ${amount}...`);
            const fundTx = await this.nftService.fundIrys(amount);
            console.log('Funding successful:', fundTx);
            
            const newBalance = await this.nftService.getIrysBalance();
            console.log('New Irys balance:', ethers.utils.formatEther(newBalance));

            return fundTx;
        } catch (error) {
            console.error('Failed to fund Irys:', error);
            throw error;
        }
    }
}

// Example usage
async function runExample() {
    try {
        // Create instance (true for testnet)
        const example = new DynamicNFTExample(true);

        // Initialize with private key
        await example.initialize(process.env.PRIVATE_KEY!);

        // Deploy a new collection
        const deployment = await example.deployCollection(
            "Dynamic Game Characters",
            "DGAME"
        );

        // Fund Irys for metadata storage
        await example.fundIrysStorage("0.1");

        // Upload initial metadata
        const metadataUrl = await example.handleMetadata(1);

        // Get user's collections
        await example.getUserCollections(deployment.owner);

        console.log('Example completed successfully!');
    } catch (error) {
        console.error('Example failed:', error);
    }
}

// Example of error handling patterns
async function errorHandlingExample() {
    const example = new DynamicNFTExample();

    try {
        // This will throw an error because we haven't initialized
        await example.deployCollection("Test", "TST");
    } catch (error) {
        if (error instanceof Error) {
            switch (error.name) {
                case 'InitializationError':
                    console.error('Service not initialized:', error.message);
                    break;
                case 'ValidationError':
                    console.error('Invalid data:', error.message);
                    break;
                default:
                    console.error('Unexpected error:', error.message);
            }
        }
    }
}

// Export for use in other files
export { DynamicNFTExample, runExample, errorHandlingExample };

// Run examples if this file is executed directly
if (require.main === module) {
    runExample().finally(() => {
        console.log('Example script completed');
        process.exit(0);
    });
}