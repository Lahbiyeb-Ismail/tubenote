# @tubenote/api-errors

A centralized package for handling custom, operational errors across the TubeNote platform. This module provides a set of standardized error classes and constants to ensure consistent and predictable error handling in all our applications.

## 1. Core Concepts

The primary goal of this package is to create a clear distinction between operational errors (expected, like "Not Found") and programmer errors (bugs). All custom errors extend a `BaseError` class, which includes important metadata for handling HTTP responses gracefully.

### BaseError

The `BaseError` class includes the following key properties:

-   `httpCode`: The corresponding HTTP status code (e.g., `404`, `400`).
-   `isOperational`: A boolean indicating if this is a known, operational error (`true`) or a programmer error (`false`). This is crucial for deciding whether to restart the application or simply inform the user.
-   `errorName`: A unique, machine-readable name for the error (e.g., `NOT_FOUND`).
-   `message`: A human-readable description of the error.

## 2. Installation

This package is managed as part of the `tubenote` monorepo. To install all dependencies, run the following command from the root directory:

```bash
pnpm install
```

## 3. Usage

### Throwing Custom Errors

You can import and use the error classes directly in your services or controllers. This allows for standardized HTTP responses and logging.

**Example:**

```typescript
import { NotFoundError, ERROR_MESSAGES } from "@tubenote/api-errors";

function findUser(userId: string) {
  const user = // ... logic to find a user
  if (!user) {
    throw new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND);
  }
  return user;
}
```

This will throw an error that can be caught by a global error handler, which can then use the `httpCode` (404) and `message` to send a consistent response to the client.

## 4. Available Error Classes

This package provides the following error classes, each corresponding to a specific HTTP status code:

-   `BadRequestError` (400)
-   `UnauthorizedError` (401)
-   `ForbiddenError` (403)
-   `NotFoundError` (404)
-   `ConflictError` (409)
-   `TooManyRequestsError` (429)
-   `InternalServerError` (500)
-   `DatabaseError` (500)

## 5. Error Constants

To maintain consistency, the package also exports predefined error messages and names.

-   `ERROR_MESSAGES`: A collection of human-readable messages for common scenarios (e.g., authentication, database operations).
-   `ERROR_NAMES`: A set of unique, machine-readable names for specific errors.

**Categories:**

-   Authentication (`AUTH_ERRORS`)
-   Database (`DATABASE_ERRORS`)
-   Email (`EMAIL_ERRORS`)
-   HTTP (`HTTP_ERRORS`)
-   Notifications (`NOTIFICATION_ERRORS`)
-   Password (`PASSWORD_ERRORS`)
-   Tokens (`TOKEN_ERRORS`)

## 6. Building the Package

You can build or watch the package for changes using the following scripts:

-   `pnpm build`: Compiles the package for production.
-   `pnpm dev`: Watches for file changes and rebuilds automatically.

## 7. License

This package is licensed under the **ISC License**.
