'use client';

import ClientProviders from '@/components/ClientProviders';
import { ReactNode } from 'react';

// A wrapper component that includes all providers
export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ClientProviders>
      {children}
    </ClientProviders>
  );
}
