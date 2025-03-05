import type { Prisma } from "@prisma/client";

import type { Account, AccountProviders } from "./account.model";
import type { ICreateAccountDto } from "./dtos";

export interface IAccountRepository {
  transaction<T>(fn: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T>;
  create(
    tx: Prisma.TransactionClient,
    userId: string,
    createAccountDto: ICreateAccountDto
  ): Promise<Account>;
  findById(id: string): Promise<Account | null>;
  findByProvider(
    provider: AccountProviders,
    providerAccountId: string,
    tx?: Prisma.TransactionClient
  ): Promise<Account | null>;
  findByUserId(userId: string): Promise<Account[]>;
  // update(id: string, updateAccountDto: IUpdateAccountDto): Promise<Account>;
  delete(id: string): Promise<void>;
}

export interface IAccountService {
  createAccount(
    tx: Prisma.TransactionClient,
    userId: string,
    createAccountDto: ICreateAccountDto
  ): Promise<Account>;
  findAccountById(id: string): Promise<Account | null>;
  findAccountByProvider(
    provider: AccountProviders,
    providerAccountId: string
  ): Promise<Account | null>;
  findAccountsByUserId(userId: string): Promise<Account[]>;
  linkAccountToUser(
    userId: string,
    createAccountDto: ICreateAccountDto
  ): Promise<Account>;
  deleteAccount(id: string): Promise<void>;
}
