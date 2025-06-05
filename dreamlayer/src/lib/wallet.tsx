import { createContext, useContext, useEffect, useState } from 'react';
import { PublicKey, Connection, VersionedTransaction } from '@solana/web3.js';
import { ethers } from 'ethers';
import { useToast } from '@/components/ui/use-toast';

export type ChainType = 'solana' | 'base';

export interface WalletContextType {
    isConnected: boolean;
    address: string | null;
    chainId: string | null;
    balance: string | null;
    chain: ChainType;
    connect: () => Promise<void>;
    disconnect: () => Promise<void>;
    switchChain: (chain: ChainType) => Promise<void>;
    signAndSendTransaction: (transaction: VersionedTransaction | ethers.Transaction) => Promise<string>;
}

const WalletContext = createContext<WalletContextType | null>(null);

export const useWallet = () => {
    const context = useContext(WalletContext);
    if (!context) {
        throw new Error('useWallet must be used within a WalletProvider');
    }
    return context;
};

interface WalletProviderProps {
    children: React.ReactNode;
}

const SOLANA_NETWORK = 'devnet'; // or 'mainnet-beta'
const BASE_NETWORK = 'goerli'; // or 'mainnet'

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
    const [isConnected, setIsConnected] = useState(false);
    const [address, setAddress] = useState<string | null>(null);
    const [chainId, setChainId] = useState<string | null>(null);
    const [balance, setBalance] = useState<string | null>(null);
    const [chain, setChain] = useState<ChainType>('solana');
    const { toast } = useToast();

    // Initialize connections
    const solanaConnection = new Connection(
        `https://api.${SOLANA_NETWORK}.solana.com`
    );

    const getProvider = () => {
        if (chain === 'solana') {
            if (!(window as any).solana) {
                throw new Error('Phantom wallet not found');
            }
            return (window as any).solana;
        } else {
            if (!(window as any).ethereum) {
                throw new Error('MetaMask not found');
            }
            return new ethers.BrowserProvider((window as any).ethereum);
        }
    };

    const connect = async () => {
        try {
            if (chain === 'solana') {
                const provider = getProvider();
                const resp = await provider.connect();
                const publicKey = resp.publicKey.toString();
                setAddress(publicKey);
                
                // Get balance
                const balance = await solanaConnection.getBalance(new PublicKey(publicKey));
                setBalance(balance.toString());
                
                setIsConnected(true);
                setChainId(SOLANA_NETWORK);
                
                toast({
                    title: "Wallet Connected",
                    description: `Connected to Phantom wallet: ${publicKey.slice(0, 6)}...${publicKey.slice(-4)}`,
                });
            } else {
                const provider = getProvider();
                const signer = await provider.getSigner();
                const address = await signer.getAddress();
                setAddress(address);
                
                // Get balance
                const balance = await provider.getBalance(address);
                setBalance(ethers.formatEther(balance));
                
                // Get chain ID
                const network = await provider.getNetwork();
                setChainId(network.chainId.toString());
                
                setIsConnected(true);
                
                toast({
                    title: "Wallet Connected",
                    description: `Connected to MetaMask: ${address.slice(0, 6)}...${address.slice(-4)}`,
                });
            }
        } catch (error) {
            console.error('Failed to connect wallet:', error);
            toast({
                title: "Connection Failed",
                description: error instanceof Error ? error.message : "Failed to connect wallet",
                variant: "destructive",
            });
        }
    };

    const disconnect = async () => {
        try {
            if (chain === 'solana') {
                const provider = getProvider();
                await provider.disconnect();
            }
            // For MetaMask, we just clear the state
            
            setIsConnected(false);
            setAddress(null);
            setBalance(null);
            setChainId(null);
            
            toast({
                title: "Wallet Disconnected",
                description: "Successfully disconnected wallet",
            });
        } catch (error) {
            console.error('Failed to disconnect wallet:', error);
            toast({
                title: "Disconnection Failed",
                description: error instanceof Error ? error.message : "Failed to disconnect wallet",
                variant: "destructive",
            });
        }
    };

    const switchChain = async (newChain: ChainType) => {
        try {
            // Disconnect from current chain first
            if (isConnected) {
                await disconnect();
            }
            
            setChain(newChain);
            
            // Reconnect to new chain
            if (isConnected) {
                await connect();
            }
        } catch (error) {
            console.error('Failed to switch chain:', error);
            toast({
                title: "Chain Switch Failed",
                description: error instanceof Error ? error.message : "Failed to switch chain",
                variant: "destructive",
            });
        }
    };

    const signAndSendTransaction = async (
        transaction: VersionedTransaction | ethers.Transaction
    ): Promise<string> => {
        try {
            if (chain === 'solana') {
                const provider = getProvider();
                const signed = await provider.signAndSendTransaction(transaction as VersionedTransaction);
                await solanaConnection.confirmTransaction(signed.signature);
                return signed.signature;
            } else {
                const provider = getProvider();
                const signer = await provider.getSigner();
                const tx = await signer.sendTransaction(transaction as ethers.Transaction);
                await tx.wait();
                return tx.hash;
            }
        } catch (error) {
            console.error('Transaction failed:', error);
            throw error;
        }
    };

    // Handle account changes
    useEffect(() => {
        if (!isConnected) return;

        if (chain === 'solana') {
            const provider = (window as any).solana;
            provider?.on('accountChanged', async () => {
                await disconnect();
                await connect();
            });
        } else {
            const provider = (window as any).ethereum;
            provider?.on('accountsChanged', async () => {
                await disconnect();
                await connect();
            });
            provider?.on('chainChanged', async () => {
                await disconnect();
                await connect();
            });
        }

        return () => {
            if (chain === 'solana') {
                const provider = (window as any).solana;
                provider?.removeAllListeners();
            } else {
                const provider = (window as any).ethereum;
                provider?.removeAllListeners();
            }
        };
    }, [chain, isConnected]);

    const value = {
        isConnected,
        address,
        chainId,
        balance,
        chain,
        connect,
        disconnect,
        switchChain,
        signAndSendTransaction,
    };

    return (
        <WalletContext.Provider value={value}>
            {children}
        </WalletContext.Provider>
    );
};