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
   * Counts the number of active refresh tokens for a user.
   *
   * @param userId - The ID of the user whose tokens are to be counted.
   * @param tx - Optional transaction client for database operations.
   *
   * @returns A promise that resolves to the count of active tokens.
   */
  async countActiveTokens(
    userId: string,
    tx?: Prisma.TransactionClient
  ): Promise<number> {
    const client = tx ?? this._db;
    return handleAsyncOperation(
      () =>
        client.refreshToken.count({
          where: {
            userId,
            expiresAt: { gt: new Date() },
            isRevoked: false,
          },
        }),
      { errorMessage: ERROR_MESSAGES.FAILED_TO_COUNT }
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
   * Revokes the oldest tokens for a user, up to a specified count.
   *
   * @param userId - The ID of the user whose tokens are to be revoked.
   * @param count - The number of oldest tokens to revoke.
   * @param tx - Optional transaction client for database operations.
   *
   * @returns A promise that resolves when the tokens are successfully revoked.
   */
  async revokeOldestTokens(
    userId: string,
    count: number,
    tx?: Prisma.TransactionClient
  ): Promise<void> {
    if (count <= 0) return; // Validate input

    const client = tx ?? this._db;

    // 1. Find oldest tokens first
    const oldestTokens = await client.refreshToken.findMany({
      where: {
        userId,
        isRevoked: false,
        expiresAt: { gt: new Date() }, // Only consider active tokens
      },
      orderBy: { createdAt: "asc" }, // Oldest first
      take: count,
      select: { id: true }, // Optimize payload
    });

    // 2. Revoce in batch if any found
    if (oldestTokens.length > 0) {
      await client.refreshToken.updateMany({
        where: {
          id: { in: oldestTokens.map((t) => t.id) },
        },
        data: {
          isRevoked: true,
          revokedAt: new Date(),
          revocationReason: "max_tokens_per_user",
        },
      });
    }
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
