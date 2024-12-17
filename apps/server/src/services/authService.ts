import type { User } from "@prisma/client";
import bcrypt from "bcryptjs";
import { REFRESH_TOKEN_SECRET } from "../constants/auth";
import userDatabase from "../databases/userDatabase";
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "../errors";
import { createNewTokens, verifyToken } from "../helpers/auth.helper";
import type { JwtPayload } from "../types";
import emailService from "./emailService";
import {
  deleteRefreshToken,
  deleteRefreshTokenByUserId,
  findRefreshToken,
} from "./refreshToken.services";
import verificationTokenService from "./verificationTokenService";

interface IRegisterUser {
  username: string;
  email: string;
  password: string;
}

class AuthService {
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

    const emailVerificationToken =
      await verificationTokenService.createEmailVericationToken(newUser.id);

    await emailService.sendVerificationEmail({
      email: newUser.email,
      token: emailVerificationToken,
    });

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

    if (!user.emailVerified) {
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

    const { accessToken, refreshToken } = await createNewTokens(user.id);

    return { accessToken, refreshToken };
  }

  async logoutUser(token: string) {
    if (!token) {
      throw new UnauthorizedError("You are not logged in.");
    }

    const isTokenExist = await findRefreshToken(token);

    if (isTokenExist) {
      await deleteRefreshToken(token);
    }
  }

  async refreshToken(
    token: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = await verifyToken(token, REFRESH_TOKEN_SECRET);

    const { userId, exp } = payload as JwtPayload;

    // Check if the token is expired
    if (exp && Date.now() >= exp * 1000) {
      await deleteRefreshTokenByUserId(userId);

      throw new UnauthorizedError(
        "Refresh token expired. Please log in again."
      );
    }

    const refreshTokenFromDB = await findRefreshToken(token);

    // Detected refresh token reuse!
    if (!refreshTokenFromDB) {
      await deleteRefreshTokenByUserId(userId);

      throw new ForbiddenError("Invalid refresh token. Please log in again.");
    }

    await deleteRefreshToken(token);

    if (refreshTokenFromDB.userId !== userId) {
      throw new ForbiddenError("Invalid refresh token. Please log in again.");
    }

    const { accessToken, refreshToken } = await createNewTokens(userId);

    return { accessToken, refreshToken };
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
