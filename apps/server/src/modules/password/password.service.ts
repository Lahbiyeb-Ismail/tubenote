import bcrypt from "bcryptjs";

import { ERROR_MESSAGES } from "../../constants/errorMessages";
import { BadRequestError, NotFoundError } from "../../errors";
import type { UserDto } from "../user/dtos/user.dto";
import type { IUserDatabase } from "../user/user.db";
import type { ComparePasswordsDto } from "./dtos/compare-passwords.dto";
import type { ResetPasswordDto } from "./dtos/reset-password.dto";
import type { UpdatePasswordDto } from "./dtos/update-password.dto";

export interface IPasswordService {
  hashPassword(password: string): Promise<string>;
  comparePasswords(comparePasswordsDto: ComparePasswordsDto): Promise<boolean>;
  updatePassword(updatePasswordDto: UpdatePasswordDto): Promise<UserDto>;
  resetPassword(resetPasswordDto: ResetPasswordDto): Promise<UserDto>;
}

export class PasswordService implements IPasswordService {
  private userDB: IUserDatabase;

  constructor(userDB: IUserDatabase) {
    this.userDB = userDB;
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);

    return await bcrypt.hash(password, salt);
  }

  async comparePasswords(
    comparePasswordsDto: ComparePasswordsDto
  ): Promise<boolean> {
    const { password, hashedPassword } = comparePasswordsDto;
    return await bcrypt.compare(password, hashedPassword);
  }

  async updatePassword(updatePasswordDto: UpdatePasswordDto): Promise<UserDto> {
    const { userId, currentPassword, newPassword } = updatePasswordDto;

    const user = await this.userDB.findById(userId);

    if (!user) {
      throw new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND);
    }

    const isPasswordValid = await this.comparePasswords({
      password: currentPassword,
      hashedPassword: user.password,
    });

    if (!isPasswordValid) {
      throw new BadRequestError(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    if (currentPassword === newPassword) {
      throw new BadRequestError(ERROR_MESSAGES.PASSWORD_SAME_AS_CURRENT);
    }

    const hashedPassword = await this.hashPassword(newPassword);

    return await this.userDB.updatePassword(userId, hashedPassword);
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<UserDto> {
    const { userId, password } = resetPasswordDto;

    const hashedPassword = await this.hashPassword(password);

    return await this.userDB.updatePassword(userId, hashedPassword);
  }
}
