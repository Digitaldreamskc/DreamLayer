"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface NFTCardProps {
    id: string;
    name: string;
    attributes: { name: string; value: number }[];
    lastUpdate: string;
}

const mockNFTs: NFTCardProps[] = [
    {
        id: "token-001",
        name: "Digital Dreamscape #1",
        attributes: [
            { name: "Rarity", value: 85 },
            { name: "Power", value: 72 },
            { name: "Charisma", value: 90 },
        ],
        lastUpdate: "2 days ago",
    },
    {
        id: "token-002",
        name: "Cosmic Explorer #42",
        attributes: [
            { name: "Speed", value: 95 },
            { name: "Intelligence", value: 88 },
            { name: "Luck", value: 65 },
        ],
        lastUpdate: "1 week ago",
    },
    {
        id: "token-003",
        name: "Neon Genesis #7",
        attributes: [
            { name: "Strength", value: 78 },
            { name: "Wisdom", value: 92 },
            { name: "Agility", value: 83 },
        ],
        lastUpdate: "3 days ago",
    },
];

export default function DynamicNFTDashboard() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockNFTs.map((nft, index) => {
                const gradientStyles = [
                    "from-purple-600 to-pink-600",
                    "from-blue-600 to-cyan-600",
                    "from-emerald-600 to-teal-600",
                ];
                const gradient = gradientStyles[index % gradientStyles.length];

                return (
                    <div
                        key={nft.id}
                        className="group relative overflow-hidden rounded-3xl bg-white/[0.02] backdrop-blur-xl border border-white/10 p-8 transition-all duration-500 hover:bg-white/[0.04] hover:border-white/20"
                    >
                        <div
                            className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                        />
                        <div className="relative z-10">
                            <div className="w-12 h-12 mb-4 bg-gradient-to-r rounded-2xl flex items-center justify-center shadow-xl"
                                style={{ backgroundImage: `linear-gradient(to right, var(--tw-gradient-from), var(--tw-gradient-to))` }}
                            >
                                <div className="w-6 h-6 bg-white/20 rounded-lg" />
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-3 tracking-wide">{nft.name}</h3>
                            <p className="text-white/60 text-sm mb-4 leading-relaxed">Updated {nft.lastUpdate}</p>

                            <div className="space-y-2 text-sm text-white/70 mb-6">
                                {nft.attributes.map((attr, i) => (
                                    <div key={i} className="flex justify-between">
                                        <span className="text-white/40">{attr.name}</span>
                                        <span className="font-mono">{attr.value} / 100</span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 flex justify-between">
                                <Button variant="outline" size="sm">
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    View
                                </Button>
                                <Button size="sm" className={`bg-gradient-to-r ${gradient} text-white hover:opacity-90`}>
                                    Update
                                </Button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

