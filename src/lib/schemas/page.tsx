'use client';

import * as React from 'react';
import { usePrivy } from '@privy-io/react-auth';
import Sidebar from '@/components/sidebar';
import AnimatedBackground from '@/components/AnimatedBackground';
import { Button } from '@/components/ui/button';

const mockNFTs = [
  {
    id: 1,
    name: 'Digital Dreamscape #1',
    updated: '2 days ago',
    attributes: [
      { label: 'Rarity', value: '85 / 100' },
      { label: 'Power', value: '72 / 100' },
      { label: 'Charisma', value: '90 / 100' }
    ]
  },
  {
    id: 2,
    name: 'Cosmic Explorer #42',
    updated: '1 week ago',
    attributes: [
      { label: 'Speed', value: '95 / 100' },
      { label: 'Intelligence', value: '88 / 100' },
      { label: 'Luck', value: '65 / 100' }
    ]
  }
];

export default function NFTStudioPage() {
  const { login, logout, authenticated, user } = usePrivy();

  return (
    <div className="relative min-h-screen flex bg-black text-white">
      <AnimatedBackground />
      <Sidebar />

      <main className="flex-1 p-8 z-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold">Creators Studio</h1>
            <p className="text-white/70 mt-1">Create and manage your dynamic NFTs</p>
          </div>
          {!authenticated ? (
            <Button onClick={() => login()}>Connect Wallet</Button>
          ) : (
            <p className="text-sm text-white/60">Connected: {user?.wallet?.address}</p>
          )}
        </div>

        {/* Mint Form */}
        <section className="mb-10 p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg shadow-xl">
          <h2 className="text-2xl font-semibold mb-4">Mint a New NFT</h2>
          <form className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Enter NFT name"
              className="bg-white/10 p-3 rounded-lg border border-white/20 placeholder-white/60"
            />
            <input
              type="text"
              placeholder="Trait A"
              className="bg-white/10 p-3 rounded-lg border border-white/20 placeholder-white/60"
            />
            <input
              type="text"
              placeholder="Trait B"
              className="bg-white/10 p-3 rounded-lg border border-white/20 placeholder-white/60"
            />
            <input
              type="file"
              className="bg-white/10 p-3 rounded-lg border border-white/20 text-white"
            />
            <button
              type="submit"
              className="col-span-full px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition text-white font-semibold mt-2"
            >
              Mint NFT
            </button>
          </form>
        </section>

        {/* Collection */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Your NFT Collection</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {mockNFTs.map((nft) => (
              <div
                key={nft.id}
                className="rounded-2xl bg-white/10 backdrop-blur-md p-5 border border-white/20 shadow-xl hover:scale-[1.01] transition-transform"
              >
                <h3 className="text-lg font-bold mb-1">{nft.name}</h3>
                <p className="text-sm text-white/60 mb-3">Updated {nft.updated}</p>
                <ul className="text-sm space-y-1 mb-4">
                  {nft.attributes.map((attr, i) => (
                    <li key={i} className="flex justify-between">
                      <span>{attr.label}</span>
                      <span>{attr.value}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex justify-between">
                  <button className="text-sm px-4 py-2 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20">
                    View
                  </button>
                  <button className="text-sm px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                    Update
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
