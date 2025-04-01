/**
 * Default rate limit configuration
 */
export const AUTH_RATE_LIMIT_CONFIG = {
  login: {
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
    blockDurationMs: 30 * 60 * 1000, // 30 minutes
  },
  registration: {
    maxAttempts: 3,
    windowMs: 60 * 60 * 1000, // 1 hour
    blockDurationMs: 24 * 60 * 60 * 1000, // 24 hours
  },
  forgotPassword: {
    maxAttempts: 2,
    windowMs: 60 * 60 * 1000, // 1 hour
    blockDurationMs: 60 * 60 * 1000, // 1 hour
  },
  verificationEmail: {
    maxAttempts: 3,
    windowMs: 60 * 60 * 1000, // 1 hour
  },
};
