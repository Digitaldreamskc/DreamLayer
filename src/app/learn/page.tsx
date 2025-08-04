"use client";

import Navbar from "@/components/Navbar";
import AnimatedBackground from "@/components/AnimatedBackground";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpenCheck, GraduationCap, Lightbulb, Sparkles } from "lucide-react";

export default function LearnPage() {
    const topics = [
        {
            title: "What is Web3?",
            icon: <Lightbulb className="h-6 w-6 text-yellow-400" />,
            description: "Understand the shift from Web2 to Web3 and why decentralized identity matters.",
        },
        {
            title: "Minting Your First NFT",
            icon: <Sparkles className="h-6 w-6 text-pink-400" />,
            description: "Step-by-step guide to mint a dynamic NFT using DreamLayer tools.",
        },
        {
            title: "What is DYOR?",
            icon: <BookOpenCheck className="h-6 w-6 text-blue-400" />,
            description: "Learn how to verify information, explore protocols, and stay safe in crypto.",
        },
        {
            title: "Intro to Story Protocol",
            icon: <GraduationCap className="h-6 w-6 text-green-400" />,
            description: "Discover how to register and protect IP using open onchain standards.",
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 relative overflow-hidden">
            <AnimatedBackground />
            <Navbar />

            <main className="pt-24 px-6 relative z-10">
                <div className="max-w-6xl mx-auto text-center mb-16">
                    <h1 className="text-5xl md:text-6xl font-extralight text-white mb-4 tracking-tight">
                        Learn Web3 with DreamLayer
                    </h1>
                    <p className="text-white/70 text-lg md:text-xl max-w-3xl mx-auto">
                        Explore tutorials, guides, and interactive quests to build your skills and protect your digital future.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {topics.map((topic, index) => (
                        <Card
                            key={index}
                            className="bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300"
                        >
                            <CardContent className="p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    {topic.icon}
                                    <h3 className="text-xl text-white font-semibold">{topic.title}</h3>
                                </div>
                                <p className="text-white/70 text-sm">{topic.description}</p>
                                <Button className="mt-4" variant="outline" size="sm">
                                    Start Lesson
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </main>
        </div>
    );
}
