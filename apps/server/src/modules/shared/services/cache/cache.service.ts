import NodeCache from "node-cache";

import type { ICacheService, ICacheServiceOptions } from "./cache.types";

/**
 * Service for managing a cache using NodeCache.
 *
 * This service provides methods to set, get, delete, and flush cache entries,
 * as well as retrieve cache statistics.
 *
 * @implements {ICacheService}
 */
export class CacheService implements ICacheService {
  private static _instance: CacheService;

  private cache: NodeCache;

  /**
   * Initializes a new instance of the cache service.
   *
   * @param ttlSeconds - The time-to-live (TTL) for cached items in seconds.
   *                     This determines how long an item remains in the cache
   *                     before it is automatically removed.
   */
  private constructor(ttlSeconds: number) {
    this.cache = new NodeCache({
      stdTTL: ttlSeconds,
      checkperiod: ttlSeconds * 0.2,
    });
  }

  public static getInstance(options: ICacheServiceOptions): CacheService {
    if (!this._instance) {
      this._instance = new CacheService(options.ttlSeconds);
    }
    return this._instance;
  }

  /**
   * Sets a value in the cache with the specified key.
   *
   * @template T - The type of the value to be cached.
   * @param {string} key - The key under which the value should be stored.
   * @param {T} value - The value to be stored in the cache.
   * @param {number} [ttl] - Optional time-to-live for the cached item in seconds.
   * @returns {boolean} - Returns true if the value was successfully set in the cache.
   */
  set<T>(key: string, value: T, ttl: number = 500): boolean {
    return this.cache.set(key, value, ttl);
  }

  /**
   * Retrieves a value from the cache.
   *
   * @template T - The type of the value to retrieve.
   * @param {string} key - The key of the value to retrieve.
   * @returns {T | undefined} - The value associated with the key, or undefined if the key does not exist.
   */
  get<T>(key: string): T | undefined {
    return this.cache.get<T>(key);
  }

  /**
   * Deletes the cache entry for the specified key.
   *
   * @param {string} key - The key of the cache entry to delete.
   * @returns {number} - The number of entries that were removed.
   */
  del(key: string): number {
    return this.cache.del(key);
  }

  /**
   * Clears all the cached data.
   *
   * This method flushes all the entries in the cache, effectively clearing it.
   * Use this method when you need to invalidate all cached data.
   *
   * @returns {void}
   */
  flush(): void {
    this.cache.flushAll();
  }

  /**
   * Retrieves the statistics of the cache.
   *
   * @returns {NodeCache.Stats} An object containing various statistics about the cache,
   * such as the number of keys, hits, misses, and other relevant metrics.
   */
  getStats(): NodeCache.Stats {
    return this.cache.getStats();
  }
}
