import type { Prisma } from "@prisma/client";

export interface IPrismaService {
  transaction<T>(fn: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T>;
}
