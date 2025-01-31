import handleAsyncOperation from "@/utils/handle-async-operation";
import type { Prisma, PrismaClient } from "@prisma/client";

import { ERROR_MESSAGES } from "@/constants/error-messages.contants";
import { DatabaseError } from "@/errors";

import type { CreateUserDto, GetUserDto, UpdateUserDto } from "./dtos";
import type { User } from "./user.model";
import type { IUserRepository } from "./user.types";

export class UserRepository implements IUserRepository {
  constructor(private readonly _db: PrismaClient) {}

  async createUser(params: CreateUserDto): Promise<User> {
    return handleAsyncOperation(
      () =>
        this._db.user.create({
          data: { ...params },
        }),
      { errorMessage: ERROR_MESSAGES.FAILD_TO_CREATE }
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
