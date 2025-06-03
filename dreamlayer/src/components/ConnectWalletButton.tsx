'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { Wallet } from 'lucide-react';

export default function ConnectWallet() {
    const { address, isConnected } = useAccount();
    const { connect } = useConnect({
        connector: injected(),
    });
    const { disconnect } = useDisconnect();

    return isConnected && address ? (
        <button
            onClick={disconnect}
            className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white flex items-center gap-2"
        >
            <Wallet size={16} />
            {address.slice(0, 6)}...{address.slice(-4)}
        </button>
    ) : (
        <button
            onClick={() => connect()}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:opacity-90 transition-all flex items-center gap-2"
        >
            <Wallet size={16} />
            Connect Wallet
        </button>
    );
}
