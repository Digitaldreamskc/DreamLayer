'use client';

import Navbar from '@/components/Navbar';
import AnimatedBackground from '@/components/AnimatedBackground';
import { IPActionButtons } from '@/components/IPActionButtons';
import Providers from '../providers';

export default function VisionPage() {
  return (
    <Providers>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 relative overflow-hidden">
        <AnimatedBackground />
        <Navbar />
        
        <main className="pt-20 relative z-10">
          <section className="py-16 px-6">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h1 className="text-7xl md:text-8xl lg:text-9xl font-thin text-white tracking-tight leading-none mb-4">
                  Vision
                </h1>
                <div className="w-32 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent mx-auto animate-pulse mb-8" />
                <p className="text-xl md:text-2xl text-white/70 font-light max-w-3xl mx-auto leading-relaxed mb-12">
                  Explore the IP marketplace powered by Story Protocol
                </p>
                
                {/* Prominent CTA Buttons */}
                <div className="mb-16">
                  <h2 className="text-2xl font-bold text-white mb-6">Create and Manage Your IP</h2>
                  <IPActionButtons />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* IP Asset 1 */}
                <div className="group relative overflow-hidden rounded-3xl bg-white/[0.02] backdrop-blur-xl border border-white/10 p-8 transition-all duration-500 hover:bg-white/[0.04] hover:border-white/20 cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide border text-green-300 bg-green-600/20 border-green-500/30">
                        available
                      </div>
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl">
                        <div className="w-6 h-6 bg-white/20 rounded-lg" />
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-3 tracking-wide">NFT Collection Framework</h3>
                    <p className="text-white/60 text-sm mb-6 leading-relaxed">Complete smart contract framework for generative NFT collections</p>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-white/40">Type</span>
                        <span className="text-white/70">Smart Contract</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-white/40">License</span>
                        <span className="text-white/70">Commercial Use</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-white/40">Price</span>
                        <span className="text-white/70">0.5 ETH</span>
                      </div>
                    </div>

                    <div className="mt-6">
                      <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white py-3 rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                        License IP
                      </button>
                    </div>
                  </div>
                </div>

                {/* IP Asset 2 */}
                <div className="group relative overflow-hidden rounded-3xl bg-white/[0.02] backdrop-blur-xl border border-white/10 p-8 transition-all duration-500 hover:bg-white/[0.04] hover:border-white/20 cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide border text-blue-300 bg-blue-600/20 border-blue-500/30">
                        trending
                      </div>
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center shadow-xl">
                        <div className="w-6 h-6 bg-white/20 rounded-lg" />
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-3 tracking-wide">DeFi Protocol Template</h3>
                    <p className="text-white/60 text-sm mb-6 leading-relaxed">Production-ready DeFi protocol with yield farming capabilities</p>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-white/40">Type</span>
                        <span className="text-white/70">Protocol</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-white/40">License</span>
                        <span className="text-white/70">Open Source</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-white/40">Price</span>
                        <span className="text-white/70">1.2 ETH</span>
                      </div>
                    </div>

                    <div className="mt-6">
                      <button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:opacity-90 text-white py-3 rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                        License IP
                      </button>
                    </div>
                  </div>
                </div>

                {/* IP Asset 3 */}
                <div className="group relative overflow-hidden rounded-3xl bg-white/[0.02] backdrop-blur-xl border border-white/10 p-8 transition-all duration-500 hover:bg-white/[0.04] hover:border-white/20 cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide border text-yellow-300 bg-yellow-600/20 border-yellow-500/30">
                        exclusive
                      </div>
                      <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center shadow-xl">
                        <div className="w-6 h-6 bg-white/20 rounded-lg" />
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-3 tracking-wide">AI Art Generator</h3>
                    <p className="text-white/60 text-sm mb-6 leading-relaxed">Advanced AI model for generating unique digital artwork</p>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-white/40">Type</span>
                        <span className="text-white/70">AI Model</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-white/40">License</span>
                        <span className="text-white/70">Exclusive Rights</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-white/40">Price</span>
                        <span className="text-white/70">2.8 ETH</span>
                      </div>
                    </div>

                    <div className="mt-6">
                      <button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-90 text-white py-3 rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                        License IP
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </Providers>
  );
}