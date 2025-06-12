'use client'

import { http } from 'viem'
import { StoryClient } from '@story-protocol/core-sdk'
import { createContext, useContext, useEffect, useState } from 'react'
import { ENV } from '@/config/env'

const CHAIN_ID = '84532'

interface DreamLayerContextType {
  storyClient: StoryClient | null;
  isReady: boolean;
  error: Error | null;
}

const DreamLayerContext = createContext<DreamLayerContextType | undefined>(undefined);

export function DreamLayerProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<DreamLayerContextType>({
    storyClient: null,
    isReady: false,
    error: null
  });

  useEffect(() => {
    const initializeClient = async () => {
      try {
        // For development, allow demo key
        const apiKey = ENV.ALCHEMY_API_KEY || 'demo';
        const transport = http(`https://base-sepolia.g.alchemy.com/v2/${apiKey}`);
        
        const client = new StoryClient({
          chainId: CHAIN_ID,
          transport,
        });
        
        setState({
          storyClient: client,
          isReady: true,
          error: null
        });
      } catch (error) {
        console.warn('Failed to initialize StoryClient:', error);
        setState({
          storyClient: null,
          isReady: false,
          error: error instanceof Error ? error : new Error('Failed to initialize StoryClient')
        });
      }
    };

    initializeClient();
  }, []);

  // In development, continue rendering even with errors
  if (state.error && process.env.NODE_ENV === 'production') {
    return (
      <div className="p-4 text-red-500">
        <h3>Failed to initialize DreamLayer</h3>
        <p>{state.error.message}</p>
      </div>
    );
  }

  return (
    <DreamLayerContext.Provider value={state}>
      {children}
    </DreamLayerContext.Provider>
  );
}

export function useDreamLayer() {
  const context = useContext(DreamLayerContext);
  if (context === undefined) {
    throw new Error('useDreamLayer must be used within a DreamLayerProvider');
  }
  return context;
}