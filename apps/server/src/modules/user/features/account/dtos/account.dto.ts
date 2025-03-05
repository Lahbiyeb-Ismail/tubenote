import type { ICreateDto } from "@/modules/shared/dtos";

import type { Account } from "../account.model";

export interface ICreateAccountDto
  extends Omit<ICreateDto<Account>, "userId"> {}
