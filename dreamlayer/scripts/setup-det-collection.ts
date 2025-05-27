/**
 * DreamLayer Event Token (DET) Collection Setup Script
 * 
 * This script creates:
 * 1. Collection NFT for DreamLayer Event Tokens
 * 2. Merkle tree configuration for compressed NFT storage
 * 3. Sets up proper authorities and permissions
 * 
 * Run with: npx ts-node scripts/setup-det-collection.ts
 */

import { 
  Connection, 
  Keypair, 
  PublicKey, 
  clusterApiUrl,
  LAMPORTS_PER_SOL,
  Transaction,
  sendAndConfirmTransaction
} from '@solana/web3.js';
import { Metaplex, keypairIdentity } from '@metaplex-foundation/js';
import fs from 'fs';
import path from 'path';

// Configuration
const COLLECTION_CONFIG = {
  name: 'DreamLayer Event Tokens',
  symbol: 'DET',
  description: 'POAP-style collectibles for DreamLayer community events, learning quests, and IRL experiences.',
  image: 'ipfs://QmYourImageHashHere', // Replace with actual IPFS hash
  external_url: 'https://dreamlayer.io',
  attributes: [
    { trait_type: 'Type', value: 'Collection' },
    { trait_type: 'Network', value: 'Solana' },
    { trait_type: 'Standard', value: 'Compressed NFT' },
  ],
};

// Tree configuration (depth=18, buffer=64 supports ~262K NFTs)
const TREE_CONFIG = {
  maxDepth: 18,
  maxBufferSize: 64,
  maxCapacity: Math.pow(2, 18), // ~262,144 NFTs
};

interface SetupResult {
  collectionMint: PublicKey;
  collectionMetadata: PublicKey;
  collectionMasterEdition: PublicKey;
  treeAddress?: PublicKey;
  treeAuthority: PublicKey;
  treeCreator: PublicKey;
}

class DETCollectionSetup {
  private connection: Connection;
  private payer: Keypair;
  private metaplex: Metaplex;

  constructor(rpcUrl?: string) {
    this.connection = new Connection(
      rpcUrl || process.env.NEXT_PUBLIC_SOLANA_RPC_URL || clusterApiUrl('devnet'),
      'confirmed'
    );
    
    // Load or create keypair for setup
    this.payer = this.loadOrCreateKeypair();
    
    // Initialize Metaplex with basic configuration
    this.metaplex = Metaplex.make(this.connection)
      .use(keypairIdentity(this.payer));
  }

  private loadOrCreateKeypair(): Keypair {
    const keypairPath = path.join(__dirname, '../.keys/setup-keypair.json');
    
    try {
      if (fs.existsSync(keypairPath)) {
        const keypairData = JSON.parse(fs.readFileSync(keypairPath, 'utf8'));
        return Keypair.fromSecretKey(new Uint8Array(keypairData));
      }
    } catch (error) {
      console.log('No existing keypair found, generating new one...');
    }

    // Generate new keypair
    const keypair = Keypair.generate();
    
    // Ensure .keys directory exists
    const keysDir = path.dirname(keypairPath);
    if (!fs.existsSync(keysDir)) {
      fs.mkdirSync(keysDir, { recursive: true });
    }
    
    // Save keypair
    fs.writeFileSync(keypairPath, JSON.stringify(Array.from(keypair.secretKey)));
    console.log(`Generated new keypair: ${keypair.publicKey.toBase58()}`);
    console.log(`Saved to: ${keypairPath}`);
    console.log('\n⚠️  IMPORTANT: Fund this wallet with SOL before running setup!');
    console.log(`   Send at least 0.1 SOL to: ${keypair.publicKey.toBase58()}`);
    
    return keypair;
  }

  async checkBalance(): Promise<number> {
    const balance = await this.connection.getBalance(this.payer.publicKey);
    const solBalance = balance / LAMPORTS_PER_SOL;
    console.log(`Wallet balance: ${solBalance} SOL`);
    
    if (solBalance < 0.01) {
      throw new Error(`Insufficient balance. Need at least 0.01 SOL for setup. Current: ${solBalance} SOL`);
    }
    
    return solBalance;
  }

  async createCollectionNFT(): Promise<{
    mint: PublicKey;
    metadata: PublicKey;
    masterEdition: PublicKey;
  }> {
    console.log('Creating collection NFT...');
    
    // Upload metadata to Arweave via Bundlr
    const { uri } = await this.metaplex.nfts().uploadMetadata({
      name: COLLECTION_CONFIG.name,
      symbol: COLLECTION_CONFIG.symbol,
      description: COLLECTION_CONFIG.description,
      image: COLLECTION_CONFIG.image,
      external_url: COLLECTION_CONFIG.external_url,
      attributes: COLLECTION_CONFIG.attributes,
      properties: {
        category: 'image',
        creators: [
          {
            address: this.payer.publicKey.toBase58(),
            share: 100,
          },
        ],
      },
    });

    console.log(`Metadata uploaded: ${uri}`);

    // Create the collection NFT
    const { nft } = await this.metaplex.nfts().create({
      uri,
      name: COLLECTION_CONFIG.name,
      symbol: COLLECTION_CONFIG.symbol,
      sellerFeeBasisPoints: 0, // No royalties for collection
      isCollection: true,
      creators: [
        {
          address: this.payer.publicKey,
          share: 100,
        },
      ],
    });

    console.log(`Collection NFT created: ${nft.address.toBase58()}`);
    
    return {
      mint: nft.address,
      metadata: nft.metadataAddress,
      masterEdition: nft.edition.address,
    };
  }

