import { REFRESH_TOKEN_SECRET } from "../../constants/auth";

import { ERROR_MESSAGES } from "../../constants/errorMessages";

import { ForbiddenError, NotFoundError, UnauthorizedError } from "../../errors";

import { IEmailService } from "../../services/emailService";

import type { IJwtService } from "../jwt/jwt.service";
import { IPasswordService } from "../password/password.service";
import { IRefreshTokenService } from "../refreshToken/refresh-token.service";
import { IUserService } from "../user/user.service";

import type { UserDto } from "../user/dtos/user.dto";
import type { LoginResponseDto } from "./dtos/login-response.dto";
import type { LoginUserDto } from "./dtos/login-user.dto";
import type { LogoutUserDto } from "./dtos/logout-user.dto";
import type { RefreshDto } from "./dtos/refresh.dto";
import type { RegisterUserDto } from "./dtos/register-user.dto";

export interface IAuthService {
  registerUser(registerUserDto: RegisterUserDto): Promise<UserDto>;
  loginUser(loginUserDto: LoginUserDto): Promise<LoginResponseDto>;
  logoutUser(logoutUserDto: LogoutUserDto): Promise<void>;
  refreshToken(refreshDto: RefreshDto): Promise<LoginResponseDto>;
  googleLogin(user: UserDto): Promise<LoginResponseDto>;
  verifyEmail(userId: string): Promise<void>;
}

export class AuthService implements IAuthService {
  private jwtService: IJwtService;
  private userService: IUserService;
  private passwordService: IPasswordService;
  private refreshTokenService: IRefreshTokenService;
  private emailService: IEmailService;

  constructor(
    jwtService: IJwtService,
    userService: IUserService,
    passwordService: IPasswordService,
    refreshTokenService: IRefreshTokenService,
    emailService: IEmailService
  ) {
    this.jwtService = jwtService;
    this.userService = userService;
    this.passwordService = passwordService;
    this.refreshTokenService = refreshTokenService;
    this.emailService = emailService;
  }

  async registerUser(registerUserDto: RegisterUserDto): Promise<UserDto> {
    const newUser = await this.userService.createUser(registerUserDto);

    await this.emailService.sendVerificationEmail(newUser.email);

    return newUser;
  }

  async loginUser(loginUserDto: LoginUserDto): Promise<LoginResponseDto> {
    const { email, password } = loginUserDto;

    const user = await this.userService.getUserByEmail(email);

    if (!user) {
      throw new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND);
    }

    if (!user.isEmailVerified) {
      throw new UnauthorizedError(ERROR_MESSAGES.EMAIL_NOT_VERIFIED);
    }

    const isPasswordMatch = await this.passwordService.comparePasswords({
      password,
      hashedPassword: user.password,
    });

    if (!isPasswordMatch) {
      throw new ForbiddenError(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    const { accessToken, refreshToken } = this.jwtService.generateAuthTokens(
      user.id
    );

    await this.refreshTokenService.createToken(user.id, refreshToken);

    return { accessToken, refreshToken };
  }

  async logoutUser(logoutUserDto: LogoutUserDto): Promise<void> {
    const { userId, refreshToken } = logoutUserDto;

    if (!refreshToken || !userId) {
      throw new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED);
    }

    await this.refreshTokenService.deleteAllTokens(userId);
  }

  async refreshToken(refreshDto: RefreshDto): Promise<LoginResponseDto> {
    const { userId, token } = refreshDto;

    const payload = await this.jwtService.verify({
      token,
      secret: REFRESH_TOKEN_SECRET,
    });

    if (!payload) {
      await this.refreshTokenService.deleteAllTokens(userId);

      throw new ForbiddenError(ERROR_MESSAGES.FORBIDDEN);
    }

    if (payload.userId !== userId) {
      throw new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED);
    }

    const refreshTokenFromDB = await this.refreshTokenService.findToken(token);

    if (!refreshTokenFromDB) {
      // Detected refresh token reuse!
      await this.refreshTokenService.deleteAllTokens(userId);

      throw new ForbiddenError(ERROR_MESSAGES.FORBIDDEN);
    }

    await this.refreshTokenService.deleteToken(token);

    const { accessToken, refreshToken } =
      this.jwtService.generateAuthTokens(userId);

    await this.refreshTokenService.createToken(userId, refreshToken);

    return { accessToken, refreshToken };
  }

  async googleLogin(user: UserDto): Promise<LoginResponseDto> {
    if (!user) {
      throw new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND);
    }

    if (!user.isEmailVerified) {
      throw new UnauthorizedError(ERROR_MESSAGES.EMAIL_NOT_VERIFIED);
    }

    const { accessToken, refreshToken } = this.jwtService.generateAuthTokens(
      user.id
    );

    await this.refreshTokenService.createToken(user.id, refreshToken);

    return { accessToken, refreshToken };
  }

  async verifyEmail(userId: string): Promise<void> {
    const user = await this.userService.getUserById(userId);

    if (user.isEmailVerified) {
      throw new ForbiddenError(ERROR_MESSAGES.EMAIL_ALREADY_VERIFIED);
    }

    await this.userService.verifyUserEmail(userId);
  }
}
