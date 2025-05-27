'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import ParticleBackground from '@/components/ParticleBackground';

export default function HomePage() {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const navigationSections = [
    {
      key: 'events',
      title: 'Events',
      subtitle: 'Community Gatherings',
      description: 'Join exclusive Web3 events and earn POAPs',
      gradient: 'from-blue-600 to-cyan-600',
      route: '/events'
    },
    {
      key: 'learn',
      title: 'Learn',
      subtitle: 'Skill Development',
      description: 'Master Web3 through interactive quests',
      gradient: 'from-emerald-600 to-teal-600',
      route: '/dyor'
    },
    {
      key: 'vision',
      title: 'Vision',
      subtitle: 'IP Creation',
      description: 'Create and trade intellectual property',
      gradient: 'from-purple-600 to-pink-600',
      route: '/vision'
    },
    {
      key: 'profile',
      title: 'Profile',
      subtitle: 'Your Dashboard',
      description: 'Manage your Web3 identity',
      gradient: 'from-orange-600 to-red-600',
      route: '/account'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 relative overflow-hidden">
      <ParticleBackground />
      <Navbar />
      
      <main className="pt-20 relative z-10">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center px-6">
          <div className="max-w-6xl mx-auto text-center">
            <div className={`space-y-8 mb-16 transition-all duration-1000 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <div className="space-y-4">
                <h1 className="text-7xl md:text-8xl lg:text-9xl font-thin text-white tracking-tight leading-none">
                  Dream
                </h1>
                <h1 className="text-7xl md:text-8xl lg:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 tracking-tight leading-none animate-pulse">
                  Layer
                </h1>
              </div>
              
              <div className="w-32 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent mx-auto animate-pulse" />
              
              <p className="text-xl md:text-2xl text-white/70 font-light max-w-3xl mx-auto leading-relaxed">
                The next generation Web3 platform for building, learning, and connecting with the future of decentralized technology
              </p>
            </div>

            <div className={`flex flex-col sm:flex-row gap-6 justify-center transition-all duration-1000 delay-500 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <button 
                onClick={() => router.push('/events')}
                onMouseEnter={() => setHoveredCard('events-cta')}
                onMouseLeave={() => setHoveredCard(null)}
                className="group relative overflow-hidden px-8 py-4 rounded-2xl font-semibold tracking-wide text-white transition-all duration-500 transform hover:scale-105"
              >
                <div className={`absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 transition-all duration-500 ${
                  hoveredCard === 'events-cta' ? 'opacity-100 scale-105' : 'opacity-90'
                }`} />
                <div className="relative z-10">Explore Events</div>
              </button>
              <button 
                onClick={() => router.push('/dyor')}
                onMouseEnter={() => setHoveredCard('learn-cta')}
                onMouseLeave={() => setHoveredCard(null)}
                className="group relative overflow-hidden px-8 py-4 rounded-2xl font-semibold tracking-wide transition-all duration-500 transform hover:scale-105"
              >
                <div className={`absolute inset-0 bg-white/[0.08] backdrop-blur-xl border border-white/20 transition-all duration-500 ${
                  hoveredCard === 'learn-cta' ? 'bg-white/[0.12] border-white/30' : ''
                }`} />
                <div className="relative z-10 text-white">Start Learning</div>
              </button>
            </div>
          </div>
        </section>

        {/* Featured Content Section */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className={`text-center mb-16 transition-all duration-1000 delay-700 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <h2 className="text-6xl md:text-7xl font-thin text-white mb-8 tracking-tight">
                Featured
              </h2>
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent mx-auto" />
            </div>

            <div className="grid lg:grid-cols-2 gap-8 mb-16">
              {/* Featured Event Card */}
              <div 
                className="group relative"
                onMouseEnter={() => setHoveredCard('featured-event')}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className={`absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-3xl blur-2xl transition-all duration-700 ${
                  hoveredCard === 'featured-event' ? 'opacity-60 scale-105' : 'opacity-0'
                }`} />
                <div className="relative bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-8 group-hover:bg-white/[0.04] group-hover:border-white/20 transition-all duration-500">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-pulse" />
                    <span className="text-sm font-mono font-semibold text-blue-400 uppercase tracking-wider">Live Event</span>
                  </div>
                  
                  <h3 className="text-3xl font-bold text-white mb-4 tracking-wide">
                    Web3 Community Meetup #12
                  </h3>
                  
                  <p className="text-white/70 mb-6 leading-relaxed">
                    Join industry leaders for an exclusive gathering featuring the latest in Web3 innovation, networking, and project showcases.
                  </p>
                  
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-2xl border border-blue-500/30">
                      <div className="text-sm font-mono font-semibold text-white/60 mb-1 uppercase tracking-wider">Date</div>
                      <div className="text-lg font-bold text-white">Jun 15</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-2xl border border-purple-500/30">
                      <div className="text-sm font-mono font-semibold text-white/60 mb-1 uppercase tracking-wider">Venue</div>
                      <div className="text-lg font-bold text-white">Dreams HQ</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-emerald-600/20 to-teal-600/20 rounded-2xl border border-emerald-500/30">
                      <div className="text-sm font-mono font-semibold text-white/60 mb-1 uppercase tracking-wider">Spots</div>
                      <div className="text-lg font-bold text-white">45/100</div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex justify-between text-sm font-mono mb-2">
                      <span className="text-white/60">Capacity</span>
                      <span className="text-white font-semibold">45%</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full w-[45%] relative">
                        <div className="absolute inset-0 bg-white/20 animate-pulse" />
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => router.push('/events')}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 rounded-2xl font-semibold tracking-wide shadow-lg hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300"
                  >
                    Join Event
                  </button>
                </div>
              </div>

              {/* Active Quest Card */}
              <div 
                className="group relative"
                onMouseEnter={() => setHoveredCard('featured-quest')}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className={`absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 rounded-3xl blur-2xl transition-all duration-700 ${
                  hoveredCard === 'featured-quest' ? 'opacity-60 scale-105' : 'opacity-0'
                }`} />
                <div className="relative bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-8 group-hover:bg-white/[0.04] group-hover:border-white/20 transition-all duration-500">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full animate-pulse" />
                    <span className="text-sm font-mono font-semibold text-emerald-400 uppercase tracking-wider">Active Quest</span>
                  </div>
                  
                  <h3 className="text-3xl font-bold text-white mb-4 tracking-wide">
                    Solana Development Mastery
                  </h3>
                  
                  <p className="text-white/70 mb-6 leading-relaxed">
                    Master building decentralized applications on Solana using the Anchor framework with hands-on projects.
                  </p>
                  
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-gradient-to-r from-amber-600/20 to-orange-600/20 border border-amber-500/30 px-4 py-2 rounded-full">
                      <span className="text-amber-300 font-semibold text-sm uppercase tracking-wide">
                        Intermediate
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-white/60">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="font-mono text-sm">7/12 Lessons</span>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex justify-between text-sm font-mono mb-2">
                      <span className="text-white/60">Progress</span>
                      <span className="text-white font-semibold">58%</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full w-[58%] relative">
                        <div className="absolute inset-0 bg-white/20 animate-pulse" />
                      </div>
                    </div>
                    <div className="text-xs font-mono text-white/50 mt-2">
                      Next: Smart Contract Testing • ~2.1h remaining
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => router.push('/dyor')}
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-2xl font-semibold tracking-wide shadow-lg hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300"
                  >
                    Continue Quest
                  </button>
                </div>
              </div>
            </div>

            {/* Navigation Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {navigationSections.map((section, index) => (
                <button
                  key={section.key}
                  onClick={() => router.push(section.route)}
                  onMouseEnter={() => setHoveredCard(section.key)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className="group relative overflow-hidden p-8 rounded-3xl transition-all duration-500 transform hover:scale-105"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${section.gradient} transition-all duration-500 ${
                    hoveredCard === section.key ? 'opacity-100 scale-105' : 'opacity-80'
                  }`} />
                  <div className={`absolute inset-0 bg-gradient-to-br from-white/10 to-transparent transition-opacity duration-300 ${
                    hoveredCard === section.key ? 'opacity-100' : 'opacity-0'
                  }`} />
                  
                  <div className="relative z-10 text-center">
                    <div className={`w-16 h-16 mx-auto mb-4 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm transition-all duration-300 ${
                      hoveredCard === section.key ? 'scale-110' : ''
                    }`}>
                      <div className={`w-8 h-8 bg-gradient-to-r ${section.gradient} rounded-lg opacity-60`} />
                    </div>
                    <div className="text-white font-bold text-xl mb-1 tracking-wide">{section.title}</div>
                    <div className="text-white/80 text-sm font-light mb-2">{section.subtitle}</div>
                    <div className="text-white/60 text-xs leading-relaxed">{section.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
