import prismaClient from "../../lib/prisma";
import handleAsyncOperation from "../../utils/handleAsyncOperation";
import type { CreateUserDto } from "./dtos/create-user.dto";
import type { UpdatePasswordDbDto } from "./dtos/update-password.dto";
import type { UpdateUserDto } from "./dtos/update-user.dto";

import type { UserEntry } from "./user.type";

class UserDatabase {
  async create(createUserDto: CreateUserDto): Promise<UserEntry> {
    return handleAsyncOperation(
      () =>
        prismaClient.user.create({
          data: { ...createUserDto },
        }),
      { errorMessage: "Failed to create new user." }
    );
  }

  async findByEmail(email: string): Promise<UserEntry | null> {
    const user = handleAsyncOperation(
      () =>
        prismaClient.user.findUnique({
          where: {
            email,
          },
        }),
      { errorMessage: "Failed to find user." }
    );

    return user;
  }

  async findById(id: string): Promise<UserEntry | null> {
    const user = handleAsyncOperation(
      () =>
        prismaClient.user.findUnique({
          where: {
            id,
          },
        }),
      { errorMessage: "Failed to find user." }
    );

    return user;
  }

  async updateUser(updateUserDto: UpdateUserDto): Promise<UserEntry> {
    const { userId } = updateUserDto;

    return handleAsyncOperation(
      () =>
        prismaClient.user.update({
          where: { id: userId },
          data: { ...updateUserDto },
        }),
      { errorMessage: "Failed to update user." }
    );
  }

  async updatePassword(
    updatePasswordDto: UpdatePasswordDbDto
  ): Promise<UserEntry> {
    const { userId, hashedPassword } = updatePasswordDto;

    return handleAsyncOperation(
      () =>
        prismaClient.user.update({
          where: { id: userId },
          data: {
            password: hashedPassword,
          },
        }),
      { errorMessage: "Failed to update user's password." }
    );
  }
}

export default new UserDatabase();
