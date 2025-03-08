import { Prisma, PrismaClient } from "@prisma/client";
import type { ILoggerService } from "../logger";

type PrismaServiceOptions = {
  maxRetries?: number;
  retryDelay?: number;
  logger?: ILoggerService;
  prismaOptions?: Prisma.PrismaClientOptions;
};

// interface ILogger {
//   info?: (message: string, meta?: unknown) => void;
//   error?: (message: string, meta?: unknown) => void;
//   warn?: (message: string, meta?: unknown) => void;
//   debug?: (message: string, meta?: unknown) => void;
// }

export class PrismaService extends PrismaClient<
  Prisma.PrismaClientOptions,
  "query" | "error"
> {
  private static instance: PrismaService;
  private retryCount = 0;
  private isConnected = false;
  private readonly maxRetries: number;
  private readonly retryDelay: number;
  private readonly logger?: ILoggerService;

  private constructor(options?: PrismaServiceOptions) {
    super({
      log: [
        { level: "warn", emit: "event" },
        { level: "info", emit: "event" },
        { level: "error", emit: "event" },
        { level: "query", emit: "event" },
      ],
      ...options?.prismaOptions,
    });

    this.maxRetries = options?.maxRetries ?? 3;
    this.retryDelay = options?.retryDelay ?? 500;
    this.logger = options?.logger;

    this.setupEventListeners();
  }

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
  }

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

  private isTransactionInProgress(): boolean {
    return this.retryCount > 0;
  }

  public static getInstance(options?: PrismaServiceOptions): PrismaService {
    if (!PrismaService.instance) {
      PrismaService.instance = new PrismaService(options);
    }
    return PrismaService.instance;
  }

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

  public async withTransaction<T>(
    fn: (tx: Prisma.TransactionClient) => Promise<T>
  ): Promise<T> {
    if (this.isTransactionInProgress()) {
      return fn(this);
    }
    return this.transaction(fn);
  }

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
