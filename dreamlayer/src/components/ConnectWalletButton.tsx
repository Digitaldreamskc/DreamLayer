"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { useEffect, useState } from "react";

export default function ConnectWalletButton() {
    const { address, isConnected } = useAccount();
    const { connect, connectors } = useConnect();
    const { disconnect } = useDisconnect();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Prevent hydration mismatch by showing nothing until mounted
    if (!mounted) {
        return (
            <div className="px-6 py-3 text-sm font-light bg-gradient-to-r from-blue-500/80 to-purple-500/80 backdrop-blur-sm border border-white/20 text-white rounded-lg opacity-50">
                Loading...
            </div>
        );
    }

    if (isConnected) {
        return (
            <div className="flex items-center gap-3">
                <span className="text-sm text-white/80 font-light">
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                </span>
                <button
                    onClick={() => disconnect()}
                    className="px-4 py-2 text-sm font-light bg-red-500/80 backdrop-blur-sm border border-white/20 text-white rounded-lg hover:bg-red-500 transition-all duration-300"
                >
                    Disconnect
                </button>
            </div>
        );
    }

    return (
        <div className="flex gap-2">
            {connectors.map((connector) => (
                <button
                    key={connector.uid}
                    onClick={() => connect({ connector })}
                    className="px-6 py-3 text-sm font-light bg-gradient-to-r from-blue-500/80 to-purple-500/80 backdrop-blur-sm border border-white/20 text-white rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all duration-300"
                >
                    Connect {connector.name}
                </button>
            ))}
        </div>
    );
}