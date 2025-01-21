import { randomUUID } from "node:crypto";
import type { PrismaClient } from "@prisma/client";

import { ERROR_MESSAGES } from "@/constants/error-messages.contants";
import handleAsyncOperation from "@/utils/handle-async-operation";

import type { ResetPasswordToken } from "./reset-password.model";
import type { IResetPasswordRepository } from "./reset-password.types";

export class ResetPasswordRepository implements IResetPasswordRepository {
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
      { errorMessage: ERROR_MESSAGES.FAILD_TO_FIND }
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
      { errorMessage: ERROR_MESSAGES.FAILD_TO_FIND }
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
      { errorMessage: ERROR_MESSAGES.FAILD_TO_CREATE }
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
      { errorMessage: ERROR_MESSAGES.FAILD_TO_DELETE_ALL }
    );
  }
}
