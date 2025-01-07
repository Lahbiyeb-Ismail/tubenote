import { ERROR_MESSAGES } from "../../constants/errorMessages";

import { BadRequestError, NotFoundError } from "../../errors";

import { IAuthService } from "../auth/auth.service";
import { IUserDatabase } from "./user.db";

import type { UserEntry } from "./user.type";

import type { IPasswordService } from "../password/password.service";
import type { UpdatePasswordDto } from "./dtos/update-password.dto";
import type { UpdateUserDto } from "./dtos/update-user.dto";

export interface IUserService {
  getUserByEmail(email: string): Promise<UserEntry | null>;
  getUserById(userId: string): Promise<UserEntry>;
  updateUser(id: string, updateUserDto: UpdateUserDto): Promise<UserEntry>;
  updatePassword(
    id: string,
    updatePasswordDto: UpdatePasswordDto
  ): Promise<UserEntry>;
  verifyUserEmail(id: string): Promise<UserEntry>;
}

export class UserService implements IUserService {
  private userDB: IUserDatabase;
  private passwordService: IPasswordService;

  constructor(userDB: IUserDatabase, passwordService: IPasswordService) {
    this.userDB = userDB;
    this.passwordService = passwordService;
  }

  async getUserByEmail(email: string): Promise<UserEntry | null> {
    const user = await this.userDB.findByEmail(email);

    return user;
  }

  async getUserById(userId: string): Promise<UserEntry> {
    const user = await this.userDB.findById(userId);

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

    return await this.userDB.updateUser(id, updateUserDto);
  }

  async updatePassword(
    id: string,
    updatePasswordDto: UpdatePasswordDto
  ): Promise<UserEntry> {
    const { currentPassword, newPassword } = updatePasswordDto;

    const user = await this.getUserById(id);

    const isPasswordValid = await this.passwordService.comparePasswords({
      password: currentPassword,
      hashedPassword: user.password,
    });

    if (!isPasswordValid) {
      throw new BadRequestError(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    if (currentPassword === newPassword) {
      throw new BadRequestError(ERROR_MESSAGES.PASSWORD_SAME_AS_CURRENT);
    }

    const hashedPassword = await this.passwordService.hashPassword(newPassword);

    return await this.userDB.updatePassword({ id, password: hashedPassword });
  }

  async verifyUserEmail(id: string): Promise<UserEntry> {
    return await this.userDB.updateUser(id, { isEmailVerified: true });
  }
}
