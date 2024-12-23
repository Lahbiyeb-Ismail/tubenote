import { ERROR_MESSAGES } from "../constants/errorMessages";
import userDatabase from "../databases/userDB";

import { BadRequestError, NotFoundError } from "../errors";
import type { UpdatePasswordParams, UserEntry } from "../types/user.type";

import authService from "./authService";

class UserService {
  async getUserByEmail(email: string): Promise<UserEntry> {
    const user = await userDatabase.findByEmail(email);

    if (!user) {
      throw new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND);
    }

    return user;
  }

  async getUserById(userId: string): Promise<UserEntry> {
    const user = await userDatabase.findById(userId);

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

    const existingUser = await this.getUserByEmail(email);

    if (existingUser && existingUser.id !== userId) {
      throw new BadRequestError(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
    }

    await userDatabase.update({ userId, data: { email, username } });
  }

  async updatePassword({
    userId,
    currentPassword,
    newPassword,
  }: UpdatePasswordParams): Promise<void> {
    const user = await this.getUserById(userId);

    const isPasswordValid = await authService.comparePasswords(
      currentPassword,
      user.password
    );

    if (!isPasswordValid) {
      throw new BadRequestError(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    if (currentPassword === newPassword) {
      throw new BadRequestError(ERROR_MESSAGES.PASSWORD_SAME_AS_CURRENT);
    }

    const hashedPassword = await authService.hashPassword(newPassword);

    await userDatabase.update({
      userId,
      data: { password: hashedPassword },
    });
  }

  async verifyUserEmail(userId: string): Promise<void> {
    await userDatabase.update({ userId, data: { isEmailVerified: true } });
  }
}

export default new UserService();
