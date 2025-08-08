'use client';

import { createContext, useContext } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { ethers } from 'ethers';
import { useToast } from '@/components/ui/use-toast';

export interface WalletContextType {
    isConnected: boolean;
    address: string | null;
    chainId: string | null;
    balance: string | null;
    connect: () => Promise<void>;
    disconnect: () => Promise<void>;
    signAndSendTransaction: (tx: ethers.providers.TransactionRequest) => Promise<string>;
}

const WalletContext = createContext<WalletContextType | null>(null);

export const useWallet = () => {
    const context = useContext(WalletContext);
    if (!context) {
        throw new Error('useWallet must be used within a WalletProvider');
    }
    return context;
};

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
    const { login, logout, user, authenticated } = usePrivy();
    const { wallets } = useWallets();
    const { toast } = useToast();

    const embeddedWallet = wallets.find((w) => w.walletClientType === 'privy');

    const isConnected = authenticated && !!embeddedWallet?.address;
    const address = embeddedWallet?.address || null;
    const chainId = embeddedWallet?.chainId?.toString() || null;

    const connect = async () => {
        try {
            if (!authenticated) {
                await login();
                toast({ title: 'Connected', description: 'Wallet connected via Privy.' });
            }
        } catch (error) {
            console.error('Privy login failed:', error);
            toast({
                title: 'Connection Failed',
                description: error instanceof Error ? error.message : 'Login error',
                variant: 'destructive',
            });
        }
    };

    const disconnect = async () => {
        try {
            await logout();
            toast({ title: 'Disconnected', description: 'Wallet disconnected.' });
        } catch (error) {
            console.error('Privy logout failed:', error);
            toast({
                title: 'Disconnection Failed',
                description: error instanceof Error ? error.message : 'Logout error',
                variant: 'destructive',
            });
        }
    };

    const signAndSendTransaction = async (
        tx: ethers.providers.TransactionRequest
    ): Promise<string> => {
        try {
            if (!embeddedWallet?.ethereumProvider) throw new Error('No wallet provider found');

            const provider = new ethers.providers.Web3Provider(embeddedWallet.ethereumProvider);
            const signer = await provider.getSigner();
            const sentTx = await signer.sendTransaction(tx);
            await sentTx.wait();
            return sentTx.hash;
        } catch (error) {
            console.error('Transaction failed:', error);
            toast({
                title: 'Transaction Error',
                description: error instanceof Error ? error.message : 'Failed to send transaction',
                variant: 'destructive',
            });
            throw error;
        }
    };

    const value: WalletContextType = {
        isConnected,
        address,
        chainId,
        balance: null,
        connect,
        disconnect,
        signAndSendTransaction,
    };

    return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};
