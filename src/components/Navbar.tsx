import Link from 'next/link';
import ConnectWallet from '@/components/ConnectWallet';

export const Navbar = () => {
  return (
    <nav className="flex items-center justify-between p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center space-x-4">
        <Link href="/" className="text-xl font-bold">
          DreamLayer
        </Link>
        <Link href="/creators-studio" className="text-sm">
          Studio
        </Link>
        <Link href="/learn" className="text-sm">
          Learn
        </Link>
        <Link href="/events" className="text-sm">
          Events
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        <ConnectWallet />
      </div>
    </nav>
  );
};

export default Navbar;