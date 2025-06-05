# Dynamic NFT Service Example

This example demonstrates how to use the DynamicNFTInitializer service to deploy and manage dynamic NFT collections on Base network.

## Features

- Deploy new NFT collections
- Upload and update dynamic metadata using Irys
- Manage multiple collections per user
- Handle metadata storage funding
- Full error handling and logging

## Prerequisites

```bash
npm install ethers@5.7.2 @irys/sdk @openzeppelin/contracts-upgradeable
```

## Environment Variables

Create a `.env` file with:

```env
PRIVATE_KEY=your_private_key_here
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key
FACTORY_CONTRACT_ADDRESS_TESTNET=your_factory_contract_address
FACTORY_CONTRACT_ADDRESS_MAINNET=your_factory_contract_address
```

## Usage

```typescript
import { DynamicNFTExample } from './examples/dynamicNFTExample';

async function main() {
    // Create instance (true for testnet)
    const example = new DynamicNFTExample(true);

    // Initialize with private key
    await example.initialize(process.env.PRIVATE_KEY!);

    // Deploy a new collection
    const deployment = await example.deployCollection(
        "My Dynamic NFTs",
        "DNFT"
    );

    // Fund Irys for metadata storage
    await example.fundIrysStorage("0.1");

    // Upload metadata
    const metadataUrl = await example.handleMetadata(1);
    
    console.log('Deployment complete!', {
        contractAddress: deployment.contractAddress,
        metadataUrl
    });
}

main().catch(console.error);
```

## Error Handling

The example includes comprehensive error handling:

```typescript
try {
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
```

## Running the Example

```bash
# Run the full example
npx ts-node src/examples/dynamicNFTExample.ts

# Or import and use in your own code
import { DynamicNFTExample } from './examples/dynamicNFTExample';
```

## Important Notes

1. Always test on testnet first (Base Goerli)
2. Ensure sufficient funds for:
   - Gas fees on Base network
   - Irys storage fees
3. Keep private keys secure and never commit them
4. Monitor gas prices on Base for optimal deployment timing