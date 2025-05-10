import type { NextFunction, Request, Response } from "express";

import { rateLimitService } from "@/config/service-provider";
import { TooManyRequestsError } from "@/modules/shared/api-errors";
import { ERROR_MESSAGES } from "@/modules/shared/constants";
import { loggerService } from "@/modules/shared/services";
import type { IRateLimitMiddlewareOptions } from "./rate-limit.middleware.types";

/**
 * Creates a rate limiting middleware for Express
 *
 * @param {Object} options - Rate limiting options
 * @param {Function} options.keyGenerator - Function to generate rate limit key from request
 * @param {Object} options.rateLimitConfig - Rate limit configuration
 * @param {number} options.rateLimitConfig.maxAttempts - Maximum number of attempts allowed
 * @param {number} options.rateLimitConfig.windowMs - Time window in milliseconds
 * @param {number} options.rateLimitConfig.blockDurationMs - Duration to block after exceeding limit
 */
export function createRateLimitMiddleware(
  options: IRateLimitMiddlewareOptions
) {
  const { keyGenerator, rateLimitConfig } = options;

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Generate key based on the request
      const key = keyGenerator(req);

      // Check if the request is already rate limited
      const result = await rateLimitService.check({
        key,
        maxAttempts: rateLimitConfig.maxAttempts,
        windowMs: rateLimitConfig.windowMs,
        blockDurationMs: rateLimitConfig.blockDurationMs,
      });

      // Set rate limit headers
      res.set("X-RateLimit-Limit", rateLimitConfig.maxAttempts.toString());
      res.set("X-RateLimit-Remaining", result.remaining.toString());

      if (result.resetAt) {
        const resetTime = Math.ceil(result.resetAt.getTime() / 1000);
        res.set("X-RateLimit-Reset", resetTime.toString());
      }

      // If blocked, throw rate limit error
      if (result.blocked) {
        loggerService.warn(`Rate limit exceeded for key: ${key}`, {
          key,
          resetAt: result.resetAt,
        });

        // Calculate retry after in seconds
        const retryAfterSeconds = result.resetAt
          ? Math.ceil((result.resetAt.getTime() - Date.now()) / 1000)
          : Math.ceil(rateLimitConfig.blockDurationMs / 1000);

        res.set("Retry-After", retryAfterSeconds.toString());

        throw new TooManyRequestsError(ERROR_MESSAGES.TOO_MANY_ATTEMPTS, {
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
