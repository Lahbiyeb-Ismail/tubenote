import type { EmailVerificationToken, Prisma } from "@tubenote/db";

import { ERROR_MESSAGES } from "@tubenote/api-errors";
import { inject, injectable } from "inversify";

import type { IPrismaService } from "@/modules/shared/services";

import { TYPES } from "@/config/inversify/types";
import { handleAsyncOperation } from "@/modules/shared/utils";

import type {
  ICreateVerifyEmailTokenDto,
  IVerifyEmailRepository,
} from "./verify-email.types";

@injectable()
export class VerifyEmailRepository implements IVerifyEmailRepository {
  constructor(
    @inject(TYPES.PrismaService) private readonly _db: IPrismaService,
  ) {}

  async findByUserId(
    userId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<EmailVerificationToken | null> {
    const client = tx ?? this._db;

    return handleAsyncOperation(
      () =>
        client.emailVerificationToken.findFirst({
          where: {
            userId,
            expiresAt: { gte: new Date() },
          },
        }),
      { errorMessage: ERROR_MESSAGES.FAILED_TO_FIND },
    );
  }

  async findByToken(
    token: string,
    tx?: Prisma.TransactionClient,
  ): Promise<EmailVerificationToken | null> {
    const client = tx ?? this._db;

    return handleAsyncOperation(
      () =>
        client.emailVerificationToken.findFirst({
          where: {
            token,
            expiresAt: { gte: new Date() },
          },
        }),
      { errorMessage: ERROR_MESSAGES.FAILED_TO_FIND },
    );
  }

  async createToken(
    userId: string,
    data: ICreateVerifyEmailTokenDto,
    tx?: Prisma.TransactionClient,
  ): Promise<EmailVerificationToken> {
    const client = tx ?? this._db;

    return handleAsyncOperation(
      () =>
        client.emailVerificationToken.create({
          data: {
            userId,
            ...data,
          },
        }),
      { errorMessage: ERROR_MESSAGES.FAILED_TO_CREATE },
    );
  }

  async deleteMany(
    userId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<void> {
    const client = tx ?? this._db;

    handleAsyncOperation(
      () =>
        client.emailVerificationToken.deleteMany({
          where: { userId },
        }),
      { errorMessage: ERROR_MESSAGES.FAILED_TO_DELETE },
    );
  }
}