  async setupTreeConfiguration(): Promise<{
    treeAddress: PublicKey;
    treeAuthority: PublicKey;
    treeCreator: PublicKey;
  }> {
    console.log('Setting up Merkle tree configuration...');
    
    // For now, we'll generate a tree address and store the configuration
    // The actual tree creation will be done via CLI or separate script
    // due to package compatibility issues
    
    const treeKeypair = Keypair.generate();
    const treeAuthority = this.payer.publicKey;
    const treeCreator = this.payer.publicKey;

    console.log(`Tree address generated: ${treeKeypair.publicKey.toBase58()}`);
    console.log(`Tree authority: ${treeAuthority.toBase58()}`);
    
    // Save tree keypair for later use
    const treeKeypairPath = path.join(__dirname, '../.keys/tree-keypair.json');
    const keysDir = path.dirname(treeKeypairPath);
    
    if (!fs.existsSync(keysDir)) {
      fs.mkdirSync(keysDir, { recursive: true });
    }
    
    fs.writeFileSync(treeKeypairPath, JSON.stringify(Array.from(treeKeypair.secretKey)));
    console.log(`Tree keypair saved to: ${treeKeypairPath}`);

    return {
      treeAddress: treeKeypair.publicKey,
      treeAuthority,
      treeCreator,
    };
  }

  async setupComplete(): Promise<SetupResult> {
    console.log('=== DreamLayer Event Token (DET) Collection Setup ===\n');
    
    // Check wallet balance
    await this.checkBalance();
    
    // Create collection NFT
    const collection = await this.createCollectionNFT();
    
    // Setup tree configuration
    const tree = await this.setupTreeConfiguration();
    
    const result: SetupResult = {
      collectionMint: collection.mint,
      collectionMetadata: collection.metadata,
      collectionMasterEdition: collection.masterEdition,
      treeAddress: tree.treeAddress,
      treeAuthority: tree.treeAuthority,
      treeCreator: tree.treeCreator,
    };

    // Save configuration to file
    const configPath = path.join(__dirname, '../src/config/det-config.json');
    const configDir = path.dirname(configPath);
    
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }

    const config = {
      collection: {
        mint: collection.mint.toBase58(),
        metadata: collection.metadata.toBase58(),
        masterEdition: collection.masterEdition.toBase58(),
        name: COLLECTION_CONFIG.name,
        symbol: COLLECTION_CONFIG.symbol,
      },
      tree: {
        address: tree.treeAddress.toBase58(),
        authority: tree.treeAuthority.toBase58(),
        creator: tree.treeCreator.toBase58(),
        maxDepth: TREE_CONFIG.maxDepth,
        maxBufferSize: TREE_CONFIG.maxBufferSize,
        maxCapacity: TREE_CONFIG.maxCapacity,
      },
      network: this.connection.rpcEndpoint,
      setupDate: new Date().toISOString(),
      setupWallet: this.payer.publicKey.toBase58(),
    };

    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    
    console.log('\n=== Setup Complete! ===');
    console.log(`Collection NFT: ${collection.mint.toBase58()}`);
    console.log(`Tree Address: ${tree.treeAddress.toBase58()}`);
    console.log(`Tree Authority: ${tree.treeAuthority.toBase58()}`);
    console.log(`Config saved to: ${configPath}`);
    console.log('\nNext steps:');
    console.log('1. Create the actual Merkle tree using Solana CLI:');
    console.log(`   spl-account-compression create-tree ${tree.treeAddress.toBase58()} --max-depth ${TREE_CONFIG.maxDepth} --max-buffer-size ${TREE_CONFIG.maxBufferSize}`);
    console.log('2. Update your .env.local with these addresses');
    console.log('3. Test minting DETs with the new service');
    console.log('4. Integrate with your event system');
    
    return result;
  }

  // Generate CLI commands for manual tree creation
  generateCLICommands(): void {
    const configPath = path.join(__dirname, '../src/config/det-config.json');
    
    if (!fs.existsSync(configPath)) {
      console.error('Configuration file not found. Run setup first.');
      return;
    }

    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    
    console.log('\n=== CLI Commands for Tree Creation ===');
    console.log('\n1. Install Solana CLI if not already installed:');
    console.log('   sh -c "$(curl -sSfL https://release.solana.com/v1.18.4/install)"');
    
    console.log('\n2. Set cluster (devnet for testing):');
    console.log('   solana config set --url devnet');
    
    console.log('\n3. Set your keypair:');
    console.log(`   solana config set --keypair ${path.join(__dirname, '../.keys/setup-keypair.json')}`);
    
    console.log('\n4. Create the Merkle tree:');
    console.log(`   spl-account-compression create-tree ${config.tree.address} --max-depth ${config.tree.maxDepth} --max-buffer-size ${config.tree.maxBufferSize}`);
    
    console.log('\n5. Verify tree creation:');
    console.log(`   spl-account-compression get-tree ${config.tree.address}`);
  }
}

// Script execution
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--cli-commands')) {
    const setup = new DETCollectionSetup();
    setup.generateCLICommands();
    return;
  }

  try {
    const setup = new DETCollectionSetup();
    await setup.setupComplete();
    
    console.log('\n=== Want CLI commands? ===');
    console.log('Run: npx ts-node scripts/setup-det-collection.ts --cli-commands');
  } catch (error) {
    console.error('Setup failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export { DETCollectionSetup, COLLECTION_CONFIG, TREE_CONFIG };
export type { SetupResult };
