import { UnauthorizedError } from "@/modules/shared/api-errors";
import { ERROR_MESSAGES } from "@/modules/shared/constants";

import type {
  ICryptoService,
  ILoggerService,
  IPrismaService,
} from "@/modules/shared/services";

import { REFRESH_TOKEN_EXPIRES_IN } from "@/modules/auth/constants";

import type { IJwtService } from "@/modules/auth/utils";

import { stringToDate } from "@/modules/shared/utils";
import type { Prisma } from "@prisma/client";
import type { IAuthResponseDto } from "../../dtos";
import type { IClientContext } from "./dtos";
import type { RefreshToken } from "./refresh-token.model";
import type {
  IRefreshTokenRepository,
  IRefreshTokenService,
  IRefreshTokenServiceOptions,
} from "./refresh-token.types";

export class RefreshTokenService implements IRefreshTokenService {
  private static _instance: RefreshTokenService;
  private MAX_TOKENS_PER_USER = 10;

  private constructor(
    private readonly _refreshTokenRepository: IRefreshTokenRepository,
    private readonly _prismaService: IPrismaService,
    private readonly _jwtService: IJwtService,
    private readonly _loggerService: ILoggerService,
    private readonly _cryptoService: ICryptoService
  ) {}

  public static getInstance(
    options: IRefreshTokenServiceOptions
  ): RefreshTokenService {
    if (!this._instance) {
      this._instance = new RefreshTokenService(
        options.refreshTokenRepository,
        options.prismaService,
        options.jwtService,
        options.loggerService,
        options.cryptoService
      );
    }

    return this._instance;
  }

  private async validateRefreshToken(
    rawToken: string
  ): Promise<RefreshToken | null> {
    const hint = rawToken.slice(0, 16);

    // First filter by hint
    const candidates = await this._refreshTokenRepository.findByHint(hint);

    // Then compare full hashes
    for (const token of candidates) {
      if (
        await this._cryptoService.validateHashMatch({
          hashedValue: token.tokenHash,
          unhashedValue: rawToken,
        })
      ) {
        return token;
      }
    }

    return null;
  }

  async refreshTokens(
    refreshToken: string,
    clientContext: IClientContext
  ): Promise<IAuthResponseDto> {
    const tokenRecord = await this.validateRefreshToken(refreshToken);

    // Check if the token is valid
    if (!tokenRecord) {
      // this._loggerService.warn(
      //   `Invalid refresh token attempt for user ${userId}`
      // );

      throw new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED);
    }

    // if (tokenRecord.userId !== userId) {
    //   await this._refreshTokenRepository.markAsRevoked(
    //     tokenRecord.id,
    //     "suspicious_activity"
    //   );

    //   this._loggerService.warn(
    //     `Invalid refresh token attempt for user ${userId}`
    //   );

    //   throw new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED);
    // }

    // Token rotation (revoke old, create new)
    const newRefreshToken = await this._prismaService.transaction(
      async (tx) => {
        const newToken = await this.createToken(
          tokenRecord.userId,
          clientContext,
          tx
        );
        await this._refreshTokenRepository.markAsRevoked(
          tokenRecord.id,
          "token_refreshing",
          tx
        );

        return newToken;
      }
    );

    // Generate a new access token
    const newAccessToken = this._jwtService.generateAccessToken(
      tokenRecord.userId
    );

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  async createToken(
    userId: string,
    clientContext: IClientContext,
    tx?: Prisma.TransactionClient
  ): Promise<string> {
    // Enforce token limits
    const activeTokensCount =
      await this._refreshTokenRepository.countActiveTokens(userId);

    if (activeTokensCount >= this.MAX_TOKENS_PER_USER) {
      const excess = activeTokensCount - this.MAX_TOKENS_PER_USER + 1;
      await this._refreshTokenRepository.revokeOldestTokens(userId, excess, tx);
    }

    const token = this._cryptoService.generateSecureToken();

    const tokenHash = await this._cryptoService.generateHash(token);
    const hint = token.slice(0, 16); // First 16 chars as lookup hint

    const expiresAt = stringToDate(REFRESH_TOKEN_EXPIRES_IN);

    await this._refreshTokenRepository.create(
      userId,
      {
        tokenHash,
        expiresAt,
        hint,
        ...clientContext,
      },
      tx
    );

    return token;
  }

  async markTokenAsRevoked(
    userId: string,
    token: string,
    revocationReason: string,
    tx?: Prisma.TransactionClient
  ): Promise<void> {
    const foundToken = await this.validateRefreshToken(token);

    console.log("foundToken:", foundToken);

    if (!foundToken) {
      this._loggerService.warn(`Invalid refresh token for user ${userId}`);
      throw new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED);
    }

    await this._refreshTokenRepository.markAsRevoked(
      foundToken.id,
      revocationReason,
      tx
    );
  }

  /**
   * Revokes all refresh tokens associated with a specific user.
   *
   * @param userId - The unique identifier of the user whose tokens are to be revoked.
   * @param revocationReason - The reason for revoking the tokens, typically for logging or auditing purposes.
   * @param tx - (Optional) A Prisma transaction client to execute the operation within a transaction.
   * @returns A promise that resolves when all tokens have been successfully revoked.
   */
  async revokeAllUserTokens(
    userId: string,
    revocationReason: string,
    tx?: Prisma.TransactionClient
  ): Promise<void> {
    await this._refreshTokenRepository.revokeAllTokens(
      userId,
      revocationReason,
      tx
    );
  }
}
