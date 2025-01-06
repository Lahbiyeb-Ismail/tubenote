import { ERROR_MESSAGES } from "../../constants/errorMessages";

import { BadRequestError, NotFoundError } from "../../errors";

import type { UserEntry } from "./user.type";

import AuthService from "../auth/auth.service";
import type { UpdatePasswordDto } from "./dtos/update-password.dto";
import type { UpdateUserDto } from "./dtos/update-user.dto";
import UserDB from "./user.db";

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

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto
  ): Promise<UserEntry> {
    const user = await this.getUserById(id);

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.getUserByEmail(updateUserDto.email);

      if (existingUser && existingUser.id !== id) {
        throw new BadRequestError(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
      }
    }

    return await UserDB.updateUser(id, updateUserDto);
  }

  async updatePassword(
    id: string,
    updatePasswordDto: UpdatePasswordDto
  ): Promise<UserEntry> {
    const { currentPassword, newPassword } = updatePasswordDto;

    const user = await this.getUserById(id);

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

    return await UserDB.updatePassword({ id, password: hashedPassword });
  }

  async verifyUserEmail(id: string): Promise<UserEntry> {
    return await UserDB.updateUser(id, { isEmailVerified: true });
  }
}

export default new UserService();
