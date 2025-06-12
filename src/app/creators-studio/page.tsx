'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAccount } from 'wagmi';
import { DynamicNFTDashboard } from '@/components/DynamicNFTDashboard';
import ConnectWalletButton from '@/components/ConnectWalletButton';
import Link from 'next/link';

export default function CreatorsStudioPage() {
  const { isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState<'all' | 'dynamic' | 'image'>('all');

  // Handle hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Return null on server-side and first render
  }

  if (!isConnected) {
    return (
      <div className="ml-64 container mx-auto px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
            Creators Studio
          </h1>
          <ConnectWalletButton />
        </div>
        <Card className="text-center p-8 backdrop-blur-md bg-black/30 border border-white/10">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">Connect Your Wallet</h2>
            <p className="text-gray-300 mb-6">
              Connect your wallet to view your NFT collection and mint new tokens.
            </p>
            <ConnectWalletButton />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="ml-64 container mx-auto px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
          Creators Studio
        </h1>
        <ConnectWalletButton />
      </div>

      <div className="mb-8">
        <Tabs 
          defaultValue={filter} 
          className="w-full md:w-auto"
          onValueChange={(value) => setFilter(value as 'all' | 'dynamic' | 'image')}
        >
          <TabsList className="grid grid-cols-3 w-full md:w-[400px]">
            <TabsTrigger value="all">All NFTs</TabsTrigger>
            <TabsTrigger value="dynamic">Dynamic</TabsTrigger>
            <TabsTrigger value="image">Images</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Card className="backdrop-blur-md bg-black/30 border border-white/10">
        <CardContent className="p-6">
          <DynamicNFTDashboard filterType={filter} />
        </CardContent>
      </Card>

      <div className="mt-8 text-center">
        <Button variant="default" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
          <Link href="/creators-studio/create" className="text-sm font-light tracking-wider">
            Create New NFT
          </Link>
        </Button>
      </div>
    </div>
  );
}