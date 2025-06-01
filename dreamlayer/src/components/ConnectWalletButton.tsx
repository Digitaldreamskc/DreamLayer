'use client';

import { useAccount, useDisconnect } from 'wagmi';
import { useState } from 'react';

export default function ConnectWalletButton() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleDisconnect = async () => {
    try {
      disconnect();
    } catch (error) {
      console.error("Failed to disconnect wallet:", error);
    }
  };

  // Format the address for display
  const displayAddress = address 
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : '';

  return (
    <div className="flex items-center space-x-2">
      {isConnected ? (
        <>
          <span className="text-sm text-white">{displayAddress}</span>
          <button
            onClick={handleDisconnect}
            className="px-3 py-1 text-xs font-medium bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Disconnect
          </button>
        </>
      ) : (
        <appkit-button />
      )}
    </div>
  );
}
