// examples/usage.ts
import { DynamicNFTInitializer } from '../services/DynamicNFTInitializer';

async function deployAndConfigureCollection() {
    try {
        // Initialize service (use true for testnet)
        const nftService = new DynamicNFTInitializer(true);

        // Connect with private key
        await nftService.connect(process.env.PRIVATE_KEY!);

        // Deploy new collection
        const collection = await nftService.deployCollection(
            "My Dynamic Collection",
            "MDC"
        );
        console.log("Collection deployed:", collection);

        // Prepare metadata
        const metadata = {
            name: "Dynamic NFT #1",
            description: "A dynamic NFT that can change",
            image: "https://example.com/image.png",
            attributes: [
                {
                    trait_type: "Level",
                    value: 1
                }
            ],
            dynamicFields: {
                lastUpdated: Date.now()
            }
        };

        // Upload metadata to Irys
        const metadataUrl = await nftService.uploadMetadata(metadata);
        console.log("Metadata uploaded:", metadataUrl);

        // Get user's collections
        const userCollections = await nftService.getUserCollections(collection.owner);
        console.log("User collections:", userCollections);

    } catch (error) {
        console.error("Error:", error);
    }
}

// Example of error handling
async function errorHandlingExample() {
    try {
        const nftService = new DynamicNFTInitializer();
        
        // This will throw InitializationError
        await nftService.deployCollection("Test", "TST");
        
    } catch (error) {
        if (error instanceof InitializationError) {
            console.error("Initialization failed:", error.message);
        } else if (error instanceof ValidationError) {
            console.error("Validation failed:", error.message);
        } else {
            console.error("Unknown error:", error);
        }
    }
}

// Run examples
deployAndConfigureCollection().catch(console.error);
errorHandlingExample().catch(console.error);