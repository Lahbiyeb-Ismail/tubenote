import prismaClient from "../../lib/prisma";
import handleAsyncOperation from "../../utils/handleAsyncOperation";

import type {
  CreateUserParams,
  UpdateUserParams,
  UserEntry,
} from "./user.type";

class UserDatabase {
  async create({ data }: CreateUserParams): Promise<UserEntry> {
    return handleAsyncOperation(
      () =>
        prismaClient.user.create({
          data,
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

  async update({ userId, data }: UpdateUserParams): Promise<UserEntry> {
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
