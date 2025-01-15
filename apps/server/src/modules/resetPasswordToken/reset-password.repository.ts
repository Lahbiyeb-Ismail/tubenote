import { randomUUID } from "node:crypto";
import type { PrismaClient } from "@prisma/client";

import handleAsyncOperation from "../../utils/handle-async-operation";
import type { ResetPasswordToken } from "./reset-password.model";
import type { IResetPasswordRespository } from "./reset-password.types";

export class ResetPasswordRepository implements IResetPasswordRespository {
  constructor(private readonly _db: PrismaClient) {}

  async findByUserId(userId: string): Promise<ResetPasswordToken | null> {
    return handleAsyncOperation(
      () =>
        this._db.resetPasswordToken.findFirst({
          where: {
            userId,
            expiresAt: { gt: new Date() },
          },
        }),
      { errorMessage: "Failed to find reset password token." }
    );
  }

  async findByToken(token: string): Promise<ResetPasswordToken | null> {
    return handleAsyncOperation(
      () =>
        this._db.resetPasswordToken.findUnique({
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
        this._db.resetPasswordToken.create({
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
        this._db.resetPasswordToken.deleteMany({
          where: {
            userId,
          },
        }),
      { errorMessage: "Failed to delete reset password tokens." }
    );
  }
}
