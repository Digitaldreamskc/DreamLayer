// Note: You'll need to install @solana/web3.js
// npm install @solana/web3.js

import { Connection, clusterApiUrl } from '@solana/web3.js';

const SOLANA_RPC_URL = `https://solana-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`;

const connection = new Connection(SOLANA_RPC_URL, 'confirmed');

export async function getSolanaBlockData(slot: number) {
    try {
        // Using Alchemy's JSON-RPC endpoint for Solana
        const response = await fetch(SOLANA_RPC_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: 1,
                jsonrpc: '2.0',
                method: 'getBlockProduction',
                params: [{ identity: slot.toString() }]
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.result;
    } catch (error) {
        console.error('Error fetching Solana block:', error);

        // Fallback to web3.js method
        try {
            const block = await connection.getBlock(slot, {
                maxSupportedTransactionVersion: 0,
            });
            return block;
        } catch (fallbackError) {
            console.error('Fallback method also failed:', fallbackError);
            throw fallbackError;
        }
    }
}

// Helper to get latest slot number
export async function getLatestSlot() {
    return await connection.getSlot();
}