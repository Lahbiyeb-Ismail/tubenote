import type { PrismaClient } from "@prisma/client";
import handleAsyncOperation from "../../utils/handleAsyncOperation";

import type { UpdatePasswordDto } from "../password/dtos/update-password.dto";
import type { CreateUserDto } from "./dtos/create-user.dto";
import type { UpdateUserDto } from "./dtos/update-user.dto";
import type { UserDto } from "./dtos/user.dto";

export interface IUserDatabase {
  create(createUserDto: CreateUserDto): Promise<UserDto>;
  findByEmail(email: string): Promise<UserDto | null>;
  findById(id: string): Promise<UserDto | null>;
  updateUser(id: string, updateUserDto: UpdateUserDto): Promise<UserDto>;
  updatePassword(userId: string, hashedPassword: string): Promise<UserDto>;
}

export class UserDatabase implements IUserDatabase {
  private database: PrismaClient;

  constructor(database: PrismaClient) {
    this.database = database;
  }

  async create(createUserDto: CreateUserDto): Promise<UserDto> {
    return handleAsyncOperation(
      () =>
        this.database.user.create({
          data: { ...createUserDto },
        }),
      { errorMessage: "Failed to create new user." }
    );
  }

  async findByEmail(email: string): Promise<UserDto | null> {
    const user = handleAsyncOperation(
      () =>
        this.database.user.findUnique({
          where: {
            email,
          },
        }),
      { errorMessage: "Failed to find user." }
    );

    return user;
  }

  async findById(id: string): Promise<UserDto | null> {
    const user = handleAsyncOperation(
      () =>
        this.database.user.findUnique({
          where: {
            id,
          },
        }),
      { errorMessage: "Failed to find user." }
    );

    return user;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<UserDto> {
    return handleAsyncOperation(
      () =>
        this.database.user.update({
          where: { id },
          data: { ...updateUserDto },
        }),
      { errorMessage: "Failed to update user." }
    );
  }

  async updatePassword(
    userId: string,
    hashedPassword: string
  ): Promise<UserDto> {
    return handleAsyncOperation(
      () =>
        this.database.user.update({
          where: { id: userId },
          data: {
            password: hashedPassword,
          },
        }),
      { errorMessage: "Failed to update user's password." }
    );
  }
}
