import { CsrfMiddlewareOptions } from "@/middlewares/csrf";

/**
 * Default CSRF protection configuration
 * This configuration applies CSRF protection to all state-changing routes
 */
export const DEFAULT_CSRF_CONFIG: CsrfMiddlewareOptions = {
  ignoreMethods: ["GET", "HEAD", "OPTIONS"],
  ignorePaths: [
    "/api/v1/auth/google", // OAuth endpoints should be excluded
    "/api/v1/auth/google/callback",
    "/api/v1/health", // Health check endpoints
  ],
};

/**
 * CSRF protection with token rotation enabled
 * Use this configuration for highly sensitive operations like
 * password changes or payment processing
 */
export const SECURE_CSRF_CONFIG: CsrfMiddlewareOptions = {
  ...DEFAULT_CSRF_CONFIG,
  csrfOptions: {
    rotate: true, // Generate a new token after each request
    ttl: 10 * 60 * 1000, // 10 minutes
  },
};
