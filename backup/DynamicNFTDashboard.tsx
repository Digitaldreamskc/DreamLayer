'use client';

import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface NFTAttribute {
  trait_type: string;
  value: string;
}

interface DynamicNFTMetadata {
  tokenId: string;
  name: string;
  description: string;
  image: string;
  attributes: NFTAttribute[];
}

interface DynamicNFTDashboardProps {
  filterType?: 'all' | 'dynamic' | 'image';
}

export function DynamicNFTDashboard({ filterType = 'all' }: DynamicNFTDashboardProps) {
  const { address } = useAccount();
  const [nfts, setNfts] = useState<DynamicNFTMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNFTs = async () => {
      if (!address) return;

      try {
        setLoading(true);
        setError(null);
        
        // In development, show test NFT
        if (process.env.NODE_ENV === 'development') {
          const mockData: DynamicNFTMetadata[] = [
            {
              tokenId: '1',
              name: 'Test NFT 1',
              description: 'Test Description 1',
              image: 'https://via.placeholder.com/150',
              attributes: [{ trait_type: 'Type', value: 'Test' }]
            }
          ];
          setNfts(mockData);
        } else {
          // TODO: Replace with actual API call to fetch NFTs
          setNfts([]);
        }
      } catch (err) {
        console.error('Error fetching NFTs:', err);
        setError('Failed to fetch NFTs');
        setNfts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNFTs();
  }, [address, filterType]);

  if (!address) {
    return (
      <div className="text-center p-6">
        <p className="text-muted-foreground">Connect your wallet to view NFTs</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-6">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!nfts || nfts.length === 0) {
    return (
      <div className="text-center p-6">
        <p className="text-muted-foreground">No NFTs found</p>
      </div>
    );
  }

  return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-2xl p-6 text-white shadow-xl">
                <h2 className="text-lg font-semibold mb-2">Recent Activity</h2>
                <p className="text-sm text-gray-400">Coming soon: wallet mints, NFT updates, etc.</p>
            </div>
            <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-2xl p-6 text-white shadow-xl">
                <h2 className="text-lg font-semibold mb-2">Quick Mint</h2>
                <p className="text-sm text-gray-400">One-click access to the NFT minter.</p>
            </div>
            <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-2xl p-6 text-white shadow-xl">
                <h2 className="text-lg font-semibold mb-2">Learn & Explore</h2>
                <p className="text-sm text-gray-400">Tutorials, FAQs, and DYOR quests coming soon.</p>
            </div>
        </div>
