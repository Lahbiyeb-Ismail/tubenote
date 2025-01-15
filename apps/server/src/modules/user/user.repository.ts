import type { PrismaClient } from "@prisma/client";
import handleAsyncOperation from "../../utils/handle-async-operation";

import type { User } from "./user.model";
import type { IUserRepository } from "./user.types";

import type { CreateUserDto } from "./dtos/create-user.dto";
import type { UpdateUserDto } from "./dtos/update-user.dto";

export class UserRepository implements IUserRepository {
  constructor(private readonly _db: PrismaClient) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    return handleAsyncOperation(
      () =>
        this._db.user.create({
          data: { ...createUserDto },
        }),
      { errorMessage: "Failed to create new user." }
    );
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = handleAsyncOperation(
      () =>
        this._db.user.findUnique({
          where: {
            email,
          },
        }),
      { errorMessage: "Failed to find user." }
    );

    return user;
  }

  async findById(id: string): Promise<User | null> {
    const user = handleAsyncOperation(
      () =>
        this._db.user.findUnique({
          where: {
            id,
          },
        }),
      { errorMessage: "Failed to find user." }
    );

    return user;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    return handleAsyncOperation(
      () =>
        this._db.user.update({
          where: { id },
          data: { ...updateUserDto },
        }),
      { errorMessage: "Failed to update user." }
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
      { errorMessage: "Failed to update user's password." }
    );
  }
}
