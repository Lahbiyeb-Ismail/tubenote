import { REFRESH_TOKEN_SECRET } from "../../constants/auth.contants";

import { ERROR_MESSAGES } from "../../constants/error-messages.contants";

import { ForbiddenError, NotFoundError, UnauthorizedError } from "../../errors";

import type { IAuthService } from "./auth.types";

import type { IJwtService } from "../jwt/jwt.types";
import type { IRefreshTokenService } from "../refreshToken/refresh-token.types";
import type { IUserService } from "../user/user.types";

import type { User } from "../user/user.model";

import type { LoginResponseDto } from "./dtos/login-response.dto";
import type { LogoutUserDto } from "./dtos/logout-user.dto";
import type { RefreshDto } from "./dtos/refresh.dto";

export class AuthService implements IAuthService {
  constructor(
    private readonly _jwtService: IJwtService,
    private readonly _userService: IUserService,
    private readonly _refreshTokenService: IRefreshTokenService
  ) {}

  async logoutUser(logoutUserDto: LogoutUserDto): Promise<void> {
    const { userId, refreshToken } = logoutUserDto;

    if (!refreshToken || !userId) {
      throw new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED);
    }

    await this._refreshTokenService.deleteAllTokens(userId);
  }

  async refreshToken(refreshDto: RefreshDto): Promise<LoginResponseDto> {
    const { userId, token } = refreshDto;

    const payload = await this._jwtService.verify({
      token,
      secret: REFRESH_TOKEN_SECRET,
    });

    if (!payload) {
      await this._refreshTokenService.deleteAllTokens(userId);

      throw new ForbiddenError(ERROR_MESSAGES.FORBIDDEN);
    }

    if (payload.userId !== userId) {
      throw new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED);
    }

    const refreshTokenFromDB = await this._refreshTokenService.findToken(token);

    if (!refreshTokenFromDB) {
      // Detected refresh token reuse!
      await this._refreshTokenService.deleteAllTokens(userId);

      throw new ForbiddenError(ERROR_MESSAGES.FORBIDDEN);
    }

    await this._refreshTokenService.deleteToken(token);

    const { accessToken, refreshToken } =
      this._jwtService.generateAuthTokens(userId);

    await this._refreshTokenService.createToken({
      userId,
      token: refreshToken,
    });

    return { accessToken, refreshToken };
  }

  async googleLogin(user: User): Promise<LoginResponseDto> {
    if (!user) {
      throw new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND);
    }

    if (!user.isEmailVerified) {
      throw new UnauthorizedError(ERROR_MESSAGES.EMAIL_NOT_VERIFIED);
    }

    const { accessToken, refreshToken } = this._jwtService.generateAuthTokens(
      user.id
    );

    await this._refreshTokenService.createToken({
      userId: user.id,
      token: refreshToken,
    });

    return { accessToken, refreshToken };
  }

  async verifyEmail(userId: string): Promise<void> {
    const user = await this._userService.getUserById(userId);

    if (user.isEmailVerified) {
      throw new ForbiddenError(ERROR_MESSAGES.EMAIL_ALREADY_VERIFIED);
    }

    await this._userService.verifyUserEmail(userId);
  }
}
