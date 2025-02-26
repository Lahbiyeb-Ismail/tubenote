import type { Prisma, PrismaClient } from "@prisma/client";

import { DatabaseError } from "@modules/shared";

import handleAsyncOperation from "@/utils/handle-async-operation";

import { ERROR_MESSAGES } from "@/constants/error-messages.contants";

import type { ICreateDto } from "@/modules/shared";

import type { FindActiveTokenDto } from "./dtos";
import type { VerifyEmailToken } from "./verify-email.model";
import type { IVerifyEmailRepository } from "./verify-email.types";

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

  async createToken(
    createTokenDto: ICreateDto<VerifyEmailToken>
  ): Promise<VerifyEmailToken> {
    return handleAsyncOperation(
      () =>
        this._db.emailVerificationToken.create({
          data: {
            userId: createTokenDto.userId,
            ...createTokenDto.data,
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
