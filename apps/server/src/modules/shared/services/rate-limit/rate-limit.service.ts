import { ICacheService } from "../cache/cache.types";
import { ILoggerService } from "../logger/logger.types";
import {
  type IRateLimitData,
  IRateLimitOptions,
  IRateLimitResult,
  IRateLimitService,
  type IRateLimitServiceOptions,
} from "./rate-limit.types";

/**
 * Rate limiting service implementation
 */
export class RateLimitService implements IRateLimitService {
  private static _instance: RateLimitService;

  private constructor(
    private readonly _cacheService: ICacheService,
    private readonly _logger: ILoggerService
  ) {}

  public static getInstance(
    options: IRateLimitServiceOptions
  ): RateLimitService {
    if (!this._instance) {
      this._instance = new RateLimitService(
        options.cacheService,
        options.logger
      );
    }
    return this._instance;
  }

  /**
   * Check if a request is rate limited
   */
  async check(options: IRateLimitOptions): Promise<IRateLimitResult> {
    const { key, maxAttempts } = options;
    const now = Date.now();

    try {
      // Get current rate limit data
      const data = this._cacheService.get<IRateLimitData>(key);

      if (!data) {
        return {
          remaining: maxAttempts,
          blocked: false,
          resetAt: null,
        };
      }

      const { count, blockedUntil, createdAt } = data;
      const isBlocked = !!blockedUntil && blockedUntil > now;
      const remaining = Math.max(0, maxAttempts - count);

      // Calculate reset time based on window
      let resetAt: Date | null = null;

      if (isBlocked) {
        resetAt = new Date(blockedUntil);
      } else if (createdAt) {
        // Calculate when the window expires
        const expiresAt = createdAt + options.windowMs;
        if (expiresAt > now) {
          resetAt = new Date(expiresAt);
        }
      }

      return {
        remaining,
        blocked: isBlocked,
        resetAt,
      };
    } catch (error) {
      this._logger.error("Error checking rate limit", {
        key,
        error: error instanceof Error ? error.message : String(error),
      });

      // Fail open - allow the request if we can't check the rate limit
      return {
        remaining: maxAttempts,
        blocked: false,
        resetAt: null,
      };
    }
  }

  /**
   * Increment the rate limit counter
   */
  async increment(options: IRateLimitOptions): Promise<IRateLimitResult> {
    const { key, maxAttempts, windowMs, blockDurationMs } = options;
    const now = Date.now();

    try {
      // Get current data or initialize new data
      let data = this._cacheService.get<IRateLimitData>(key);

      if (!data) {
        data = {
          count: 0,
          createdAt: now,
        };
      }

      // Check if already blocked
      if (data.blockedUntil && data.blockedUntil > now) {
        return {
          remaining: 0,
          blocked: true,
          resetAt: new Date(data.blockedUntil),
        };
      }

      // Check if window has expired and reset if needed
      if (data.createdAt && data.createdAt + windowMs < now) {
        data = {
          count: 0,
          createdAt: now,
        };
      }

      // Increment counter
      data.count += 1;

      // Check if we need to block
      if (data.count > maxAttempts && blockDurationMs) {
        data.blockedUntil = now + blockDurationMs;

        this._logger.warn("Rate limit exceeded, blocking further attempts", {
          key,
          attempts: data.count,
          maxAttempts,
          blockDurationMs,
          expiresAt: new Date(data.blockedUntil),
        });
      }

      // Save updated data with appropriate TTL
      // Use the longer of windowMs or blockDurationMs for TTL
      const ttl = data.blockedUntil
        ? Math.max(windowMs, data.blockedUntil - now)
        : windowMs;

      // Convert to seconds for the cache service (NodeCache uses seconds)
      const ttlSeconds = Math.ceil(ttl / 1000);

      // Store in cache with custom TTL
      this._cacheService.set<IRateLimitData>(key, data, ttlSeconds);

      // Calculate remaining attempts and reset time
      const remaining = Math.max(0, maxAttempts - data.count);
      let resetAt: Date | null = null;

      if (data.blockedUntil) {
        resetAt = new Date(data.blockedUntil);
      } else {
        resetAt = new Date(data.createdAt + windowMs);
      }

      return {
        remaining,
        blocked: !!data.blockedUntil && data.blockedUntil > now,
        resetAt,
      };
    } catch (error) {
      this._logger.error("Error incrementing rate limit", {
        key,
        error: error instanceof Error ? error.message : String(error),
      });

      // Fail open
      return {
        remaining: maxAttempts,
        blocked: false,
        resetAt: null,
      };
    }
  }

  /**
   * Reset the rate limit counter
   */
  async reset(key: string): Promise<void> {
    try {
      this._cacheService.del(key);

      this._logger.debug("Rate limit reset", { key });
    } catch (error) {
      this._logger.error("Error resetting rate limit", {
        key,
        error: error instanceof Error ? error.message : String(error),
      });

      throw error;
    }
  }
}
