import type { Prisma } from "@prisma/client";

import { ERROR_MESSAGES } from "@/modules/shared/constants";
import type { IPrismaService } from "@/modules/shared/services";
import { handleAsyncOperation } from "@/modules/shared/utils";

import type { ICreateUserDto, IUpdateUserDto } from "./dtos";
import type { User } from "./user.model";
import type { IUserRepository } from "./user.types";

export class UserRepository implements IUserRepository {
  constructor(private readonly _db: IPrismaService) {}

  /**
   * Creates a new user in the database.
   *
   * @param {CreateUserDto} createUserDto - The data transfer object containing user creation parameters.
   * @returns {Promise<User>} A promise that resolves to the created user.
   * @throws Will throw an error if the user creation fails.
   */
  async create(
    tx: Prisma.TransactionClient,
    createUserDto: ICreateUserDto
  ): Promise<User> {
    return handleAsyncOperation(
      () =>
        tx.user.create({
          data: { ...createUserDto.data },
        }),
      { errorMessage: ERROR_MESSAGES.FAILED_TO_CREATE }
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
  async getByEmail(
    email: string,
    tx?: Prisma.TransactionClient
  ): Promise<User | null> {
    const client = tx ?? this._db;

    return handleAsyncOperation(
      () =>
        client.user.findUnique({
          where: {
            email,
          },
        }),
      { errorMessage: ERROR_MESSAGES.FAILED_TO_FIND }
    );
  }

  /**
   * Retrieves a user by their unique identifier.
   *
   * @param id - The unique identifier of the user.
   * @returns A promise that resolves to the user object if found, or null if not found.
   *
   * @throws Will throw an error if the operation fails with a message defined in ERROR_MESSAGES.FAILED_TO_FIND.
   */
  async getById(
    id: string,
    tx?: Prisma.TransactionClient
  ): Promise<User | null> {
    const client = tx ?? this._db;

    return handleAsyncOperation(
      () =>
        client.user.findUnique({
          where: {
            id,
          },
        }),
      { errorMessage: ERROR_MESSAGES.FAILED_TO_FIND }
    );
  }

  /**
   * Updates a user with the given parameters.
   *
   * @param updatedUserDto - The parameters to update the user with.
   * @returns A promise that resolves to the updated user.
   * @throws Will throw an error if the update operation fails.
   */
  async update(
    tx: Prisma.TransactionClient,
    updatedUserDto: IUpdateUserDto
  ): Promise<User> {
    const { id, data } = updatedUserDto;

    return handleAsyncOperation(
      () =>
        tx.user.update({
          where: { id },
          data: { ...data },
        }),
      { errorMessage: ERROR_MESSAGES.FAILED_TO_UPDATE }
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
  async updatePassword(
    tx: Prisma.TransactionClient,
    userId: string,
    hashedPassword: string
  ): Promise<User> {
    return handleAsyncOperation(
      () =>
        tx.user.update({
          where: { id: userId },
          data: {
            password: hashedPassword,
          },
        }),
      { errorMessage: ERROR_MESSAGES.FAILED_TO_UPDATE }
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
  async verifyEmail(
    tx: Prisma.TransactionClient,
    userId: string
  ): Promise<User> {
    return handleAsyncOperation(
      () =>
        tx.user.update({
          where: { id: userId },
          data: {
            isEmailVerified: true,
          },
        }),
      { errorMessage: ERROR_MESSAGES.FAILED_TO_UPDATE }
    );
  }
}
