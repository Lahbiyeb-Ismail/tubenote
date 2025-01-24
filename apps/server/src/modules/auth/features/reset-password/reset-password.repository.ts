import type { PrismaClient } from "@prisma/client";

import { ERROR_MESSAGES } from "@/constants/error-messages.contants";
import handleAsyncOperation from "@/utils/handle-async-operation";

import type { SaveTokenDto } from "./dtos/save-token.dto";
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
            expiresAt: { gt: new Date() },
          },
        }),
      { errorMessage: ERROR_MESSAGES.FAILD_TO_FIND }
    );
  }

  async saveToken(saveTokenDto: SaveTokenDto): Promise<ResetPasswordToken> {
    return handleAsyncOperation(
      () =>
        this._db.resetPasswordToken.create({
          data: {
            ...saveTokenDto,
          },
        }),
      { errorMessage: ERROR_MESSAGES.FAILD_TO_CREATE }
    );
  }

  async deleteMany(userId: string): Promise<void> {
    await handleAsyncOperation(
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
