import type { PrismaClient } from "@prisma/client";

import handleAsyncOperation from "../../../utils/handle-async-operation";

import type { RefreshToken } from "./refresh-token.model";
import type { IRefreshTokenRepository } from "./refresh-token.types";

import type { CreateTokenDto } from "./dtos/create-token.dto";

export class RefreshTokenRepository implements IRefreshTokenRepository {
  constructor(private readonly _db: PrismaClient) {}

  async create(createTokenDto: CreateTokenDto): Promise<RefreshToken> {
    return handleAsyncOperation(
      () =>
        this._db.refreshToken.create({
          data: { ...createTokenDto },
        }),
      { errorMessage: "Failed to create refresh token" }
    );
  }

  async find(token: string): Promise<RefreshToken | null> {
    return handleAsyncOperation(
      () =>
        this._db.refreshToken.findUnique({
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
        this._db.refreshToken.delete({
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
        this._db.refreshToken.deleteMany({
          where: {
            userId,
          },
        }),
      { errorMessage: "Failed to delete refresh tokens for user" }
    );
  }
}
