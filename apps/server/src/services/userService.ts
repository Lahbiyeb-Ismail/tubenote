import type { User } from "@prisma/client";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import userDatabase from "../databases/userDB";
import { BadRequestError, NotFoundError } from "../errors";
import authService from "./authService";

class UserService {
  async getUserByEmail(email: string): Promise<User> {
    const user = await userDatabase.findUser({ email });

    if (!user) {
      throw new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND);
    }

    return user;
  }

  async getUserById(userId: string): Promise<User> {
    const user = await userDatabase.findUser({ id: userId });

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

    await userDatabase.updateUser({ userId, data: { email, username } });
  }

  async updatePassword({
    userId,
    currentPassword,
    newPassword,
  }: { userId: string; currentPassword: string; newPassword: string }) {
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

    await userDatabase.updateUser({
      userId,
      data: { password: hashedPassword },
    });
  }

  async verifyUserEmail(userId: string): Promise<void> {
    await userDatabase.updateUser({ userId, data: { isEmailVerified: true } });
  }
}

export default new UserService();
