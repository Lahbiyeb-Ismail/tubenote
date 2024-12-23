import prismaClient from "../lib/prisma";
import handleAsyncOperation from "../utils/handleAsyncOperation";

import type { RefreshTokenEntry } from "../types/refreshToken.type";

class RefreshTokenDB {
  async create(token: string, userId: string): Promise<RefreshTokenEntry> {
    return handleAsyncOperation(
      () =>
        prismaClient.refreshToken.create({
          data: { token, userId },
        }),
      { errorMessage: "Failed to create refresh token" }
    );
  }

  async find(token: string): Promise<RefreshTokenEntry | null> {
    return handleAsyncOperation(
      () =>
        prismaClient.refreshToken.findUnique({
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
        prismaClient.refreshToken.delete({
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
        prismaClient.refreshToken.deleteMany({
          where: {
            userId,
          },
        }),
      { errorMessage: "Failed to delete refresh tokens for user" }
    );
  }
}

export default new RefreshTokenDB();
