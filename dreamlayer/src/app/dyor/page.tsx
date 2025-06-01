'use client';

import { useAccount } from 'wagmi';
import Navbar from '@/components/Navbar';
import ParticleBackground from '@/components/ParticleBackground';

export default function DYORPage() {
    const { isConnected } = useAccount();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 relative overflow-hidden">
            <ParticleBackground />
            <Navbar />

            <main className="pt-20 relative z-10">
                <section className="py-16 px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h1 className="text-7xl md:text-8xl lg:text-9xl font-thin text-white tracking-tight leading-none mb-8">
                                DYOR
                            </h1>
                            <div className="w-32 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent mx-auto animate-pulse mb-8" />
                            <p className="text-xl md:text-2xl text-white/70 font-light max-w-3xl mx-auto leading-relaxed">
                                Master Web3, blockchain, and decentralized technologies through hands-on learning
                            </p>

                            {!isConnected && (
                                <div className="mt-8 p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 max-w-md mx-auto">
                                    <p className="text-white/80 mb-4 text-sm">
                                        Connect your wallet to access premium courses and track your learning journey
                                    </p>
                                    <appkit-button />
                                </div>
                            )}
                        </div>

                        {/* Course Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
                                <div className="p-6">
                                    <h3 className="text-2xl font-semibold text-white mb-4">Web3 Fundamentals</h3>
                                    <p className="text-white/60 mb-6">
                                        Learn the core concepts of Web3, blockchain technology, and decentralized applications
                                    </p>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-white/40">Duration</span>
                                            <span className="text-white/70">2.5 hours</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-white/40">Lessons</span>
                                            <span className="text-white/70">12 modules</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-white/40">Progress</span>
                                            <span className="text-white/70">{isConnected ? '0%' : 'Connect to Start'}</span>
                                        </div>
                                    </div>
                                    <div className="mt-6 w-full bg-white/10 rounded-full h-2 overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-green-600 to-emerald-600 transition-all duration-500" style={{ width: isConnected ? '0%' : '0%' }} />
                                    </div>
                                    <div className="mt-6">
                                        <button
                                            className={`w-full ${isConnected
                                                ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:opacity-90'
                                                : 'bg-white/10 border border-white/20 hover:bg-white/20'
                                                } text-white py-3 rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105`}
                                        >
                                            {isConnected ? 'Start Learning' : 'Connect to Begin'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
