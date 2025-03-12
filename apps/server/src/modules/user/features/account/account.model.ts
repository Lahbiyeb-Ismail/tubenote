export interface Account {
  id: string;
  userId: string;
  type: AccountType;
  provider: AccountProviders;
  providerAccountId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type AccountType = "oauth" | "email";

export type AccountProviders = "google" | "credentials";
