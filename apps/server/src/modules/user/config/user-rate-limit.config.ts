import type { IRateLimitConfig } from "@/middlewares/rate-limit";

export const USER_RATE_LIMIT_CONFIG: Record<string, IRateLimitConfig> = {
  updatePassword: {
    maxAttempts: 1,
    windowMs: 60 * 60 * 1000, // 1 hour
    blockDurationMs: 24 * 60 * 60 * 1000, // 24 hours
  },
};
