import type { Prisma } from "@prisma/client";

import type { User } from "@tubenote/types";

import type {
  ICreateUserDto,
  IUpdatePasswordDto,
  IUpdateUserDto,
} from "@tubenote/dtos";

import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from "@/modules/shared/api-errors";
import { ERROR_MESSAGES } from "@/modules/shared/constants";

import type { ICryptoService, IPrismaService } from "@/modules/shared/services";

import type {
  IUserRepository,
  IUserService,
  IUserServiceOptions,
} from "./user.types";

import type { IRefreshTokenService } from "../auth";
import type { IAccountService } from "./features/account/account.types";
import type { ICreateAccountDto } from "./features/account/dtos";

export class UserService implements IUserService {
  private static _instance: UserService;

  private constructor(
    private readonly _userRepository: IUserRepository,
    private readonly _accountService: IAccountService,
    private readonly _prismaService: IPrismaService,
    private readonly _cryptoService: ICryptoService,
    private readonly _refreshTokenService: IRefreshTokenService
  ) {}

  public static getInstance(options: IUserServiceOptions): UserService {
    if (!this._instance) {
      this._instance = new UserService(
        options.userRepository,
        options.accountService,
        options.prismaService,
        options.cryptoService,
        options.refreshTokenService
      );
    }
    return this._instance;
  }

  /**
   * Ensures that the provided email is unique.
   *
   * @param email - The email address to check for uniqueness.
   * @returns A promise that resolves to null if the email is unique.
   * @throws {ConflictError} If the email already exists in the repository.
   */
  private async _ensureEmailIsUnique(
    email: string,
    tx: Prisma.TransactionClient
  ): Promise<null> {
    const existingUser = await this._userRepository.getByEmail(email, tx);

    if (existingUser) {
      throw new ConflictError(ERROR_MESSAGES.ALREADY_EXISTS);
    }

    return null;
  }

  /**
   * Creates a new user.
   *
   * @param dto - The data transfer object containing user creation details.
   * @returns A promise that resolves to the created user.
   * @private
   */
  private async _createUser(
    tx: Prisma.TransactionClient,
    data: ICreateUserDto
  ): Promise<User> {
    const hashedPassword = await this._cryptoService.generateHash(
      data.password
    );

    return this._userRepository.create(tx, {
      ...data,
      password: hashedPassword,
    });
  }

  /**
   * Ensures that a user exists.
   *
   * @param id - The ID of the user to check for existence.
   * @returns A promise that resolves to the user if found.
   * @throws NotFoundError if the user does not exist.
   */
  private async _ensureUserExists(
    id: string,
    tx?: Prisma.TransactionClient
  ): Promise<User> {
    const user = await this._userRepository.getById(id, tx);

    if (!user) {
      throw new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND);
    }

    return user;
  }

  async createUserWithAccount(
    tx: Prisma.TransactionClient,
    userData: ICreateUserDto,
    accountData: ICreateAccountDto
  ): Promise<User> {
    const user = await this._createUser(tx, userData);

    await this._accountService.createAccount(tx, user.id, accountData);

    return user;
  }

  async getUserByEmail(
    email: string,
    tx?: Prisma.TransactionClient
  ): Promise<User | null> {
    return this._userRepository.getByEmail(email, tx);
  }

  async getUserById(
    id: string,
    tx?: Prisma.TransactionClient
  ): Promise<User | null> {
    return this._userRepository.getById(id, tx);
  }

  /**
   * Updates a user with the provided data.
   *
   * @param userId - The ID of the user to update.
   * @param data - The data transfer object containing the user ID and the data to update.
   *
   * @returns {Promise<User>} - A promise that resolves to the updated user.
   *
   * @throws {Error} - Throws an error if the user does not exist or if the email is not unique.
   */
  async updateUser(userId: string, data: IUpdateUserDto): Promise<User> {
    const updatedUser = await this._prismaService.transaction(async (tx) => {
      const user = await this._ensureUserExists(userId, tx);

      if (Object.keys(data).length === 0) {
        return user;
      }

      if (data.email && data.email !== user.email) {
        await this._ensureEmailIsUnique(data.email, tx);
      }

      return this._userRepository.update(tx, userId, data);
    });

    return updatedUser;
  }

  /**
   * Updates the password of a user.
   *
   * @param userId - The ID of the user whose password is to be updated.
   * @param data - Data transfer object containing the user's ID, current password, and new password.
   *
   * @returns {Promise<User>} - A promise that resolves to the updated user.
   * @throws {BadRequestError} - Throws an error if the current password is invalid or if the new password is the same as the current password.
   */
  async updateUserPassword(
    userId: string,
    data: IUpdatePasswordDto
  ): Promise<User> {
    const { currentPassword, newPassword } = data;

    return this._prismaService.transaction(async (tx) => {
      const user = await this._ensureUserExists(userId, tx);

      const isPasswordValid = await this._cryptoService.validateHashMatch({
        unhashedValue: currentPassword,
        hashedValue: user.password,
      });

      if (!isPasswordValid) {
        throw new BadRequestError(ERROR_MESSAGES.INVALID_CREDENTIALS);
      }

      if (currentPassword === newPassword) {
        throw new BadRequestError(ERROR_MESSAGES.PASSWORD_SAME_AS_CURRENT);
      }

      const hashedPassword =
        await this._cryptoService.generateHash(newPassword);

      const updatedUser = this._userRepository.updatePassword(
        tx,
        user.id,
        hashedPassword
      );

      await this._refreshTokenService.revokeAllUserTokens(
        user.id,
        "password_changed",
        tx
      );

      return updatedUser;
    });
  }

  /**
   * Resets the password for a user.
   *
   * @param userId - The ID of the user whose password is to be reset.
   * @param newPassword - The new password to set for the user.
   *
   * @returns {Promise<User>} - A promise that resolves to the updated user.
   *
   * @throws {UserNotFoundException} - If the user with the given ID does not exist.
   * @throws {HashingException} - If there is an error while hashing the new password.
   */
  async resetUserPassword(userId: string, newPassword: string): Promise<User> {
    const updatedUser = await this._prismaService.transaction(async (tx) => {
      const user = await this._ensureUserExists(userId, tx);

      const hashedPassword =
        await this._cryptoService.generateHash(newPassword);

      return this._userRepository.updatePassword(tx, user.id, hashedPassword);
    });

    return updatedUser;
  }

  /**
   * Verifies the email of a user by their user ID.
   *
   * This method performs the following steps:
   * 1. Starts a transaction to ensure atomicity.
   * 2. Retrieves the user by their ID.
   * 3. Throws a `NotFoundError` if the user does not exist.
   * 4. Throws a `BadRequestError` if the user's email is already verified.
   * 5. Verifies the user's email within the transaction.
   *
   * @param userId - The ID of the user whose email is to be verified.
   * @returns A promise that resolves to the updated `User` object with the email verified.
   * @throws `NotFoundError` if the user is not found.
   * @throws `BadRequestError` if the user's email is already verified.
   */
  async verifyUserEmail(
    userId: string,
    tx?: Prisma.TransactionClient
  ): Promise<User> {
    const user = await this._ensureUserExists(userId, tx);

    if (user.isEmailVerified) {
      throw new BadRequestError(ERROR_MESSAGES.ALREADY_VERIFIED);
    }

    return await this._userRepository.verifyEmail(user.id, tx);
  }
}
