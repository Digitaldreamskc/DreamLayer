'use client';

import { 
  Connection, 
  PublicKey, 
  clusterApiUrl
} from '@solana/web3.js';
import { 
  Metaplex, 
  walletAdapterIdentity,
  CreateNftInput,
} from '@metaplex-foundation/js';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { keccak256 } from 'js-sha3';
import { 
  solanaConnectionManager, 
  getCurrentConnection, 
  getCurrentNetwork,
  type SolanaNetwork 
} from '../lib/solana-connection';

// Types
export interface DETEvent {
  id: string;
  name: string;
  description: string;
  image_url: string;
  start_date: string;
  end_date: string;
  location: string;
  city: string;
  supply: number;
  claimed: number;
  collection_address?: string;
  merkle_tree?: string;
  secret_code?: string;
  verification_radius?: number;
  verification_methods: ('location' | 'qr' | 'signature')[];
  whitelist_merkle_root?: string;
}

export interface DETMetadata {
  name: string;
  description: string;
  image: string;
  external_url: string;
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
  properties: {
    category: string;
    creators: Array<{
      address: string;
      share: number;
    }>;
  };
}

export interface DETMintResult {
  success: boolean;
  signature?: string;
  mint?: PublicKey;
  error?: string;
}

export interface WhitelistEntry {
  address: string;
  eventId: string;
  proof: string[];
}

export interface DETAttribute {
  trait_type: string;
  value: string;
}

export interface DETNft {
  id: string;
  name: string;
  description: string;
  image: string;
  attributes: DETAttribute[];
  mint: string;
}

// Load configuration from setup
interface DETConfig {
  collection: {
    mint: string;
    name: string;
    symbol: string;
  };
  tree: {
    address: string;
    authority: string;
    maxCapacity: number;
  };
  network: string;
}

let detConfig: DETConfig | null = null;

async function loadDETConfig(): Promise<DETConfig> {
  if (!detConfig) {
    try {
      const response = await fetch('/api/det-config');
      if (response.ok) {
        detConfig = await response.json();
      } else {
        // Fallback to mock config if API not available
        detConfig = {
          collection: {
            mint: 'TBD_COLLECTION_MINT',
            name: 'DreamLayer Event Tokens',
            symbol: 'DET'
          },
          tree: {
            address: 'TBD_TREE_ADDRESS',
            authority: 'TBD_AUTHORITY',
            maxCapacity: 262144
          },
          network: clusterApiUrl('devnet')
        };
      }
    } catch {
      console.warn('Could not load DET config, using fallback');
      detConfig = {
        collection: {
          mint: 'TBD_COLLECTION_MINT',
          name: 'DreamLayer Event Tokens',
          symbol: 'DET'
        },
        tree: {
          address: 'TBD_TREE_ADDRESS',
          authority: 'TBD_AUTHORITY',
          maxCapacity: 262144
        },
        network: clusterApiUrl('devnet')
      };
    }
  }
  return detConfig!;
}

class DETBlockchainService {
  private metaplex: Metaplex | null = null;

  constructor() {
    // Connection now managed by SolanaConnectionManager
    solanaConnectionManager.logConfiguration();
  }

  // Get current connection from manager
  private getConnection(): Connection {
    return getCurrentConnection();
  }

  // Get current network from manager
  private getCurrentNetwork(): SolanaNetwork {
    return getCurrentNetwork();
  }

  // Initialize Metaplex with wallet using current connection
  async initializeMetaplex(wallet: WalletContextState) {
    if (!wallet.publicKey || !wallet.signTransaction) {
      throw new Error('Wallet not connected');
    }

    const connection = this.getConnection();
    const network = this.getCurrentNetwork();

    console.log(`🔧 Initializing Metaplex on ${network}`);

    this.metaplex = Metaplex.make(connection)
      .use(walletAdapterIdentity(wallet));

    return this.metaplex;
  }

