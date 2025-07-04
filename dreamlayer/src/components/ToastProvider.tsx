'use client';

import { Toaster } from 'sonner';
import { useEffect, useState, ReactNode } from 'react';

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  // Client-side only rendering to prevent hydration issues
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      {children}
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgb(15, 23, 42)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          },
          duration: 4000
        }}
      />
    </>
  );
}
