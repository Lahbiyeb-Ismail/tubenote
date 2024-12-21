import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { Profile } from "passport-google-oauth20";

import {
  ACCESS_TOKEN_EXPIRE,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRE,
  REFRESH_TOKEN_SECRET,
} from "../constants/auth";

import userDatabase from "../databases/userDB";

import { ERROR_MESSAGES } from "../constants/errorMessages";

import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "../errors";

import type { JwtPayload } from "../types";
import type {
  GoogleUser,
  LoginParams,
  LoginResponse,
  LogoutParams,
  RegisterParams,
} from "../types/auth.type";

import type { UserEntry } from "../types/user.type";
import refreshTokenService from "./refreshTokenService";
import userService from "./userService";
import emailVerificationService from "./verifyEmailService";

class AuthService {
  private async verifyToken(
    token: string,
    secret: string
  ): Promise<JwtPayload> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, secret, (err, payload) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(payload as JwtPayload);
      });
    });
  }

  private generateJwtToken(
    userId: string,
    secret: string,
    expire: string
  ): string {
    return jwt.sign({ userId }, secret, {
      expiresIn: expire,
    });
  }

  private createJwtTokens(userId: string): {
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
    const isUserExist = await userDatabase.findUserByEmail(email);

    if (isUserExist) {
      throw new ConflictError(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
    }

    const newUser = await userDatabase.create({
      data: { username, email, password },
    });

    await emailVerificationService.generateAndSendToken(newUser.email);

    return newUser;
  }

  async loginUser({ email, password }: LoginParams): Promise<LoginResponse> {
    const user = await userDatabase.findUserByEmail(email);

    if (!user) {
      throw new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND);
    }

    if (!user.isEmailVerified) {
      throw new UnauthorizedError(ERROR_MESSAGES.EMAIL_NOT_VERIFIED);
    }

    const isPasswordMatch = await this.comparePasswords(
      password,
      user.password
    );

    if (!isPasswordMatch) {
      throw new UnauthorizedError(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    const { accessToken, refreshToken } = this.createJwtTokens(user.id);

    await refreshTokenService.createToken(user.id, refreshToken);

    return { accessToken, refreshToken };
  }

  async logoutUser({ refreshToken, userId }: LogoutParams): Promise<void> {
    if (!refreshToken) {
      throw new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED);
    }

    await refreshTokenService.deleteAllTokens(userId);
  }

  async refreshToken(token: string): Promise<LoginResponse> {
    const payload = await this.verifyToken(token, REFRESH_TOKEN_SECRET);

    const { userId, exp } = payload as JwtPayload;

    if (exp && Date.now() >= exp * 1000) {
      // Check if the token is expired
      await refreshTokenService.deleteAllTokens(userId);

      throw new ForbiddenError(ERROR_MESSAGES.FORBIDDEN);
    }

    const refreshTokenFromDB = await refreshTokenService.findToken(token);

    if (!refreshTokenFromDB) {
      // Detected refresh token reuse!
      await refreshTokenService.deleteAllTokens(userId);

      throw new ForbiddenError(ERROR_MESSAGES.FORBIDDEN);
    }

    await refreshTokenService.deleteToken(token);

    if (refreshTokenFromDB.userId !== userId) {
      throw new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED);
    }

    const { accessToken, refreshToken } = this.createJwtTokens(userId);

    await refreshTokenService.createToken(userId, refreshToken);

    return { accessToken, refreshToken };
  }

  async googleLogin(user: Profile): Promise<LoginResponse> {
    if (!user) {
      throw new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND);
    }

    const {
      sub: googleId,
      email,
      email_verified,
      name,
      picture,
    } = user._json as GoogleUser;

    if (!email_verified) {
      throw new UnauthorizedError(ERROR_MESSAGES.EMAIL_NOT_VERIFIED);
    }

    let foundUser = await userDatabase.findUserByEmail(email);

    if (!foundUser) {
      foundUser = await userDatabase.create({
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
      foundUser = await userDatabase.updateUser({
        userId: foundUser.id,
        data: { googleId },
      });
    }

    const { accessToken, refreshToken } = this.createJwtTokens(foundUser.id);

    await refreshTokenService.createToken(foundUser.id, refreshToken);

    return { accessToken, refreshToken };
  }

  async verifyEmail(userId: string): Promise<void> {
    const user = await userService.getUserById(userId);

    if (user.isEmailVerified) {
      throw new ForbiddenError(ERROR_MESSAGES.EMAIL_ALREADY_VERIFIED);
    }

    await userService.verifyUserEmail(userId);
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);

    return await bcrypt.hash(password, salt);
  }

  async comparePasswords(
    password: string,
    userPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(password, userPassword);
  }
}

export default new AuthService();
