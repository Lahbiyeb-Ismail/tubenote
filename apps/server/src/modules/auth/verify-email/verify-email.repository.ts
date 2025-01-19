import { randomUUID } from "node:crypto";
import type { PrismaClient } from "@prisma/client";

import handleAsyncOperation from "@/utils/handle-async-operation";

import type { VerifyEmailToken } from "./verify-email.model";
import type { IVerifyEmailRepository } from "./verify-email.types";

export class VerifyEmailRepository implements IVerifyEmailRepository {
  constructor(private readonly _db: PrismaClient) {}

  async findByUserId(userId: string): Promise<VerifyEmailToken | null> {
    return handleAsyncOperation(
      () =>
        this._db.emailVerificationToken.findFirst({
          where: {
            userId,
          },
        }),
      { errorMessage: "Failed to get email verification token." }
    );
  }

  async findByToken(token: string): Promise<VerifyEmailToken | null> {
    return handleAsyncOperation(
      () =>
        this._db.emailVerificationToken.findFirst({
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
        this._db.emailVerificationToken.create({
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
        this._db.emailVerificationToken.deleteMany({
          where: { userId },
        }),
      { errorMessage: "Failed to delete email verification tokens." }
    );
  }
}
