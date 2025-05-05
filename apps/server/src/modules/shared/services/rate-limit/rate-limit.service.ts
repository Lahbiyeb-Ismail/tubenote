import { TYPES } from "@/config/inversify/types";
import { inject, injectable } from "inversify";
import { ICacheService } from "../cache/cache.types";
import { ILoggerService } from "../logger/logger.types";
import {
  type IRateLimitData,
  IRateLimitOptions,
  IRateLimitResult,
  IRateLimitService,
} from "./rate-limit.types";

/**
 * Rate limiting service implementation using a fixed window algorithm
 *
 * This service provides methods to check, increment, and reset rate limits
 * for different resources identified by a key.
 */
@injectable()
export class RateLimitService implements IRateLimitService {
  constructor(
    @inject(TYPES.CacheService) private readonly cacheService: ICacheService,
    @inject(TYPES.LoggerService) private readonly logger: ILoggerService
  ) {}

  /**
   * Calculate the reset time based on current data
   *
   * @param data Rate limit data
   * @param windowMs Time window in milliseconds
   * @param now Current timestamp
   * @returns Date object representing when the rate limit resets, or null
   */
  private calculateResetTime(
    data: IRateLimitData | null,
    windowMs: number,
    now: number
  ): Date | null {
    if (!data) return null;

    const { blockedUntil, createdAt } = data;

    if (blockedUntil && blockedUntil > now) {
      return new Date(blockedUntil);
    } else if (createdAt) {
      const expiresAt = createdAt + windowMs;
      if (expiresAt > now) {
        return new Date(expiresAt);
      }
    }

    return null;
  }

  /**
   * Validate rate limit options
   *
   * @param options Rate limit options to validate
   * @throws Error if options are invalid
   */
  private validateOptions(options: IRateLimitOptions): void {
    if (!options.key || typeof options.key !== "string") {
      throw new Error("Invalid key: must be a non-empty string");
    }

    if (typeof options.maxAttempts !== "number" || options.maxAttempts < 0) {
      throw new Error("Invalid maxAttempts: must be a non-negative number");
    }

    if (typeof options.windowMs !== "number" || options.windowMs <= 0) {
      throw new Error("Invalid windowMs: must be a positive number");
    }

    if (
      options.blockDurationMs !== undefined &&
      (typeof options.blockDurationMs !== "number" ||
        options.blockDurationMs < 0)
    ) {
      throw new Error("Invalid blockDurationMs: must be a non-negative number");
    }
  }

  /**
   * Check if a request is rate limited without incrementing the counter
   *
   * @param options Rate limit options
   * @returns Promise resolving to rate limit result
   */
  public async check(options: IRateLimitOptions): Promise<IRateLimitResult> {
    const { key, maxAttempts, windowMs } = options;
    const now = Date.now();

    try {
      this.validateOptions(options);

      // Get current rate limit data
      const data = this.cacheService.get<IRateLimitData>(key);

      if (!data) {
        return {
          remaining: maxAttempts,
          blocked: false,
          resetAt: null,
        };
      }

      const { count, blockedUntil } = data;
      const isBlocked = !!blockedUntil && blockedUntil > now;
      const remaining = Math.max(0, maxAttempts - count);
      const resetAt = this.calculateResetTime(data, windowMs, now);

      return {
        remaining,
        blocked: isBlocked,
        resetAt,
      };
    } catch (error) {
      this.logger.error("Error checking rate limit", {
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
   *
   * @param options Rate limit options
   * @returns Promise resolving to rate limit result
   */
  public async increment(
    options: IRateLimitOptions
  ): Promise<IRateLimitResult> {
    const { key, maxAttempts, windowMs, blockDurationMs = 0 } = options;
    const now = Date.now();

    try {
      this.validateOptions(options);

      // Get current data or initialize new data
      let data = this.cacheService.get<IRateLimitData>(key);

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
      if (data.count > maxAttempts && blockDurationMs > 0) {
        data.blockedUntil = now + blockDurationMs;

        this.logger.warn("Rate limit exceeded, blocking further attempts", {
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
      this.cacheService.set<IRateLimitData>(key, data, ttlSeconds);

      // Calculate remaining attempts and reset time
      const remaining = Math.max(0, maxAttempts - data.count);
      const resetAt = this.calculateResetTime(data, windowMs, now);

      return {
        remaining,
        blocked: !!data.blockedUntil && data.blockedUntil > now,
        resetAt,
      };
    } catch (error) {
      this.logger.error("Error incrementing rate limit", {
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
   *
   * @param key The key to reset
   * @returns Promise that resolves when the reset is complete
   */
  public async reset(key: string): Promise<void> {
    try {
      if (!key || typeof key !== "string") {
        throw new Error("Invalid key: must be a non-empty string");
      }

      this.cacheService.del(key);
      this.logger.debug("Rate limit reset", { key });
    } catch (error) {
      this.logger.error("Error resetting rate limit", {
        key,
        error: error instanceof Error ? error.message : String(error),
      });

      throw error;
    }
  }
}
