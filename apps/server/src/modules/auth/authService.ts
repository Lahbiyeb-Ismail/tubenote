import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { Profile } from "passport-google-oauth20";

import {
  ACCESS_TOKEN_EXPIRE,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRE,
  REFRESH_TOKEN_SECRET,
} from "../../constants/auth";

import UserDB from "../user/userDB";

import { ERROR_MESSAGES } from "../../constants/errorMessages";

import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "../../errors";

import type { JwtPayload } from "../../types";
import type {
  GoogleUser,
  LoginParams,
  LoginResponse,
  LogoutParams,
  RegisterParams,
} from "./auth.type";

import type { UserEntry } from "../user/user.type";

import logger from "../../utils/logger";
import RefreshTokenService from "../refreshToken/refreshTokenService";
import UserService from "../user/userService";
import EmailVerificationService from "../verifyEmailToken/verifyEmailService";

class AuthService {
  async verifyToken(token: string, secret: string): Promise<JwtPayload | null> {
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

  generateJwtToken(userId: string, secret: string, expire: string): string {
    return jwt.sign({ userId }, secret, {
      expiresIn: expire,
    });
  }

  createJwtTokens(userId: string): {
    accessToken: string;
    refreshToken: string;
  } {
    const accessToken = this.generateJwtToken(
      userId,
      ACCESS_TOKEN_SECRET,
      ACCESS_TOKEN_EXPIRE
    );

    const refreshToken = this.generateJwtToken(
      userId,
      REFRESH_TOKEN_SECRET,
      REFRESH_TOKEN_EXPIRE
    );

    return { accessToken, refreshToken };
  }

  async registerUser({
    username,
    email,
    password,
  }: RegisterParams): Promise<UserEntry> {
    const userExists = await UserDB.findByEmail(email);

    if (userExists) {
      throw new ConflictError(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
    }

    const hashedPassword = await this.hashPassword(password);

    const newUser = await UserDB.create({
      data: { username, email, password: hashedPassword },
    });

    await EmailVerificationService.generateAndSendToken(newUser.email);

    return newUser;
  }

  async loginUser({ email, password }: LoginParams): Promise<LoginResponse> {
    const user = await UserDB.findByEmail(email);

    if (!user) {
      throw new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND);
    }

    if (!user.isEmailVerified) {
      throw new UnauthorizedError(ERROR_MESSAGES.EMAIL_NOT_VERIFIED);
    }

    const isPasswordMatch = await this.comparePasswords({
      rawPassword: password,
      hashedPassword: user.password,
    });

    if (!isPasswordMatch) {
      throw new ForbiddenError(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    const { accessToken, refreshToken } = this.createJwtTokens(user.id);

    await RefreshTokenService.createToken(user.id, refreshToken);

    return { accessToken, refreshToken };
  }

  async logoutUser({ refreshToken, userId }: LogoutParams): Promise<void> {
    if (!refreshToken || !userId) {
      throw new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED);
    }

    await RefreshTokenService.deleteAllTokens(userId);
  }

  async refreshToken({
    token,
    userId,
  }: { token: string; userId: string }): Promise<LoginResponse> {
    const payload = await this.verifyToken(token, REFRESH_TOKEN_SECRET);

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

  async googleLogin(user: GoogleUser): Promise<LoginResponse> {
    if (!user) {
      throw new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND);
    }

    const { sub: googleId, email, email_verified, name, picture } = user;

    if (!email_verified) {
      throw new UnauthorizedError(ERROR_MESSAGES.EMAIL_NOT_VERIFIED);
    }

    let foundUser = await UserDB.findByEmail(email);

    if (!foundUser) {
      foundUser = await UserDB.create({
        data: {
          username: name,
          isEmailVerified: email_verified,
          password: googleId,
          profilePicture: picture,
          email,
          googleId,
        },
      });
    } else if (!foundUser.googleId) {
      foundUser = await UserDB.update({
        userId: foundUser.id,
        data: { googleId },
      });
    }

    const { accessToken, refreshToken } = this.createJwtTokens(foundUser.id);

    await RefreshTokenService.createToken(foundUser.id, refreshToken);

    return { accessToken, refreshToken };
  }

  async verifyEmail(userId: string): Promise<void> {
    const user = await UserService.getUserById(userId);

    if (user.isEmailVerified) {
      throw new ForbiddenError(ERROR_MESSAGES.EMAIL_ALREADY_VERIFIED);
    }

    await UserService.verifyUserEmail(userId);
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);

    return await bcrypt.hash(password, salt);
  }

  async comparePasswords({
    rawPassword,
    hashedPassword,
  }: { rawPassword: string; hashedPassword: string }): Promise<boolean> {
    return await bcrypt.compare(rawPassword, hashedPassword);
  }
}

export default new AuthService();
