import { prismaService } from "@/modules/shared/services";

import { AccountRepository } from "./account.repository";
import { AccountService } from "./account.service";

const accountRepository = new AccountRepository(prismaService);

const accountService = new AccountService(accountRepository, prismaService);

export { accountService };
