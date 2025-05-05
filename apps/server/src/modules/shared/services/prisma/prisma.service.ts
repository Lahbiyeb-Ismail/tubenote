import { Prisma, PrismaClient } from "@prisma/client";

import { TYPES } from "@/config/inversify/types";
import { inject, injectable } from "inversify";
import type { ILoggerService } from "../logger";
import type { IPrismaService } from "./prisma.types";

@injectable()
export class PrismaService
  extends PrismaClient<
    Prisma.PrismaClientOptions,
    "query" | "error" | "info" | "warn"
  >
  implements IPrismaService
{
  private static instance: PrismaService;
  private retryCount = 0;
  private isConnected = false;
  private readonly maxRetries: number = 3;
  private readonly retryDelay: number = 500;

  constructor(@inject(TYPES.LoggerService) private logger: ILoggerService) {
    super({
      log: [
        { level: "warn", emit: "event" },
        { level: "info", emit: "event" },
        { level: "error", emit: "event" },
        { level: "query", emit: "event" },
      ],
    });

    this.setupEventListeners();
  }

  /**
   * Sets up event listeners for Prisma client events.
   *
   * This method listens for the following events:
   * - `query`: Logs the executed query and its duration.
   * - `error`: Logs any errors that occur.
   * - `info`: Logs informational messages.
   * - `warn`: Logs warning messages.
   *
   * Each event logs relevant details using the appropriate logger method.
   *
   * @private
   */
  private setupEventListeners() {
    this.$on("query", (e) => {
      this.logger?.debug?.(`Query: ${e.query}`, {
        duration: e.duration,
        target: e.target,
      });
    });

    this.$on("error", (e) => {
      this.logger?.error?.(`Error: ${e.message}`, {
        target: e.target,
      });
    });

    this.$on("info", (e) => {
      this.logger?.info?.(`Info: ${e.message}`, {
        target: e.target,
      });
    });

    this.$on("warn", (e) => {
      this.logger?.warn?.(`Warning: ${e.message}`, {
        target: e.target,
      });
    });
  }

  /**
   * Determines if the provided error is a retryable Prisma error.
   *
   * This method checks if the error is an instance of `Prisma.PrismaClientKnownRequestError`
   * and if its error code is one of the known retryable error codes: "P2028", "P2034", "P1008", "P1001", "P1017".
   *
   * @param error - The error to check.
   * @returns `true` if the error is retryable, `false` otherwise.
   */
  private isRetryableError(error: unknown): boolean {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError)) return false;

    return ["P2028", "P2034", "P1008", "P1001", "P1017"].includes(error.code);
  }

  /**
   * Method to wait for a specified amount of time.
   *
   * @param ms - The number of milliseconds to wait.
   * @returns A promise that resolves after the specified delay.
   */
  private wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Checks if a transaction is currently in progress.
   *
   * @returns {boolean} `true` if a transaction is in progress, otherwise `false`.
   */
  private isTransactionInProgress(): boolean {
    return this.retryCount > 0;
  }

  /**
   * Establishes a connection to the database if not already connected.
   *
   * @returns {Promise<void>} A promise that resolves when the connection is successfully established.
   *
   * @throws Will throw an error if the connection attempt fails.
   */
  public async connect(): Promise<void> {
    if (this.isConnected) return;

    try {
      await this.$connect();
      this.isConnected = true;
      this.logger?.info?.("Successfully connected to database");
    } catch (error) {
      this.logger?.error?.("Database connection failed", { error });
      throw error;
    }
  }

  /**
   * Disconnects from the database if currently connected.
   *
   * @returns {Promise<void>} A promise that resolves when the disconnection is complete.
   *
   * @throws Will throw an error if the disconnection process fails.
   *
   * @remarks
   * This method checks if the service is currently connected to the database.
   * If it is, it attempts to disconnect and logs the result.
   * If the disconnection fails, it logs the error and rethrows it.
   */
  public async disconnect(): Promise<void> {
    if (!this.isConnected) return;

    try {
      await this.$disconnect();
      this.isConnected = false;
      this.logger?.info?.("Successfully disconnected from database");
    } catch (error) {
      this.logger?.error?.("Database disconnection failed", { error });
      throw error;
    }
  }

  /**
   * Executes a function within a database transaction, with support for retries.
   *
   * @template T - The type of the result returned by the transaction function.
   * @param {function(Prisma.TransactionClient): Promise<T>} fn - The function to execute within the transaction.
   * @param {Object} [options] - Optional settings for the transaction.
   * @param {number} [options.maxRetries] - The maximum number of retries if the transaction fails. Defaults to `this.maxRetries`.
   * @param {number} [options.retryDelay] - The delay between retries in milliseconds. Defaults to `this.retryDelay`.
   * @returns {Promise<T>} - A promise that resolves with the result of the transaction function.
   * @throws {Error} - Throws an error if the transaction fails after all retries.
   */
  public async transaction<T>(
    fn: (tx: Prisma.TransactionClient) => Promise<T>,
    options?: {
      maxRetries?: number;
      retryDelay?: number;
    }
  ): Promise<T> {
    const maxRetries = options?.maxRetries ?? this.maxRetries;
    const retryDelay = options?.retryDelay ?? this.retryDelay;

    while (this.retryCount < maxRetries) {
      try {
        return await this.$transaction(
          async (prismaTx: Prisma.TransactionClient) => {
            return await fn(prismaTx);
          }
        );
      } catch (error) {
        this.retryCount++;

        if (this.isRetryableError(error) && this.retryCount < maxRetries) {
          this.logger?.warn?.(
            `Transaction failed, retrying (${this.retryCount}/${maxRetries})`,
            { error }
          );
          await this.wait(retryDelay * this.retryCount);
          continue;
        }

        this.logger?.error?.("Transaction failed after all retries", { error });
        throw error;
      } finally {
        this.retryCount = 0;
      }
    }

    throw new Error("Transaction failed to execute");
  }

  /**
   * Executes a function within a database transaction. If a transaction is already in progress,
   * the function is executed within the existing transaction. Otherwise, a new transaction is started.
   *
   * @template T - The type of the result returned by the function.
   * @param fn - A function that takes a `Prisma.TransactionClient` and returns a promise of type `T`.
   * @returns A promise that resolves to the result of the function.
   */
  public async withTransaction<T>(
    fn: (tx: Prisma.TransactionClient) => Promise<T>
  ): Promise<T> {
    if (this.isTransactionInProgress()) {
      return fn(this);
    }
    return this.transaction(fn);
  }

  /**
   * Creates a middleware for soft deleting records in specified models.
   * Instead of permanently deleting the records, it updates the `deletedAt` field with the current date.
   *
   * @param models - An array of model names to apply the soft delete middleware to.
   * @returns A Prisma middleware function that intercepts delete actions and converts them to update actions setting the `deletedAt` field.
   */
  public createSoftDeleteMiddleware(models: string[]): Prisma.Middleware {
    return async (params, next) => {
      if (models.includes(params.model!) && params.action === "delete") {
        return next({
          ...params,
          action: "update",
          args: {
            ...params.args,
            data: { deletedAt: new Date() },
          },
        });
      }
      return next(params);
    };
  }
}
