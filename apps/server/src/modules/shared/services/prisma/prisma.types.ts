import type { Prisma, PrismaClient } from "@prisma/client";
import type { ILoggerService } from "../logger";

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

export type PrismaServiceOptions = {
  maxRetries?: number;
  retryDelay?: number;
  logger?: ILoggerService;
  prismaOptions?: Prisma.PrismaClientOptions;
};
