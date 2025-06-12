// services/DynamicNFTEventListener.ts
import { ethers, Contract, Event } from 'ethers';
import { DynamicNFT__factory } from '../types/contracts/factories/DynamicNFT__factory';
import { NFT_CONFIG } from '../config/nft.config';

interface EventCallback {
    (event: Event): Promise<void>;
}

interface NFTUpdateEvent {
    tokenId: number;
    newTokenURI: string;
    timestamp: number;
    transactionHash: string;
}

export class DynamicNFTEventListener {
    private provider: ethers.providers.JsonRpcProvider;
    private contracts: Map<string, Contract>;
    private eventCallbacks: Map<string, EventCallback[]>;

    constructor(isTestnet: boolean = false) {
        const network = isTestnet ? NFT_CONFIG.network.testnet : NFT_CONFIG.network.mainnet;
        this.provider = new ethers.providers.JsonRpcProvider(network.rpcUrl);
        this.contracts = new Map();
        this.eventCallbacks = new Map();
    }

    /**
     * Add a contract to listen to
     * @param contractAddress The address of the NFT contract
     */
    public async addContract(contractAddress: string): Promise<void> {
        try {
            if (this.contracts.has(contractAddress)) {
                return;
            }

            const contract = DynamicNFT__factory.connect(contractAddress, this.provider);
            this.contracts.set(contractAddress, contract);
            
            // Initialize empty callback array for this contract
            this.eventCallbacks.set(contractAddress, []);

            console.log(`Now listening to contract: ${contractAddress}`);
        } catch (error) {
            console.error(`Failed to add contract ${contractAddress}:`, error);
            throw error;
        }
    }

    /**
     * Subscribe to TokenURIUpdated events
     * @param contractAddress The contract to listen to
     * @param callback Callback function for handling events
     */
    public async subscribeToUpdates(
        contractAddress: string,
        callback: EventCallback
    ): Promise<void> {
        const contract = this.contracts.get(contractAddress);
        if (!contract) {
            throw new Error(`Contract ${contractAddress} not found. Call addContract first.`);
        }

        try {
            // Store callback
            const callbacks = this.eventCallbacks.get(contractAddress) || [];
            callbacks.push(callback);
            this.eventCallbacks.set(contractAddress, callbacks);

            // Listen for TokenURIUpdated events
            contract.on('TokenURIUpdated', async (tokenId, newTokenURI, event) => {
                const block = await event.getBlock();
                const update: NFTUpdateEvent = {
                    tokenId: tokenId.toNumber(),
                    newTokenURI,
                    timestamp: block.timestamp,
                    transactionHash: event.transactionHash
                };

                // Execute all callbacks for this contract
                const contractCallbacks = this.eventCallbacks.get(contractAddress) || [];
                await Promise.all(contractCallbacks.map(cb => cb(event)));
            });

            console.log(`Subscribed to updates for contract: ${contractAddress}`);
        } catch (error) {
            console.error(`Failed to subscribe to updates for ${contractAddress}:`, error);
            throw error;
        }
    }

    /**
     * Get historical updates for a token
     * @param contractAddress The contract address
     * @param tokenId The token ID to query
     * @param fromBlock Optional starting block number
     */
    public async getUpdateHistory(
        contractAddress: string,
        tokenId: number,
        fromBlock?: number
    ): Promise<NFTUpdateEvent[]> {
        const contract = this.contracts.get(contractAddress);
        if (!contract) {
            throw new Error(`Contract ${contractAddress} not found. Call addContract first.`);
        }

        try {
            // Create filter for TokenURIUpdated events
            const filter = contract.filters.TokenURIUpdated(tokenId);
            
            // Get all matching events
            const events = await contract.queryFilter(
                filter,
                fromBlock || 0,
                'latest'
            );

            // Process events
            const updates = await Promise.all(events.map(async (event) => {
                const block = await event.getBlock();
                return {
                    tokenId: event.args?.tokenId.toNumber(),
                    newTokenURI: event.args?.newTokenURI,
                    timestamp: block.timestamp,
                    transactionHash: event.transactionHash
                };
            }));

            return updates;
        } catch (error) {
            console.error(`Failed to get update history for token ${tokenId}:`, error);
            throw error;
        }
    }

    /**
     * Stop listening to a specific contract
     * @param contractAddress The contract to stop listening to
     */
    public async removeContract(contractAddress: string): Promise<void> {
        const contract = this.contracts.get(contractAddress);
        if (contract) {
            contract.removeAllListeners();
            this.contracts.delete(contractAddress);
            this.eventCallbacks.delete(contractAddress);
            console.log(`Stopped listening to contract: ${contractAddress}`);
        }
    }

    /**
     * Stop listening to all contracts
     */
    public async removeAllListeners(): Promise<void> {
        for (const [address, contract] of this.contracts) {
            await this.removeContract(address);
        }
        console.log('Removed all listeners');
    }
}