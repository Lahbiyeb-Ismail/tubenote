import { ForbiddenError, NotFoundError, UnauthorizedError } from "@/errors";
import { REFRESH_TOKEN_SECRET } from "@constants/auth.contants";
import { ERROR_MESSAGES } from "@constants/error-messages.contants";

import { IJwtService } from "@modules/auth/core/jwt/jwt.types";

import type { LoginResponseDto } from "@modules/auth/dtos/login-response.dto";
import type { RefreshDto } from "@modules/auth/dtos/refresh.dto";

import type { CreateTokenDto } from "./dtos/create-token.dto";
import type { RefreshToken } from "./refresh-token.model";

import type {
  IRefreshTokenRepository,
  IRefreshTokenService,
} from "./refresh-token.types";

export class RefreshTokenService implements IRefreshTokenService {
  constructor(
    private readonly _refreshTokenRepository: IRefreshTokenRepository,
    private readonly _jwtService: IJwtService
  ) {}

  async createToken(createTokenDto: CreateTokenDto): Promise<RefreshToken> {
    return await this._refreshTokenRepository.create(createTokenDto);
  }

  async findToken(token: string): Promise<RefreshToken | null> {
    return await this._refreshTokenRepository.find(token);
  }

  async deleteToken(token: string): Promise<void> {
    const refreshToken = await this._refreshTokenRepository.find(token);

    if (!refreshToken) {
      throw new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND);
    }

    await this._refreshTokenRepository.delete(token);
  }

  async deleteAllTokens(userId: string): Promise<void> {
    await this._refreshTokenRepository.deleteAll(userId);
  }

  async refreshToken(refreshDto: RefreshDto): Promise<LoginResponseDto> {
    const { userId, token } = refreshDto;

    const payload = await this._jwtService.verify({
      token,
      secret: REFRESH_TOKEN_SECRET,
    });

    if (!payload) {
      await this.deleteAllTokens(userId);

      throw new ForbiddenError(ERROR_MESSAGES.FORBIDDEN);
    }

    if (payload.userId !== userId) {
      throw new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED);
    }

    const refreshTokenFromDB = await this.findToken(token);

    if (!refreshTokenFromDB) {
      // Detected refresh token reuse!
      await this.deleteAllTokens(userId);

      throw new ForbiddenError(ERROR_MESSAGES.FORBIDDEN);
    }

    await this.deleteToken(token);

    const { accessToken, refreshToken } =
      this._jwtService.generateAuthTokens(userId);

    await this.createToken({
      userId,
      token: refreshToken,
    });

    return { accessToken, refreshToken };
  }
}