  // Generate metadata for DET based on event
  generateDETMetadata(event: DETEvent, userAddress: string): DETMetadata {
    const eventDate = new Date(event.start_date);
    const uniqueId = `${event.id}-${userAddress.slice(0, 8)}-${Date.now()}`;
    const network = this.getCurrentNetwork();

    return {
      name: `DET: ${event.name}`,
      description: `${event.description}\n\nAttended: ${eventDate.toDateString()}\nLocation: ${event.location}, ${event.city}\n\nThis is a non-transferable proof of attendance token.`,
      image: event.image_url,
      external_url: 'https://dreamlayer.io',
      attributes: [
        { trait_type: 'Event Type', value: 'Community Event' },
        { trait_type: 'Location', value: event.city },
        { trait_type: 'Date', value: eventDate.toISOString().split('T')[0] },
        { trait_type: 'Organizer', value: 'DreamLayer' },
        { trait_type: 'Event ID', value: event.id },
        { trait_type: 'Network', value: `Solana ${network}` },
        { trait_type: 'Type', value: 'Soulbound' },
        { trait_type: 'Unique ID', value: uniqueId },
        { trait_type: 'RPC Provider', value: network === 'mainnet' ? 'QuickNode' : 'Solana Labs' },
      ],
      properties: {
        category: 'image',
        creators: [
          {
            address: userAddress,
            share: 100,
          },
        ],
      },
    };
  }

  // Upload metadata to Arweave
  async uploadMetadata(metadata: DETMetadata): Promise<string> {
    if (!this.metaplex) {
      throw new Error('Metaplex not initialized');
    }

    const { uri } = await this.metaplex.nfts().uploadMetadata(metadata as unknown as Record<string, unknown>);
    console.log(`📁 Metadata uploaded to: ${uri}`);
    return uri;
  }

  // Test QuickNode connection health
  async testQuickNodeConnection(): Promise<boolean> {
    try {
      const result = await solanaConnectionManager.testConnection('mainnet');
      if (result) {
        console.log('✅ QuickNode mainnet connection healthy');
      }
      return result;
    } catch (error) {
      console.error('❌ QuickNode connection failed:', error);
      return false;
    }
  }

