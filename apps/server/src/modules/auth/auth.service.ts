import { REFRESH_TOKEN_SECRET } from "../../constants/auth";

import { ERROR_MESSAGES } from "../../constants/errorMessages";

import { ForbiddenError, NotFoundError, UnauthorizedError } from "../../errors";

import { IEmailService } from "../../services/emailService";

import type { IAuthService } from "./auth.types";

import type { IJwtService } from "../jwt/jwt.service";
import type { IPasswordService } from "../password/password.service";
import type { IRefreshTokenService } from "../refreshToken/refresh-token.service";
import type { IUserService } from "../user/user.service";

import type { UserDto } from "../user/dtos/user.dto";
import type { LoginResponseDto } from "./dtos/login-response.dto";
import type { LoginUserDto } from "./dtos/login-user.dto";
import type { LogoutUserDto } from "./dtos/logout-user.dto";
import type { RefreshDto } from "./dtos/refresh.dto";
import type { RegisterUserDto } from "./dtos/register-user.dto";

export class AuthService implements IAuthService {
  constructor(
    private readonly _jwtService: IJwtService,
    private readonly _userService: IUserService,
    private readonly _passwordService: IPasswordService,
    private readonly _refreshTokenService: IRefreshTokenService,
    private readonly _emailService: IEmailService
  ) {}

  async registerUser(registerUserDto: RegisterUserDto): Promise<UserDto> {
    const newUser = await this._userService.createUser(registerUserDto);

    await this._emailService.sendVerificationEmail(newUser.email);

    return newUser;
  }

  async loginUser(loginUserDto: LoginUserDto): Promise<LoginResponseDto> {
    const { email, password } = loginUserDto;

    const user = await this._userService.getUserByEmail(email);

    if (!user) {
      throw new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND);
    }

    if (!user.isEmailVerified) {
      throw new UnauthorizedError(ERROR_MESSAGES.EMAIL_NOT_VERIFIED);
    }

    const isPasswordMatch = await this._passwordService.comparePasswords({
      password,
      hashedPassword: user.password,
    });

    if (!isPasswordMatch) {
      throw new ForbiddenError(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    const { accessToken, refreshToken } = this._jwtService.generateAuthTokens(
      user.id
    );

    await this._refreshTokenService.createToken(user.id, refreshToken);

    return { accessToken, refreshToken };
  }

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

    await this._refreshTokenService.createToken(userId, refreshToken);

    return { accessToken, refreshToken };
  }

  async googleLogin(user: UserDto): Promise<LoginResponseDto> {
    if (!user) {
      throw new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND);
    }

    if (!user.isEmailVerified) {
      throw new UnauthorizedError(ERROR_MESSAGES.EMAIL_NOT_VERIFIED);
    }

    const { accessToken, refreshToken } = this._jwtService.generateAuthTokens(
      user.id
    );

    await this._refreshTokenService.createToken(user.id, refreshToken);

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
