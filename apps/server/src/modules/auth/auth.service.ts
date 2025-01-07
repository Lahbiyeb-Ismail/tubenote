import jwt from "jsonwebtoken";

import {
  ACCESS_TOKEN_EXPIRE,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRE,
  REFRESH_TOKEN_SECRET,
} from "../../constants/auth";

import { ERROR_MESSAGES } from "../../constants/errorMessages";

import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "../../errors";

import type { JwtPayload } from "../../types";
import type { GoogleUser } from "./auth.type";

import type { UserEntry } from "../user/user.type";

import logger from "../../utils/logger";

import { IPasswordService } from "../password/password.service";
import { IUserDatabase } from "../user/user.db";
import { IUserService } from "../user/user.service";

import RefreshTokenService from "../refreshToken/refreshTokenService";

import type { IEmailService } from "../../services/emailService";
import type { GenerateTokenDto } from "./dtos/generate-token.dto";
import type { LoginResponseDto } from "./dtos/login-response.dto";
import type { LoginUserDto } from "./dtos/login-user.dto";
import type { LogoutUserDto } from "./dtos/logout-user.dto";
import type { RefreshTokenDto } from "./dtos/refresh-token.dto";
import type { RegisterUserDto } from "./dtos/register-user.dto";
import type { VerifyJwtTokenDto } from "./dtos/verfiy-jwt-token.dto";

export interface IAuthService {
  verifyToken(verifyTokenDto: VerifyJwtTokenDto): Promise<JwtPayload | null>;
  generateJwtToken(generateTokenDto: GenerateTokenDto): string;
  createJwtTokens(userId: string): {
    accessToken: string;
    refreshToken: string;
  };
  registerUser(registerUserDto: RegisterUserDto): Promise<UserEntry>;
  loginUser(loginUserDto: LoginUserDto): Promise<LoginResponseDto>;
  logoutUser(logoutUserDto: LogoutUserDto): Promise<void>;
  refreshToken(refreshTokenDto: RefreshTokenDto): Promise<LoginResponseDto>;
  googleLogin(user: GoogleUser): Promise<LoginResponseDto>;
  verifyEmail(userId: string): Promise<void>;
}

export class AuthService implements IAuthService {
  private userDB: IUserDatabase;
  private userService: IUserService;
  private passwordService: IPasswordService;
  private emailService: IEmailService;

  constructor(
    userDB: IUserDatabase,
    userService: IUserService,
    passwordService: IPasswordService,
    emailService: IEmailService
  ) {
    this.userDB = userDB;
    this.userService = userService;
    this.passwordService = passwordService;
    this.emailService = emailService;
  }

  async verifyToken(
    verifyTokenDto: VerifyJwtTokenDto
  ): Promise<JwtPayload | null> {
    const { token, secret } = verifyTokenDto;

    return new Promise((resolve, _reject) => {
      jwt.verify(token, secret, (err, payload) => {
        if (err) {
          logger.error(`Error verifying token: ${err}`);
          resolve(null);
        }

        resolve(payload as JwtPayload);
      });
    });
  }

  generateJwtToken(generateTokenDto: GenerateTokenDto): string {
    const { userId, secret, expiresIn } = generateTokenDto;

    return jwt.sign({ userId }, secret, {
      expiresIn,
    });
  }

  createJwtTokens(userId: string): {
    accessToken: string;
    refreshToken: string;
  } {
    const accessToken = this.generateJwtToken({
      userId,
      secret: ACCESS_TOKEN_SECRET,
      expiresIn: ACCESS_TOKEN_EXPIRE,
    });

    const refreshToken = this.generateJwtToken({
      userId,
      secret: REFRESH_TOKEN_SECRET,
      expiresIn: REFRESH_TOKEN_EXPIRE,
    });

    return { accessToken, refreshToken };
  }

  async registerUser(registerUserDto: RegisterUserDto): Promise<UserEntry> {
    const { email, username, password } = registerUserDto;

    const userExists = await this.userDB.findByEmail(email);

    if (userExists) {
      throw new ConflictError(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
    }

    const hashedPassword = await this.passwordService.hashPassword(password);

    const newUser = await this.userDB.create({
      username,
      email,
      password: hashedPassword,
    });

    await this.emailService.sendVerificationEmail(newUser.email);

    return newUser;
  }

  async loginUser(loginUserDto: LoginUserDto): Promise<LoginResponseDto> {
    const { email, password } = loginUserDto;

    const user = await this.userDB.findByEmail(email);

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

    const { accessToken, refreshToken } = this.createJwtTokens(user.id);

    await RefreshTokenService.createToken(user.id, refreshToken);

    return { accessToken, refreshToken };
  }

  async logoutUser(logoutUserDto: LogoutUserDto): Promise<void> {
    const { userId, refreshToken } = logoutUserDto;

    if (!refreshToken || !userId) {
      throw new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED);
    }

    await RefreshTokenService.deleteAllTokens(userId);
  }

  async refreshToken(
    refreshTokenDto: RefreshTokenDto
  ): Promise<LoginResponseDto> {
    const { userId, token } = refreshTokenDto;

    const payload = await this.verifyToken({
      token,
      secret: REFRESH_TOKEN_SECRET,
    });

    if (!payload) {
      await RefreshTokenService.deleteAllTokens(userId);

      throw new ForbiddenError(ERROR_MESSAGES.FORBIDDEN);
    }

    if (payload.userId !== userId) {
      throw new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED);
    }

    const refreshTokenFromDB = await RefreshTokenService.findToken(token);

    if (!refreshTokenFromDB) {
      // Detected refresh token reuse!
      await RefreshTokenService.deleteAllTokens(userId);

      throw new ForbiddenError(ERROR_MESSAGES.FORBIDDEN);
    }

    await RefreshTokenService.deleteToken(token);

    const { accessToken, refreshToken } = this.createJwtTokens(userId);

    await RefreshTokenService.createToken(userId, refreshToken);

    return { accessToken, refreshToken };
  }

  async googleLogin(user: GoogleUser): Promise<LoginResponseDto> {
    if (!user) {
      throw new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND);
    }

    const { sub: googleId, email, email_verified, name, picture } = user;

    if (!email_verified) {
      throw new UnauthorizedError(ERROR_MESSAGES.EMAIL_NOT_VERIFIED);
    }

    let foundUser = await this.userDB.findByEmail(email);

    if (!foundUser) {
      foundUser = await this.userDB.create({
        username: name,
        isEmailVerified: email_verified,
        password: googleId,
        profilePicture: picture,
        email,
        googleId,
      });
    } else if (!foundUser.googleId) {
      foundUser = await this.userDB.updateUser(foundUser.id, {
        googleId,
      });
    }

    const { accessToken, refreshToken } = this.createJwtTokens(foundUser.id);

    await RefreshTokenService.createToken(foundUser.id, refreshToken);

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
