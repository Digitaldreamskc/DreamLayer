'use client';

import { useAppKit } from '@reown/appkit/react';
import { useAccount } from 'wagmi';
import Navbar from '@/components/Navbar';
import ParticleBackground from '@/components/ParticleBackground';

export default function DYORPage() {
  const { open } = useAppKit();
  const { isConnected } = useAccount();

  const handleConnectWallet = () => {
    open();
  };

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
                Do Your Own Research - Learn Web3, blockchain, and decentralized technologies
              </p>
              
              {/* Wallet Connect Section */}
              {!isConnected && (
                <div className="mt-8 p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 max-w-md mx-auto">
                  <p className="text-white/80 mb-4 text-sm">
                    Connect your wallet to unlock premium courses and track your progress
                  </p>
                  <button 
                    onClick={handleConnectWallet}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white px-6 py-3 rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                  >
                    Connect Wallet
                  </button>
                </div>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold shadow-xl transition-all duration-300">
                All Categories
              </button>
              <button className="bg-white/[0.05] hover:bg-white/[0.08] border border-white/20 hover:border-white/30 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300">
                Blockchain Basics
              </button>
              <button className="bg-white/[0.05] hover:bg-white/[0.08] border border-white/20 hover:border-white/30 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300">
                DeFi
              </button>
              <button className="bg-white/[0.05] hover:bg-white/[0.08] border border-white/20 hover:border-white/30 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300">
                NFTs & IP
              </button>
              <button className="bg-white/[0.05] hover:bg-white/[0.08] border border-white/20 hover:border-white/30 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300">
                Advanced
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Course 1 */}
              <div className="group relative overflow-hidden rounded-3xl bg-white/[0.02] backdrop-blur-xl border border-white/10 p-8 transition-all duration-500 hover:bg-white/[0.04] hover:border-white/20 cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide border text-green-300 bg-green-600/20 border-green-500/30">
                      beginner
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl">
                      <div className="w-6 h-6 bg-white/20 rounded-lg" />
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-3 tracking-wide">Blockchain Fundamentals</h3>
                  <p className="text-white/60 text-sm mb-6 leading-relaxed">Learn the basics of blockchain technology, consensus mechanisms, and cryptography</p>
                  
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
                      <span className="text-white/40">Completion</span>
                      <span className="text-white/70">{isConnected ? '0%' : 'Login Required'}</span>
                    </div>
                  </div>

                  <div className="mt-6 w-full bg-white/10 rounded-full h-2 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-600 to-emerald-600 transition-all duration-500" style={{ width: isConnected ? '0%' : '0%' }} />
                  </div>

                  <div className="mt-6">
                    <button 
                      onClick={isConnected ? undefined : handleConnectWallet}
                      className={`w-full ${isConnected 
                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:opacity-90' 
                        : 'bg-white/10 border border-white/20 hover:bg-white/20'
                      } text-white py-3 rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105`}
                    >
                      {isConnected ? 'Start Course' : 'Connect to Start'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Course 2 */}
              <div className="group relative overflow-hidden rounded-3xl bg-white/[0.02] backdrop-blur-xl border border-white/10 p-8 transition-all duration-500 hover:bg-white/[0.04] hover:border-white/20 cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide border text-blue-300 bg-blue-600/20 border-blue-500/30">
                      intermediate
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center shadow-xl">
                      <div className="w-6 h-6 bg-white/20 rounded-lg" />
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-3 tracking-wide">DeFi Deep Dive</h3>
                  <p className="text-white/60 text-sm mb-6 leading-relaxed">Explore decentralized finance protocols, yield farming, and liquidity provision</p>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-white/40">Duration</span>
                      <span className="text-white/70">4 hours</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-white/40">Lessons</span>
                      <span className="text-white/70">18 modules</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-white/40">Completion</span>
                      <span className="text-white/70">{isConnected ? '67%' : 'Login Required'}</span>
                    </div>
                  </div>

                  <div className="mt-6 w-full bg-white/10 rounded-full h-2 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-600 to-cyan-600 transition-all duration-500" style={{ width: isConnected ? '67%' : '0%' }} />
                  </div>

                  <div className="mt-6">
                    <button 
                      onClick={isConnected ? undefined : handleConnectWallet}
                      className={`w-full ${isConnected 
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:opacity-90' 
                        : 'bg-white/10 border border-white/20 hover:bg-white/20'
                      } text-white py-3 rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105`}
                    >
                      {isConnected ? 'Continue Course' : 'Connect to Continue'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Course 3 */}
              <div className="group relative overflow-hidden rounded-3xl bg-white/[0.02] backdrop-blur-xl border border-white/10 p-8 transition-all duration-500 hover:bg-white/[0.04] hover:border-white/20 cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide border text-purple-300 bg-purple-600/20 border-purple-500/30">
                      intermediate
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl">
                      <div className="w-6 h-6 bg-white/20 rounded-lg" />
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-3 tracking-wide">Story Protocol & IP</h3>
                  <p className="text-white/60 text-sm mb-6 leading-relaxed">Master intellectual property tokenization and licensing on blockchain</p>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-white/40">Duration</span>
                      <span className="text-white/70">3 hours</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-white/40">Lessons</span>
                      <span className="text-white/70">15 modules</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-white/40">Completion</span>
                      <span className="text-white/70">{isConnected ? '100%' : 'Login Required'}</span>
                    </div>
                  </div>

                  <div className="mt-6 w-full bg-white/10 rounded-full h-2 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-500" style={{ width: isConnected ? '100%' : '0%' }} />
                  </div>

                  <div className="mt-6">
                    <button 
                      onClick={isConnected ? undefined : handleConnectWallet}
                      className={`w-full ${isConnected 
                        ? 'bg-white/[0.05] border border-white/20' 
                        : 'bg-white/10 border border-white/20 hover:bg-white/20'
                      } text-white py-3 rounded-xl font-semibold transition-all duration-300`}
                    >
                      {isConnected ? 'View Certificate' : 'Connect to View'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Learning Path Section */}
            <div className="mt-16">
              <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-3xl p-8">
                <h3 className="text-3xl font-bold text-white mb-4 text-center">Recommended Learning Path</h3>
                <p className="text-white/70 mb-8 text-center max-w-2xl mx-auto">Follow our structured curriculum to master Web3 development from basics to advanced concepts</p>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl mx-auto mb-4">
                      <span className="text-white font-bold text-xl">1</span>
                    </div>
                    <h4 className="text-white font-semibold mb-2">Foundations</h4>
                    <p className="text-white/60 text-sm">Blockchain basics and wallet security</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center shadow-xl mx-auto mb-4">
                      <span className="text-white font-bold text-xl">2</span>
                    </div>
                    <h4 className="text-white font-semibold mb-2">DeFi & Trading</h4>
                    <p className="text-white/60 text-sm">Decentralized finance protocols</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl mx-auto mb-4">
                      <span className="text-white font-bold text-xl">3</span>
                    </div>
                    <h4 className="text-white font-semibold mb-2">NFTs & IP</h4>
                    <p className="text-white/60 text-sm">Digital assets and intellectual property</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl flex items-center justify-center shadow-xl mx-auto mb-4">
                      <span className="text-white font-bold text-xl">4</span>
                    </div>
                    <h4 className="text-white font-semibold mb-2">Advanced Dev</h4>
                    <p className="text-white/60 text-sm">Smart contract development</p>
                  </div>
                </div>
                
                {/* Connect Wallet CTA for Learning Path */}
                {!isConnected && (
                  <div className="text-center mt-8">
                    <button 
                      onClick={handleConnectWallet}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white px-8 py-3 rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                    >
                      Connect Wallet to Start Learning
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
