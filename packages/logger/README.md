# @tubenote/logger

A reusable and configurable logging service for the TubeNote application, built on top of the powerful `winston` library.

## ✨ Features

-   **Multiple Log Levels:** Supports standard log levels (`error`, `warn`, `info`, `http`, `debug`).
-   **Flexible Transports:** Logs to the console with colorization for readability and to files for persistence.
-   **Structured Logging:** Outputs logs in JSON format to files, making them easy to parse and analyze.
-   **Customizable Formatting:** Provides clear, timestamped log messages.
-   **TypeScript Support:** Fully typed for a better development experience.

## 📦 Installation

This package is part of the TubeNote monorepo. To install all dependencies, run the following command from the root of the project:

```bash
pnpm install
```

## 🚀 Usage

Import the `Logger` class and create a new instance to start logging.

```typescript
import { Logger } from '@tubenote/logger';

const logger = new Logger();

// Basic logging
logger.info("User logged in successfully.");
logger.warn("Configuration value is missing, using default.");

// Logging with metadata
const error = new Error("Database connection failed");
logger.error("Failed to process request.", { 
  requestId: 'xyz-123',
  error: error.message 
});

logger.http("POST /api/users - 201 Created");
```

## ⚙️ Configuration

The logger comes with a default configuration that can be found in `src/logger.constants.ts`.

-   **Log Levels:** `error`, `warn`, `info`, `http`, `debug`.
-   **Transports:**
    -   **Console:** Colorized, human-readable output.
    -   **File (Errors):** Logs `error` level messages to `logs/error.log`.
    -   **File (Combined):** Logs all messages to `logs/all.log`.
-   **Timestamp Format:** `YYYY-MM-DD HH:mm:ss`

## 📜 API Reference

### `new Logger()`

Creates a new logger instance with the default configuration.

### Logging Methods

The following methods are available for logging messages at different levels. They all share the same signature:

`(message: string, meta?: any) => void`

-   `logger.error(message, meta)`
-   `logger.warn(message, meta)`
-   `logger.info(message, meta)`
-   `logger.http(message, meta)`
-   `logger.debug(message, meta)`

### Utility Methods

-   `getLogger(): winston.Logger`: Returns the underlying `winston` logger instance for advanced use cases.
-   `addTransport(transport: winston.transport)`: Adds a custom `winston` transport to the logger.
-   `clearTransports()`: Removes all transports from the logger.

## 🛠️ Scripts

-   `pnpm build`: Compiles the TypeScript code into JavaScript for production use.
-   `pnpm dev`: Runs the build in watch mode for development.
-   `pnpm clean`: Removes the `dist` directory.

## 📄 License

This package is licensed under the **ISC License**.
