'use client';

import { useRouter } from 'next/navigation';
import { FileText, Upload, Link2 } from 'lucide-react';

export function IPActionButtons() {
  const router = useRouter();

  const handleAction = (action: string) => {
    switch (action) {
      case 'register':
        router.push('/register-mint');
        break;
      case 'upload':
        router.push('/upload');
        break;
      case 'link':
        router.push('/link-ip');
        break;
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-4xl mx-auto my-8">
      <button
        onClick={() => handleAction('register')}
        className="w-full sm:w-1/3 bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white p-6 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex flex-col items-center gap-3"
      >
        <div className="bg-white/20 p-4 rounded-xl">
          <FileText className="h-8 w-8" />
        </div>
        <span className="text-xl">Register IP</span>
        <span className="text-sm text-white/70">Create new intellectual property</span>
      </button>

      <button
        onClick={() => handleAction('upload')}
        className="w-full sm:w-1/3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:opacity-90 text-white p-6 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex flex-col items-center gap-3"
      >
        <div className="bg-white/20 p-4 rounded-xl">
          <Upload className="h-8 w-8" />
        </div>
        <span className="text-xl">Upload Asset</span>
        <span className="text-sm text-white/70">Upload file to IPFS</span>
      </button>

      <button
        onClick={() => handleAction('link')}
        className="w-full sm:w-1/3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-90 text-white p-6 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex flex-col items-center gap-3"
      >
        <div className="bg-white/20 p-4 rounded-xl">
          <Link2 className="h-8 w-8" />
        </div>
        <span className="text-xl">Link Existing IP</span>
        <span className="text-sm text-white/70">Connect to IP you own</span>
      </button>
    </div>
  );
}
