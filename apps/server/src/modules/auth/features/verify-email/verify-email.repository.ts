import type { Prisma, PrismaClient } from "@prisma/client";

import { DatabaseError } from "@/errors";

import handleAsyncOperation from "@/utils/handle-async-operation";

import { ERROR_MESSAGES } from "@/constants/error-messages.contants";

import type { VerifyEmailToken } from "./verify-email.model";
import type { IVerifyEmailRepository } from "./verify-email.types";

import type { FindActiveTokenDto } from "./dtos/find-active-token.dto";
import type { SaveTokenDto } from "./dtos/save-token.dto";

export class VerifyEmailRepository implements IVerifyEmailRepository {
  constructor(private readonly _db: PrismaClient) {}
  async findActiveToken(
    params: FindActiveTokenDto
  ): Promise<VerifyEmailToken | null> {
    const { userId, token } = params;

    // Validate input: At least one parameter must be provided
    if (!token && !userId) {
      throw new DatabaseError("Token or userId must be provided");
    }

    // Build dynamic query conditions
    const conditions: Prisma.EmailVerificationTokenWhereInput[] = [];

    if (token) {
      conditions.push({ token });
    }

    if (userId) {
      conditions.push({ userId });
    }

    return handleAsyncOperation(
      () =>
        this._db.emailVerificationToken.findFirst({
          where: {
            OR: conditions,
            expiresAt: { gte: new Date() },
          },
        }),
      { errorMessage: ERROR_MESSAGES.FAILD_TO_FIND }
    );
  }

  async saveToken(params: SaveTokenDto): Promise<VerifyEmailToken> {
    return handleAsyncOperation(
      () =>
        this._db.emailVerificationToken.create({
          data: {
            ...params,
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
