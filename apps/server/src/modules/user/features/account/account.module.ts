import { prismaClient } from "@/modules/shared/config";

import { AccountRepository } from "./account.repository";
import { AccountService } from "./account.service";

const accountRepository = new AccountRepository(prismaClient);

const accountService = new AccountService(accountRepository);

export { accountService };
