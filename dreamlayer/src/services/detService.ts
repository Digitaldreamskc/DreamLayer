'use client';

import { useAppKitAccount, useAppKitProvider } from '@reown/appkit/react';
import { Connection, clusterApiUrl, Keypair } from '@solana/web3.js';
import { Metaplex, keypairIdentity, bundlrStorage } from '@metaplex-foundation/js';

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
  merkle_tree?: string;
  collection_address?: string;
  secret_code?: string;
  verification_radius?: number; // meters
  verification_methods: ('location' | 'qr' | 'signature')[];
}

export interface DETClaim {
  event_id: string;
  user_address: string;
  signature: string;
  claim_code?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  metadata?: Record<string, unknown>;
}

export interface DETToken {
  id: string;
  event_id: string;
  owner: string;
  mint_date: string;
  metadata: {
    name: string;
    description: string;
    image: string;
    attributes: Array<{
      trait_type: string;
      value: string;
    }>;
  };
}

class DETService {
  private readonly connection: Connection;
  private metaplex: Metaplex | null = null;

  constructor() {
    // Use devnet for now, will switch to mainnet when ready
    const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || clusterApiUrl('devnet');
    this.connection = new Connection(rpcUrl, 'confirmed');
  }

  // Initialize Metaplex instance (will be called when wallet is connected)
  private async initializeMetaplex(walletAdapter: Keypair) {
    if (!this.metaplex) {
      this.metaplex = Metaplex.make(this.connection)
        .use(keypairIdentity(walletAdapter))
        .use(bundlrStorage({
          address: 'https://devnet.bundlr.network',
          providerUrl: this.connection.rpcEndpoint,
          timeout: 60000,
        }));
    }
    return this.metaplex;
  }

  // Create a new DET event (for event organizers)
  async createDETEvent(eventData: Partial<DETEvent>): Promise<DETEvent> {
    try {
      // For now, return mock data. Will implement real creation later
      const newEvent: DETEvent = {
        id: Math.random().toString(36).substr(2, 9),
        name: eventData.name || 'New DreamLayer Event',
        description: eventData.description || '',
        image_url: eventData.image_url || '',
        start_date: eventData.start_date || new Date().toISOString(),
        end_date: eventData.end_date || new Date().toISOString(),
        location: eventData.location || '',
        city: eventData.city || '',
        supply: eventData.supply || 100,
        claimed: 0,
        verification_methods: eventData.verification_methods || ['signature'],
        verification_radius: eventData.verification_radius || 100,
      };

      console.log('Created DET Event:', newEvent);
      return newEvent;
    } catch (error) {
      console.error('Error creating DET event:', error);
      throw error;
    }
  }

  // Get event details by ID
  async getDETEvent(eventId: string): Promise<DETEvent | null> {
    try {
      const mockEvent = this.getMockEventData(eventId);
      return mockEvent;
    } catch (error) {
      console.error('Error fetching DET event:', error);
      return null;
    }
  }

