/**
 * Utilities for efficient caching strategies
 */

// Cache duration constants (in milliseconds)
export const CACHE_DURATIONS = {
  SHORT: 5 * 60 * 1000, // 5 minutes
  MEDIUM: 30 * 60 * 1000, // 30 minutes
  LONG: 24 * 60 * 60 * 1000, // 1 day
  VERY_LONG: 7 * 24 * 60 * 60 * 1000, // 1 week
};

interface CacheItem<T> {
  value: T;
  expiry: number;
}

/**
 * In-memory cache for storing data with expiration
 */
class MemoryCache {
  private cache: Map<string, CacheItem<any>> = new Map();

  /**
   * Set a value in the cache with expiration
   * @param key - Cache key
   * @param value - Value to store
   * @param ttl - Time to live in milliseconds
   */
  set<T>(key: string, value: T, ttl: number): void {
    const expiry = Date.now() + ttl;
    this.cache.set(key, { value, expiry });
  }

  /**
   * Get a value from the cache
   * @param key - Cache key
   * @returns The cached value or undefined if not found or expired
   */
  get<T>(key: string): T | undefined {
    const item = this.cache.get(key);
    
    // Return undefined if item doesn't exist or is expired
    if (!item || item.expiry < Date.now()) {
      if (item) this.cache.delete(key); // Clean up expired item
      return undefined;
    }
    
    return item.value as T;
  }

  /**
   * Remove a value from the cache
   * @param key - Cache key
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all items from the cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Clean up expired items from the cache
   */
  cleanup(): void {
    const now = Date.now();
    // Use Array.from to convert Map entries to array for ES5 compatibility
    Array.from(this.cache.keys()).forEach(key => {
      const item = this.cache.get(key);
      if (item && item.expiry < now) {
        this.cache.delete(key);
      }
    });
  }
}

// Export a singleton instance
export const memoryCache = new MemoryCache();

/**
 * Creates a function that caches the result of an async operation
 * @param fn - The async function to cache
 * @param keyFn - Function to generate a cache key from arguments
 * @param ttl - Time to live in milliseconds
 * @returns A cached version of the function
 */
export function createCachedFunction<T, Args extends any[]>(
  fn: (...args: Args) => Promise<T>,
  keyFn: (...args: Args) => string,
  ttl: number
): (...args: Args) => Promise<T> {
  return async (...args: Args): Promise<T> => {
    const key = keyFn(...args);
    const cached = memoryCache.get<T>(key);
    
    if (cached !== undefined) {
      return cached;
    }
    
    const result = await fn(...args);
    memoryCache.set(key, result, ttl);
    return result;
  };
}

/**
 * Initialize cache cleanup interval
 * @param interval - Cleanup interval in milliseconds (default: 5 minutes)
 */
export function initCacheCleanup(interval = 5 * 60 * 1000): () => void {
  const timer = setInterval(() => {
    memoryCache.cleanup();
  }, interval);
  
  // Return cleanup function
  return () => clearInterval(timer);
}