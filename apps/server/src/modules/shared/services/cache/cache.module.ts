import { CacheService } from "./cache.service";

// Create a singleton instance with a default TTL of 5 minutes
export const cacheService = new CacheService(300);