  // Claim DET using various verification methods
  async claimDET(
    eventId: string,
    userAddress: string,
    verificationData: {
      secretCode?: string;
      location?: { latitude: number; longitude: number };
      signature?: string;
    }
  ): Promise<{ success: boolean; token_id?: string; error?: string }> {
    try {
      const event = await this.getDETEvent(eventId);
      if (!event) {
        throw new Error('Event not found');
      }

      // Verify the claim based on event requirements
      const isValid = await this.verifyClaimEligibility(event, userAddress, verificationData);
      
      if (!isValid) {
        return { 
          success: false, 
          error: 'Verification failed. Please check your location, secret code, or try again.' 
        };
      }

      // For now, simulate minting process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const tokenId = `det_${eventId}_${userAddress.slice(0, 8)}_${Date.now()}`;
      
      console.log('DET Claimed:', { eventId, userAddress, tokenId });
      
      return { 
        success: true, 
        token_id: tokenId 
      };
    } catch (error) {
      console.error('Error claiming DET:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // Verify claim eligibility
  private async verifyClaimEligibility(
    event: DETEvent,
    userAddress: string,
    verificationData: {
      secretCode?: string;
      location?: { latitude: number; longitude: number };
      signature?: string;
    }
  ): Promise<boolean> {
    // Check if user already claimed
    const alreadyClaimed = await this.hasUserClaimedDET(event.id, userAddress);
    if (alreadyClaimed) {
      return false;
    }

    // Verify based on event's verification methods
    for (const method of event.verification_methods) {
      switch (method) {
        case 'signature':
          // Always pass for signature verification in demo
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

  // Get user's DETs
  async getUserDETs(address: string): Promise<DETToken[]> {
    try {
      // For now, return mock data based on local storage or hardcoded
      const mockTokens: DETToken[] = [];
      
      // Check if user has claimed any of our mock events
      const claimedEvents = this.getClaimedEventsFromStorage(address);
      
      for (const eventId of claimedEvents) {
        const event = this.getMockEventData(eventId);
        if (event) {
          mockTokens.push({
            id: `det_${eventId}_${address.slice(0, 8)}`,
            event_id: eventId,
            owner: address,
            mint_date: new Date().toISOString(),
            metadata: {
              name: `DET - ${event.name}`,
              description: event.description,
              image: event.image_url,
              attributes: [
                { trait_type: 'Event Type', value: 'Community Meetup' },
                { trait_type: 'Location', value: event.city },
                { trait_type: 'Date', value: event.start_date.split('T')[0] },
                { trait_type: 'Organizer', value: 'DreamLayer' },
              ],
            },
          });
        }
      }

      return mockTokens;
    } catch (error) {
      console.error('Error fetching user DETs:', error);
      return [];
    }
  }

  // Check if user has already claimed DET for an event
  async hasUserClaimedDET(eventId: string, userAddress: string): Promise<boolean> {
    try {
      const claimedEvents = this.getClaimedEventsFromStorage(userAddress);
      return claimedEvents.includes(eventId);
    } catch (error) {
      console.error('Error checking DET claim status:', error);
      return false;
    }
  }

  // Store claimed event in local storage (temporary solution)
  private storeClaimedEvent(userAddress: string, eventId: string) {
    try {
      const key = `det_claimed_${userAddress}`;
      const claimed = this.getClaimedEventsFromStorage(userAddress);
      if (!claimed.includes(eventId)) {
        claimed.push(eventId);
        localStorage.setItem(key, JSON.stringify(claimed));
      }
    } catch (error) {
      console.error('Error storing claimed event:', error);
    }
  }

  // Get claimed events from local storage
  private getClaimedEventsFromStorage(userAddress: string): string[] {
    try {
      const key = `det_claimed_${userAddress}`;
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error getting claimed events:', error);
      return [];
    }
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

  // Mock event data with updated dates
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

  // Simulate claiming process and store locally
  async simulateClaimDET(eventId: string, userAddress: string): Promise<boolean> {
    try {
      this.storeClaimedEvent(userAddress, eventId);
      return true;
    } catch (error) {
      console.error('Error simulating DET claim:', error);
      return false;
    }
  }
}

export const detService = new DETService();

// React hook for DET operations
export const useDET = () => {
  const { address, isConnected } = useAppKitAccount();
  useAppKitProvider('eip155');

  const claimDET = async (
    eventId: string, 
    verificationData: {
      secretCode?: string;
      location?: { latitude: number; longitude: number };
    }
  ) => {
    if (!isConnected || !address) {
      throw new Error('Wallet not connected');
    }

    return await detService.claimDET(eventId, address, verificationData);
  };

  const getUserDETs = async () => {
    if (!address) return [];
    return await detService.getUserDETs(address);
  };

  const checkDETClaimed = async (eventId: string) => {
    if (!address) return false;
    return await detService.hasUserClaimedDET(eventId, address);
  };

  const simulateClaimDET = async (eventId: string) => {
    if (!address) return false;
    return await detService.simulateClaimDET(eventId, address);
  };

  return {
    claimDET,
    getUserDETs,
    checkDETClaimed,
    simulateClaimDET,
    address,
    isConnected,
  };
};
