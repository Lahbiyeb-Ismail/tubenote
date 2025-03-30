import type { NextFunction, Request, Response } from "express";

import { TooManyRequestsError } from "@/modules/shared/api-errors";
import { ERROR_MESSAGES } from "@/modules/shared/constants";
import type {
  ILoggerService,
  IRateLimitService,
} from "@/modules/shared/services";

interface IRateLimitMiddlewareOptions {
  rateLimitService: IRateLimitService;
  logger: ILoggerService;
  keyGenerator: (req: Request) => string;
  limits: {
    maxAttempts: number;
    windowMs: number;
    blockDurationMs: number;
  };
  errorMessage?: string;
}

/**
 * Creates a rate limiting middleware for Express
 *
 * @param {Object} options - Rate limiting options
 * @param {Object} options.rateLimitService - The rate limit service instance
 * @param {Object} options.logger - The logger service instance
 * @param {Function} options.keyGenerator - Function to generate rate limit key from request
 * @param {Object} options.limits - Rate limit configuration
 * @param {number} options.limits.maxAttempts - Maximum number of attempts allowed
 * @param {number} options.limits.windowMs - Time window in milliseconds
 * @param {number} options.limits.blockDurationMs - Duration to block after exceeding limit
 * @param {string} options.errorMessage - Error message to display when rate limited
 */
export function createRateLimitMiddleware(
  options: IRateLimitMiddlewareOptions
) {
  const {
    rateLimitService,
    logger,
    keyGenerator,
    limits,
    errorMessage = ERROR_MESSAGES.TOO_MANY_ATTEMPTS,
  } = options;

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Generate key based on the request
      const key = keyGenerator(req);

      // Check if the request is already rate limited
      const result = await rateLimitService.check({
        key,
        maxAttempts: limits.maxAttempts,
        windowMs: limits.windowMs,
        blockDurationMs: limits.blockDurationMs,
      });

      // Set rate limit headers
      res.set("X-RateLimit-Limit", limits.maxAttempts.toString());
      res.set("X-RateLimit-Remaining", result.remaining.toString());

      if (result.resetAt) {
        const resetTime = Math.ceil(result.resetAt.getTime() / 1000);
        res.set("X-RateLimit-Reset", resetTime.toString());
      }

      // If blocked, throw rate limit error
      if (result.blocked) {
        logger.warn(`Rate limit exceeded for key: ${key}`, {
          key,
          resetAt: result.resetAt,
        });

        // Calculate retry after in seconds
        const retryAfterSeconds = result.resetAt
          ? Math.ceil((result.resetAt.getTime() - Date.now()) / 1000)
          : Math.ceil(limits.blockDurationMs / 1000);

        res.set("Retry-After", retryAfterSeconds.toString());

        throw new TooManyRequestsError(errorMessage, {
          resetAt: result.resetAt,
          remainingSeconds: retryAfterSeconds,
        });
      }

      // Store the rate limit key in the request for later use
      req.rateLimitKey = key;

      // Continue to the next middleware
      next();
    } catch (error) {
      if (error instanceof TooManyRequestsError) {
        throw error;
      }

      // For other errors, pass to the error handler
      next(error);
    }
  };
}
