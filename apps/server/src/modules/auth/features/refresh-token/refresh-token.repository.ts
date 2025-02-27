import type { PrismaClient } from "@prisma/client";

import { handleAsyncOperation } from "@modules/shared";
import { ERROR_MESSAGES } from "@modules/shared";

import type { RefreshToken } from "./refresh-token.model";
import type { IRefreshTokenRepository } from "./refresh-token.types";

import type { ICreateDto } from "@/modules/shared";

export class RefreshTokenRepository implements IRefreshTokenRepository {
  constructor(private readonly _db: PrismaClient) {}

  async createToken(
    createTokenDto: ICreateDto<RefreshToken>
  ): Promise<RefreshToken> {
    return handleAsyncOperation(
      () =>
        this._db.refreshToken.create({
          data: { userId: createTokenDto.userId, ...createTokenDto.data },
        }),
      { errorMessage: ERROR_MESSAGES.FAILED_TO_CREATE }
    );
  }

  async findValidToken(token: string): Promise<RefreshToken | null> {
    return handleAsyncOperation(
      () =>
        this._db.refreshToken.findUnique({
          where: {
            token,
            expiresAt: { gt: new Date() },
          },
        }),
      { errorMessage: ERROR_MESSAGES.FAILED_TO_FIND }
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
      { errorMessage: ERROR_MESSAGES.FAILED_TO_DELETE }
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
      { errorMessage: ERROR_MESSAGES.FAILED_TO_DELETE_ALL }
    );
  }
}
