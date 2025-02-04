import { ERROR_MESSAGES } from "@constants/error-messages.contants";

import { BadRequestError, ConflictError, NotFoundError } from "@/errors";

import type {
  CreateUserDto,
  GetUserDto,
  IUserRepository,
  IUserService,
  UpdatePasswordDto,
  UpdateUserDto,
  User,
} from "@modules/user";

import type { ICryptoService } from "@modules/utils/crypto";

export class UserService implements IUserService {
  constructor(
    private readonly _userRepository: IUserRepository,
    private readonly _cryptoService: ICryptoService
  ) {}

  /**
   * Creates a new user within a transaction.
   *
   * @param tx - The user repository transaction object.
   * @param dto - The data transfer object containing user creation details.
   * @returns A promise that resolves to the created user.
   * @private
   */
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

  /**
   * Ensures that the provided email is unique within the context of a transaction.
   *
   * @param tx - The user repository transaction object.
   * @param email - The email address to check for uniqueness.
   * @returns A promise that resolves to null if the email is unique.
   * @throws {ConflictError} If the email already exists in the repository.
   */
  private async _ensureEmailIsUniqueWithinTransaction(
    tx: IUserRepository,
    email: string
  ): Promise<null> {
    const existingUser = await tx.getUserByEmail(email);

    if (existingUser) {
      throw new ConflictError(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
    }

    return null;
  }

  /**
   * Ensures that a user exists within a transaction.
   *
   * @param tx - The transaction repository to use for fetching the user.
   * @param id - The ID of the user to check for existence.
   * @returns A promise that resolves to the user if found.
   * @throws NotFoundError if the user does not exist.
   */
  private async _ensureUserExistsInTransaction(
    tx: IUserRepository,
    id: string
  ): Promise<User> {
    const user = await tx.getUserById(id);

    if (!user) {
      throw new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND);
    }

    return user;
  }

  /**
   * Creates a new user.
   *
   * @param dto - The data transfer object containing user creation details.
   * @returns A promise that resolves to the created user.
   */
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

  /**
   * Retrieves an existing user or creates a new one if not found.
   *
   * @param dto - The data transfer object containing user details.
   * @returns A promise that resolves to the retrieved or created user.
   */
  async getOrCreateUser(dto: CreateUserDto): Promise<User> {
    return this._userRepository.transaction(async (tx) => {
      // 1. Check if user exists within the transaction
      const user = await tx.getUserByEmail(dto.email);

      // 2. Return existing user if found
      if (user) return user;

      // 3. Create user if not found
      return this._createUserWithinTransaction(tx, dto);
    });
  }

  /**
   * Retrieves a user based on the provided criteria.
   *
   * @param dto - The data transfer object containing user retrieval details.
   * @returns A promise that resolves to the retrieved user.
   * @throws NotFoundError if the user is not found.
   */
  async getUser(dto: GetUserDto): Promise<User> {
    const user = await this._userRepository.getUser(dto);

    if (!user) {
      throw new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND);
    }

    return user;
  }

  /**
   * Updates an existing user.
   *
   * @param id - The ID of the user to update.
   * @param dto - The data transfer object containing user update details.
   * @returns A promise that resolves to the updated user.
   */
  async updateUser(id: string, dto: UpdateUserDto): Promise<User> {
    const updatedUser = await this._userRepository.transaction(async (tx) => {
      const user = await this._ensureUserExistsInTransaction(tx, id);

      if (Object.keys(dto).length === 0) {
        return user;
      }

      if (dto.email && dto.email !== user.email) {
        await this._ensureEmailIsUniqueWithinTransaction(tx, dto.email);
      }

      return tx.updateUser(user.id, dto);
    });

    return updatedUser;
  }

  /**
   * Updates the password of an existing user.
   *
   * @param userId - The ID of the user whose password is to be updated.
   * @param dto - The data transfer object containing password update details.
   * @returns A promise that resolves to the updated user.
   * @throws BadRequestError if the current password is invalid or the new password is the same as the current password.
   */
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

  /**
   * Resets the password of an existing user.
   *
   * @param userId - The ID of the user whose password is to be reset.
   * @param newPassword - The new password to set.
   * @returns A promise that resolves to the updated user.
   */
  async resetPassword(userId: string, newPassword: string): Promise<User> {
    const updatedUser = await this._userRepository.transaction(async (tx) => {
      const user = await this._ensureUserExistsInTransaction(tx, userId);

      const hashedPassword =
        await this._cryptoService.hashPassword(newPassword);

      return tx.updatePassword(user.id, hashedPassword);
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
      const user = await tx.getUserById(userId);

      if (!user) {
        throw new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND);
      }

      if (user.isEmailVerified) {
        throw new BadRequestError(ERROR_MESSAGES.EMAIL_ALREADY_VERIFIED);
      }

      return await tx.verifyUserEmail(userId);
    });

    return updatedUser;
  }
}
