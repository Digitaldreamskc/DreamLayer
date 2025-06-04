'use client';

import React from 'react';
import ConnectWallet from '@/components/ConnectWallet';

export default function CreateToken() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Create New Token</h1>
                <ConnectWallet />
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <form className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Token Name</label>
                        <input
                            type="text"
                            className="w-full bg-white/10 rounded-lg border border-white/20 p-3"
                            placeholder="Enter token name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Token Symbol</label>
                        <input
                            type="text"
                            className="w-full bg-white/10 rounded-lg border border-white/20 p-3"
                            placeholder="e.g., BTC"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Initial Supply</label>
                        <input
                            type="number"
                            className="w-full bg-white/10 rounded-lg border border-white/20 p-3"
                            placeholder="Enter initial supply"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Description</label>
                        <textarea
                            className="w-full bg-white/10 rounded-lg border border-white/20 p-3"
                            rows={4}
                            placeholder="Enter token description"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:opacity-90 transition-all"
                    >
                        Create Token
                    </button>
                </form>
            </div>
        </div>
    );
}
