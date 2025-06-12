import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-static';

export async function GET() {
  try {
    const configPath = path.join(process.cwd(), 'src/config/det-config.json');
    
    if (!fs.existsSync(configPath)) {
      // Return fallback config if file doesn't exist
      return NextResponse.json({
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
        network: process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com'
      });
    }

    const configData = fs.readFileSync(configPath, 'utf8');
    const config = JSON.parse(configData);
    
    return NextResponse.json(config);
  } catch (error) {
    console.error('Error loading DET config:', error);
    
    // Return fallback config on error
    return NextResponse.json({
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
      network: process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com'
    });
  }
}
