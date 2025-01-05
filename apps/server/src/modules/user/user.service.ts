import { ERROR_MESSAGES } from "../../constants/errorMessages";

import { BadRequestError, NotFoundError } from "../../errors";

import type { UserEntry } from "./user.type";

import AuthService from "../auth/auth.service";
import type { UpdatePasswordDto } from "./dtos/update-password.dto";
import type { UpdateUserDto } from "./dtos/update-user.dto";
import UserDB from "./userDB";

class UserService {
  async getUserByEmail(email: string): Promise<UserEntry | null> {
    const user = await UserDB.findByEmail(email);

    return user;
  }

  async getUserById(userId: string): Promise<UserEntry> {
    const user = await UserDB.findById(userId);

    if (!user) {
      throw new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND);
    }

    return user;
  }

  async updateUser(updateUserDto: UpdateUserDto): Promise<UserEntry> {
    const { userId, email } = updateUserDto;

    await this.getUserById(userId);

    let user: UserEntry | null = null;

    if (email) {
      user = await this.getUserByEmail(email);
    }

    if (user && user.id !== userId) {
      throw new BadRequestError(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
    }

    return await UserDB.updateUser(updateUserDto);
  }

  async updatePassword(
    updatePasswordDto: UpdatePasswordDto
  ): Promise<UserEntry> {
    const { userId, currentPassword, newPassword } = updatePasswordDto;

    const user = await this.getUserById(userId);

    const isPasswordValid = await AuthService.comparePasswords({
      password: currentPassword,
      hashedPassword: user.password,
    });

    if (!isPasswordValid) {
      throw new BadRequestError(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    if (currentPassword === newPassword) {
      throw new BadRequestError(ERROR_MESSAGES.PASSWORD_SAME_AS_CURRENT);
    }

    const hashedPassword = await AuthService.hashPassword(newPassword);

    return await UserDB.updatePassword({
      userId,
      hashedPassword,
    });
  }

  async verifyUserEmail(userId: string): Promise<UserEntry> {
    return await UserDB.updateUser({ userId, isEmailVerified: true });
  }
}

export default new UserService();
