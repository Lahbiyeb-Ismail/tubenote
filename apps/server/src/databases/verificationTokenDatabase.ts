import { randomUUID } from "node:crypto";
import prismaClient from "../lib/prisma";
import handleAsyncOperation from "../utils/handleAsyncOperation";

class VerificationTokenDatabase {
  async createVerificationToken(userId: string) {
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
