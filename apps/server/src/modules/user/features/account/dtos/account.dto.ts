import type { AccountType, Providers } from "@tubenote/db";

export interface ICreateAccountDto {
  type: AccountType;
  provider: Providers;
  providerAccountId: string;
}
