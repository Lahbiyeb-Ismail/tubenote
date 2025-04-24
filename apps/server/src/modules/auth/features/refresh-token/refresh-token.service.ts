import { ForbiddenError, UnauthorizedError } from "@/modules/shared/api-errors";
import { ERROR_MESSAGES } from "@/modules/shared/constants";

import type { ILoggerService, IPrismaService } from "@/modules/shared/services";

import { REFRESH_TOKEN_SECRET } from "@/modules/auth/constants";

import type { IJwtService } from "@/modules/auth/utils";

import type { RefreshToken } from "./refresh-token.model";

import type { ICreateRefreshTokenDto } from "./dtos";
import type {
  IRefreshTokenRepository,
  IRefreshTokenService,
  IRefreshTokenServiceOptions,
} from "./refresh-token.types";

export class RefreshTokenService implements IRefreshTokenService {
  private static _instance: RefreshTokenService;

  private constructor(
    private readonly _refreshTokenRepository: IRefreshTokenRepository,
    private readonly _prismaService: IPrismaService,
    private readonly _jwtService: IJwtService,
    private readonly _loggerService: ILoggerService
  ) {}

  public static getInstance(
    options: IRefreshTokenServiceOptions
  ): RefreshTokenService {
    if (!this._instance) {
      this._instance = new RefreshTokenService(
        options.refreshTokenRepository,
        options.prismaService,
        options.jwtService,
        options.loggerService
      );
    }

    return this._instance;
  }

  async refreshToken(userId: string, token: string): Promise<string> {
    const decodedToken = await this._jwtService.verify({
      token,
      secret: REFRESH_TOKEN_SECRET,
    });

    // Ensure the decoded token contains a valid userId
    if (
      typeof decodedToken.userId !== "string" ||
      userId !== decodedToken.userId
    ) {
      throw new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED);
    }

    return this._prismaService.transaction(async (tx) => {
      // Check if the token exists in the database
      const refreshTokenFromDB = await this._refreshTokenRepository.findValid(
        token,
        tx
      );

      // Detected refresh token reuse!
      if (!refreshTokenFromDB || refreshTokenFromDB.userId !== userId) {
        this._loggerService.warn(
          `Detected refresh token reuse for user ${userId}`
        );

        await this._refreshTokenRepository.deleteAll(userId, tx);

        throw new ForbiddenError(ERROR_MESSAGES.FORBIDDEN);
      }

      const accessToken = this._jwtService.generateAccessToken(
        decodedToken.userId
      );

      return accessToken;
    });
  }

  async createToken(
    userId: string,
    data: ICreateRefreshTokenDto
  ): Promise<RefreshToken> {
    return this._refreshTokenRepository.create(userId, data);
  }

  async deleteToken(userId: string, token: string): Promise<void> {
    await this._refreshTokenRepository.delete(userId, token);
  }

  async deleteAllTokens(userId: string): Promise<void> {
    await this._refreshTokenRepository.deleteAll(userId);
  }
}
