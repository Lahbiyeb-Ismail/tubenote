import { randomUUID } from "node:crypto";
import type { PrismaClient } from "@prisma/client";

import handleAsyncOperation from "../../utils/handleAsyncOperation";
import type { ResetTokenEntry } from "./reset-password.type";

export interface IResetPasswordTokenDatabase {
  findByUserId(userId: string): Promise<ResetTokenEntry | null>;
  findByToken(token: string): Promise<ResetTokenEntry | null>;
  create(userId: string): Promise<string>;
  deleteMany(userId: string): Promise<void>;
}

export class ResetPasswordTokenDatabase implements IResetPasswordTokenDatabase {
  private database: PrismaClient;

  constructor(database: PrismaClient) {
    this.database = database;
  }

  async findByUserId(userId: string): Promise<ResetTokenEntry | null> {
    return handleAsyncOperation(
      () =>
        this.database.resetPasswordToken.findFirst({
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
        this.database.resetPasswordToken.findUnique({
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
        this.database.resetPasswordToken.create({
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
        this.database.resetPasswordToken.deleteMany({
          where: {
            userId,
          },
        }),
      { errorMessage: "Failed to delete reset password tokens." }
    );
  }
}
