import type { PrismaClient } from "@prisma/client";

import handleAsyncOperation from "@/utils/handle-async-operation";

import type { RefreshToken } from "./refresh-token.model";
import type { IRefreshTokenRepository } from "./refresh-token.types";

import { ERROR_MESSAGES } from "@/constants/error-messages.contants";
import type { CreateTokenDto } from "./dtos/create-token.dto";

export class RefreshTokenRepository implements IRefreshTokenRepository {
  constructor(private readonly _db: PrismaClient) {}

  async create(createTokenDto: CreateTokenDto): Promise<RefreshToken> {
    return handleAsyncOperation(
      () =>
        this._db.refreshToken.create({
          data: { ...createTokenDto },
        }),
      { errorMessage: ERROR_MESSAGES.FAILD_TO_CREATE }
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
      { errorMessage: ERROR_MESSAGES.FAILD_TO_FIND }
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
      { errorMessage: ERROR_MESSAGES.FAILD_TO_DELETE }
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
      { errorMessage: ERROR_MESSAGES.FAILD_TO_DELETE_ALL }
    );
  }
}
