import type { Request } from "express";

export interface IRateLimitConfig {
  maxAttempts: number;
  windowMs: number;
  blockDurationMs: number;
}

export interface IRateLimitMiddlewareOptions {
  rateLimitConfig: IRateLimitConfig;
  keyGenerator: (req: Request) => string;
}
