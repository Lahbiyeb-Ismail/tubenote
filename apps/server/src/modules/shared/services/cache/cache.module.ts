import { CacheService } from "./cache.service";

// Create a singleton instance with a default time-to-live (TTL) of 5 minutes
export const cacheService = CacheService.getInstance({ ttlSeconds: 300 });
