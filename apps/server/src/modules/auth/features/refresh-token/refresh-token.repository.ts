import type { Prisma } from "@prisma/client";

import { ERROR_MESSAGES } from "@/modules/shared/constants";
import { handleAsyncOperation } from "@/modules/shared/utils";

import type { IPrismaService } from "@/modules/shared/services";

import type { ICreateRefreshTokenDto } from "./dtos";
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
    userId: string,
    data: ICreateRefreshTokenDto,
    tx?: Prisma.TransactionClient
  ): Promise<RefreshToken> {
    const client = tx ?? this._db;

    return handleAsyncOperation(
      () =>
        client.refreshToken.create({
          data: { userId, ...data },
        }),
      { errorMessage: ERROR_MESSAGES.FAILED_TO_CREATE }
    );
  }

  async findValid(
    tokenHash: string,
    tx?: Prisma.TransactionClient
  ): Promise<RefreshToken | null> {
    const client = tx ?? this._db;

    return handleAsyncOperation(
      () =>
        client.refreshToken.findUnique({
          where: {
            tokenHash,
            expiresAt: { gt: new Date() },
            isRevoked: false,
          },
        }),
      { errorMessage: ERROR_MESSAGES.FAILED_TO_FIND }
    );
  }

  /**
   * Marks a refresh token as revoked in the database.
   *
   * @param tokenHash - The hashed token string to be marked as revoked.
   * @param tx - Optional transaction client for database operations.
   *
   * @returns A promise that resolves when the token is successfully marked as revoked.
   */
  async markAsRevoked(
    tokenHash: string,
    tx?: Prisma.TransactionClient
  ): Promise<void> {
    const client = tx ?? this._db;

    await handleAsyncOperation(
      () =>
        client.refreshToken.update({
          where: { tokenHash },
          data: { isRevoked: true },
        }),
      { errorMessage: ERROR_MESSAGES.FAILED_TO_UPDATE }
    );
  }

  async delete(
    userId: string,
    token: string,
    tx?: Prisma.TransactionClient
  ): Promise<void> {
    const client = tx ?? this._db;

    await handleAsyncOperation(
      () =>
        client.refreshToken.delete({
          where: {
            userId,
            tokenHash: token,
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
