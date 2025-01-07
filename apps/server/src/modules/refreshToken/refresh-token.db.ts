import type { PrismaClient } from "@prisma/client";

import handleAsyncOperation from "../../utils/handleAsyncOperation";

import type { RefreshTokenEntry } from "./refresh-token.type";

export interface IRefreshTokenDatabase {
  create(token: string, userId: string): Promise<RefreshTokenEntry>;
  find(token: string): Promise<RefreshTokenEntry | null>;
  delete(token: string): Promise<void>;
  deleteAll(userId: string): Promise<void>;
}

export class RefreshTokenDatabase implements IRefreshTokenDatabase {
  private database: PrismaClient;

  constructor(database: PrismaClient) {
    this.database = database;
  }

  async create(token: string, userId: string): Promise<RefreshTokenEntry> {
    return handleAsyncOperation(
      () =>
        this.database.refreshToken.create({
          data: { token, userId },
        }),
      { errorMessage: "Failed to create refresh token" }
    );
  }

  async find(token: string): Promise<RefreshTokenEntry | null> {
    return handleAsyncOperation(
      () =>
        this.database.refreshToken.findUnique({
          where: {
            token,
          },
        }),
      { errorMessage: "Failed to find refresh token" }
    );
  }
  async delete(token: string): Promise<void> {
    await handleAsyncOperation(
      () =>
        this.database.refreshToken.delete({
          where: {
            token,
          },
        }),
      { errorMessage: "Failed to delete refresh token" }
    );
  }
  async deleteAll(userId: string): Promise<void> {
    await handleAsyncOperation(
      () =>
        this.database.refreshToken.deleteMany({
          where: {
            userId,
          },
        }),
      { errorMessage: "Failed to delete refresh tokens for user" }
    );
  }
}
