import prismaClient from "../lib/prisma";
import authService from "../services/authService";
import handleAsyncOperation from "../utils/handleAsyncOperation";

import type {
  CreateUserParams,
  UpdateUserParams,
  UserEntry,
} from "../types/user.type";

class UserDatabase {
  async create({ data }: CreateUserParams): Promise<UserEntry> {
    const hashedpassword = await authService.hashPassword(data.password);

    return handleAsyncOperation(
      () =>
        prismaClient.user.create({
          data: {
            ...data,
            password: hashedpassword,
          },
        }),
      { errorMessage: "Failed to create new user." }
    );
  }

  async findUserByEmail(email: string): Promise<UserEntry | null> {
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

  async findUserById(id: string): Promise<UserEntry | null> {
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

  async updateUser({ userId, data }: UpdateUserParams): Promise<UserEntry> {
    return handleAsyncOperation(
      () =>
        prismaClient.user.update({
          where: { id: userId },
          data,
        }),
      { errorMessage: "Failed to update user." }
    );
  }
}

export default new UserDatabase();
