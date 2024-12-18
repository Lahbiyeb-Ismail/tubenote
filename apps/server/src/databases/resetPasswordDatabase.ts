import { randomUUID } from "node:crypto";
import type { Prisma, ResetPasswordToken } from "@prisma/client";
import prismaClient from "../lib/prisma";
import handleAsyncOperation from "../utils/handleAsyncOperation";

class ResetPasswordTokenDatabase {
  async find(
    params: Prisma.ResetPasswordTokenWhereInput
  ): Promise<ResetPasswordToken | null> {
    return handleAsyncOperation(
      () =>
        prismaClient.resetPasswordToken.findFirst({
          where: {
            ...params,
            expiresAt: { gt: new Date() },
          },
        }),
      { errorMessage: "Failed to find reset password token." }
    );
  }

  async create(userId: string): Promise<string> {
    const token = randomUUID();
    const expiresAt = new Date(Date.now() + 3600000); // Token expires in 1 hour

    handleAsyncOperation(
      () =>
        prismaClient.resetPasswordToken.create({
          data: {
            token,
            userId,
            expiresAt,
          },
        }),
      { errorMessage: "Failed to create reset password token." }
    );

    return token;
  }
}

export default new ResetPasswordTokenDatabase();
