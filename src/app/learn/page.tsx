"use client";

import ParticleBackground from '@/components/ParticleBackground';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LearnPage() {
    const { isConnected } = useAccount();
    const router = useRouter();

    // Redirect to home if not connected
    useEffect(() => {
        if (!isConnected) {
            router.push('/');
        }
    }, [isConnected, router]);

    if (!isConnected) {
        return null;
    }

    const topics = [
        {
            title: "What is Web3?",
            description: "Understand the shift from Web2 to Web3 and why decentralized identity matters.",
        },
        {
            title: "Minting Your First NFT",
            description: "Step-by-step guide to mint a dynamic NFT using DreamLayer tools.",
        },
        {
            title: "What is DYOR?",
            description: "Learn how to verify information, explore protocols, and stay safe in crypto.",
        },
        {
            title: "Intro to Story Protocol",
            description: "Discover how to register and protect IP using open onchain standards.",
        },
    ];

    return (
        <div className="relative min-h-screen">
            <ParticleBackground />
            
            <section className="relative z-10 py-16 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-thin text-white tracking-tight leading-none mb-8">
                            Learn Web3
                        </h1>
                        <div className="w-32 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent mx-auto animate-pulse mb-8" />
                        <p className="text-xl md:text-2xl text-white/70 font-light max-w-3xl mx-auto leading-relaxed">
                            Explore tutorials, guides, and interactive quests to build your skills and protect your digital future.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {topics.map((topic, index) => (
                            <Card
                                key={index}
                                className="group relative overflow-hidden rounded-3xl bg-white/[0.02] backdrop-blur-xl border border-white/10 hover:bg-white/[0.04] hover:border-white/20 transition-all duration-500"
                            >
                                <CardContent className="p-8">
                                    <div className="mb-4">
                                        <h3 className="text-2xl font-light text-white tracking-wide">{topic.title}</h3>
                                    </div>
                                    <p className="text-white/60 text-sm mb-6 font-light">{topic.description}</p>
                                    <Button 
                                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-sm font-light tracking-wider"
                                    >
                                        Start Lesson
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}