import { useState, useEffect, useCallback } from 'react';

/**
 * Token bucket rate limiter implementation
 */
export class TokenBucketRateLimiter {
  private tokens: number;
  private lastRefill: number;
  private readonly maxTokens: number;
  private readonly refillRate: number; // tokens per millisecond
  private readonly refillInterval: number;

  constructor(maxTokens: number, refillInterval: number) {
    this.maxTokens = maxTokens;
    this.tokens = maxTokens;
    this.lastRefill = Date.now();
    this.refillInterval = refillInterval;
    this.refillRate = maxTokens / refillInterval;
  }

  private refill(): void {
    const now = Date.now();
    const timePassed = now - this.lastRefill;
    const tokensToAdd = Math.floor(timePassed * this.refillRate);
    
    if (tokensToAdd > 0) {
      this.tokens = Math.min(this.maxTokens, this.tokens + tokensToAdd);
      this.lastRefill = now;
    }
  }

  public tryAcquire(tokens: number = 1): boolean {
    this.refill();
    
    if (this.tokens >= tokens) {
      this.tokens -= tokens;
      return true;
    }
    
    return false;
  }

  public getAvailableTokens(): number {
    this.refill();
    return this.tokens;
  }

  public reset(): void {
    this.tokens = this.maxTokens;
    this.lastRefill = Date.now();
  }
}

/**
 * Sliding window rate limiter implementation
 */
export class SlidingWindowRateLimiter {
  private readonly window: number[];
  private readonly windowMs: number;
  private readonly maxRequests: number;

  constructor(windowMs: number, maxRequests: number) {
    this.window = [];
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
  }

  private cleanup(): void {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    while (this.window.length > 0 && this.window[0] < windowStart) {
      this.window.shift();
    }
  }

  public tryAcquire(): boolean {
    this.cleanup();
    
    if (this.window.length < this.maxRequests) {
      this.window.push(Date.now());
      return true;
    }
    
    return false;
  }

  public getAvailableSlots(): number {
    this.cleanup();
    return this.maxRequests - this.window.length;
  }

  public reset(): void {
    this.window.length = 0;
  }
}

/**
 * React hook for rate limiting
 */
export function useRateLimit(
  maxRequests: number,
  windowMs: number,
  onLimitExceeded?: () => void
) {
  const [rateLimiter] = useState(() => new SlidingWindowRateLimiter(windowMs, maxRequests));
  const [isLimited, setIsLimited] = useState(false);

  const checkRateLimit = useCallback(() => {
    const canProceed = rateLimiter.tryAcquire();
    setIsLimited(!canProceed);
    
    if (!canProceed && onLimitExceeded) {
      onLimitExceeded();
    }
    
    return canProceed;
  }, [rateLimiter, onLimitExceeded]);

  const getRemainingRequests = useCallback(() => {
    return rateLimiter.getAvailableSlots();
  }, [rateLimiter]);

  const resetRateLimit = useCallback(() => {
    rateLimiter.reset();
    setIsLimited(false);
  }, [rateLimiter]);

  // Reset rate limiter when component unmounts
  useEffect(() => {
    return () => {
      rateLimiter.reset();
    };
  }, [rateLimiter]);

  return {
    isLimited,
    checkRateLimit,
    getRemainingRequests,
    resetRateLimit,
  };
}

/**
 * Utility function to create a debounced rate-limited function
 */
export function createRateLimitedFunction<T extends (...args: any[]) => any>(
  fn: T,
  rateLimiter: TokenBucketRateLimiter | SlidingWindowRateLimiter,
  debounceMs: number = 0
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  let timeout: NodeJS.Timeout;
  let lastCall = 0;

  return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    // Clear existing timeout if it exists
    if (timeout) {
      clearTimeout(timeout);
    }

    // Check rate limit
    if ('tryAcquire' in rateLimiter && !rateLimiter.tryAcquire()) {
      throw new Error('Rate limit exceeded');
    }

    // Return a promise that resolves with the function call
    return new Promise((resolve, reject) => {
      const now = Date.now();
      const timeSinceLastCall = now - lastCall;

      if (timeSinceLastCall < debounceMs) {
        // Debounce the call
        timeout = setTimeout(() => {
          lastCall = Date.now();
          try {
            const result = fn(...args);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        }, debounceMs - timeSinceLastCall);
      } else {
        // Execute immediately
        lastCall = now;
        try {
          const result = fn(...args);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }
    });
  };
}

// Example usage:
/*
const rateLimiter = new TokenBucketRateLimiter(5, 1000); // 5 tokens per second
const searchWithRateLimit = createRateLimitedFunction(
  searchNFTs,
  rateLimiter,
  300 // 300ms debounce
);

// In a React component:
const {
  isLimited,
  checkRateLimit,
  getRemainingRequests,
  resetRateLimit
} = useRateLimit(5, 1000, () => {
  console.log('Rate limit exceeded!');
});
*/