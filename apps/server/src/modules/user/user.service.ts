import type { Prisma, User } from "@tubenote/db";
import type {
  ICreateUserDto,
  IUpdatePasswordDto,
  IUpdateUserDto,
} from "@tubenote/dtos";

import {
  BadRequestError,
  ConflictError,
  ERROR_MESSAGES,
  NotFoundError,
} from "@tubenote/api-errors";
import { inject, injectable } from "inversify";

import type { ICacheService, ICryptoService, IPrismaService } from "@/modules/shared/services";

import { TYPES } from "@/config/inversify/types";

import type { IRefreshTokenService } from "../auth";
import type { IAccountService } from "./features/account/account.types";
import type { ICreateAccountDto } from "./features/account/dtos";
import type { IUserRepository, IUserService } from "./user.types";

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TYPES.UserRepository) private _userRepository: IUserRepository,
    @inject(TYPES.AccountService) private _accountService: IAccountService,
    @inject(TYPES.PrismaService) private _prismaService: IPrismaService,
    @inject(TYPES.CryptoService) private _cryptoService: ICryptoService,
    @inject(TYPES.RefreshTokenService)
    private _refreshTokenService: IRefreshTokenService,
    @inject(TYPES.CacheService)
    private _cacheService: ICacheService,
  ) {}

  /**
   * Ensures that the provided email is unique.
   *
   * @param email - The email address to check for uniqueness.
   * @returns A promise that resolves to null if the email is unique.
   * @throws {ConflictError} If the email already exists in the repository.
   */
  private async _ensureEmailIsUnique(
    email: string,
    tx: Prisma.TransactionClient,
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
   * @param tx - The Prisma transaction client to use for the operation.
   * @param data - The data for the new user.
   * @returns A promise that resolves to the created user.
   * @private
   */
  private async _createUser(
    tx: Prisma.TransactionClient,
    data: ICreateUserDto,
  ): Promise<User> {
    const hashedPassword = await this._cryptoService.generateHash(
      data.password,
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
    tx?: Prisma.TransactionClient,
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
    accountData: ICreateAccountDto,
  ): Promise<User> {
    const user = await this._createUser(tx, userData);

    await this._accountService.createAccount(tx, user.id, accountData);

    return user;
  }

  async getUserByEmail(
    email: string,
    tx?: Prisma.TransactionClient,
  ): Promise<User | null> {
    return this._userRepository.getByEmail(email, tx);
  }

  /**
   * Retrieves a user by their unique identifier with caching support.
   *
   * This method first checks the cache for an existing user record. If found,
   * it returns the cached user immediately. If not found in cache, it fetches
   * the user from the database and caches the result for 1 hour to improve
   * performance on subsequent requests.
   *
   * @param id - The unique identifier of the user to retrieve
   * @param tx - Optional Prisma transaction client for database operations
   * @returns A Promise that resolves to the User object if found, or null if not found
   *
   */
  async getUserById(
    id: string,
    tx?: Prisma.TransactionClient,
  ): Promise<User | null> {
    const cacheKey = `user:${id}`;
    const cachedUser = await this._cacheService.get<User>(cacheKey);

    if (cachedUser) {
      return cachedUser;
    }

    const user = await this._userRepository.getById(id, tx);

    if (user) {
      // Cache for 1 hour
      await this._cacheService.set(cacheKey, user, 3600);
    }

    return user;
  }

  /**
   * Updates a user's information in the database.
   *
   * This method performs the following operations within a database transaction:
   * - Validates that the user exists
   * - Checks if email is being updated and ensures the new email is unique
   * - Updates the user data if changes are provided
   * - Invalidates the user's cache entry after successful update
   *
   * @param userId - The unique identifier of the user to update
   * @param data - The partial user data containing fields to update
   * @returns A Promise that resolves to the updated User object
   * @throws Will throw an error if the user doesn't exist or if the new email is already in use
   *
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

    const cacheKey = `user:${userId}`;
    await this._cacheService.del(cacheKey);

    return updatedUser;
  }

  /**
   * Updates a user's password after validating the current password.
   *
   * This method performs the following operations within a database transaction:
   * 1. Validates that the user exists
   * 2. Verifies the current password matches the stored password
   * 3. Ensures the new password is different from the current password
   * 4. Hashes the new password and updates it in the database
   * 5. Revokes all existing refresh tokens for security
   * 6. Clears the user cache
   *
   * @param userId - The unique identifier of the user whose password is being updated
   * @param data - The password update data containing current and new passwords
   * @returns Promise that resolves to the updated User object
   * @throws {BadRequestError} When current password is invalid or new password is the same as current
   */
  async updateUserPassword(
    userId: string,
    data: IUpdatePasswordDto,
  ): Promise<User> {
    const { currentPassword, newPassword } = data;

    const updatedUser = await this._prismaService.transaction(async (tx) => {
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

      const hashedPassword
        = await this._cryptoService.generateHash(newPassword);

      const updatedUser = this._userRepository.updatePassword(
        tx,
        user.id,
        hashedPassword,
      );

      await this._refreshTokenService.revokeAllUserTokens(
        user.id,
        "password_changed",
        tx,
      );

      return updatedUser;
    });

    const cacheKey = `user:${userId}`;
    await this._cacheService.del(cacheKey);

    return updatedUser;
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

      const hashedPassword
        = await this._cryptoService.generateHash(newPassword);

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
    tx?: Prisma.TransactionClient,
  ): Promise<User> {
    const user = await this._ensureUserExists(userId, tx);

    if (user.isEmailVerified) {
      throw new BadRequestError(ERROR_MESSAGES.ALREADY_VERIFIED);
    }

    return await this._userRepository.verifyEmail(user.id, tx);
  }
}
