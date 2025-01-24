import type { PrismaClient } from "@prisma/client";

import handleAsyncOperation from "@/utils/handle-async-operation";

import { ERROR_MESSAGES } from "@/constants/error-messages.contants";
import type { SaveTokenDto } from "./dtos/save-token.dto";
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
      { errorMessage: ERROR_MESSAGES.FAILD_TO_FIND }
    );
  }

  async findByToken(token: string): Promise<VerifyEmailToken | null> {
    return handleAsyncOperation(
      () =>
        this._db.emailVerificationToken.findFirst({
          where: {
            token,
            expiresAt: { gte: new Date() },
          },
        }),
      { errorMessage: ERROR_MESSAGES.FAILD_TO_FIND }
    );
  }

  async saveToken(saveTokenDto: SaveTokenDto): Promise<VerifyEmailToken> {
    return handleAsyncOperation(
      () =>
        this._db.emailVerificationToken.create({
          data: {
            ...saveTokenDto,
          },
        }),
      { errorMessage: ERROR_MESSAGES.FAILD_TO_CREATE }
    );
  }

  async deleteMany(userId: string): Promise<void> {
    handleAsyncOperation(
      () =>
        this._db.emailVerificationToken.deleteMany({
          where: { userId },
        }),
      { errorMessage: ERROR_MESSAGES.FAILD_TO_DELETE }
    );
  }
}
