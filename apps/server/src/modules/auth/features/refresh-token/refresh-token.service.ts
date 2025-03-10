import { ForbiddenError, UnauthorizedError } from "@/modules/shared/api-errors";
import { ERROR_MESSAGES } from "@/modules/shared/constants";
import { stringToDate } from "@/modules/shared/utils";

import type { ICreateDto } from "@/modules/shared/dtos";
import type { ILoggerService, IPrismaService } from "@/modules/shared/services";

import {
  REFRESH_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_SECRET,
} from "@/modules/auth/constants";

import type { IAuthResponseDto, IRefreshDto } from "@/modules/auth/dtos";
import type { IJwtService } from "@/modules/auth/utils";

import type { RefreshToken } from "./refresh-token.model";

import type {
  IRefreshTokenRepository,
  IRefreshTokenService,
} from "./refresh-token.types";

export class RefreshTokenService implements IRefreshTokenService {
  constructor(
    private readonly _refreshTokenRepository: IRefreshTokenRepository,
    private readonly _prismaService: IPrismaService,
    private readonly _jwtService: IJwtService,
    private readonly _loggerService: ILoggerService
  ) {}

  async refreshToken(refreshDto: IRefreshDto): Promise<IAuthResponseDto> {
    const { userId, token } = refreshDto;

    const decodedToken = await this._jwtService.verify({
      token,
      secret: REFRESH_TOKEN_SECRET,
    });

    return this._prismaService.transaction(async (tx) => {
      // Ensure the decoded token contains a valid userId
      if (
        typeof decodedToken.userId !== "string" ||
        decodedToken.userId !== userId
      ) {
        await this._refreshTokenRepository.deleteAll(userId, tx);

        throw new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED);
      }

      // Check if the token exists in the database
      const refreshTokenFromDB = await this._refreshTokenRepository.findValid(
        token,
        tx
      );

      // Detected refresh token reuse!
      if (!refreshTokenFromDB) {
        this._loggerService.warn(
          `Detected refresh token reuse for user ${userId}`
        );

        await this._refreshTokenRepository.deleteAll(userId, tx);

        throw new ForbiddenError(ERROR_MESSAGES.FORBIDDEN);
      }

      await this._refreshTokenRepository.delete(token, tx);

      const { accessToken, refreshToken } =
        this._jwtService.generateAuthTokens(userId);

      await this._refreshTokenRepository.create(
        {
          userId,
          data: {
            token: refreshToken,
            expiresAt: stringToDate(REFRESH_TOKEN_EXPIRES_IN),
          },
        },
        tx
      );

      return { accessToken, refreshToken };
    });
  }

  async deleteAllTokens(userId: string): Promise<void> {
    await this._refreshTokenRepository.deleteAll(userId);
  }

  async createToken(
    createTokenDto: ICreateDto<RefreshToken>
  ): Promise<RefreshToken> {
    return this._refreshTokenRepository.create(createTokenDto);
  }
}
