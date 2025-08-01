import dotenv from "dotenv";

import app from "./app";
import { envConfig } from "./config";
import { logger } from "./services";

dotenv.config();

const port = envConfig.server.port;

const server = app.listen(port, () => {
  logger.info(`BFF server listening on port ${port}`);
});

/**
 * Event listener for uncaught exceptions.
 *
 * Logs the error and shuts down the process.
 *
 * @param {Error} err - The uncaught exception error.
 */
process.on("uncaughtException", (err) => {
  logger.warn("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  logger.error(err.name, err.message);
  process.exit(1);
});

/**
 * Event listener for unhandled promise rejections.
 *
 * Logs the error and shuts down the server gracefully.
 *
 * @param {Error} err - The unhandled rejection error.
 */
process.on("unhandledRejection", (err: Error) => {
  logger.warn("UNHANDLED REJECTION! 💥 Shutting down...");
  logger.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
