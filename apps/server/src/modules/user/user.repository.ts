import handleAsyncOperation from "@/utils/handle-async-operation";
import type { Prisma, PrismaClient } from "@prisma/client";

import { ERROR_MESSAGES } from "@/constants/error-messages.contants";
import { DatabaseError } from "@/errors";

import type {
  ICreateUserDto,
  IGetUserDto,
  IUpdateUserDto,
  IUserRepository,
  User,
} from "@modules/user";

export class UserRepository implements IUserRepository {
  constructor(private readonly _db: PrismaClient) {}

  /**
   * Executes a function within a database transaction.
   *
   * @template T - The return type of the function to be executed within the transaction.
   * @param {function(IUserRepository): Promise<T>} fn - A function that takes a transactional repository instance and returns a promise.
   * @returns {Promise<T>} - A promise that resolves to the result of the function executed within the transaction.
   *
   */
  async transaction<T>(fn: (tx: IUserRepository) => Promise<T>): Promise<T> {
    // Use Prisma's transaction system
    return this._db.$transaction(async (prismaTx: Prisma.TransactionClient) => {
      // Create a new repository instance with the transactional client
      const txRepository = new UserRepository(prismaTx as PrismaClient);
      return await fn(txRepository);
    });
  }

  /**
   * Creates a new user in the database.
   *
   * @param {CreateUserDto} createUserDto - The data transfer object containing user creation parameters.
   * @returns {Promise<User>} A promise that resolves to the created user.
   * @throws Will throw an error if the user creation fails.
   */
  async createUser(createUserDto: ICreateUserDto): Promise<User> {
    return handleAsyncOperation(
      () =>
        this._db.user.create({
          data: { ...createUserDto.data },
        }),
      { errorMessage: ERROR_MESSAGES.FAILD_TO_CREATE }
    );
  }

  /**
   * Retrieves a user by their email address.
   *
   * @param email - The email address of the user to retrieve.
   * @returns A promise that resolves to the user object if found, or null if not found.
   *
   * @throws Will throw an error if the operation fails.
   */
  async getUserByEmail(email: string): Promise<User | null> {
    return handleAsyncOperation(
      () =>
        this._db.user.findUnique({
          where: {
            email,
          },
        }),
      { errorMessage: ERROR_MESSAGES.FAILD_TO_FIND }
    );
  }

  /**
   * Retrieves a user by their unique identifier.
   *
   * @param id - The unique identifier of the user.
   * @returns A promise that resolves to the user object if found, or null if not found.
   *
   * @throws Will throw an error if the operation fails with a message defined in ERROR_MESSAGES.FAILD_TO_FIND.
   */
  async getUserById(id: string): Promise<User | null> {
    return handleAsyncOperation(
      () =>
        this._db.user.findUnique({
          where: {
            id,
          },
        }),
      { errorMessage: ERROR_MESSAGES.FAILD_TO_FIND }
    );
  }

  /**
   * Retrieves a user based on the provided parameters.
   *
   * @param {GetUserDto} getUserDto - The parameters to find the user by. Must include either an `id` or `email`.
   * @returns {Promise<User | null>} - A promise that resolves to the user if found, otherwise null.
   * @throws {DatabaseError} - Throws an error if neither `id` nor `email` is provided.
   */
  async getUser(getUserDto: IGetUserDto): Promise<User | null> {
    const { id, email } = getUserDto;

    if (!id && !email) {
      throw new DatabaseError("Id or email must be provided.");
    }

    const conditions: Prisma.UserWhereInput[] = [];

    if (id) {
      conditions.push({ id });
    }

    if (email) {
      conditions.push({ email });
    }

    return handleAsyncOperation(
      () =>
        this._db.user.findFirst({
          where: {
            OR: conditions,
          },
        }),
      { errorMessage: ERROR_MESSAGES.FAILD_TO_FIND }
    );
  }

  /**
   * Updates a user with the given parameters.
   *
   * @param updatedUserDto - The parameters to update the user with.
   * @returns A promise that resolves to the updated user.
   * @throws Will throw an error if the update operation fails.
   */
  async updateUser(updatedUserDto: IUpdateUserDto): Promise<User> {
    const { id, data } = updatedUserDto;

    return handleAsyncOperation(
      () =>
        this._db.user.update({
          where: { id },
          data: { ...data },
        }),
      { errorMessage: ERROR_MESSAGES.FAILD_TO_UPDATE }
    );
  }

  /**
   * Updates the password for a user with the given userId.
   *
   * @param userId - The unique identifier of the user whose password is to be updated.
   * @param hashedPassword - The new hashed password to be set for the user.
   * @returns A promise that resolves to the updated User object.
   * @throws Will throw an error if the update operation fails.
   */
  async updatePassword(userId: string, hashedPassword: string): Promise<User> {
    return handleAsyncOperation(
      () =>
        this._db.user.update({
          where: { id: userId },
          data: {
            password: hashedPassword,
          },
        }),
      { errorMessage: ERROR_MESSAGES.FAILD_TO_UPDATE }
    );
  }

  /**
   * Verifies the email of a user by updating the `isEmailVerified` field to `true`.
   *
   * @param {string} userId - The unique identifier of the user whose email is to be verified.
   * @returns {Promise<User>} - A promise that resolves to the updated user object.
   *
   * @throws {Error} - Throws an error if the email verification process fails.
   */
  async verifyUserEmail(userId: string): Promise<User> {
    return handleAsyncOperation(
      () =>
        this._db.user.update({
          where: { id: userId },
          data: {
            isEmailVerified: true,
          },
        }),
      { errorMessage: ERROR_MESSAGES.FAILD_TO_UPDATE }
    );
  }
}
