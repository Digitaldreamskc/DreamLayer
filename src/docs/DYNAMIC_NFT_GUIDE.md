# Dynamic NFT Deployment System

A comprehensive system for deploying and managing ERC-7160 Dynamic NFTs on Base network with Irys metadata storage integration.

## Features

- 🚀 One-click ERC-7160 contract deployment
- 📦 Automated metadata management with Irys
- 🎨 Dynamic NFT minting and updating
- ⚡ Built on Base network
- 🔒 Type-safe implementation with TypeScript

## Prerequisites

```bash
npm install ethers@5 @irys/sdk @webIII/core-contracts
```

Required environment variables:
```env
ALCHEMY_API_KEY=your_alchemy_api_key
PRIVATE_KEY=your_private_key
```

## Quick Start

```typescript
import { initializeDynamicNFTService } from './examples/dynamicNFTExample';

async function deployAndMintNFT() {
  // Initialize the service
  const nftService = await initializeDynamicNFTService(
    process.env.ALCHEMY_API_KEY!,
    process.env.PRIVATE_KEY!
  );

  // Deploy contract
  const contractAddress = await nftService.deployContract(
    "MyDynamicNFT",
    "DNFT",
    {
      name: "My Collection",
      description: "Dynamic NFT Collection",
      image: "https://your-image.com/default.png"
    }
  );

  console.log(`Contract deployed at: ${contractAddress}`);
}
```

## Usage Guide

### 1. Contract Deployment

Deploy your ERC-7160 contract:

```typescript
const contractAddress = await nftService.deployContract(
  "CollectionName",
  "SYMBOL",
  {
    name: "Collection Name",
    description: "Collection Description",
    image: "https://your-image.com/collection.png"
  }
);
```

### 2. Minting NFTs

Mint a new dynamic NFT:

```typescript
const mintResult = await nftService.mintNFT(
  "0xRecipientAddress",
  tokenId,
  {
    name: "NFT #1",
    description: "My awesome NFT",
    image: "https://your-image.com/nft1.png",
    attributes: [
      { trait_type: "Level", value: 1 },
      { trait_type: "Power", value: 100 }
    ]
  }
);
```

### 3. Updating Metadata

Update an NFT's metadata dynamically:

```typescript
const updateResult = await nftService.updateTokenMetadata(
  tokenId,
  {
    name: "NFT #1 - Evolved",
    description: "Level up!",
    image: "https://your-image.com/nft1-evolved.png",
    attributes: [
      { trait_type: "Level", value: 2 },
      { trait_type: "Power", value: 200 }
    ]
  }
);
```

## Architecture

The system consists of three main components:

1. **ERC7160Deployer**: Handles contract deployment and interaction
2. **IrysMetadataHandler**: Manages metadata storage on Irys
3. **DynamicNFTService**: Orchestrates the deployment and minting flow

## Error Handling

The service includes comprehensive error handling. Always wrap calls in try-catch:

```typescript
try {
  const result = await nftService.mintNFT(/* ... */);
} catch (error) {
  if (error.message.includes("insufficient funds")) {
    // Handle insufficient funds error
  } else if (error.message.includes("contract not deployed")) {
    // Handle contract not deployed error
  }
  console.error("Operation failed:", error);
}
```

## Best Practices

1. **Contract Management**
   - Store contract addresses after deployment
   - Implement a contract registry for multiple deployments

2. **Metadata Management**
   - Keep metadata consistent across updates
   - Include relevant attributes for your use case
   - Store IPFS/Irys URLs safely

3. **Gas Optimization**
   - Monitor gas prices on Base network
   - Batch mint operations when possible
   - Implement proper error handling for failed transactions

4. **Security**
   - Never expose private keys in code
   - Implement proper access control
   - Validate input data before transactions

## Troubleshooting

Common issues and solutions:

1. **Metadata Upload Fails**
   - Check Irys balance
   - Verify file size limits
   - Ensure proper network connectivity

2. **Contract Deployment Issues**
   - Verify network configuration
   - Check gas prices and limits
   - Ensure sufficient funds for deployment

3. **Minting Errors**
   - Confirm contract deployment
   - Verify recipient address
   - Check transaction parameters

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## License

MIT License - see LICENSE.md for details