'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Upload, FileText, Link } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function IPActionMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleAction = (action: string) => {
    setIsOpen(false);
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
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-8 p-0 hover:bg-white/10"
        >
          <MoreVertical className="h-4 w-4 text-white" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 bg-slate-900/95 backdrop-blur-xl border border-white/10"
      >
        <DropdownMenuItem
          onClick={() => handleAction('register')}
          className="text-white hover:bg-white/10 cursor-pointer"
        >
          <FileText className="mr-2 h-4 w-4" />
          Register IP
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleAction('upload')}
          className="text-white hover:bg-white/10 cursor-pointer"
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload Asset
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleAction('link')}
          className="text-white hover:bg-white/10 cursor-pointer"
        >
          <Link className="mr-2 h-4 w-4" />
          Link Existing IP
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 