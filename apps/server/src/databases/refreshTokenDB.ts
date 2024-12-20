import type { Prisma, RefreshToken } from "@prisma/client";
import prismaClient from "../lib/prisma";
import handleAsyncOperation from "../utils/handleAsyncOperation";

class RefreshTokenDB {
  async create(token: string, userId: string): Promise<RefreshToken> {
    return handleAsyncOperation(
      () =>
        prismaClient.refreshToken.create({
          data: { token, userId },
        }),
      { errorMessage: "Failed to create refresh token" }
    );
  }

  async find(
    where: Prisma.RefreshTokenWhereUniqueInput
  ): Promise<RefreshToken | null> {
    return handleAsyncOperation(
      () =>
        prismaClient.refreshToken.findUnique({
          where,
        }),
      { errorMessage: "Failed to find refresh token" }
    );
  }
  async delete(where: Prisma.RefreshTokenWhereUniqueInput): Promise<void> {
    await handleAsyncOperation(
      () =>
        prismaClient.refreshToken.delete({
          where,
        }),
      { errorMessage: "Failed to delete refresh token" }
    );
  }
  async deleteAll(where: Prisma.RefreshTokenWhereInput): Promise<void> {
    await handleAsyncOperation(
      () =>
        prismaClient.refreshToken.deleteMany({
          where,
        }),
      { errorMessage: "Failed to delete refresh tokens for user" }
    );
  }
}

export default new RefreshTokenDB();
