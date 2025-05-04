import { type Prisma } from "@prisma/client";

import { ERROR_MESSAGES } from "@/modules/shared/constants";
import type { IPrismaService } from "@/modules/shared/services";
import { handleAsyncOperation } from "@/modules/shared/utils";

import { TYPES } from "@/config/inversify/types";
import { inject, injectable } from "inversify";
import type { Account, AccountProviders } from "./account.model";
import type { IAccountRepository } from "./account.types";
import type { ICreateAccountDto } from "./dtos";

@injectable()
export class AccountRepository implements IAccountRepository {
  constructor(@inject(TYPES.PrismaService) private _db: IPrismaService) {}

  async create(
    tx: Prisma.TransactionClient,
    userId: string,
    createAccountDto: ICreateAccountDto
  ): Promise<Account> {
    return handleAsyncOperation(
      async () => {
        const account = await tx.account.create({
          data: {
            ...createAccountDto,
            userId,
          },
        });

        return account;
      },
      { errorMessage: ERROR_MESSAGES.FAILED_TO_CREATE }
    );
  }

  async findById(id: string): Promise<Account | null> {
    return handleAsyncOperation(
      async () => {
        const account = await this._db.account.findUnique({
          where: {
            id,
          },
        });

        return account;
      },
      { errorMessage: ERROR_MESSAGES.FAILED_TO_FIND }
    );
  }

  async findByProvider(
    provider: AccountProviders,
    providerAccountId: string,
    tx?: Prisma.TransactionClient
  ): Promise<Account | null> {
    const client = tx ?? this._db;

    return handleAsyncOperation(
      async () => {
        const account = await client.account.findUnique({
          where: {
            provider_providerAccountId: {
              provider,
              providerAccountId,
            },
          },
        });

        return account;
      },
      { errorMessage: ERROR_MESSAGES.FAILED_TO_FIND }
    );
  }

  async findByUserId(userId: string): Promise<Account[]> {
    return handleAsyncOperation(
      async () => {
        const accounts = await this._db.account.findMany({
          where: {
            userId,
          },
        });

        return accounts;
      },
      { errorMessage: ERROR_MESSAGES.FAILED_TO_FIND }
    );
  }

  // async update(
  //   id: string,
  //   updateAccountDto: IUpdateAccountDto
  // ): Promise<Account> {
  //   const { refreshToken, accessToken, expiresAt, tokenType, scope, idToken } =
  //     updateAccountDto;

  //   const account = await this._db.account.update({
  //     where: {
  //       id,
  //     },
  //     data: {
  //       refreshToken,
  //       accessToken,
  //       expiresAt,
  //       tokenType,
  //       scope,
  //       idToken,
  //       updatedAt: new Date(), // Explicitly update the timestamp
  //     },
  //   });

  //   return account
  // }

  async delete(id: string): Promise<void> {
    handleAsyncOperation(
      async () => {
        await this._db.account.delete({
          where: {
            id,
          },
        });
      },
      { errorMessage: ERROR_MESSAGES.FAILED_TO_DELETE }
    );
  }
}
