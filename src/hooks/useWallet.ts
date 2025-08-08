'use client';

import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useAccount, useBalance, usePublicClient, useWalletClient } from 'wagmi';
import { base } from 'viem/chains';
import { useToast } from '@/components/ui/use-toast';
import { formatEther } from 'viem';

export interface WalletContextType {
    isConnected: boolean;
    address: string | null;
    chainId: number | null;
    balance: string | null;
    isLoading: boolean;
    connect: () => Promise<void>;
    disconnect: () => Promise<void>;
    switchToBase: () => Promise<void>;
    sendTransaction: (transaction: any) => Promise<string>;
}

export const useWallet = (): WalletContextType => {
    const { login, logout, ready, authenticated } = usePrivy();
    const { wallets } = useWallets();
    const { address, isConnected, chainId } = useAccount();
    const { data: walletClient } = useWalletClient();
    const publicClient = usePublicClient();
    const { toast } = useToast();
    
    const { 
        data: balanceData, 
        isLoading: balanceLoading 
    } = useBalance({
        address: address,
        chainId: base.id,
    });

    const connect = async () => {
        try {
            if (!ready) return;
            await login();
            
            toast({
                title: "Wallet Connected",
                description: "Successfully connected to your wallet",
            });
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
            await logout();
            
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

    const switchToBase = async () => {
        try {
            if (!wallets.length) {
                throw new Error('No wallet connected');
            }

            const wallet = wallets[0];
            
            // Switch to Base network
            await wallet.switchChain(base.id);
            
            toast({
                title: "Network Switched",
                description: "Successfully switched to Base network",
            });
        } catch (error) {
            console.error('Failed to switch network:', error);
            toast({
                title: "Network Switch Failed",
                description: error instanceof Error ? error.message : "Failed to switch network",
                variant: "destructive",
            });
        }
    };

    const sendTransaction = async (transaction: any): Promise<string> => {
        try {
            if (!walletClient) {
                throw new Error('Wallet not connected');
            }

            const hash = await walletClient.sendTransaction(transaction);
            
            // Wait for transaction confirmation
            if (publicClient) {
                await publicClient.waitForTransactionReceipt({ hash });
            }
            
            toast({
                title: "Transaction Sent",
                description: `Transaction hash: ${hash.slice(0, 10)}...`,
            });
            
            return hash;
        } catch (error) {
            console.error('Transaction failed:', error);
            toast({
                title: "Transaction Failed",
                description: error instanceof Error ? error.message : "Transaction failed",
                variant: "destructive",
            });
            throw error;
        }
    };

    return {
        isConnected: authenticated && isConnected,
        address: address || null,
        chainId: chainId || null,
        balance: balanceData ? formatEther(balanceData.value) : null,
        isLoading: !ready || balanceLoading,
        connect,
        disconnect,
        switchToBase,
        sendTransaction,
    };
};