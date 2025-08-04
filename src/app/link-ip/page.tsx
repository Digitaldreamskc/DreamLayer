'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import AnimatedBackground from '@/components/AnimatedBackground';
import { showToast } from '@/utils/toast';
import Providers from '../providers';
import { supabase } from '@/lib/supabaseClient';
import { useAccount } from 'wagmi';

export default function LinkIPPage() {
  const router = useRouter();
  const { address } = useAccount();
  
  const [tokenId, setTokenId] = useState('');
  const [contractAddress, setContractAddress] = useState('');
  const [ipfsUrl, setIpfsUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) {
      setError('Please connect your wallet first');
      return;
    }

    if (!tokenId || !contractAddress) {
      setError('Please fill in all required fields');
      return;
    }

    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      // Log the linked IP to Supabase
      const { error: supabaseError } = await supabase
        .from('ip_assets')
        .insert([
          {
            asset_id: tokenId,
            title: `Linked IP Asset #${tokenId}`,
            description: 'Externally linked IP asset',
            contract_address: contractAddress,
            ipfs_url: ipfsUrl || null,
            owner_address: address,
            created_at: new Date().toISOString(),
            is_linked: true
          }
        ]);

      if (supabaseError) throw supabaseError;
      
      setSuccess('IP Asset successfully linked to your account!');
      showToast.success('IP Linked', 'The IP asset has been linked to your account');
      
      // Clear form after successful submission
      setTokenId('');
      setContractAddress('');
      setIpfsUrl('');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to link IP asset';
      setError(errorMessage);
      showToast.error('Link Failed', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Providers>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 relative overflow-hidden">
        <AnimatedBackground />
        <Navbar />
        
        <main className="pt-20 relative z-10">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-5xl font-bold mb-8 text-white text-center">Link Existing IP</h1>
            
            <div className="max-w-2xl mx-auto bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-white">Token ID *</label>
                  <input
                    type="text"
                    value={tokenId}
                    onChange={(e) => setTokenId(e.target.value)}
                    placeholder="Enter token ID"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/[0.05] text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-white">Contract Address *</label>
                  <input
                    type="text"
                    value={contractAddress}
                    onChange={(e) => setContractAddress(e.target.value)}
                    placeholder="Enter contract address"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/[0.05] text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-white">IPFS URL (Optional)</label>
                  <input
                    type="text"
                    value={ipfsUrl}
                    onChange={(e) => setIpfsUrl(e.target.value)}
                    placeholder="ipfs://..."
                    className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/[0.05] text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {error && (
                  <div className="p-4 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-sm">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="p-4 rounded-xl bg-green-500/20 border border-green-500/30 text-green-300 text-sm">
                    {success}
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-90 text-white py-4 rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </div>
                  ) : 'Link IP Asset'}
                </button>
                
                <div className="pt-4 border-t border-white/10">
                  <button 
                    type="button"
                    onClick={() => router.push('/vision')}
                    className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-semibold transition-all"
                  >
                    Back to Vision
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </Providers>
  );
}
