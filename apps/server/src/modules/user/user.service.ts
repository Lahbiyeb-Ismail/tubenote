import type { Prisma } from "@prisma/client";

import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from "@/modules/shared/api-errors";
import { ERROR_MESSAGES } from "@/modules/shared/constants";

import type { ICryptoService } from "@/modules/shared/services";

import type {
  ICreateUserDto,
  IGetUserDto,
  IResetPasswordDto,
  IUpdatePasswordDto,
  IUpdateUserDto,
} from "./dtos";
import type { User } from "./user.model";
import type { IUserRepository, IUserService } from "./user.types";

import type { IAccountService } from "./features/account/account.types";
import type { ICreateAccountDto } from "./features/account/dtos";

export class UserService implements IUserService {
  constructor(
    private readonly _userRepository: IUserRepository,
    private readonly _accountService: IAccountService,
    private readonly _cryptoService: ICryptoService
  ) {}

  /**
   * Creates a new user.
   *
   * @param dto - The data transfer object containing user creation details.
   * @returns A promise that resolves to the created user.
   * @private
   */
  private async _createUser(
    tx: Prisma.TransactionClient,
    dto: ICreateUserDto
  ): Promise<User> {
    const { data } = dto;

    const hashedPassword = await this._cryptoService.hashPassword(
      data.password
    );

    return this._userRepository.create(tx, {
      data: {
        ...data,
        password: hashedPassword,
      },
    });
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
   * Ensures that a user exists.
   *
   * @param id - The ID of the user to check for existence.
   * @returns A promise that resolves to the user if found.
   * @throws NotFoundError if the user does not exist.
   */
  private async _ensureUserExists(
    id: string,
    tx: Prisma.TransactionClient
  ): Promise<User> {
    const user = await this._userRepository.getById(id, tx);

    if (!user) {
      throw new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND);
    }

    return user;
  }

  async createUserWithAccount(
    createUserDto: ICreateUserDto,
    createAccountDto: ICreateAccountDto
  ): Promise<User> {
    const { email } = createUserDto.data;

    return this._userRepository.transaction(async (tx) => {
      await this._ensureEmailIsUnique(email, tx);

      const user = await this._createUser(tx, createUserDto);

      await this._accountService.createAccount(tx, user.id, createAccountDto);

      return user;
    });
  }

  /**
   * Retrieves an existing user by email or creates a new user if not found.
   *
   * @param createUserDto - Data Transfer Object containing user creation data.
   * @returns A promise that resolves to the user entity.
   *
   * The function performs the following steps:
   * 1. Checks if a user with the given email exists within a transaction.
   * 2. Returns the existing user if found.
   * 3. Creates a new user within the transaction if not found.
   */
  async getOrCreateUser(createUserDto: ICreateUserDto): Promise<User> {
    const { email } = createUserDto.data;

    return this._userRepository.transaction(async (tx) => {
      // 1. Check if user exists within the transaction
      const user = await this._userRepository.getByEmail(email, tx);

      // 2. Return existing user if found
      if (user) return user;

      // 3. Create user if not found
      return this._createUser(tx, createUserDto);
    });
  }

  /**
   * Retrieves an existing user by the provided data transfer object.
   *
   * @param getUserDto - The data transfer object containing user retrieval details.
   * @returns A promise that resolves to the retrieved user.
   * @throws NotFoundError if the user is not found
   */
  async getUserByIdOrEmail(getUserDto: IGetUserDto): Promise<User> {
    const { id, email } = getUserDto;

    let user: User | null = null;

    if (id) {
      user = await this._userRepository.getById(id);
    }

    if (email) {
      user = await this._userRepository.getByEmail(email);
    }

    if (!user) {
      throw new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND);
    }

    return user;
  }

  /**
   * Updates a user with the provided data.
   *
   * @param {IUpdateUserDto} updateUserDto - The data transfer object containing the user ID and the data to update.
   * @returns {Promise<User>} - A promise that resolves to the updated user.
   *
   * @throws {Error} - Throws an error if the user does not exist or if the email is not unique.
   */
  async updateUser(updateUserDto: IUpdateUserDto): Promise<User> {
    const { id, data } = updateUserDto;

    const updatedUser = await this._userRepository.transaction(async (tx) => {
      const user = await this._ensureUserExists(id, tx);

      if (Object.keys(data).length === 0) {
        return user;
      }

      if (data.email && data.email !== user.email) {
        await this._ensureEmailIsUnique(data.email, tx);
      }

      return this._userRepository.update(tx, updateUserDto);
    });

    return updatedUser;
  }

  /**
   * Updates the password of a user.
   *
   * @param {IUpdatePasswordDto} updateUserDto - Data transfer object containing the user's ID, current password, and new password.
   * @returns {Promise<User>} - A promise that resolves to the updated user.
   * @throws {BadRequestError} - Throws an error if the current password is invalid or if the new password is the same as the current password.
   */
  async updateUserPassword(updateUserDto: IUpdatePasswordDto): Promise<User> {
    const { id, currentPassword, newPassword } = updateUserDto;

    const updatedUser = await this._userRepository.transaction(async (tx) => {
      const user = await this._ensureUserExists(id, tx);

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

      return this._userRepository.updatePassword(tx, user.id, hashedPassword);
    });

    return updatedUser;
  }

  /**
   * Resets the password for a user.
   *
   * @param {IResetPasswordDto} resetPasswordDto - The data transfer object containing the user's ID and the new password.
   * @returns {Promise<User>} - A promise that resolves to the updated user.
   *
   * @throws {UserNotFoundException} - If the user with the given ID does not exist.
   * @throws {HashingException} - If there is an error while hashing the new password.
   */
  async resetUserPassword(resetPasswordDto: IResetPasswordDto): Promise<User> {
    const { id, newPassword } = resetPasswordDto;

    const updatedUser = await this._userRepository.transaction(async (tx) => {
      const user = await this._ensureUserExists(id, tx);

      const hashedPassword =
        await this._cryptoService.hashPassword(newPassword);

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
  async verifyUserEmail(userId: string): Promise<User> {
    const updatedUser = await this._userRepository.transaction(async (tx) => {
      const user = await this._ensureUserExists(userId, tx);

      if (user.isEmailVerified) {
        throw new BadRequestError(ERROR_MESSAGES.ALREADY_VERIFIED);
      }

      return await this._userRepository.verifyEmail(tx, user.id);
    });

    return updatedUser;
  }
}
