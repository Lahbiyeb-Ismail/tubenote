import type { ICacheService } from "../cache";
import type { ILoggerService } from "../logger";

export interface IRateLimitOptions {
  key: string;
  maxAttempts: number;
  windowMs: number;
  blockDurationMs?: number;
}

export interface IRateLimitResult {
  remaining: number;
  blocked: boolean;
  resetAt: Date | null;
}

export interface IRateLimitData {
  count: number;
  createdAt: number;
  blockedUntil?: number;
}

export interface IRateLimitServiceOptions {
  cacheService: ICacheService;
  logger: ILoggerService;
}
export interface IRateLimitService {
  check(options: IRateLimitOptions): Promise<IRateLimitResult>;
  increment(options: IRateLimitOptions): Promise<IRateLimitResult>;
  reset(key: string): Promise<void>;
}
