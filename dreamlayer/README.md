# DreamLayer

A Next.js application for managing and interacting with digital assets on the blockchain.

## Features

- Wallet connection and authentication
- NFT management with Dynamic NFT support
- Digital asset tracking
- Web3 integration
- Smart contract integration with Hardhat

## Tech Stack

- Next.js 14
- React 18
- Solana Web3.js
- TailwindCSS
- TypeScript
- Hardhat (Ethereum development environment)
- OpenZeppelin Contracts v5.3.0
- Solidity ^0.8.20

## Smart Contracts

The project includes smart contracts for NFT management:

### DynamicNFT Contract

A dynamic NFT implementation that allows:
- Minting new NFTs
- Updating token URIs after minting
- Full ERC721 compatibility

Key technical notes:
- Uses OpenZeppelin v5.3.0 contracts
- Implements proper token existence checks using `_ownerOf`
- Solidity version ^0.8.20

## Development

### Frontend
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Smart Contracts
```bash
# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Start local blockchain
npx hardhat node

# Deploy contracts (local network)
npx hardhat run scripts/deploy.js --network localhost
```

## Recent Updates

### 2024-06-05
- Updated Hardhat configuration to support Solidity 0.8.20
- Fixed compatibility issues with OpenZeppelin v5.3.0
- Updated DynamicNFT contract to use current OpenZeppelin best practices
- Implemented proper token existence checks using `_ownerOf` instead of deprecated `_exists`

## Configuration Notes

The project uses the following key configurations:

### Hardhat Config
```typescript
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("@typechain/hardhat");

const config = {
  solidity: "0.8.20",
  networks: {
    hardhat: {
      chainId: 31337
    },
  },
  typechain: {
    outDir: "src/types/contracts",
    target: "ethers-v5",
  },
};
```

## Deployment

This project is deployed on Vercel.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
- [OpenZeppelin Documentation](https://docs.openzeppelin.com/)
- [Hardhat Documentation](https://hardhat.org/getting-started/)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.