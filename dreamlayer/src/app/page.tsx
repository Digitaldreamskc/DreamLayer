'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 text-white">
      {/* Simple Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">DreamLayer</div>
            <div className="flex gap-6">
              <button onClick={() => router.push('/events')} className="hover:text-blue-400">Events</button>
              <button onClick={() => router.push('/dyor')} className="hover:text-green-400">Learn</button>
              <button onClick={() => router.push('/vision')} className="hover:text-purple-400">Vision</button>
              <button onClick={() => router.push('/account')} className="hover:text-orange-400">Account</button>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Main Content */}
      <main className="pt-20 px-6">
        <div className="max-w-6xl mx-auto text-center py-20">
          <h1 className="text-8xl font-thin mb-4">Dream</h1>
          <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 mb-8">
            Layer
          </h1>
          
          <p className="text-xl text-white/70 mb-12 max-w-3xl mx-auto">
            The next generation Web3 platform for building, learning, and connecting with the future of decentralized technology
          </p>
          
          <div className="flex gap-6 justify-center">
            <button 
              onClick={() => router.push('/events')}
              className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-xl font-semibold transition-all"
            >
              Explore Events
            </button>
            <button 
              onClick={() => router.push('/dyor')}
              className="bg-white/10 hover:bg-white/20 border border-white/20 px-8 py-4 rounded-xl font-semibold transition-all"
            >
              Start Learning
            </button>
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="max-w-7xl mx-auto py-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <button
              onClick={() => router.push('/events')}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 p-8 rounded-3xl text-center hover:scale-105 transition-transform"
            >
              <div className="text-2xl font-bold mb-2">Events</div>
              <div className="text-sm opacity-90">Community Gatherings</div>
            </button>
            
            <button
              onClick={() => router.push('/dyor')}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 p-8 rounded-3xl text-center hover:scale-105 transition-transform"
            >
              <div className="text-2xl font-bold mb-2">Learn</div>
              <div className="text-sm opacity-90">Skill Development</div>
            </button>
            
            <button
              onClick={() => router.push('/vision')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 p-8 rounded-3xl text-center hover:scale-105 transition-transform"
            >
              <div className="text-2xl font-bold mb-2">Vision</div>
              <div className="text-sm opacity-90">IP Creation</div>
            </button>
            
            <button
              onClick={() => router.push('/account')}
              className="bg-gradient-to-r from-orange-600 to-red-600 p-8 rounded-3xl text-center hover:scale-105 transition-transform"
            >
              <div className="text-2xl font-bold mb-2">Profile</div>
              <div className="text-sm opacity-90">Your Dashboard</div>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
