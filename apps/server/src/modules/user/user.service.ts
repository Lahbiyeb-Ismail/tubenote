import { ERROR_MESSAGES } from "@constants/error-messages.contants";

import { BadRequestError, ConflictError, NotFoundError } from "@/errors";

import type { User } from "./user.model";

import type { IPasswordHasherService } from "@modules/auth/utils/services/password-hasher/password-hasher.types";
import type { IUserRepository, IUserService } from "./user.types";

import type { CreateUserDto } from "./dtos/create-user.dto";
import type { UpdatePasswordDto } from "./dtos/update-password.dto";
import type { UpdateUserDto } from "./dtos/update-user.dto";

export class UserService implements IUserService {
  constructor(
    private readonly _userRepository: IUserRepository,
    private readonly _passwordHasherService: IPasswordHasherService
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { email } = createUserDto;

    const existingUser = await this.getUserByEmail(email);

    if (existingUser) {
      throw new ConflictError(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
    }

    const hashedPassword = await this._passwordHasherService.hashPassword(
      createUserDto.password
    );

    return await this._userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
  }

  async findOrCreateUser(createUserDto: CreateUserDto): Promise<User> {
    const { email } = createUserDto;

    let user = await this.getUserByEmail(email);

    if (!user) {
      user = await this.createUser(createUserDto);
    }

    return user;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const user = await this._userRepository.findByEmail(email);

    return user;
  }

  async getUserById(userId: string): Promise<User> {
    const user = await this._userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND);
    }

    return user;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.getUserById(id);

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.getUserByEmail(updateUserDto.email);

      if (existingUser && existingUser.id !== id) {
        throw new BadRequestError(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
      }
    }

    return await this._userRepository.updateUser(id, updateUserDto);
  }

  async updatePassword(
    userId: string,
    updatePasswordDto: UpdatePasswordDto
  ): Promise<User> {
    const { currentPassword, newPassword } = updatePasswordDto;

    const user = await this.getUserById(userId);

    if (!user) {
      throw new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND);
    }

    const isPasswordValid = await this._passwordHasherService.comparePassword({
      password: currentPassword,
      hashedPassword: user.password,
    });

    if (!isPasswordValid) {
      throw new BadRequestError(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    if (currentPassword === newPassword) {
      throw new BadRequestError(ERROR_MESSAGES.PASSWORD_SAME_AS_CURRENT);
    }

    const hashedPassword =
      await this._passwordHasherService.hashPassword(newPassword);

    return await this._userRepository.updatePassword(user.id, hashedPassword);
  }

  async resetPassword(userId: string, newPassword: string): Promise<User> {
    const hashedPassword =
      await this._passwordHasherService.hashPassword(newPassword);

    return await this._userRepository.updatePassword(userId, hashedPassword);
  }
}
