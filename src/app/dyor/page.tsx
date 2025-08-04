'use client';

import { useAccount } from 'wagmi';
import Navbar from '@/components/Navbar';
import ParticleBackground from '@/components/ParticleBackground';
import { BookOpen, Code, Zap, Trophy, Clock, Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useProgress } from '@/hooks/useProgress';

const learningPaths = [
    {
        id: 'solana',
        title: "Solana Development",
        description: "Master Solana's high-performance blockchain. Learn Rust, Anchor, and build scalable dApps.",
        icon: <Code className="w-8 h-8" />,
        color: "from-purple-600 to-pink-600",
        stats: {
            modules: 12,
            builders: "1,847",
            projects: "89"
        },
        features: [
            "Rust & Anchor Framework",
            "Smart Contract Development",
            "DeFi & NFT Integration",
            "Validator Operations"
        ]
    },
    {
        id: 'base',
        title: "Base Development",
        description: "Build on Coinbase's L2 network. Create secure, scalable applications with EVM compatibility.",
        icon: <Zap className="w-8 h-8" />,
        color: "from-blue-600 to-cyan-600",
        stats: {
            modules: 8,
            builders: "1,000",
            projects: "67"
        },
        features: [
            "EVM Smart Contracts",
            "Layer 2 Scaling",
            "Cross-chain Integration",
            "Security Best Practices"
        ]
    }
];

const learningModules = [
    {
        id: 1,
        title: "Solana Development Bootcamp",
        description: "Build your first Solana program from scratch. Learn Rust basics, Anchor framework, and deploy to mainnet.",
        duration: "4 hours",
        lessons: 15,
        difficulty: "Intermediate",
        icon: <Code className="w-6 h-6" />,
        tags: ["Rust", "Anchor", "Smart Contracts"],
        color: "from-purple-600 to-pink-600"
    },
    {
        id: 2, 
        title: "DeFi Protocol Deep Dive",
        description: "Understand how AMMs, lending protocols, and yield farming work. Analyze real protocols like Jupiter and Raydium.",
        duration: "3.5 hours",
        lessons: 12,
        difficulty: "Advanced",
        icon: <Zap className="w-6 h-6" />,
        tags: ["DeFi", "AMM", "Liquidity"],
        color: "from-blue-600 to-cyan-600"
    },
    {
        id: 3,
        title: "NFT & Token Economics",
        description: "Create and launch your own SPL tokens and NFT collections. Learn tokenomics and market dynamics.",
        duration: "2.5 hours", 
        lessons: 10,
        difficulty: "Beginner",
        icon: <Trophy className="w-6 h-6" />,
        tags: ["NFTs", "Tokens", "Economics"],
        color: "from-green-600 to-emerald-600"
    },
    {
        id: 4,
        title: "Cross-Chain Bridge Architecture",
        description: "Explore how Wormhole and other bridges work. Build a simple cross-chain application.",
        duration: "3 hours",
        lessons: 8,
        difficulty: "Advanced",
        icon: <BookOpen className="w-6 h-6" />,
        tags: ["Cross-chain", "Wormhole", "Interoperability"],
        progress: 0,
        color: "from-orange-600 to-red-600"
    },
    {
        id: 5,
        title: "MEV & Arbitrage Strategies",
        description: "Learn Maximum Extractable Value concepts, arbitrage opportunities, and ethical MEV practices.",
        duration: "2 hours",
        lessons: 6,
        difficulty: "Expert",
        icon: <Zap className="w-6 h-6" />,
        tags: ["MEV", "Arbitrage", "Trading"],
        progress: 0,
        color: "from-yellow-600 to-orange-600"
    },
    {
        id: 6,
        title: "Solana Validator Operations",
        description: "Set up and operate a Solana validator. Understand staking, rewards, and network governance.",
        duration: "5 hours",
        lessons: 18,
        difficulty: "Expert",
        icon: <Users className="w-6 h-6" />,
        tags: ["Validator", "Staking", "Infrastructure"],
        progress: 0,
        color: "from-indigo-600 to-purple-600"
    }
];

const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
        case 'Beginner': return 'bg-green-500/20 text-green-300 border-green-500/30';
        case 'Intermediate': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
        case 'Advanced': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
        case 'Expert': return 'bg-red-500/20 text-red-300 border-red-500/30';
        default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
};

export default function DYORPage() {
    const { address, isConnected } = useAccount();
    const { userProgress, loading } = useProgress();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 relative overflow-hidden">
            <Navbar />
            <ParticleBackground />
            
            <main className="container mx-auto px-4 py-8 relative z-10">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold text-white mb-2">DYOR Learning Platform</h1>
                    <p className="text-white/60 mb-8">Master Web3 development with our comprehensive learning paths</p>

                    {/* Learning Paths */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                        {learningPaths.map((path) => {
                            const pathProgress = userProgress?.paths[path.id];
                            const progress = pathProgress?.overallProgress || 0;
                            
                            return (
                                <Link 
                                    key={path.id}
                                    href={`/dyor/${path.id}`}
                                    className="group"
                                >
                                    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300">
                                        <div className="flex items-start gap-4 mb-4">
                                            <div className={`p-3 rounded-xl bg-gradient-to-br ${path.color}`}>
                                                {path.icon}
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-semibold text-white mb-1">{path.title}</h2>
                                                <p className="text-white/60 text-sm">{path.description}</p>
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
                                                    className={`h-full bg-gradient-to-r ${path.color} rounded-full transition-all duration-300`}
                                                    style={{ width: `${progress}%` }}
                                                />
                                            </div>
                                        </div>

                                        {/* Stats */}
                                        <div className="grid grid-cols-3 gap-4 text-center">
                                            <div>
                                                <div className="text-white/60 text-sm">Modules</div>
                                                <div className="text-white font-semibold">{path.stats.modules}</div>
                                            </div>
                                            <div>
                                                <div className="text-white/60 text-sm">Builders</div>
                                                <div className="text-white font-semibold">{path.stats.builders}</div>
                                            </div>
                                            <div>
                                                <div className="text-white/60 text-sm">Projects</div>
                                                <div className="text-white font-semibold">{path.stats.projects}</div>
                                            </div>
                                        </div>

                                        {/* Features */}
                                        <div className="mt-4">
                                            <div className="text-white/60 text-sm mb-2">Key Features:</div>
                                            <ul className="space-y-1">
                                                {path.features.map((feature, index) => (
                                                    <li key={index} className="text-white/80 text-sm flex items-center gap-2">
                                                        <ArrowRight className="w-4 h-4" />
                                                        {feature}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Featured Modules */}
                    <h2 className="text-2xl font-bold text-white mb-4">Featured Modules</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {learningModules.map((module) => {
                            const moduleProgress = userProgress?.paths['solana']?.modules[module.id.toString()];
                            const progress = moduleProgress?.progress || 0;
                            
                            return (
                                <div 
                                    key={module.id}
                                    className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10"
                                >
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className={`p-3 rounded-xl bg-gradient-to-br ${module.color}`}>
                                            {module.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-white mb-1">{module.title}</h3>
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
                            );
                        })}
                    </div>
                </div>
            </main>
        </div>
    );
}
