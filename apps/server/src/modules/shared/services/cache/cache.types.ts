import type NodeCache from "node-cache";

export interface ICacheService {
  set<T>(key: string, value: T): boolean;
  get<T>(key: string): T | undefined;
  del(key: string): number;
  flush(): void;
  getStats(): NodeCache.Stats;
}
