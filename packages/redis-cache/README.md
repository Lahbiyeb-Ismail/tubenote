# @tubenote/redis-cache

A shared Redis cache service for the TubeNote platform.

## Features

- Singleton Redis client
- Basic cache operations (get, set, del)
- Statistics reporting

## Usage

```typescript
import { RedisCacheService } from "@tubenote/redis-cache";

const cacheService = new RedisCacheService({
  host: "localhost",
  port: 6379,
});

await cacheService.set("my-key", { foo: "bar" }, 60);
const value = await cacheService.get("my-key");
```