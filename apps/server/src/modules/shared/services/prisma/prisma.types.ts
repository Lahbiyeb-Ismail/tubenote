import type { Prisma, PrismaClient } from "@prisma/client";
import type { ILoggerService } from "../logger";

/**
 * Interface representing the Prisma service with extended functionalities.
 *
 * @extends PrismaClient
 *
 * @method connect
 * Connects to the Prisma database.
 * @returns {Promise<void>} A promise that resolves when the connection is established.
 *
 * @method disconnect
 * Disconnects from the Prisma database.
 * @returns {Promise<void>} A promise that resolves when the connection is closed.
 *
 * @method transaction
 * Executes a function within a transaction.
 * @template T
 * @param {function} fn - The function to execute within the transaction.
 * @param {object} [options] - Optional transaction options.
 * @param {number} [options.maxRetries] - Maximum number of retries for the transaction.
 * @param {number} [options.retryDelay] - Delay between retries in milliseconds.
 * @returns {Promise<T>} A promise that resolves with the result of the transaction.
 *
 * @method withTransaction
 * Executes a function within a transaction without additional options.
 * @template T
 * @param {function} fn - The function to execute within the transaction.
 * @returns {Promise<T>} A promise that resolves with the result of the transaction.
 *
 * @method createSoftDeleteMiddleware
 * Creates a middleware for soft deleting records.
 * @param {string[]} models - The list of models to apply the soft delete middleware to.
 * @returns {Prisma.Middleware} The middleware function for soft deleting records.
 */
export interface IPrismaService
  extends PrismaClient<
    Prisma.PrismaClientOptions,
    "query" | "error" | "info" | "warn"
  > {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  transaction<T>(
    fn: (tx: Prisma.TransactionClient) => Promise<T>,
    options?: { maxRetries?: number; retryDelay?: number }
  ): Promise<T>;
  withTransaction<T>(
    fn: (tx: Prisma.TransactionClient) => Promise<T>
  ): Promise<T>;
  createSoftDeleteMiddleware(models: string[]): Prisma.Middleware;
}

/**
 * Options for configuring the Prisma service.
 *
 * @typedef {Object} PrismaServiceOptions
 *
 * @property {number} [maxRetries] - The maximum number of retries for a failed operation.
 * @property {number} [retryDelay] - The delay between retries in milliseconds.
 * @property {ILoggerService} [logger] - An optional logger service for logging operations.
 * @property {Prisma.PrismaClientOptions} [prismaOptions] - Additional options for the Prisma client.
 */
export type PrismaServiceOptions = {
  maxRetries?: number;
  retryDelay?: number;
  logger?: ILoggerService;
  prismaOptions?: Prisma.PrismaClientOptions;
};
