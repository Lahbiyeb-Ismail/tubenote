import type { Prisma } from "@prisma/client";

import { ERROR_MESSAGES } from "@/modules/shared/constants";
import { handleAsyncOperation } from "@/modules/shared/utils";

import type { ICreateDto } from "@/modules/shared/dtos";
import type { IPrismaService } from "@/modules/shared/services";

import type { RefreshToken } from "./refresh-token.model";
import type {
  IRefreshTokenRepository,
  IRefreshTokenRepositoryOptions,
} from "./refresh-token.types";

export class RefreshTokenRepository implements IRefreshTokenRepository {
  private static _instance: RefreshTokenRepository;

  private constructor(private readonly _db: IPrismaService) {}

  public static getInstance(
    options: IRefreshTokenRepositoryOptions
  ): RefreshTokenRepository {
    if (!this._instance) {
      this._instance = new RefreshTokenRepository(options.db);
    }

    return this._instance;
  }

  async create(
    createTokenDto: ICreateDto<RefreshToken>,
    tx?: Prisma.TransactionClient
  ): Promise<RefreshToken> {
    const client = tx ?? this._db;

    return handleAsyncOperation(
      () =>
        client.refreshToken.create({
          data: { userId: createTokenDto.userId, ...createTokenDto.data },
        }),
      { errorMessage: ERROR_MESSAGES.FAILED_TO_CREATE }
    );
  }

  async findValid(
    token: string,
    tx?: Prisma.TransactionClient
  ): Promise<RefreshToken | null> {
    const client = tx ?? this._db;

    return handleAsyncOperation(
      () =>
        client.refreshToken.findUnique({
          where: {
            token,
            expiresAt: { gt: new Date() },
          },
        }),
      { errorMessage: ERROR_MESSAGES.FAILED_TO_FIND }
    );
  }

  async delete(token: string, tx?: Prisma.TransactionClient): Promise<void> {
    const client = tx ?? this._db;

    await handleAsyncOperation(
      () =>
        client.refreshToken.delete({
          where: {
            token,
          },
        }),
      { errorMessage: ERROR_MESSAGES.FAILED_TO_DELETE }
    );
  }

  async deleteAll(
    userId: string,
    tx?: Prisma.TransactionClient
  ): Promise<void> {
    const client = tx ?? this._db;

    await handleAsyncOperation(
      () =>
        client.refreshToken.deleteMany({
          where: {
            userId,
          },
        }),
      { errorMessage: ERROR_MESSAGES.FAILED_TO_DELETE_ALL }
    );
  }
}
