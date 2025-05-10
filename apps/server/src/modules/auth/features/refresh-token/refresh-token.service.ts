import type { Prisma } from "@prisma/client";
import { inject, injectable } from "inversify";

import { UnauthorizedError } from "@/modules/shared/api-errors";
import { ERROR_MESSAGES } from "@/modules/shared/constants";

import { TYPES } from "@/config/inversify/types";
import type {
  ICryptoService,
  ILoggerService,
  IPrismaService,
} from "@/modules/shared/services";

import { REFRESH_TOKEN_EXPIRES_IN } from "@/modules/auth/constants";

import type { IJwtService } from "@/modules/auth/utils";

import { stringToDate } from "@/modules/shared/utils";
import type { IAuthResponseDto } from "../../dtos";
import type { IClientContext } from "./dtos";
import type { RefreshToken } from "./refresh-token.model";
import type {
  IRefreshTokenRepository,
  IRefreshTokenService,
} from "./refresh-token.types";

@injectable()
export class RefreshTokenService implements IRefreshTokenService {
  constructor(
    @inject(TYPES.RefreshTokenRepository)
    private readonly _refreshTokenRepository: IRefreshTokenRepository,
    @inject(TYPES.PrismaService)
    private readonly _prismaService: IPrismaService,
    @inject(TYPES.JwtService) private readonly _jwtService: IJwtService,
    @inject(TYPES.LoggerService)
    private readonly _loggerService: ILoggerService,
    @inject(TYPES.CryptoService) private readonly _cryptoService: ICryptoService
  ) {}

  private async validateRefreshToken(
    rawToken: string
  ): Promise<RefreshToken | null> {
    const tokenHash = this._cryptoService.generateUnsaltedHash(rawToken);

    return this._refreshTokenRepository.findByToken(tokenHash);
  }

  async refreshTokens(
    refreshToken: string,
    deviceId: string,
    ipAddress: string,
    clientContext: IClientContext
  ): Promise<IAuthResponseDto> {
    const tokenRecord = await this.validateRefreshToken(refreshToken);

    // Check if the token is valid
    if (!tokenRecord) {
      throw new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED);
    }

    const currentDeviceId = this._cryptoService.generateUnsaltedHash(deviceId);
    const currentIpAddress =
      this._cryptoService.generateUnsaltedHash(ipAddress);

    if (
      tokenRecord.deviceId !== currentDeviceId ||
      tokenRecord.ipAddress !== currentIpAddress
    ) {
      await this.revokeAllUserTokens(
        tokenRecord.userId,
        "suspicious_activity_detected"
      );

      throw new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED);
    }

    // Token rotation (revoke old, create new)
    const newRefreshToken = await this._prismaService.transaction(
      async (tx) => {
        const newToken = await this.createToken(
          tokenRecord.userId,
          deviceId,
          ipAddress,
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
    deviceId: string,
    ipAddress: string,
    clientContext: IClientContext,
    tx?: Prisma.TransactionClient
  ): Promise<string> {
    const randomToken = this._cryptoService.generateSecureToken();
    const tokenHash = this._cryptoService.generateUnsaltedHash(randomToken);
    const expiresAt = stringToDate(REFRESH_TOKEN_EXPIRES_IN);

    const deviceIdHash = this._cryptoService.generateUnsaltedHash(deviceId);
    const ipAddressHash = this._cryptoService.generateUnsaltedHash(ipAddress);

    await this._refreshTokenRepository.create(
      userId,
      {
        token: tokenHash,
        deviceId: deviceIdHash,
        ipAddress: ipAddressHash,
        expiresAt,
        ...clientContext,
      },
      tx
    );

    return randomToken;
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
