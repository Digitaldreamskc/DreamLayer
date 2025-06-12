import { StoryClient } from '@story-protocol/core-sdk';
import { useDreamLayer } from '../providers/DreamLayerProvider';
import { useEffect, useState } from 'react';

interface UseStoryClientReturn {
  client: StoryClient | null;
  isLoading: boolean;
  error: Error | null;
  isReady: boolean;
}

export function useStoryClient(): UseStoryClientReturn {
  const { storyClient } = useDreamLayer();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Simple initialization check
    const checkClient = async () => {
      try {
        setIsLoading(true);
        if (!storyClient) {
          throw new Error('Story Protocol client not initialized');
        }
        // Optional: Add any additional client validation here
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to initialize Story Protocol client'));
      } finally {
        setIsLoading(false);
      }
    };

    checkClient();
  }, [storyClient]);

  return {
    client: storyClient,
    isLoading,
    error,
    isReady: !isLoading && !error && !!storyClient
  };
}

// Example usage in a component:
/*
function MyComponent() {
  const { client, isLoading, error, isReady } = useStoryClient();

  if (isLoading) return <div>Loading Story Protocol client...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!isReady) return <div>Client not ready</div>;

  return (
    <div>
      {/* Use client safely here *\/}
    </div>
  );
}
*/