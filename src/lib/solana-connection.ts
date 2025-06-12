import { Connection, clusterApiUrl } from '@solana/web3.js';

export type SolanaNetwork = 'mainnet' | 'devnet' | 'testnet';

export interface SolanaEndpoints {
  http: string;
  websocket?: string;
}

export class SolanaConnectionManager {
  private static instance: SolanaConnectionManager;
  private connections: Map<SolanaNetwork, Connection> = new Map();
  
  private constructor() {}
  
  public static getInstance(): SolanaConnectionManager {
    if (!SolanaConnectionManager.instance) {
      SolanaConnectionManager.instance = new SolanaConnectionManager();
    }
    return SolanaConnectionManager.instance;
  }

  /**
   * Get endpoints for a specific network
   */
  public getEndpoints(network: SolanaNetwork): SolanaEndpoints {
    switch (network) {
      case 'mainnet':
        return {
          http: process.env.NEXT_PUBLIC_SOLANA_RPC_URL_MAINNET || clusterApiUrl('mainnet-beta'),
          websocket: process.env.NEXT_PUBLIC_SOLANA_WSS_URL_MAINNET
        };
      case 'devnet':
        return {
          http: process.env.NEXT_PUBLIC_SOLANA_RPC_URL_DEVNET || clusterApiUrl('devnet'),
          websocket: process.env.NEXT_PUBLIC_SOLANA_WSS_URL_DEVNET
        };
      case 'testnet':
        return {
          http: clusterApiUrl('testnet'),
          websocket: undefined
        };
      default:
        throw new Error(`Unsupported network: ${network}`);
    }
  }

  /**
   * Get or create a connection for a specific network
   */
  public getConnection(network: SolanaNetwork = 'devnet'): Connection {
    if (!this.connections.has(network)) {
      const endpoints = this.getEndpoints(network);
      const connection = new Connection(
        endpoints.http,
        {
          commitment: 'confirmed',
          wsEndpoint: endpoints.websocket,
          confirmTransactionInitialTimeout: 60000,
        }
      );
      this.connections.set(network, connection);
    }
    
    return this.connections.get(network)!;
  }

  /**
   * Get current active network from environment
   */
  public getCurrentNetwork(): SolanaNetwork {
    const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK as SolanaNetwork;
    return network || 'devnet';
  }

  /**
   * Get current active connection
   */
  public getCurrentConnection(): Connection {
    return this.getConnection(this.getCurrentNetwork());
  }

  /**
   * Test connection health
   */
  public async testConnection(network: SolanaNetwork): Promise<boolean> {
    try {
      const connection = this.getConnection(network);
      const slot = await connection.getSlot();
      console.log(`✅ ${network} connection healthy - Current slot: ${slot}`);
      return true;
    } catch (error) {
      console.error(`❌ ${network} connection failed:`, error);
      return false;
    }
  }

  /**
   * Test all configured connections
   */
  public async testAllConnections(): Promise<Record<SolanaNetwork, boolean>> {
    const networks: SolanaNetwork[] = ['mainnet', 'devnet'];
    const results: Partial<Record<SolanaNetwork, boolean>> = {};
    
    await Promise.all(
      networks.map(async (network) => {
        results[network] = await this.testConnection(network);
      })
    );
    
    return results as Record<SolanaNetwork, boolean>;
  }

  /**
   * Get Bundlr storage endpoint based on network
   */
  public getBundlrEndpoint(network: SolanaNetwork): string {
    switch (network) {
      case 'mainnet':
        return 'https://node1.bundlr.network';
      case 'devnet':
        return 'https://devnet.bundlr.network';
      default:
        return 'https://devnet.bundlr.network';
    }
  }

  /**
   * Switch to a different network (for testing/staging)
   */
  public switchNetwork(network: SolanaNetwork): Connection {
    console.log(`🔄 Switching to ${network} network`);
    return this.getConnection(network);
  }

  /**
   * Log current configuration
   */
  public logConfiguration(): void {
    const currentNetwork = this.getCurrentNetwork();
    const endpoints = this.getEndpoints(currentNetwork);
    
    console.log('🔧 Solana Configuration:');
    console.log(`  Network: ${currentNetwork}`);
    console.log(`  HTTP: ${endpoints.http}`);
    console.log(`  WebSocket: ${endpoints.websocket || 'Not configured'}`);
    console.log(`  Bundlr: ${this.getBundlrEndpoint(currentNetwork)}`);
  }
}

// Export singleton instance
export const solanaConnectionManager = SolanaConnectionManager.getInstance();

// Convenience exports
export const getCurrentConnection = () => solanaConnectionManager.getCurrentConnection();
export const getCurrentNetwork = () => solanaConnectionManager.getCurrentNetwork();
export const getConnection = (network: SolanaNetwork) => solanaConnectionManager.getConnection(network);
export const testQuickNodeConnection = () => solanaConnectionManager.testConnection('mainnet');
