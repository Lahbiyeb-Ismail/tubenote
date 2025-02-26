import { ERROR_MESSAGES } from "@constants/error-messages.contants";

import { BadRequestError, ConflictError, NotFoundError } from "@/errors";

import type {
  ICreateUserDto,
  IGetUserDto,
  IResetPasswordDto,
  IUpdatePasswordDto,
  IUpdateUserDto,
  IUserRepository,
  IUserService,
  User,
} from "@modules/user";

import type { ICryptoService } from "@modules/shared";

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
    dto: ICreateUserDto
  ): Promise<User> {
    const { data } = dto;

    const hashedPassword = await this._cryptoService.hashPassword(
      data.password
    );

    return tx.createUser({
      data: {
        ...data,
        password: hashedPassword,
      },
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
   * This method performs the following steps within a transaction:
   * 1. Ensures the email is unique within the transaction.
   * 2. Creates the user within the transaction.
   *
   * @param createUserDto - The data transfer object containing the user creation data.
   * @returns A promise that resolves to the created user.
   */
  async createUser(createUserDto: ICreateUserDto): Promise<User> {
    const { email } = createUserDto.data;

    const user = await this._userRepository.transaction(async (tx) => {
      // 1. Ensure email is unique within the transaction
      await this._ensureEmailIsUniqueWithinTransaction(tx, email);

      // 2. Create user within the transaction
      return await this._createUserWithinTransaction(tx, createUserDto);
    });

    return user;
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
      const user = await tx.getUserByEmail(email);

      // 2. Return existing user if found
      if (user) return user;

      // 3. Create user if not found
      return this._createUserWithinTransaction(tx, createUserDto);
    });
  }

  /**
   * Retrieves an existing user by the provided data transfer object.
   *
   * @param getUserDto - The data transfer object containing user retrieval details.
   * @returns A promise that resolves to the retrieved user.
   * @throws NotFoundError if the user is not found
   */
  async getUser(getUserDto: IGetUserDto): Promise<User> {
    const user = await this._userRepository.getUser(getUserDto);

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
      const user = await this._ensureUserExistsInTransaction(tx, id);

      if (Object.keys(data).length === 0) {
        return user;
      }

      if (data.email && data.email !== user.email) {
        await this._ensureEmailIsUniqueWithinTransaction(tx, data.email);
      }

      return tx.updateUser(updateUserDto);
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
  async updatePassword(updateUserDto: IUpdatePasswordDto): Promise<User> {
    const { id, currentPassword, newPassword } = updateUserDto;

    const updatedUser = await this._userRepository.transaction(async (tx) => {
      const user = await this._ensureUserExistsInTransaction(tx, id);

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
   * Resets the password for a user.
   *
   * @param {IResetPasswordDto} resetPasswordDto - The data transfer object containing the user's ID and the new password.
   * @returns {Promise<User>} - A promise that resolves to the updated user.
   *
   * @throws {UserNotFoundException} - If the user with the given ID does not exist.
   * @throws {HashingException} - If there is an error while hashing the new password.
   */
  async resetPassword(resetPasswordDto: IResetPasswordDto): Promise<User> {
    const { id, newPassword } = resetPasswordDto;

    const updatedUser = await this._userRepository.transaction(async (tx) => {
      const user = await this._ensureUserExistsInTransaction(tx, id);

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
