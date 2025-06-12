import { AptosClient } from '@aptos-labs/ts-sdk';

// Create a browser-compatible client
export const aptosClient = new AptosClient({ 
  NODE_URL: process.env.NEXT_PUBLIC_APTOS_NODE_URL || 'https://fullnode.mainnet.aptoslabs.com/v1',
});

export default aptosClient;