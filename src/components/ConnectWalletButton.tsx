'use client';

import { useState } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected, coinbaseWallet, walletConnect } from 'wagmi/connectors';
import { Wallet } from 'lucide-react';
import { 
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function ConnectWalletButton() {
    const { address, isConnected } = useAccount();
    const { connect, connectors, isPending, error } = useConnect();
    const { disconnect } = useDisconnect();
    const [open, setOpen] = useState(false);

    // Available connectors setup
    const availableConnectors = [
        {
            id: 'injected',
            name: 'Browser Wallet',
            description: 'Connect to your MetaMask or other browser extension wallet',
            icon: '🦊',
            connector: injected
        },
        {
            id: 'walletConnect',
            name: 'WalletConnect',
            description: 'Connect with your mobile wallet using WalletConnect',
            icon: '📱',
            connector: walletConnect
        },
        {
            id: 'coinbaseWallet',
            name: 'Coinbase Wallet',
            description: 'Connect to your Coinbase Wallet',
            icon: '🔷',
            connector: coinbaseWallet
        }
    ];

    const handleConnect = (connectorFn) => {
        connect({ connector: connectorFn() });
        setOpen(false);
    };

    return isConnected && address ? (
        <button
            onClick={() => disconnect()}
            className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white flex items-center gap-2"
        >
            <Wallet size={16} />
            {address.slice(0, 6)}...{address.slice(-4)}
        </button>
    ) : (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:opacity-90 transition-all flex items-center gap-2"
                >
                    <Wallet size={16} />
                    Connect Wallet
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Connect your wallet</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    {error && (
                        <div className="text-red-500 text-sm p-2 bg-red-100/10 rounded-md">
                            {error.message || "Failed to connect wallet"}
                        </div>
                    )}
                    
                    <div className="grid gap-4">
                        {availableConnectors.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => handleConnect(item.connector)}
                                disabled={isPending}
                                className="flex items-center gap-3 p-4 border border-white/10 rounded-lg bg-white/5 hover:bg-white/10 transition-all text-left"
                            >
                                <div className="text-2xl">{item.icon}</div>
                                <div>
                                    <div className="font-medium">{item.name}</div>
                                    <div className="text-sm text-white/60">{item.description}</div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
