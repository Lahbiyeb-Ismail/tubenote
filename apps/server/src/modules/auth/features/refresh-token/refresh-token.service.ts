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
    userId: string,
    rawToken: string
  ): Promise<RefreshToken | null> {
    const hint = rawToken.slice(0, 8);

    // First filter by hint
    const candidates = await this._refreshTokenRepository.findByHint(
      userId,
      hint
    );

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

  async refreshToken(
    userId: string,
    oldToken: string,
    clientContext: IClientContext
  ): Promise<IAuthResponseDto> {
    const tokenRecord = await this.validateRefreshToken(userId, oldToken);

    // Check if the token is valid
    if (!tokenRecord) {
      this._loggerService.warn(
        `Invalid refresh token attempt for user ${userId}`
      );

      throw new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED);
    }

    if (tokenRecord.userId !== userId) {
      await this._refreshTokenRepository.markAsRevoked(
        tokenRecord.id,
        "suspicious_activity"
      );

      this._loggerService.warn(
        `Invalid refresh token attempt for user ${userId}`
      );

      throw new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED);
    }

    // Token rotation (revoke old, create new)
    const refreshToken = await this._prismaService.transaction(async (tx) => {
      const newToken = await this.createToken(userId, clientContext, tx);
      await this._refreshTokenRepository.markAsRevoked(
        tokenRecord.id,
        "token_refreshing",
        tx
      );

      return newToken;
    });

    // Generate a new access token
    const accessToken = this._jwtService.generateAccessToken(userId);

    return { accessToken, refreshToken };
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
    const hint = token.slice(0, 8); // First 8 chars as lookup hint

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
    const foundToken = await this.validateRefreshToken(userId, token);

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
}
