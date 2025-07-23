/**
 * Session data structure containing authentication tokens.
 * Used to store user authentication information in Redis cache.
 */
export interface ISessionData {
  /** JWT access token for API authentication */
  accessToken: string;
  /** JWT refresh token for obtaining new access tokens */
  refreshToken: string;
}

/**
 * Redis-based session service interface for managing user sessions with TTL support.
 * Provides methods for creating, retrieving, and deleting session data in Redis cache.
 */
export interface IRedisSessionService {
  /**
   * Creates a new session in Redis with the specified data and time-to-live.
   *
   * @param sessionId - Unique identifier for the session
   * @param data - Session data to store
   * @param ttl - Time-to-live in seconds for the session
   * @returns Promise that resolves to true if session was created successfully, false otherwise
   */
  createSession: (sessionId: string, data: ISessionData, ttl: number) => Promise<boolean>;

  /**
   * Retrieves session data from Redis by session ID.
   *
   * @param sessionId - Unique identifier for the session to retrieve
   * @returns Promise that resolves to session data if found, undefined if session doesn't exist or has expired
   */
  getSession: (sessionId: string) => Promise<ISessionData | undefined>;

  /**
   * Deletes a session from Redis by session ID.
   *
   * @param sessionId - Unique identifier for the session to delete
   * @returns Promise that resolves to the number of keys deleted (1 if successful, 0 if key didn't exist)
   */
  deleteSession: (sessionId: string) => Promise<number>;
}
