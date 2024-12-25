import { ERROR_MESSAGES } from "../../constants/errorMessages";

import { BadRequestError, NotFoundError } from "../../errors";

import type { UpdatePasswordParams, UserEntry } from "./user.type";

import AuthService from "../auth/authService";
import UserDB from "./userDB";

class UserService {
  async getUserByEmail(email: string): Promise<UserEntry | null> {
    const user = await UserDB.findByEmail(email);

    if (!user) {
      return null;
    }

    return user;
  }

  async getUserById(userId: string): Promise<UserEntry> {
    const user = await UserDB.findById(userId);

    if (!user) {
      throw new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND);
    }

    return user;
  }

  async updateUser({
    username,
    email,
    userId,
  }: {
    userId: string;
    username: string;
    email: string;
  }): Promise<void> {
    await this.getUserById(userId);

    const user = await this.getUserByEmail(email);

    if (user && user.id !== userId) {
      throw new BadRequestError(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
    }

    await UserDB.update({ userId, data: { email, username } });
  }

  async updatePassword({
    userId,
    currentPassword,
    newPassword,
  }: UpdatePasswordParams): Promise<void> {
    const user = await this.getUserById(userId);

    const isPasswordValid = await AuthService.comparePasswords({
      rawPassword: currentPassword,
      hashedPassword: user.password,
    });

    if (!isPasswordValid) {
      throw new BadRequestError(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    if (currentPassword === newPassword) {
      throw new BadRequestError(ERROR_MESSAGES.PASSWORD_SAME_AS_CURRENT);
    }

    const hashedPassword = await AuthService.hashPassword(newPassword);

    await UserDB.update({
      userId,
      data: { password: hashedPassword },
    });
  }

  async verifyUserEmail(userId: string): Promise<void> {
    await UserDB.update({ userId, data: { isEmailVerified: true } });
  }
}

export default new UserService();
