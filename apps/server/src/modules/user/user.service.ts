import { ERROR_MESSAGES } from "@constants/error-messages.contants";

import { BadRequestError, ConflictError, NotFoundError } from "@/errors";

import type { User } from "./user.model";

import type { ICryptoService } from "@modules/utils/crypto";

import type {
  CreateUserDto,
  GetUserDto,
  UpdatePasswordDto,
  UpdateUserDto,
} from "./dtos";
import type { IUserRepository, IUserService } from "./user.types";

export class UserService implements IUserService {
  constructor(
    private readonly _userRepository: IUserRepository,
    private readonly _cryptoService: ICryptoService
  ) {}

  private async _createUserWithinTransaction(
    tx: IUserRepository,
    dto: CreateUserDto
  ): Promise<User> {
    const hashedPassword = await this._cryptoService.hashPassword(dto.password);

    return tx.createUser({
      ...dto,
      password: hashedPassword,
    });
  }

  private async _ensureEmailIsUniqueWithinTransaction(
    tx: IUserRepository,
    email: string
  ): Promise<void> {
    const existingUser = await tx.getUser({ email });

    if (existingUser) {
      throw new ConflictError(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
    }
  }

  private async _ensureUserExistsInTransaction(
    tx: IUserRepository,
    id: string
  ): Promise<User> {
    const user = await tx.getUser({ id });

    if (!user) {
      throw new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND);
    }

    return user;
  }

  async createUser(dto: CreateUserDto): Promise<User> {
    const { email } = dto;

    const user = await this._userRepository.transaction(async (tx) => {
      // 1. Ensure email is unique within the transaction
      await this._ensureEmailIsUniqueWithinTransaction(tx, email);

      // 2. Create user within the transaction
      return await this._createUserWithinTransaction(tx, dto);
    });

    return user;
  }

  async getOrCreateUser(dto: CreateUserDto): Promise<User> {
    return this._userRepository.transaction(async (tx) => {
      // 1. Check if user exists within the transaction
      const user = await tx.getUser({ email: dto.email });

      // 2. Return existing user if found
      if (user) return user;

      // 3. Create user if not found
      return this._createUserWithinTransaction(tx, dto);
    });
  }

  async getUser(dto: GetUserDto): Promise<User> {
    const user = await this._userRepository.getUser(dto);

    if (!user) {
      throw new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND);
    }

    return user;
  }

  async updateUser(id: string, dto: UpdateUserDto): Promise<User> {
    const updatedUser = await this._userRepository.transaction(async (tx) => {
      const user = await this._ensureUserExistsInTransaction(tx, id);

      if (dto.email && dto.email !== user.email) {
        await this._ensureEmailIsUniqueWithinTransaction(tx, dto.email);
      }

      return tx.updateUser(user.id, dto);
    });

    return updatedUser;
  }

  async updatePassword(userId: string, dto: UpdatePasswordDto): Promise<User> {
    const { currentPassword, newPassword } = dto;

    const updatedUser = await this._userRepository.transaction(async (tx) => {
      const user = await this._ensureUserExistsInTransaction(tx, userId);

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

      const hashedPassword =
        await this._cryptoService.hashPassword(newPassword);

      return tx.updatePassword(user.id, hashedPassword);
    });

    return updatedUser;
  }

  async resetPassword(userId: string, newPassword: string): Promise<User> {
    const updatedUser = await this._userRepository.transaction(async (tx) => {
      const user = await this._ensureUserExistsInTransaction(tx, userId);

      const hashedPassword =
        await this._cryptoService.hashPassword(newPassword);

      return tx.updatePassword(user.id, hashedPassword);
    });

    return updatedUser;
  }
}
