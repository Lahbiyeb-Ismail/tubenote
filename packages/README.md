# TubeNote Packages

This directory contains shared packages used across the TubeNote platform. These packages provide reusable code, types, and utilities to ensure consistency between the client and server applications.

## Structure

- [`api-errors/`](./api-errors/README.md) - A collection of custom error classes for consistent error handling across the platform.
- [`config-typescript/`](./config-typescript/README.md) - Shared TypeScript configurations for the entire monorepo.
- [`database/`](./database/README.md) - Manages the database connection, schema, and queries.
- [`dtos/`](./dtos/README.md) - Data Transfer Objects for type-safe API communication
- [`redis-cache/`](./redis-cache/README.md) - A caching layer with Redis to improve performance.
- [`schemas/`](./schemas/README.md) - Zod validation schemas for data validation
- [`types/`](./types/README.md) - TypeScript type definitions shared across applications
- [`utils/`](./utils/README.md) - Shared utility functions and helpers
- [`youtube-api/`](./youtube-api/README.md) - A wrapper around the YouTube API for fetching video data.

## Building Packages

From the root directory, you can build all packages:

```bash
pnpm build:api-errors
pnpm build:database
pnpm build:dtos
pnpm build:redis-cache
pnpm build:schemas
pnpm build:types
pnpm build:utils
pnpm build:youtube-api
```

Or build all packages in parallel:

```bash
pnpm build:all
```

## Usage

These packages are used as workspace dependencies in the client and server applications. For example, in a package.json file:

```json
"dependencies": {
  "@tubenote/api-errors": "workspace:*",
  "@tubenote/database": "workspace:*",
  "@tubenote/dtos": "workspace:*",
  "@tubenote/redis-cache": "workspace:*",
  "@tubenote/schemas": "workspace:*",
  "@tubenote/types": "workspace:*",
  "@tubenote/utils": "workspace:*",
  "@tubenote/youtube-api": "workspace:*"
}
```
