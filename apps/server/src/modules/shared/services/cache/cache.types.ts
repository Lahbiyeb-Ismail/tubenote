/**
 * Interface for cache service operations providing basic cache functionality
 * with support for storing, retrieving, and managing cached data with TTL support.
 */
export interface ICacheService {
  /**
   * Stores a value in the cache with an optional time-to-live (TTL).
   * @template T - The type of the value to be cached
   * @param key - The unique identifier for the cached value
   * @param value - The value to store in the cache
   * @param ttl - Optional time-to-live in seconds. If not provided, uses default TTL
   * @returns Promise that resolves to true if the value was successfully stored, false otherwise
   */
  set: <T>(key: string, value: T, ttl?: number) => Promise<boolean>;

  /**
   * Retrieves a value from the cache by its key.
   * @template T - The expected type of the cached value
   * @param key - The unique identifier for the cached value
   * @returns Promise that resolves to the cached value if found, undefined otherwise
   */
  get: <T>(key: string) => Promise<T | undefined>;

  /**
   * Removes a value from the cache by its key.
   * @param key - The unique identifier for the cached value to remove
   * @returns Promise that resolves to the number of keys that were removed (0 or 1)
   */
  del: (key: string) => Promise<number>;

  /**
   * Clears all cached values from the cache storage.
   * @returns Promise that resolves when all cached data has been successfully cleared
   */
  flush: () => Promise<void>;

  /**
   * Retrieves cache statistics and performance metrics.
   * @returns Promise that resolves to an object containing cache statistics such as hit/miss ratios, memory usage, etc.
   */
  getStats: () => Promise<any>;
}
