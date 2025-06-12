'use client';

import { NFTMinter } from '@/components/NFTMinter';
import { Card } from '@/components/ui/card';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CreateNFTPage() {
  const { isConnected } = useAccount();
  const router = useRouter();

  // Redirect to Creators Studio if not connected
  useEffect(() => {
    if (!isConnected) {
      router.push('/creators-studio');
    }
  }, [isConnected, router]);

  if (!isConnected) {
    return null;
  }

  return (
    <div className="ml-64 container mx-auto px-8 py-8">
      <div className="mb-8 flex items-center gap-4">
        <Link 
          href="/creators-studio" 
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm font-light"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Creators Studio
        </Link>
      </div>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-thin text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 mb-8">
          Create New NFT
        </h1>

        <Card className="backdrop-blur-md bg-black/30 border border-white/10 p-8">
          <NFTMinter />
        </Card>

        <div className="mt-8 text-sm text-white/50 text-center font-light">
          <p>Need help? Check out our <Link href="/learn" className="text-purple-400 hover:text-purple-300">tutorials</Link> or <Link href="/support" className="text-purple-400 hover:text-purple-300">contact support</Link>.</p>
        </div>
      </div>
    </div>
  );
}