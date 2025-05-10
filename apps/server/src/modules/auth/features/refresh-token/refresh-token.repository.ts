import type { Prisma } from "@prisma/client";
import { inject, injectable } from "inversify";

import { ERROR_MESSAGES } from "@/modules/shared/constants";
import { handleAsyncOperation } from "@/modules/shared/utils";

import { TYPES } from "@/config/inversify/types";
import type { IPrismaService } from "@/modules/shared/services";

import type { ICreateRefreshTokenDto } from "./dtos";
import type { RefreshToken } from "./refresh-token.model";
import type { IRefreshTokenRepository } from "./refresh-token.types";

@injectable()
export class RefreshTokenRepository implements IRefreshTokenRepository {
  constructor(
    @inject(TYPES.PrismaService) private readonly _db: IPrismaService
  ) {}

  /**
   * Creates a new refresh token for a user.
   *
   * @param userId - The ID of the user for whom the refresh token is being created.
   * @param data - The data required to create the refresh token.
   * @param tx - Optional transaction client for database operations.
   *
   * @returns A promise that resolves to the created refresh token.
   */
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

  /**
   * Finds a refresh token by its token string.
   *
   * @param token - The token string to search for.
   * @param tx - Optional transaction client for database operations.
   *
   * @returns A promise that resolves to the found refresh token or null if not found.
   */
  async findByToken(
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
            isRevoked: false,
          },
        }),
      { errorMessage: ERROR_MESSAGES.FAILED_TO_FIND }
    );
  }

  /**
   * Marks a refresh token as revoked in the database.
   *
   * @param tokenId - The ID of the token to be marked as revoked.
   * @param tx - Optional transaction client for database operations.
   *
   * @returns A promise that resolves when the token is successfully marked as revoked.
   */
  async markAsRevoked(
    tokenId: string,
    revocationReason: string,
    tx?: Prisma.TransactionClient
  ): Promise<void> {
    const client = tx ?? this._db;

    await handleAsyncOperation(
      () =>
        client.refreshToken.update({
          where: { id: tokenId },
          data: { isRevoked: true, revokedAt: new Date(), revocationReason },
        }),
      { errorMessage: ERROR_MESSAGES.FAILED_TO_UPDATE }
    );
  }

  /**
   * Revokes all active refresh tokens for a specific user by marking them as revoked
   * and recording the revocation reason and timestamp.
   *
   * @param userId - The ID of the user whose tokens are to be revoked.
   * @param revocationReason - The reason for revoking the tokens.
   * @param tx - (Optional) A Prisma transaction client to use for the operation.
   *             If not provided, the default database client will be used.
   * @returns A promise that resolves when the operation is complete.
   * @throws Will throw an error if the update operation fails.
   */
  async revokeAllTokens(
    userId: string,
    revocationReason: string,
    tx?: Prisma.TransactionClient
  ): Promise<void> {
    const client = tx ?? this._db;

    await handleAsyncOperation(
      () =>
        client.refreshToken.updateMany({
          where: {
            userId,
            isRevoked: false,
          },
          data: {
            isRevoked: true,
            revokedAt: new Date(),
            revocationReason,
          },
        }),
      { errorMessage: ERROR_MESSAGES.FAILED_TO_UPDATE }
    );
  }
}
