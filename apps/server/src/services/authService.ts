import type { User } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { Profile } from "passport-google-oauth20";

import {
  ACCESS_TOKEN_EXPIRE,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRE,
  REFRESH_TOKEN_SECRET,
} from "../constants/auth";

import userDatabase from "../databases/userDatabase";

import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "../errors";

import type { JwtPayload } from "../types";
import type { GoogleUser } from "../types/auth.type";

import refreshTokenService from "./refreshTokenService";
import userService from "./userService";
import emailVerificationService from "./verifyEmailService";

interface IRegisterUser {
  username: string;
  email: string;
  password: string;
}

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
  }: IRegisterUser): Promise<User> {
    const isUserExist = await userDatabase.findUser({ email });

    if (isUserExist) {
      throw new ConflictError(
        "Email address already in use. Please select another one."
      );
    }

    const newUser = await userDatabase.createNewUser({
      username,
      email,
      password,
    });

    await emailVerificationService.generateAndSendToken(newUser.email);

    return newUser;
  }

  async loginUser(
    email: string,
    password: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await userDatabase.findUser({ email });

    if (!user) {
      throw new NotFoundError("No User found with this email address.");
    }

    if (!user.isEmailVerified) {
      throw new UnauthorizedError(
        "Email not verified. Please verify your email address."
      );
    }

    const isPasswordMatch = await this.comparePasswords(
      password,
      user.password
    );

    if (!isPasswordMatch) {
      throw new UnauthorizedError(
        "Invalid email or password. Please try again."
      );
    }

    const { accessToken, refreshToken } = this.createJwtTokens(user.id);

    await refreshTokenService.createToken(user.id, refreshToken);

    return { accessToken, refreshToken };
  }

  async logoutUser(token: string, userId: string): Promise<void> {
    if (!token) {
      throw new UnauthorizedError("You are not logged in.");
    }

    await refreshTokenService.deleteAllTokens(userId);
  }

  async refreshToken(
    token: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = await this.verifyToken(token, REFRESH_TOKEN_SECRET);

    const { userId, exp } = payload as JwtPayload;

    if (exp && Date.now() >= exp * 1000) {
      // Check if the token is expired
      await refreshTokenService.deleteAllTokens(userId);

      throw new UnauthorizedError(
        "Refresh token expired. Please log in again."
      );
    }

    const refreshTokenFromDB = await refreshTokenService.findToken(token);

    if (!refreshTokenFromDB) {
      // Detected refresh token reuse!
      await refreshTokenService.deleteAllTokens(userId);

      throw new ForbiddenError("Invalid refresh token. Please log in again.");
    }

    await refreshTokenService.deleteToken(token);

    if (refreshTokenFromDB.userId !== userId) {
      throw new ForbiddenError("Invalid refresh token. Please log in again.");
    }

    const { accessToken, refreshToken } = this.createJwtTokens(userId);

    await refreshTokenService.createToken(userId, refreshToken);

    return { accessToken, refreshToken };
  }

  async googleLogin(
    profile: Profile
  ): Promise<{ accessToken: string; refreshToken: string }> {
    if (!profile) {
      throw new UnauthorizedError("Google login failed. Please try again.");
    }

    const {
      sub: googleId,
      email,
      email_verified,
      name,
      picture,
    } = profile._json as GoogleUser;

    if (!email_verified) {
      throw new UnauthorizedError("Email not verified. Please try again.");
    }

    let foundUser = await userDatabase.findUser({ email });

    if (!foundUser) {
      foundUser = await userDatabase.createNewUser({
        username: name,
        isEmailVerified: email_verified,
        password: googleId,
        profilePicture: picture,
        email,
        googleId,
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
      throw new BadRequestError("Email is already verified.");
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
