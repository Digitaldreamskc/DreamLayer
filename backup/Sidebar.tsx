'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ConnectButton } from '@rainbow-me/rainbowkit'; // ✅ Import RainbowKit button

export default function Sidebar() {
    const pathname = usePathname();

    const navigation = [
        { name: 'Dashboard', href: '/dashboard' },
        { name: 'Events', href: '/events' },
        { name: 'Creative Studio', href: '/creators-studio' },
        { name: 'Learn', href: '/learn' },
        { name: 'Settings', href: '/settings' },
    ];

    return (
        <div className="w-64 h-screen fixed left-0 top-0 z-50 bg-gradient-to-b from-purple-900 to-black">
            <div className="flex flex-col h-full py-6">
                <div className="px-6 mb-8">
                    <h2 className="text-2xl font-bold text-white">DreamLayer</h2>
                </div>

                <nav className="flex-1 px-4">
                    <ul className="space-y-2">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        className={`block px-4 py-3 text-sm font-light tracking-wider transition-colors duration-200 ${isActive
                                                ? 'bg-white/10 text-white'
                                                : 'text-gray-300 hover:bg-white/5 hover:text-white'
                                            }`}
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* ✅ Wallet Connect Button placed here at bottom */}
                <div className="mt-auto px-4 pt-6">
                    <ConnectButton showBalance={false} chainStatus="icon" />
                </div>
            </div>
        </div>
    );
}

