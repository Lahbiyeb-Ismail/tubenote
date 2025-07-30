# @tubenote/utils

This package contains shared utility functions used across the tubenote monorepo.

## Installation

This is an internal package within a pnpm workspace, so you don't need to install it separately. It is available to other packages in the monorepo.

## API

### `asyncTryCatch`

A utility function to handle asynchronous operations with a try-catch block. It wraps a promise and returns a result object containing either the resolved data or the caught error.

**Signature**

```typescript
function asyncTryCatch<T, E = Error>(
  promise: Promise<T>
): Promise<Result<T, E>>
```

**Return Type**

The function returns a `Result` object with the following shape:

```typescript
type Result<T, E = Error> =
  | { data: T; error: null }
  | { data: null; error: E };
```

**Example Usage**

```typescript
import { asyncTryCatch } from '@tubenote/utils';

async function getUser(id: string) {
  // This might throw an error
  const user = await fetchUserFromDb(id);
  return user;
}

async function main() {
  const { data: user, error } = await asyncTryCatch(getUser("123"));

  if (error) {
    console.error("Failed to get user:", error);
    return;
  }

  console.log("User found:", user);
}
```

## Development Scripts

- `pnpm dev`: Watch for changes in the `src` directory and rebuild on the fly.
- `pnpm build`: Build the package for production.
- `pnpm clean`: Remove the `dist` directory.
