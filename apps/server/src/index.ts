import dotenv from "dotenv";

import app from "@/app";
import { envConfig } from "@/modules/shared/config";
import { loggerService, prismaService } from "@/modules/shared/services";

dotenv.config();

const PORT = envConfig.server.port || 8080;

/**
 * Starts the server and listens on the specified port.
 *
 * Logs a message indicating that the server is running.
 */
const server = app.listen(PORT, async () => {
  try {
    await prismaService.connect();
    loggerService.info(
      `Database connected and server is running on http://localhost:${PORT}`
    );
  } catch (error) {
    loggerService.error("Failed to connect to the database", error);
    process.exit(1);
  }
});

const shutdown = async () => {
  loggerService.warn("Shutting down... 💥💥💥");
  try {
    await prismaService.disconnect();
    loggerService.warn("💥💥💥 Database connection closed 💥💥💥");
    process.exit(0);
  } catch (error) {
    loggerService.error("Failed to disconnect from database:", error);
    process.exit(1);
  }
};

/**
 * Event listener for uncaught exceptions.
 *
 * Logs the error and shuts down the process.
 *
 * @param {Error} err - The uncaught exception error.
 */
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
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
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

/**
 * Event listener for SIGTERM signal.
 *
 * Logs a message and shuts down the server gracefully.
 */
process.on("SIGINT", shutdown); // Handle Ctrl+C
process.on("SIGTERM", shutdown); // Handle termination signal
