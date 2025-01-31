import { ERROR_MESSAGES } from "@constants/error-messages.contants";

import { BadRequestError, ConflictError, NotFoundError } from "@/errors";

import type { User } from "./user.model";

import type { ICryptoService } from "@modules/utils/crypto";

import type { CreateUserDto, UpdatePasswordDto, UpdateUserDto } from "./dtos";
import type { IUserRepository, IUserService } from "./user.types";

export class UserService implements IUserService {
  constructor(
    private readonly _userRepository: IUserRepository,
    private readonly _cryptoService: ICryptoService
  ) {}

  private async _ensureEmailIsUnique(
    email: string,
    excludedUserId?: string
  ): Promise<void> {
    const existingUser = await this._userRepository.getUser({ email });

    if (existingUser && existingUser.id !== excludedUserId) {
      throw new ConflictError(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
    }
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { email } = createUserDto;

    await this._ensureEmailIsUnique(email);

    const hashedPassword = await this._cryptoService.hashPassword(
      createUserDto.password
    );

    return await this._userRepository.createUser({
      ...createUserDto,
      password: hashedPassword,
    });
  }

  async findOrCreateUser(createUserDto: CreateUserDto): Promise<User> {
    const { email } = createUserDto;

    let user = await this._userRepository.getUser({ email });

    if (!user) {
      user = await this.createUser(createUserDto);
    }

    return user;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const user = await this._userRepository.getUser({ email });

    return user;
  }

  async getUserById(userId: string): Promise<User> {
    const user = await this._userRepository.getUser({ id: userId });

    if (!user) {
      throw new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND);
    }

    return user;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.getUserById(id);

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      await this._ensureEmailIsUnique(updateUserDto.email, user.id);
    }

    return await this._userRepository.updateUser(id, updateUserDto);
  }

  async updatePassword(
    userId: string,
    updatePasswordDto: UpdatePasswordDto
  ): Promise<User> {
    const { currentPassword, newPassword } = updatePasswordDto;

    const user = await this.getUserById(userId);

    const isPasswordValid = await this._cryptoService.comparePasswords({
      plainText: currentPassword,
      hash: user.password,
    });

    if (!isPasswordValid) {
      throw new BadRequestError(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    if (currentPassword === newPassword) {
      throw new BadRequestError(ERROR_MESSAGES.PASSWORD_SAME_AS_CURRENT);
    }

    const hashedPassword = await this._cryptoService.hashPassword(newPassword);

    return await this._userRepository.updatePassword(user.id, hashedPassword);
  }

  async resetPassword(userId: string, newPassword: string): Promise<User> {
    // Check if the user exists
    await this.getUserById(userId);

    const hashedPassword = await this._cryptoService.hashPassword(newPassword);

    return await this._userRepository.updatePassword(userId, hashedPassword);
  }
}
