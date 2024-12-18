import type { User } from "@prisma/client";
import userDatabase from "../databases/userDatabase";
import { BadRequestError, NotFoundError } from "../errors";
import authService from "./authService";

class UserService {
  async getUser(userId: string): Promise<User> {
    const user = await userDatabase.findUser({ id: userId });

    if (!user) {
      throw new NotFoundError("User not found. Please try again.");
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
    await this.getUser(userId);

    const existingUser = await userDatabase.findUser({ email });

    if (existingUser && existingUser.id !== userId) {
      throw new BadRequestError(
        "Email is already taken. Please try another one."
      );
    }

    await userDatabase.updateUser({ userId, data: { email, username } });
  }

  async updatePassword({
    userId,
    currentPassword,
    newPassword,
  }: { userId: string; currentPassword: string; newPassword: string }) {
    const user = await this.getUser(userId);

    const isPasswordValid = await authService.comparePasswords(
      currentPassword,
      user.password
    );

    if (!isPasswordValid) {
      throw new BadRequestError("Invalid current password. Please try again.");
    }

    if (currentPassword === newPassword) {
      throw new BadRequestError(
        "New password must be different from the current password."
      );
    }

    const hashedPassword = await authService.hashPassword(newPassword);

    await userDatabase.updateUser({
      userId,
      data: { password: hashedPassword },
    });
  }
}

export default new UserService();
