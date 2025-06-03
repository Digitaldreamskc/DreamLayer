'use client';

import Navbar from '@/components/Navbar';
import AnimatedBackground from '@/components/AnimatedBackground';

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 relative overflow-hidden">
      <AnimatedBackground />
      <Navbar />
      
      <main className="pt-20 relative z-10">
        <section className="py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-7xl md:text-8xl lg:text-9xl font-thin text-white tracking-tight leading-none mb-8">
                Events
              </h1>
              <div className="w-32 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent mx-auto animate-pulse mb-8" />
              <p className="text-xl md:text-2xl text-white/70 font-light max-w-3xl mx-auto leading-relaxed">
                Join exclusive Web3 events, earn rewards, and connect with the community
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Event 1 */}
              <div className="group relative overflow-hidden rounded-3xl bg-white/[0.02] backdrop-blur-xl border border-white/10 p-8 transition-all duration-500 hover:bg-white/[0.04] hover:border-white/20 cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide border text-blue-300 bg-blue-600/20 border-blue-500/30">
                      upcoming
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl">
                      <div className="w-6 h-6 bg-white/20 rounded-lg" />
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-3 tracking-wide">Solana Builder Workshop</h3>
                  <p className="text-white/60 text-sm mb-6 leading-relaxed">Learn to build on Solana with hands-on tutorials and expert guidance</p>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-white/40">Date</span>
                      <span className="text-white/70 font-mono">June 10, 2025</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-white/40">Location</span>
                      <span className="text-white/70">Virtual Event</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-white/40">Attendees</span>
                      <span className="text-white/70">156 / 200</span>
                    </div>
                  </div>

                  <div className="mt-6 w-full bg-white/10 rounded-full h-2 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-500" style={{ width: '78%' }} />
                  </div>
                </div>
              </div>

              {/* Event 2 */}
              <div className="group relative overflow-hidden rounded-3xl bg-white/[0.02] backdrop-blur-xl border border-white/10 p-8 transition-all duration-500 hover:bg-white/[0.04] hover:border-white/20 cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide border text-green-300 bg-green-600/20 border-green-500/30">
                      ongoing
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center shadow-xl">
                      <div className="w-6 h-6 bg-white/20 rounded-lg" />
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-3 tracking-wide">Story Protocol Deep Dive</h3>
                  <p className="text-white/60 text-sm mb-6 leading-relaxed">Explore IP tokenization and licensing on Story Protocol</p>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-white/40">Date</span>
                      <span className="text-white/70 font-mono">May 28, 2025</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-white/40">Location</span>
                      <span className="text-white/70">Community Center</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-white/40">Attendees</span>
                      <span className="text-white/70">89 / 100</span>
                    </div>
                  </div>

                  <div className="mt-6 w-full bg-white/10 rounded-full h-2 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-600 to-cyan-600 transition-all duration-500" style={{ width: '89%' }} />
                  </div>
                </div>
              </div>

              {/* Event 3 */}
              <div className="group relative overflow-hidden rounded-3xl bg-white/[0.02] backdrop-blur-xl border border-white/10 p-8 transition-all duration-500 hover:bg-white/[0.04] hover:border-white/20 cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide border text-gray-300 bg-gray-600/20 border-gray-500/30">
                      completed
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center shadow-xl">
                      <div className="w-6 h-6 bg-white/20 rounded-lg" />
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-3 tracking-wide">Web3 UX/UI Design Masterclass</h3>
                  <p className="text-white/60 text-sm mb-6 leading-relaxed">Creating intuitive interfaces for decentralized applications</p>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-white/40">Date</span>
                      <span className="text-white/70 font-mono">May 25, 2025</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-white/40">Location</span>
                      <span className="text-white/70">Design Studio</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-white/40">Attendees</span>
                      <span className="text-white/70">45 / 50</span>
                    </div>
                  </div>

                  <div className="mt-6 w-full bg-white/10 rounded-full h-2 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-600 to-teal-600 transition-all duration-500" style={{ width: '90%' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-16 text-center">
              <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-3xl p-8">
                <h3 className="text-2xl font-bold text-white mb-4">Connect to Participate</h3>
                <p className="text-white/70 mb-6">Connect your wallet to check into events and claim rewards</p>
                <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white px-8 py-3 rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  Connect Wallet
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
