import { randomUUID } from "node:crypto";
import prismaClient from "../../lib/prisma";

import handleAsyncOperation from "../../utils/handleAsyncOperation";
import type { VerificationTokenEntry } from "./verifyEmail.type";

class VerificationTokenDatabase {
  async findByUserId(userId: string): Promise<VerificationTokenEntry | null> {
    return handleAsyncOperation(
      () =>
        prismaClient.emailVerificationToken.findFirst({
          where: {
            userId,
          },
        }),
      { errorMessage: "Failed to get email verification token." }
    );
  }

  async findByToken(token: string): Promise<VerificationTokenEntry | null> {
    return handleAsyncOperation(
      () =>
        prismaClient.emailVerificationToken.findFirst({
          where: {
            token,
          },
        }),
      { errorMessage: "Failed to get email verification token." }
    );
  }

  async create(userId: string): Promise<string> {
    const token = randomUUID();
    const expiresAt = new Date(Date.now() + 3600000); // Token expires in 1 hour

    handleAsyncOperation(
      () =>
        prismaClient.emailVerificationToken.create({
          data: {
            token,
            expiresAt,
            userId,
          },
        }),
      { errorMessage: "Failed to create email verification token." }
    );

    return token;
  }

  async deleteMany(userId: string): Promise<void> {
    handleAsyncOperation(
      () =>
        prismaClient.emailVerificationToken.deleteMany({
          where: { userId },
        }),
      { errorMessage: "Failed to delete email verification tokens." }
    );
  }
}

export default new VerificationTokenDatabase();
