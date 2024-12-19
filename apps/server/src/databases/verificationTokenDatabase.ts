import { randomUUID } from "node:crypto";
import type { EmailVerificationToken, Prisma } from "@prisma/client";
import prismaClient from "../lib/prisma";
import handleAsyncOperation from "../utils/handleAsyncOperation";

export interface IFindToken {
  where: Prisma.EmailVerificationTokenWhereInput;
}

class VerificationTokenDatabase {
  async find({ where }: IFindToken): Promise<EmailVerificationToken | null> {
    return handleAsyncOperation(
      () =>
        prismaClient.emailVerificationToken.findFirst({
          where,
        }),
      { errorMessage: "Failed to get email verification token." }
    );
  }

  async create(userId: string) {
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
}

export default new VerificationTokenDatabase();
