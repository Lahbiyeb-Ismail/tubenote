import type { Prisma, User } from "@prisma/client";

import prismaClient from "../lib/prisma";
import authService from "../services/authService";
import handleAsyncOperation from "../utils/handleAsyncOperation";

export interface IUpdateUser {
  userId: string;
  data: Prisma.UserUpdateInput;
}

class UserDatabase {
  async createNewUser(userData: Prisma.UserCreateInput): Promise<User> {
    const hashedpassword = await authService.hashPassword(userData.password);

    return handleAsyncOperation(
      () =>
        prismaClient.user.create({
          data: {
            ...userData,
            password: hashedpassword,
          },
        }),
      { errorMessage: "Failed to create new user." }
    );
  }

  async findUser(params: Prisma.UserWhereInput): Promise<User | null> {
    const user = handleAsyncOperation(
      () =>
        prismaClient.user.findFirst({
          where: {
            ...params,
          },
        }),
      { errorMessage: "Failed to find user." }
    );

    return user;
  }

  async updateUser({ userId, data }: IUpdateUser): Promise<User> {
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
