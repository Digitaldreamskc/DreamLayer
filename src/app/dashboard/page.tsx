"use client";

import DynamicNFTDashboard from '@/components/DynamicNFTDashboard';
import { DashboardNav } from '@/components/dashboard-nav';
import Navbar from '@/components/Navbar';
import AnimatedBackground from '@/components/AnimatedBackground';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 relative overflow-hidden">
      <AnimatedBackground />
      <Navbar />

      <div className="flex flex-col md:flex-row pt-20 relative z-10">
        <div className="w-full md:w-64 bg-card/50 backdrop-blur-sm border-r h-auto md:min-h-[calc(100vh-5rem)]">
          <DashboardNav />
        </div>
        
        <main className="flex-1">
          <section className="py-16 px-6">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-thin text-white tracking-tight leading-none mb-8">
                  Dashboard
                </h1>
                <div className="w-32 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent mx-auto animate-pulse mb-8" />
                <p className="text-xl md:text-2xl text-white/70 font-light max-w-3xl mx-auto leading-relaxed">
                  Manage your dynamic NFTs and digital assets
                </p>
              </div>

              <DynamicNFTDashboard />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
