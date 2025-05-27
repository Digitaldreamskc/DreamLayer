'use client';

import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#021027' }}>
      {children}
    </div>
  );
}
