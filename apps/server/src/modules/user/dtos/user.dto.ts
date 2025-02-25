import type { ICreateDto, IUpdateDto } from "@/modules/shared";
import type { User } from "@modules/user";

export interface ICreateUserDto extends Omit<ICreateDto<User>, "userId"> {}

export interface IGetUserDto {
  id?: string;
  email?: string;
}

export interface IUpdateUserDto extends Omit<IUpdateDto<User>, "userId"> {}

export interface IUpdatePasswordBodyDto {
  currentPassword: string;
  newPassword: string;
}

export interface IUpdatePasswordDto extends IUpdatePasswordBodyDto {
  id: string;
}

export interface IResetPasswordDto {
  id: string;
  newPassword: string;
}
