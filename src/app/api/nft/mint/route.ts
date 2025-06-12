import { NextRequest } from 'next/server';
import { ethers } from 'ethers';
import { createClient } from '@supabase/supabase-js';
import { MintRequest } from '@/types/nft';
import { registerIPAsset } from '@/lib/story-protocol';
import { uploadToIrys } from '@/lib/irys';

// Initialize Supabase client
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
    try {
        const body = (await req.json()) as MintRequest;
        
        // Validate request
        if (!body.name || !body.description || !body.imageUrl || !body.ownerAddress) {
            return new Response(
                JSON.stringify({ error: 'Missing required fields' }),
                { status: 400 }
            );
        }

        // Create metadata object
        const metadata = {
            name: body.name,
            description: body.description,
            image: body.imageUrl,
            attributes: body.attributes || [],
        };

        // Upload metadata to Irys
        const metadataStr = JSON.stringify(metadata);
        const { url: metadataUrl } = await uploadToIrys(
            metadataStr,
            'application/json'
        );

        // Calculate content hash for Story Protocol
        const contentHash = ethers.utils.keccak256(
            ethers.utils.toUtf8Bytes(metadataStr)
        );

        // Register with Story Protocol
        const registration = await registerIPAsset(
            body.name,
            body.description,
            body.imageUrl,
            contentHash,
            body.ownerAddress
        );

        // Store in Supabase
        const { data, error } = await supabase
            .from('nfts')
            .insert({
                name: body.name,
                description: body.description,
                image_url: body.imageUrl,
                metadata_url: metadataUrl,
                owner_address: body.ownerAddress,
                ip_id: registration.ipId,
            })
            .select()
            .single();

        if (error) throw error;

        return new Response(
            JSON.stringify({
                success: true,
                data: {
                    ...data,
                    registration
                }
            }),
            { 
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

    } catch (error) {
        console.error('NFT minting error:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to mint NFT' }),
            { status: 500 }
        );
    }
}