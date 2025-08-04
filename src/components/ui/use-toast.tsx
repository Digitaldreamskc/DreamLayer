'use client';

import { useState, useEffect, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

// Toast types
type ToastType = 'default' | 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  id: string;
  title?: string;
  description?: string;
  type?: ToastType;
  duration?: number;
}

// Toast context to manage toasts
type ToastContextType = {
  toast: (props: Omit<ToastProps, 'id'>) => void;
};

// Simple implementation without context API for MVP
const toastQueue: ToastProps[] = [];
let listeners: (() => void)[] = [];

// Notify all components that the toast queue has changed
const notifyListeners = () => {
  listeners.forEach(listener => listener());
};

// Main hook that components can use to create toasts
export function useToast(): ToastContextType {
  const [_, setUpdate] = useState(0);

  useEffect(() => {
    const listener = () => setUpdate(prev => prev + 1);
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  }, []);

  const toast = (props: Omit<ToastProps, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    toastQueue.push({
      id,
      type: 'default',
      duration: 5000,
      ...props
    });
    notifyListeners();

    // Auto-dismiss toast after duration
    setTimeout(() => {
      const index = toastQueue.findIndex(t => t.id === id);
      if (index !== -1) {
        toastQueue.splice(index, 1);
        notifyListeners();
      }
    }, props.duration || 5000);
  };

  return { toast };
}

// Toast component that displays a single toast notification
function Toast({ toast, onClose }: { toast: ToastProps; onClose: () => void }) {
  // Different styling based on toast type
  const getBgColor = (type: ToastType = 'default') => {
    switch (type) {
      case 'success':
        return 'bg-green-500/20 border-green-500/30 text-green-300';
      case 'error':
        return 'bg-red-500/20 border-red-500/30 text-red-300';
      case 'warning':
        return 'bg-yellow-500/20 border-yellow-500/30 text-yellow-300';
      case 'info':
        return 'bg-blue-500/20 border-blue-500/30 text-blue-300';
      default:
        return 'bg-white/10 border-white/20 text-white';
    }
  };

  return (
    <div 
      className={`p-4 rounded-xl border shadow-lg backdrop-blur-lg max-w-md w-full transition-all duration-300 ${getBgColor(toast.type)}`}
    >
      <div className="flex justify-between items-start">
        {toast.title && (
          <h3 className="text-sm font-semibold">{toast.title}</h3>
        )}
        <button
          onClick={onClose}
          className="ml-4 inline-flex flex-shrink-0 justify-center items-center h-5 w-5 rounded-md text-white/70 hover:text-white focus:outline-none"
        >
          <X className="h-3 w-3" />
        </button>
      </div>
      {toast.description && (
        <div className="mt-1 text-xs opacity-90">{toast.description}</div>
      )}
    </div>
  );
}

// Toaster component that renders all toasts
export function Toaster() {
  const [toasts, setToasts] = useState<ToastProps[]>([]);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    
    const updateToasts = () => {
      setToasts([...toastQueue]);
    };
    
    listeners.push(updateToasts);
    // Initial update
    updateToasts();
    
    return () => {
      listeners = listeners.filter(l => l !== updateToasts);
    };
  }, []);

  // Don't render anything until mounted on client
  if (!mounted) return null;
  
  // Safety check for browser environment
  if (typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed top-0 right-0 z-50 p-4 flex flex-col gap-2 max-h-screen overflow-hidden">
      {toasts.map(toast => (
        <Toast 
          key={toast.id} 
          toast={toast} 
          onClose={() => {
            const index = toastQueue.findIndex(t => t.id === toast.id);
            if (index !== -1) {
              toastQueue.splice(index, 1);
              notifyListeners();
            }
          }} 
        />
      ))}
    </div>,
    document.body
  );
}
