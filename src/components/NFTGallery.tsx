import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useAccount } from 'wagmi';
import { Card, CardContent, CardHeader } from './ui/card';
import { Skeleton } from './ui/skeleton';
import { Button } from './ui/button';

interface NFT {
  id: string;
  name: string;
  description: string;
  image: string;
  attributes: Array<{ trait_type: string; value: string }>;
}

export const NFTGallery: React.FC = () => {
  const { address } = useAccount();
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNFTs = async () => {
      if (!address) return;
      try {
        setLoading(true);
        // TODO: Replace with your actual NFT fetching logic
        const response = await fetch(`/api/nfts/${address}`);
        const data = await response.json();
        setNfts(data);
      } catch (error) {
        console.error('Error fetching NFTs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNFTs();
  }, [address]);

  if (!address) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">Please connect your wallet to view your NFTs</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="h-[300px]" />
            <CardContent className="p-4">
              <Skeleton className="h-4 w-[250px] mb-2" />
              <Skeleton className="h-4 w-[200px]" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (nfts.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No NFTs found in your collection</p>
        <Button
          className="mt-4"
          onClick={() => window.location.href = '/mint'}
        >
          Mint Your First NFT
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {nfts.map((nft) => (
        <Card key={nft.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="relative h-[300px]">
            <Image
              src={nft.image}
              alt={nft.name}
              fill
              className="object-cover"
            />
          </div>
          <CardHeader className="p-4">
            <h3 className="text-lg font-semibold">{nft.name}</h3>
            <p className="text-sm text-gray-500">{nft.description}</p>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="grid grid-cols-2 gap-2">
              {nft.attributes.map((attr, index) => (
                <div key={index} className="bg-gray-100 p-2 rounded">
                  <p className="text-xs font-medium">{attr.trait_type}</p>
                  <p className="text-sm">{attr.value}</p>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => window.location.href = `/nft/${nft.id}`}
            >
              View Details
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default NFTGallery;