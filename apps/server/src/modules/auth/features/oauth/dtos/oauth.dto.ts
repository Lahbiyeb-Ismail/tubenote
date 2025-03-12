import type { ICreateUserDto } from "@/modules/user";
import type { ICreateAccountDto } from "@/modules/user/features/account/dtos";

export interface IOauthLoginDto {
  createUserDto: ICreateUserDto;
  createAccountDto: ICreateAccountDto;
}