  // Mint regular NFT (enhanced with network support)
  async mintRegularNFT(
    event: DETEvent,
    userAddress: string,
    wallet: WalletContextState
  ): Promise<DETMintResult> {
    try {
      const network = this.getCurrentNetwork();
      console.log(`🪙 Minting DET on ${network} network for event: ${event.name}`);

      if (!this.metaplex) {
        await this.initializeMetaplex(wallet);
      }

      // Generate and upload metadata
      const metadata = this.generateDETMetadata(event, userAddress);
      const uri = await this.uploadMetadata(metadata);

      const config = await loadDETConfig();

      // Create NFT input
      const nftInput: CreateNftInput = {
        uri,
        name: metadata.name,
        symbol: 'DET',
        sellerFeeBasisPoints: 0,
        isMutable: false, // Immutable for soulbound
        creators: [
          {
            address: new PublicKey(userAddress),
            share: 100,
          },
        ],
        collection: config.collection.mint !== 'TBD_COLLECTION_MINT' 
          ? new PublicKey(config.collection.mint) 
          : undefined,
      };

      // Mint the NFT
      const { nft, response } = await this.metaplex!.nfts().create(nftInput);

      console.log('✅ DET minted successfully:', {
        mint: nft.address.toBase58(),
        signature: response.signature,
        network,
        explorer: network === 'mainnet' 
          ? `https://solscan.io/tx/${response.signature}`
          : `https://solscan.io/tx/${response.signature}?cluster=devnet`
      });

      return {
        success: true,
        signature: response.signature,
        mint: nft.address,
      };

    } catch (error) {
      console.error('❌ Error minting DET:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Verify whitelist eligibility using Merkle proof
  verifyWhitelist(
    userAddress: string,
    eventId: string,
    proof: string[],
    merkleRoot: string
  ): boolean {
    try {
      // Create leaf from user address and event ID
      const leaf = keccak256(Buffer.from(`${userAddress}:${eventId}`, 'utf8'));
      
      // Verify proof
      let computedHash = leaf;
      
      for (const proofElement of proof) {
        const proofBuffer = Buffer.from(proofElement, 'hex');
        
        if (Buffer.compare(Buffer.from(computedHash, 'hex'), proofBuffer) <= 0) {
          computedHash = keccak256(Buffer.concat([
            Buffer.from(computedHash, 'hex'),
            proofBuffer
          ]));
        } else {
          computedHash = keccak256(Buffer.concat([
            proofBuffer,
            Buffer.from(computedHash, 'hex')
          ]));
        }
      }

      return computedHash === merkleRoot.replace('0x', '');
    } catch (error) {
      console.error('Error verifying whitelist:', error);
      return false;
    }
  }

  // Check if user has already claimed DET for an event
  async hasUserClaimedDET(eventId: string, userAddress: string): Promise<boolean> {
    try {
      if (!this.metaplex) {
        return false;
      }

      // Query user's NFTs and check for existing DET from this event
      const nfts = await this.metaplex.nfts().findAllByOwner({
        owner: new PublicKey(userAddress),
      });

      // Check if any NFT has the event ID in its metadata
      for (const nft of nfts) {
        if (nft.json?.attributes) {
          const eventIdAttr = (nft.json.attributes as DETAttribute[]).find(
            (attr: DETAttribute) => attr.trait_type === 'Event ID' && attr.value === eventId
          );
          if (eventIdAttr) {
            return true;
          }
        }
      }

      return false;
    } catch (error) {
      console.error('Error checking DET claim status:', error);
      return false;
    }
  }

  // Main claim function with all verifications
  async claimDET(
    event: DETEvent,
    userAddress: string,
    wallet: WalletContextState,
    verificationData: {
      secretCode?: string;
      location?: { latitude: number; longitude: number };
      whitelistProof?: string[];
    }
  ): Promise<DETMintResult> {
    try {
      // Log network information
      const network = this.getCurrentNetwork();
      console.log(`🎯 Claiming DET on ${network} for event: ${event.name}`);

      // Check if user already claimed
      const alreadyClaimed = await this.hasUserClaimedDET(event.id, userAddress);
      if (alreadyClaimed) {
        return {
          success: false,
          error: 'You have already claimed a DET for this event',
        };
      }

      // Verify claim eligibility
      const isEligible = await this.verifyClaimEligibility(
        event,
        userAddress,
        verificationData
      );

      if (!isEligible) {
        return {
          success: false,
          error: 'Verification failed. Please check your location, secret code, or whitelist status.',
        };
      }

      // Attempt to mint DET
      return await this.mintRegularNFT(event, userAddress, wallet);

    } catch (error) {
      console.error('Error claiming DET:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Verify claim eligibility based on event requirements
  private async verifyClaimEligibility(
    event: DETEvent,
    userAddress: string,
    verificationData: {
      secretCode?: string;
      location?: { latitude: number; longitude: number };
      whitelistProof?: string[];
    }
  ): Promise<boolean> {
    // Check each verification method
    for (const method of event.verification_methods) {
      switch (method) {
        case 'signature':
          // Always pass for signature verification (wallet connection implies signature)
          return true;

        case 'qr':
          if (verificationData.secretCode === event.secret_code) {
            return true;
          }
          break;

        case 'location':
          if (verificationData.location && this.verifyLocation(
            verificationData.location,
            event,
            event.verification_radius || 100
          )) {
            return true;
          }
          break;
      }
    }

    // Check whitelist if provided
    if (event.whitelist_merkle_root && verificationData.whitelistProof) {
      return this.verifyWhitelist(
        userAddress,
        event.id,
        verificationData.whitelistProof,
        event.whitelist_merkle_root
      );
    }

    return false;
  }

  // Verify user location for claiming
  private verifyLocation(
    userLocation: { latitude: number; longitude: number },
    event: DETEvent,
    radiusInMeters: number = 100
  ): boolean {
    // Mock event locations for demo
    const eventLocations: Record<string, { latitude: number; longitude: number }> = {
      '1': { latitude: 37.7749, longitude: -122.4194 }, // San Francisco
      '2': { latitude: 30.2672, longitude: -97.7431 },  // Austin
      '3': { latitude: 40.7128, longitude: -74.0060 },  // New York
    };

    const eventLocation = eventLocations[event.id];
    if (!eventLocation) {
      return true; // Allow if no specific location set
    }

    const distance = this.calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      eventLocation.latitude,
      eventLocation.longitude
    );

    return distance <= radiusInMeters;
  }

  // Calculate distance between two coordinates
  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  // Get user's DETs from their wallet
  async getUserDETs(userAddress: string): Promise<DETNft[]> {
    try {
      if (!this.metaplex) {
        return [];
      }

      const nfts = await this.metaplex.nfts().findAllByOwner({
        owner: new PublicKey(userAddress),
      });

      // Filter for DETs (those with Event ID attribute)
      const dets = nfts.filter(nft => {
        if (!nft.json?.attributes) return false;
        
        return (nft.json.attributes as DETAttribute[]).some(
          (attr: DETAttribute) => attr.trait_type === 'Event ID'
        );
      });

      return dets.map(nft => ({
        id: nft.address.toBase58(),
        name: nft.json?.name || 'DET',
        description: nft.json?.description || '',
        image: nft.json?.image || '',
        attributes: (nft.json?.attributes as DETAttribute[]) || [],
        mint: nft.address.toBase58(),
      }));

    } catch (error) {
      console.error('Error fetching user DETs:', error);
      return [];
    }
  }

  // Get event details by ID (with blockchain config)
  async getDETEvent(eventId: string): Promise<DETEvent | null> {
    try {
      const config = await loadDETConfig();
      const mockEvent = this.getMockEventData(eventId);
      
      if (mockEvent && config.collection.mint !== 'TBD_COLLECTION_MINT') {
        mockEvent.collection_address = config.collection.mint;
        mockEvent.merkle_tree = config.tree.address;
      }
      
      return mockEvent;
    } catch (error) {
      console.error('Error fetching DET event:', error);
      return null;
    }
  }

  // Mock event data (same as before but with blockchain config)
  getMockEventData(eventId: string): DETEvent | null {
    const mockData: Record<string, DETEvent> = {
      '1': {
        id: '1',
        name: 'Web3 Community Meetup #12',
        description: 'Monthly community gathering with guest speakers and networking opportunities. Join industry leaders for exclusive insights into Web3 innovation.',
        image_url: 'https://images.unsplash.com/photo-1559223607-b4d0555ae73c?w=400&h=400&fit=crop',
        start_date: '2025-06-08T18:00:00Z',
        end_date: '2025-06-08T22:00:00Z',
        location: 'Digital Dreams HQ',
        city: 'San Francisco',
        supply: 100,
        claimed: 45,
        secret_code: 'DREAMLAYER2025',
        verification_methods: ['signature', 'qr'],
        verification_radius: 100,
      },
      '2': {
        id: '2',
        name: 'Solana Builder Workshop',
        description: 'Hands-on workshop for building decentralized applications on Solana blockchain using the Anchor framework with practical examples.',
        image_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=400&fit=crop',
        start_date: '2025-07-13T14:00:00Z',
        end_date: '2025-07-13T18:00:00Z',
        location: 'Innovation Hub',
        city: 'Austin',
        supply: 50,
        claimed: 28,
        secret_code: 'SOLANA2025',
        verification_methods: ['signature', 'qr', 'location'],
        verification_radius: 50,
      },
      '3': {
        id: '3',
        name: 'NFT & IP Rights Summit',
        description: 'Deep dive into intellectual property management in the Web3 space, covering Story Protocol, licensing, and royalty structures.',
        image_url: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=400&fit=crop',
        start_date: '2025-08-10T09:00:00Z',
        end_date: '2025-08-10T17:00:00Z',
        location: 'Convention Center',
        city: 'New York',
        supply: 75,
        claimed: 12,
        secret_code: 'IPSUMMIT2025',
        verification_methods: ['signature', 'qr'],
        verification_radius: 200,
      },
    };

    return mockData[eventId] || null;
  }
}

// Create singleton instance
export const detBlockchainService = new DETBlockchainService();

// React hook for blockchain DET operations with QuickNode support
export const useBlockchainDET = () => {
  const claimDET = async (
    eventId: string,
    userAddress: string,
    wallet: WalletContextState,
    verificationData: {
      secretCode?: string;
      location?: { latitude: number; longitude: number };
      whitelistProof?: string[];
    }
  ) => {
    const event = await detBlockchainService.getDETEvent(eventId);
    if (!event) {
      throw new Error('Event not found');
    }

    return await detBlockchainService.claimDET(event, userAddress, wallet, verificationData);
  };

  const getUserDETs = async (userAddress: string) => {
    return await detBlockchainService.getUserDETs(userAddress);
  };

  const checkDETClaimed = async (eventId: string, userAddress: string) => {
    return await detBlockchainService.hasUserClaimedDET(eventId, userAddress);
  };

  const testQuickNode = async () => {
    return await detBlockchainService.testQuickNodeConnection();
  };

  return {
    claimDET,
    getUserDETs,
    checkDETClaimed,
    testQuickNode,
  };
};
