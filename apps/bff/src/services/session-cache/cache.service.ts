import Redis from "ioredis";

import type { IRedisSessionService, ISessionData } from "./cache.types";

import { envConfig } from "../../config";

export class RedisSessionService implements IRedisSessionService {
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
    console.log(`Cache: Creating session for ID: ${sessionId} with TTL: ${ttl}`);

    if (!sessionId || !data) {
      console.warn("Cache: Attempted to create session with invalid ID or data");
      return false;
    }

    const result = await this.client.set(sessionId, JSON.stringify(data), "EX", ttl);
    return result === "OK";
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
  async getSession(sessionId: string): Promise<ISessionData | null> {
    console.log(`Cache: Retrieving session for ID: ${sessionId}`);

    if (!sessionId) {
      console.warn("Cache: Attempted to retrieve session with empty ID");
      return null;
    }

    const data = await this.client.get(sessionId);

    return data ? JSON.parse(data) : null;
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
    console.log(`Cache: Deleting session for ID: ${sessionId}`);

    if (!sessionId) {
      console.warn("Cache: Attempted to delete a session with empty ID");
      return 0;
    }

    return this.client.del(sessionId);
  }
}
