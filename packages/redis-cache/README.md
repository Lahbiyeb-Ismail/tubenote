# @tubenote/redis-cache

This package provides a robust and reusable Redis cache service for the TubeNote platform. It is built on top of `ioredis` and offers a simplified interface for common caching operations.

## 1. Core Features

-   **Singleton Client**: Manages a single, efficient `ioredis` client instance.
-   **Simplified API**: Offers a clean and straightforward interface for `get`, `set`, and `del` operations.
-   **Automatic JSON Serialization**: Automatically serializes objects to JSON strings before caching and deserializes them upon retrieval.
-   **Time-To-Live (TTL) Support**: Allows setting an expiration time for cached items.
-   **Cache Management**: Includes methods to `flush` the entire cache and retrieve performance `stats`.
-   **Type-Safe**: Provides a generic interface for type-safe operations.

## 2. Installation

This package is part of the `tubenote` monorepo. To install all dependencies, run the following command from the **root directory**:

```bash
pnpm install
```

## 3. API and Usage

### Initialization

To use the service, import `RedisCacheService` and instantiate it with your Redis connection options. It accepts the same options as `ioredis`.

```typescript
import { RedisCacheService } from "@tubenote/redis-cache";

const cacheService = new RedisCacheService({
  host: "localhost",
  port: 6379,
  password: "your-redis-password",
});
```

### Caching a Value

Use the `set` method to store a value. You can optionally provide a TTL (Time-To-Live) in seconds.

```typescript
const userProfile = { id: 1, name: "John Doe" };

// Cache the profile for 1 hour (3600 seconds)
await cacheService.set("user:1:profile", userProfile, 3600);
```

### Retrieving a Value

Use the `get` method to retrieve a value. It automatically deserializes the JSON string back into an object.

```typescript
interface UserProfile {
  id: number;
  name: string;
}

const userProfile = await cacheService.get<UserProfile>("user:1:profile");

if (userProfile) {
  console.log(userProfile.name); // "John Doe"
}
```

### Deleting a Value

Use the `del` method to remove a key from the cache.

```typescript
const deletedCount = await cacheService.del("user:1:profile");
console.log(`Deleted ${deletedCount} key(s)`);
```

### Flushing the Cache

To clear all keys from the cache, use the `flush` method. **Use with caution!**

```typescript
await cacheService.flush();
console.log("Cache has been cleared.");
```

### Getting Cache Statistics

Retrieve performance metrics like keys, hits, and misses using `getStats`.

```typescript
const stats = await cacheService.getStats();
console.log(`Cache Stats: ${stats.keys} keys, ${stats.hits} hits, ${stats.misses} misses.`);
```

## 4. Building the Package

To build or watch the package for development, run the following commands from the root of the monorepo:

-   `pnpm --filter @tubenote/redis-cache build`: Compiles the package for production.
-   `pnpm --filter @tubenote/redis-cache dev`: Watches for file changes and rebuilds automatically.

## 5. License

This package is licensed under the **ISC License**.
