import { useAppKitAccount, useAppKitProvider } from '@reown/appkit/react';

export interface POAPEvent {
    id: string;
    name: string;
    description: string;
    image_url: string;
    start_date: string;
    end_date: string;
    event_url: string;
    country: string;
    city: string;
    supply: number;
    claimed: number;
    secret_code?: string;
    qr_hash?: string;
}

export interface POAPClaim {
    event_id: string;
    user_address: string;
    signature: string;
    claim_code?: string;
    location?: {
        latitude: number;
        longitude: number;
    };
}

// Define proper types for POAP API responses
export interface UserPOAP {
    event: {
        id: string;
        name: string;
        description: string;
        image_url: string;
        start_date: string;
        end_date: string;
        country: string;
        city: string;
    };
    tokenId: string;
    owner: string;
    chain: string;
    created: string;
}

export interface ClaimResponse {
    success: boolean;
    tx_hash?: string;
    message?: string;
    error?: string;
}

class POAPService {
    private readonly API_BASE = 'https://api.poap.tech';
    private readonly API_KEY = process.env.NEXT_PUBLIC_POAP_API_KEY;

    // Create a new POAP event (for event organizers)
    async createPOAPEvent(eventData: Partial<POAPEvent>): Promise<POAPEvent> {
        try {
            const response = await fetch(`${this.API_BASE}/events`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': this.API_KEY || '',
                },
                body: JSON.stringify(eventData),
            });

            if (!response.ok) {
                throw new Error(`Failed to create POAP event: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error creating POAP event:', error);
            throw error;
        }
    }

    // Get event details by ID
    async getPOAPEvent(eventId: string): Promise<POAPEvent> {
        try {
            const response = await fetch(`${this.API_BASE}/events/id/${eventId}`, {
                headers: {
                    'X-API-Key': this.API_KEY || '',
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch POAP event: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching POAP event:', error);
            throw error;
        }
    }

    // Claim POAP using secret code
    async claimPOAPWithCode(
        eventId: string,
        secretCode: string,
        userAddress: string
    ): Promise<{ success: boolean; tx_hash?: string; error?: string }> {
        try {
            const response = await fetch(`${this.API_BASE}/actions/claim-qr`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': this.API_KEY || '',
                },
                body: JSON.stringify({
                    qr_hash: secretCode,
                    address: userAddress,
                    secret: secretCode,
                }),
            });

            const result: ClaimResponse = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to claim POAP');
            }

            return { success: true, tx_hash: result.tx_hash };
        } catch (error) {
            console.error('Error claiming POAP:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    // Generate QR code for POAP claiming
    async generateClaimQR(eventId: string, secretCode: string): Promise<string> {
        const claimUrl = `https://poap.xyz/claim/${secretCode}`;
        // You can use a QR code generation library here
        // For now, returning the URL that can be converted to QR
        return claimUrl;
    }

    // Verify user location for POAP claiming (optional)
    async verifyLocationForClaim(
        eventId: string,
        userLocation: { latitude: number; longitude: number },
        eventLocation: { latitude: number; longitude: number },
        radiusInMeters: number = 1000
    ): Promise<boolean> {
        const distance = this.calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            eventLocation.latitude,
            eventLocation.longitude
        );

        return distance <= radiusInMeters;
    }

    // Get user's POAPs with proper typing
    async getUserPOAPs(address: string): Promise<UserPOAP[]> {
        try {
            const response = await fetch(`${this.API_BASE}/actions/scan/${address}`, {
                headers: {
                    'X-API-Key': this.API_KEY || '',
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch user POAPs: ${response.statusText}`);
            }

            const data: UserPOAP[] = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching user POAPs:', error);
            return [];
        }
    }

    // Helper function to calculate distance between two coordinates
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

    // Check if user has already claimed POAP for an event
    async hasUserClaimedPOAP(eventId: string, userAddress: string): Promise<boolean> {
        try {
            const userPOAPs = await this.getUserPOAPs(userAddress);
            return userPOAPs.some((poap: UserPOAP) => poap.event?.id === eventId);
        } catch (error) {
            console.error('Error checking POAP claim status:', error);
            return false;
        }
    }

    // Mock function for demo purposes - replace with real event data
    getMockEventPOAPData(eventId: string): Partial<POAPEvent> | null {
        const mockData: Record<string, Partial<POAPEvent>> = {
            '1': {
                id: '1',
                name: 'Web3 Community Meetup #12',
                description: 'Monthly community gathering with guest speakers and networking',
                image_url: 'https://assets.poap.xyz/2023-web3-meetup-12.png',
                start_date: '2025-06-15T18:00:00Z',
                end_date: '2025-06-15T22:00:00Z',
                country: 'US',
                city: 'San Francisco',
                supply: 100,
                claimed: 45,
                secret_code: 'DREAMLAYER2025',
            },
            '2': {
                id: '2',
                name: 'Solana Builder Workshop',
                description: 'Hands-on workshop for building on Solana blockchain',
                image_url: 'https://assets.poap.xyz/2023-solana-workshop.png',
                start_date: '2025-06-22T14:00:00Z',
                end_date: '2025-06-22T18:00:00Z',
                country: 'US',
                city: 'Austin',
                supply: 50,
                claimed: 28,
                secret_code: 'SOLANA2025',
            },
            '3': {
                id: '3',
                name: 'NFT & IP Rights Summit',
                description: 'Deep dive into intellectual property in the Web3 space',
                image_url: 'https://assets.poap.xyz/2023-ip-summit.png',
                start_date: '2025-07-01T09:00:00Z',
                end_date: '2025-07-01T17:00:00Z',
                country: 'US',
                city: 'New York',
                supply: 75,
                claimed: 12,
                secret_code: 'IPSUMMIT2025',
            },
        };

        return mockData[eventId] || null;
    }
}

export const poapService = new POAPService();

// React hook for POAP operations
export const usePOAP = () => {
    const { address, isConnected } = useAppKitAccount();
    // Removed unused walletProvider to fix ESLint error
    // const { walletProvider } = useAppKitProvider('eip155');

    const claimPOAP = async (eventId: string, secretCode: string) => {
        if (!isConnected || !address) {
            throw new Error('Wallet not connected');
        }

        return await poapService.claimPOAPWithCode(eventId, secretCode, address);
    };

    const getUserPOAPs = async (): Promise<UserPOAP[]> => {
        if (!address) return [];
        return await poapService.getUserPOAPs(address);
    };

    const checkPOAPClaimed = async (eventId: string): Promise<boolean> => {
        if (!address) return false;
        return await poapService.hasUserClaimedPOAP(eventId, address);
    };

    return {
        claimPOAP,
        getUserPOAPs,
        checkPOAPClaimed,
        address,
        isConnected,
    };
};