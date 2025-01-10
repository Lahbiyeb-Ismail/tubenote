import { randomUUID } from "node:crypto";
import type { PrismaClient } from "@prisma/client";

import handleAsyncOperation from "../../utils/handleAsyncOperation";
import type { VerifyEmailTokenDto } from "./dtos/verify-email-token.dto";

export interface IVerificationTokenDB {
  findByUserId(userId: string): Promise<VerifyEmailTokenDto | null>;
  findByToken(token: string): Promise<VerifyEmailTokenDto | null>;
  create(userId: string): Promise<string>;
  deleteMany(userId: string): Promise<void>;
}

export class VerificationTokenDatabase implements IVerificationTokenDB {
  private database: PrismaClient;

  constructor(database: PrismaClient) {
    this.database = database;
  }

  async findByUserId(userId: string): Promise<VerifyEmailTokenDto | null> {
    return handleAsyncOperation(
      () =>
        this.database.emailVerificationToken.findFirst({
          where: {
            userId,
          },
        }),
      { errorMessage: "Failed to get email verification token." }
    );
  }

  async findByToken(token: string): Promise<VerifyEmailTokenDto | null> {
    return handleAsyncOperation(
      () =>
        this.database.emailVerificationToken.findFirst({
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
        this.database.emailVerificationToken.create({
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
        this.database.emailVerificationToken.deleteMany({
          where: { userId },
        }),
      { errorMessage: "Failed to delete email verification tokens." }
    );
  }
}
