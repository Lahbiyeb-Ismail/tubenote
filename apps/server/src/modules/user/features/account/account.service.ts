import type { Prisma } from "@prisma/client";

import { ForbiddenError, NotFoundError } from "@/modules/shared/api-errors";
import type { IPrismaService } from "@/modules/shared/services";

import type { Account, AccountProviders } from "./account.model";
import type { IAccountRepository, IAccountService } from "./account.types";
import type { ICreateAccountDto } from "./dtos";

export class AccountService implements IAccountService {
  constructor(
    private readonly _accountRepository: IAccountRepository,
    private readonly _prismaService: IPrismaService
  ) {}

  async createAccount(
    tx: Prisma.TransactionClient,
    userId: string,
    createAccountDto: ICreateAccountDto
  ): Promise<Account> {
    const { provider, providerAccountId } = createAccountDto;

    // Check if account already exists with this provider and providerAccountId
    const existingAccount = await this._accountRepository.findByProvider(
      provider,
      providerAccountId,
      tx
    );

    if (existingAccount) {
      throw new ForbiddenError("Account already exists for this provider");
    }

    return this._accountRepository.create(tx, userId, createAccountDto);
  }

  async findAccountById(id: string): Promise<Account | null> {
    return this._accountRepository.findById(id);
  }

  async findAccountByProvider(
    provider: AccountProviders,
    providerAccountId: string
  ): Promise<Account | null> {
    return this._accountRepository.findByProvider(provider, providerAccountId);
  }

  async findAccountsByUserId(userId: string): Promise<Account[]> {
    return this._accountRepository.findByUserId(userId);
  }

  async linkAccountToUser(
    userId: string,
    createAccountDto: ICreateAccountDto
  ): Promise<Account> {
    return this._prismaService.transaction(async (tx) => {
      // Verify that this provider account isn't already linked to another user
      const existingAccount = await this._accountRepository.findByProvider(
        createAccountDto.provider,
        createAccountDto.providerAccountId,
        tx
      );

      if (existingAccount) {
        if (existingAccount.userId === userId) {
          // Account already linked to this user, return it
          return existingAccount;
        } else {
          // Account linked to different user, cannot link
          throw new ForbiddenError(
            "This provider account is already linked to another user"
          );
        }
      }

      return this._accountRepository.create(tx, userId, createAccountDto);
    });
  }

  // async updateAccount(id: string, updateAccountDto: IUpdateAccountDto): Promise<Account> {
  //   const account = await this._accountRepository.findById(id);

  //   if (!account) {
  //     throw new NotFoundError('Account not found');
  //   }

  //   return this._accountRepository.update(id, updateAccountDto);
  // }

  async deleteAccount(id: string): Promise<void> {
    const account = await this._accountRepository.findById(id);

    if (!account) {
      throw new NotFoundError("Account not found");
    }

    await this._accountRepository.delete(id);
  }
}
