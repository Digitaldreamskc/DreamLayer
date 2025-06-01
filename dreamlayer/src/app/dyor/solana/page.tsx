'use client';

import { useAccount } from 'wagmi';
import Navbar from '@/components/Navbar';
import ParticleBackground from '@/components/ParticleBackground';
import { Code, Zap, Trophy, Clock, BookOpen, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useProgress } from '@/hooks/useProgress';

const modules = [
    {
        id: 1,
        title: "Introduction to Solana",
        description: "Learn about Solana's architecture, key features, and why it's one of the fastest blockchains.",
        duration: "45 min",
        lessons: 5,
        difficulty: "Beginner",
        icon: <Code className="w-6 h-6" />,
        tags: ["Architecture", "Performance", "Features"],
        color: "from-purple-600 to-pink-600"
    },
    {
        id: 2,
        title: "Rust Fundamentals",
        description: "Master Rust programming language basics essential for Solana development.",
        duration: "2 hours",
        lessons: 8,
        difficulty: "Intermediate",
        icon: <Code className="w-6 h-6" />,
        tags: ["Rust", "Programming", "Basics"],
        color: "from-blue-600 to-cyan-600"
    },
    {
        id: 3,
        title: "Anchor Framework",
        description: "Build Solana programs using the Anchor framework for faster development.",
        duration: "3 hours",
        lessons: 10,
        difficulty: "Intermediate",
        icon: <Code className="w-6 h-6" />,
        tags: ["Anchor", "Smart Contracts", "Development"],
        color: "from-green-600 to-emerald-600"
    },
    {
        id: 4,
        title: "Smart Contract Development",
        description: "Create and deploy smart contracts on Solana with best practices.",
        duration: "4 hours",
        lessons: 12,
        difficulty: "Advanced",
        icon: <Code className="w-6 h-6" />,
        tags: ["Smart Contracts", "Deployment", "Security"],
        color: "from-orange-600 to-red-600"
    },
    {
        id: 5,
        title: "DeFi Integration",
        description: "Integrate with Solana DeFi protocols and build financial applications.",
        duration: "3 hours",
        lessons: 8,
        difficulty: "Advanced",
        icon: <Zap className="w-6 h-6" />,
        tags: ["DeFi", "Integration", "Finance"],
        color: "from-yellow-600 to-orange-600"
    },
    {
        id: 6,
        title: "NFT Development",
        description: "Create and manage NFT collections on Solana using Metaplex.",
        duration: "2.5 hours",
        lessons: 7,
        difficulty: "Intermediate",
        icon: <Trophy className="w-6 h-6" />,
        tags: ["NFTs", "Metaplex", "Collections"],
        color: "from-pink-600 to-purple-600"
    }
];

export default function SolanaLearningPath() {
    const { address, isConnected } = useAccount();
    const { userProgress, loading, updateModuleProgress } = useProgress();

    const handleModuleClick = async (moduleId: number) => {
        if (!address) return;
        
        // Update progress when module is clicked
        await updateModuleProgress(
            'solana',
            moduleId.toString(),
            0, // Start at 0% if not already started
            false
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 relative overflow-hidden">
            <Navbar />
            <ParticleBackground />
            
            <main className="container mx-auto px-4 py-8 relative z-10">
                <div className="max-w-4xl mx-auto">
                    {/* Back Button */}
                    <Link 
                        href="/dyor"
                        className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Learning Paths
                    </Link>

                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-white mb-2">Solana Development</h1>
                        <p className="text-white/60">
                            Master Solana's high-performance blockchain. Learn Rust, Anchor, and build scalable dApps.
                        </p>
                    </div>

                    {/* Progress Overview */}
                    {isConnected && userProgress && (
                        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 mb-8">
                            <h2 className="text-xl font-semibold text-white mb-4">Your Progress</h2>
                            <div className="grid grid-cols-3 gap-6">
                                <div>
                                    <div className="text-white/60 text-sm mb-1">Overall Progress</div>
                                    <div className="text-2xl font-bold text-white">
                                        {Math.round(userProgress.paths['solana']?.overallProgress || 0)}%
                                    </div>
                                </div>
                                <div>
                                    <div className="text-white/60 text-sm mb-1">Completed Modules</div>
                                    <div className="text-2xl font-bold text-white">
                                        {Object.values(userProgress.paths['solana']?.modules || {})
                                            .filter(m => m.completed).length}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-white/60 text-sm mb-1">Total Modules</div>
                                    <div className="text-2xl font-bold text-white">{modules.length}</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Modules Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {modules.map((module) => {
                            const moduleProgress = userProgress?.paths['solana']?.modules[module.id.toString()];
                            const progress = moduleProgress?.progress || 0;
                            const completed = moduleProgress?.completed || false;
                            
                            return (
                                <Link
                                    key={module.id}
                                    href={`/dyor/solana/${module.id}`}
                                    onClick={() => handleModuleClick(module.id)}
                                    className="group"
                                >
                                    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300">
                                        <div className="flex items-start gap-4 mb-4">
                                            <div className={`p-3 rounded-xl bg-gradient-to-br ${module.color}`}>
                                                {module.icon}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-lg font-semibold text-white mb-1">{module.title}</h3>
                                                    {completed && (
                                                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                                                    )}
                                                </div>
                                                <p className="text-white/60 text-sm">{module.description}</p>
                                            </div>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="mb-4">
                                            <div className="flex justify-between text-sm font-mono mb-2">
                                                <span className="text-white/60">Progress</span>
                                                <span className="text-white font-semibold">{Math.round(progress)}%</span>
                                            </div>
                                            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full bg-gradient-to-r ${module.color} rounded-full transition-all duration-300`}
                                                    style={{ width: `${progress}%` }}
                                                />
                                            </div>
                                        </div>

                                        {/* Module Info */}
                                        <div className="grid grid-cols-3 gap-4 text-center mb-4">
                                            <div>
                                                <div className="text-white/60 text-sm">Duration</div>
                                                <div className="text-white font-semibold">{module.duration}</div>
                                            </div>
                                            <div>
                                                <div className="text-white/60 text-sm">Lessons</div>
                                                <div className="text-white font-semibold">{module.lessons}</div>
                                            </div>
                                            <div>
                                                <div className="text-white/60 text-sm">Level</div>
                                                <div className="text-white font-semibold">{module.difficulty}</div>
                                            </div>
                                        </div>

                                        {/* Tags */}
                                        <div className="flex flex-wrap gap-2">
                                            {module.tags.map((tag, index) => (
                                                <span 
                                                    key={index}
                                                    className="px-2 py-1 bg-white/10 rounded-full text-white/80 text-xs"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </main>
        </div>
    );
} 