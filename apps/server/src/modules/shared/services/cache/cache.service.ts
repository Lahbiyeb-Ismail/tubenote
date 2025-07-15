import { injectable } from "inversify";
import Redis from "ioredis";

import type { ICacheService } from "./cache.types";

import { envConfig } from "../../config";

@injectable()
export class CacheService implements ICacheService {
  private client: Redis;

  /**
   * Initializes the cache service with a Redis client connection.
   *
   * Sets up a Redis client using configuration from envConfig with the following settings:
   * - Host and port from environment configuration
   * - Password authentication if provided
   * - Maximum of 3 retry attempts per request
   * - Error event listener for logging Redis connection errors
   *
   * @throws {Error} If Redis connection fails or configuration is invalid
   */
  constructor() {
    this.client = new Redis({
      host: envConfig.redis.host,
      port: +envConfig.redis.port,
      password: envConfig.redis.password,
      maxRetriesPerRequest: 3,
    });

    this.client.on("error", err => console.error("Redis Client Error", err));
  }

  /**
   * Retrieves a value from the cache by key and deserializes it from JSON.
   *
   * @template T - The expected type of the cached value
   * @param key - The cache key to retrieve the value for
   * @returns A promise that resolves to the cached value of type T, or undefined if the key doesn't exist
   *
   */
  async get<T>(key: string): Promise<T | undefined> {
    const data = await this.client.get(key);
    if (data) {
      return JSON.parse(data) as T;
    }
    return undefined;
  }

  /**
   * Sets a value in the cache with an optional time-to-live (TTL).
   *
   * @template T - The type of the value to be cached
   * @param key - The cache key to store the value under
   * @param value - The value to be cached (will be JSON serialized)
   * @param ttl - Optional time-to-live in seconds. If provided, the key will expire after this duration
   * @returns A promise that resolves to true if the operation was successful, false otherwise
   *
   */
  async set<T>(key: string, value: T, ttl?: number): Promise<boolean> {
    const stringValue = JSON.stringify(value);
    if (ttl) {
      const result = await this.client.set(key, stringValue, "EX", ttl);
      return result === "OK";
    }
    const result = await this.client.set(key, stringValue);
    return result === "OK";
  }

  /**
   * Deletes a key from the cache.
   *
   * @param key - The cache key to delete
   * @returns A promise that resolves to the number of keys that were deleted (0 or 1)
   */
  async del(key: string): Promise<number> {
    return this.client.del(key);
  }

  /**
   * Flushes all data from the cache by removing all keys from all databases.
   * This operation is irreversible and will permanently delete all cached data.
   *
   * @returns A promise that resolves when the flush operation is complete
   * @throws {Error} If the cache client is not available or the flush operation fails
   */
  async flush(): Promise<void> {
    await this.client.flushall();
  }

  /**
   * Retrieves Redis cache statistics including key count, hits, and misses.
   *
   * This method fetches Redis server information and parses it to extract
   * relevant cache performance metrics.
   *
   * @returns {Promise<any>} A promise that resolves to an object containing:
   * - `keys`: Number of keys in database 0 (defaults to 0 if db0 doesn't exist)
   * - `hits`: Total number of cache hits (keyspace_hits)
   * - `misses`: Total number of cache misses (keyspace_misses)
   *
   * @example
   * ```typescript
   * const stats = await cacheService.getStats();
   * console.log(`Cache has ${stats.keys} keys with ${stats.hits} hits and ${stats.misses} misses`);
   * ```
   */
  async getStats(): Promise<any> {
    const info = await this.client.info();
    // Parse the info string to get relevant stats
    const lines = info.split("\r\n");
    const stats: Record<string, any> = {};

    lines.forEach((line) => {
      if (line && !line.startsWith("#")) {
        const parts = line.split(":");
        if (parts.length === 2) {
          stats[parts[0]] = parts[1];
        }
      }
    });

    return {
      keys: stats.db0 ? +stats.db0.split(",")[0].split("=")[1] : 0,
      hits: +stats.keyspace_hits,
      misses: +stats.keyspace_misses,
    };
  }
}
