import { RedisCacheService } from "@tubenote/redis-cache";

import type { IRedisSessionService, ISessionData } from "./session-cache.types";

import { envConfig } from "../../config";

export class SessionCacheService implements IRedisSessionService {
  private redisCache: RedisCacheService;

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
    this.redisCache = new RedisCacheService({
      host: envConfig.redis.host,
      port: +envConfig.redis.port,
      password: envConfig.redis.password,
      maxRetriesPerRequest: 3,
    });
  }

  /**
   * Creates a new session in the Redis cache with the specified TTL (Time To Live).
   *
   * @param sessionId - The unique identifier for the session
   * @param data - The session data to be stored, must implement ISessionData interface
   * @param ttl - Time to live in seconds, after which the session will automatically expire
   * @returns Promise that resolves to true if the session was successfully created, false otherwise
   *
   * @remarks
   * - The session data is JSON stringified before storage
   * - Returns false if sessionId or data parameters are invalid/empty
   * - Logs creation attempts and warnings for debugging purposes
   * - Uses Redis SET command with EX flag for automatic expiration
   */
  async createSession(sessionId: string, data: ISessionData, ttl: number): Promise<boolean> {
    return this.redisCache.set(sessionId, data, ttl);
  }

  /**
   * Retrieves session data from Redis cache by session ID.
   *
   * @param sessionId - The unique identifier for the session to retrieve
   * @returns A Promise that resolves to the session data object if found, or null if not found or invalid ID
   *
   * @remarks
   * - Logs the retrieval attempt for debugging purposes
   * - Returns null immediately if sessionId is empty or falsy
   * - Parses the stored JSON string back into an object
   * - Logs a warning when attempting to retrieve with an empty session ID
   */
  async getSession(sessionId: string): Promise<ISessionData | undefined> {
    return this.redisCache.get(sessionId);
  }

  /**
   * Deletes a session from the Redis cache.
   *
   * @param sessionId - The unique identifier of the session to delete
   * @returns A Promise that resolves to the number of keys that were removed (0 or 1)
   *
   * @remarks
   * - Logs the deletion attempt for debugging purposes
   * - Returns 0 immediately if sessionId is empty or falsy
   * - Uses Redis DEL command to remove the session key
   *
   * @example
   * ```typescript
   * const deletedCount = await cacheService.deleteSession('user-session-123');
   * console.log(`Deleted ${deletedCount} session(s)`);
   * ```
   */
  async deleteSession(sessionId: string): Promise<number> {
    return this.redisCache.del(sessionId);
  }
}
