'use client';

import { useAppKit, useAppKitAccount } from '@reown/appkit/react';

export default function WalletTest() {
  const { open, close } = useAppKit();
  const { isConnected, address } = useAppKitAccount();

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Wallet Test</h2>
      <button
        onClick={() => isConnected ? close() : open()}
        className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
      >
        {isConnected ? 'Disconnect' : 'Connect Wallet'}
      </button>
      {address && (
        <p className="mt-4">Connected: {address}</p>
      )}
    </div>
  );
} 