import handleAsyncOperation from "@/utils/handle-async-operation";
import type { Prisma, PrismaClient } from "@prisma/client";

import { ERROR_MESSAGES } from "@/constants/error-messages.contants";
import { DatabaseError } from "@/errors";

import type { CreateUserDto, GetUserDto, UpdateUserDto } from "./dtos";
import type { User } from "./user.model";
import type { IUserRepository } from "./user.types";

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

  async createUser(params: CreateUserDto): Promise<User> {
    return handleAsyncOperation(
      () =>
        this._db.user.create({
          data: { ...params },
        }),
      { errorMessage: ERROR_MESSAGES.FAILD_TO_CREATE }
    );
  }

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

  async getUser(params: GetUserDto): Promise<User | null> {
    const { id, email } = params;

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

  async updateUser(id: string, params: UpdateUserDto): Promise<User> {
    return handleAsyncOperation(
      () =>
        this._db.user.update({
          where: { id },
          data: { ...params },
        }),
      { errorMessage: ERROR_MESSAGES.FAILD_TO_UPDATE }
    );
  }

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
}
