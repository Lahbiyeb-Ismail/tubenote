import type { AccountProviders, AccountType } from "../account.model";

export interface ICreateAccountDto {
  type: AccountType;
  provider: AccountProviders;
  providerAccountId: string;
}
