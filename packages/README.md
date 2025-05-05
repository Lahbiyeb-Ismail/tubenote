# TubeNote Packages

This directory contains shared packages used across the TubeNote platform. These packages provide reusable code, types, and utilities to ensure consistency between the client and server applications.

## Structure

- [`dtos/`](./dtos/README.md) - Data Transfer Objects for type-safe API communication
- [`schemas/`](./schemas/README.md) - Zod validation schemas for data validation
- [`types/`](./types/README.md) - TypeScript type definitions shared across applications
- [`utils/`](./utils/README.md) - Shared utility functions and helpers

## Building Packages

From the root directory, you can build all packages:

```bash
pnpm build:types
pnpm build:schemas
pnpm build:dtos
pnpm build:utils
```

Or build all packages in parallel:

```bash
pnpm build:all
```

## Usage

These packages are used as workspace dependencies in the client and server applications. For example, in a package.json file:

```json
"dependencies": {
  "@tubenote/dtos": "workspace:*",
  "@tubenote/schemas": "workspace:*",
  "@tubenote/types": "workspace:*",
  "@tubenote/utils": "workspace:*"
}
```
