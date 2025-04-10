import type { Prisma } from "@prisma/client";

import { ERROR_MESSAGES } from "@/modules/shared/constants";
import { handleAsyncOperation } from "@/modules/shared/utils";

import type { IPrismaService } from "@/modules/shared/services";

import type { VerifyEmailToken } from "./verify-email.model";
import type {
  ICreateVerifyEmailTokenDto,
  IVerifyEmailRepository,
  IVerifyEmailRepositoryOptions,
} from "./verify-email.types";

export class VerifyEmailRepository implements IVerifyEmailRepository {
  private static _instance: VerifyEmailRepository;

  private constructor(private readonly _db: IPrismaService) {}

  public static getInstance(
    options: IVerifyEmailRepositoryOptions
  ): VerifyEmailRepository {
    if (!this._instance) {
      this._instance = new VerifyEmailRepository(options.db);
    }
    return this._instance;
  }

  async findByUserId(
    userId: string,
    tx?: Prisma.TransactionClient
  ): Promise<VerifyEmailToken | null> {
    const client = tx ?? this._db;

    return handleAsyncOperation(
      () =>
        client.emailVerificationToken.findFirst({
          where: {
            userId,
            expiresAt: { gte: new Date() },
          },
        }),
      { errorMessage: ERROR_MESSAGES.FAILED_TO_FIND }
    );
  }

  async findByToken(
    token: string,
    tx?: Prisma.TransactionClient
  ): Promise<VerifyEmailToken | null> {
    const client = tx ?? this._db;

    return handleAsyncOperation(
      () =>
        client.emailVerificationToken.findFirst({
          where: {
            token,
            expiresAt: { gte: new Date() },
          },
        }),
      { errorMessage: ERROR_MESSAGES.FAILED_TO_FIND }
    );
  }

  async createToken(
    userId: string,
    data: ICreateVerifyEmailTokenDto,
    tx?: Prisma.TransactionClient
  ): Promise<VerifyEmailToken> {
    const client = tx ?? this._db;

    return handleAsyncOperation(
      () =>
        client.emailVerificationToken.create({
          data: {
            userId,
            ...data,
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
