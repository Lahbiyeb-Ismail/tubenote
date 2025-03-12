import type { Prisma } from "@prisma/client";

import { DatabaseError } from "@/modules/shared/api-errors";
import { ERROR_MESSAGES } from "@/modules/shared/constants";
import { handleAsyncOperation } from "@/modules/shared/utils";

import type { ICreateDto } from "@/modules/shared/dtos";
import type { IPrismaService } from "@/modules/shared/services";

import type { FindActiveTokenDto } from "./dtos";
import type { VerifyEmailToken } from "./verify-email.model";
import type { IVerifyEmailRepository } from "./verify-email.types";

export class VerifyEmailRepository implements IVerifyEmailRepository {
  constructor(private readonly _db: IPrismaService) {}
  async findActiveToken(
    params: FindActiveTokenDto,
    tx?: Prisma.TransactionClient
  ): Promise<VerifyEmailToken | null> {
    const client = tx ?? this._db;

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
        client.emailVerificationToken.findFirst({
          where: {
            OR: conditions,
            expiresAt: { gte: new Date() },
          },
        }),
      { errorMessage: ERROR_MESSAGES.FAILED_TO_FIND }
    );
  }

  async createToken(
    createTokenDto: ICreateDto<VerifyEmailToken>,
    tx?: Prisma.TransactionClient
  ): Promise<VerifyEmailToken> {
    const client = tx ?? this._db;

    return handleAsyncOperation(
      () =>
        client.emailVerificationToken.create({
          data: {
            userId: createTokenDto.userId,
            ...createTokenDto.data,
          },
        }),
      { errorMessage: ERROR_MESSAGES.FAILED_TO_CREATE }
    );
  }

  async deleteMany(
    userId: string,
    tx?: Prisma.TransactionClient
  ): Promise<void> {
    const client = tx ?? this._db;

    handleAsyncOperation(
      () =>
        client.emailVerificationToken.deleteMany({
          where: { userId },
        }),
      { errorMessage: ERROR_MESSAGES.FAILED_TO_DELETE }
    );
  }
}
