import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { uploadToIrys } from '@/lib/irys';
import { NFTMetadata } from '@/types/nft';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PUT(req: NextRequest) {
    try {
        const { id, metadata } = await req.json() as { 
            id: string; 
            metadata: Partial<NFTMetadata>;
        };

        // Get current NFT data
        const { data: nft, error: fetchError } = await supabase
            .from('nfts')
            .select()
            .eq('id', id)
            .single();

        if (fetchError) throw fetchError;
        if (!nft) {
            return new Response(
                JSON.stringify({ error: 'NFT not found' }),
                { status: 404 }
            );
        }

        // Merge with existing metadata
        const currentMetadata = nft.metadata || {};
        const updatedMetadata = {
            ...currentMetadata,
            ...metadata,
            lastUpdated: new Date().toISOString()
        };

        // Upload new metadata to Irys
        const metadataStr = JSON.stringify(updatedMetadata);
        const { url: metadataUrl } = await uploadToIrys(
            metadataStr,
            'application/json'
        );

        // Update Supabase record
        const { data, error } = await supabase
            .from('nfts')
            .update({
                metadata: updatedMetadata,
                metadata_url: metadataUrl,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        return new Response(
            JSON.stringify({
                success: true,
                data
            }),
            { 
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

    } catch (error) {
        console.error('NFT update error:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to update NFT' }),
            { status: 500 }
        );
    }
}