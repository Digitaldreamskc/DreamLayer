'use client';

import { useChainId, useSwitchChain } from 'wagmi';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AnimatedBackground from '@/components/AnimatedBackground';
import Navbar from '@/components/Navbar';

const STORY_CHAIN_ID = 1315;

export default function MintPage() {
    const router = useRouter();
    const chainId = useChainId();
    const { switchChain } = useSwitchChain();

    useEffect(() => {
        if (chainId !== STORY_CHAIN_ID) {
            console.warn('Not connected to Story Protocol chain');
        }
    }, [chainId]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 relative overflow-hidden">
            <AnimatedBackground />
            <Navbar />
            <main className="pt-20 relative z-10">
                <div className="container mx-auto px-4 py-16">
                    <h1 className="text-5xl font-bold text-white text-center mb-10">Welcome to DreamLayer</h1>

                    {chainId !== STORY_CHAIN_ID && (
                        <div className="flex justify-center mb-8">
                            <button
                                onClick={async () => {
                                    try {
                                        if (!switchChain) {
                                            toast.error("switchChain is not available");
                                            return;
                                        }
                                        await switchChain({ chainId: STORY_CHAIN_ID });
                                        toast.success("Switched to Story Protocol Network");
                                    } catch (err) {
                                        console.error("Failed to switch network", err);
                                        toast.error("Failed to switch network");
                                    }
                                }}
                                className="px-6 py-3 rounded-xl bg-yellow-500 text-black font-semibold hover:bg-yellow-400 transition"
                            >
                                Switch to Story Protocol Network
                            </button>
                        </div>
                    )}


                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        <div
                            onClick={() => router.push('/mint/create')}
                            className="cursor-pointer bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl p-8 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
                        >
                            <h2 className="text-2xl font-bold text-white mb-2">Mint Dynamic NFT</h2>
                            <p className="text-white/80">Create a dynamic NFT using the ERC-7160 standard on Base. Customize metadata, media, and more.</p>
                        </div>

                        <div
                            onClick={() => router.push('/mint/register')}
                            className="cursor-pointer bg-gradient-to-br from-blue-600 to-cyan-600 rounded-3xl p-8 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
                        >
                            <h2 className="text-2xl font-bold text-white mb-2">Register IP on Story Protocol</h2>
                            <p className="text-white/80">Once you've minted your NFT, register it as IP on the Story Protocol network for protection and licensing.</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
