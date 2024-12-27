import { randomUUID } from "node:crypto";
import prismaClient from "../../lib/prisma";

import handleAsyncOperation from "../../utils/handleAsyncOperation";
import type { ResetTokenEntry } from "./resetPassword.type";

class ResetPasswordTokenDatabase {
  async findByUserId(userId: string): Promise<ResetTokenEntry | null> {
    return handleAsyncOperation(
      () =>
        prismaClient.resetPasswordToken.findFirst({
          where: {
            userId,
            expiresAt: { gt: new Date() },
          },
        }),
      { errorMessage: "Failed to find reset password token." }
    );
  }

  async findByToken(token: string): Promise<ResetTokenEntry | null> {
    return handleAsyncOperation(
      () =>
        prismaClient.resetPasswordToken.findUnique({
          where: {
            token,
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

  async deleteMany(userId: string): Promise<void> {
    handleAsyncOperation(
      () =>
        prismaClient.resetPasswordToken.deleteMany({
          where: {
            userId,
          },
        }),
      { errorMessage: "Failed to delete reset password tokens." }
    );
  }
}

export default new ResetPasswordTokenDatabase();
