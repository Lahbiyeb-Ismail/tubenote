import type { Response } from "express";

import type { EmptyRecord, TypedRequest } from "@modules/shared";

import type {
  IEmailBodyDto,
  IParamTokenDto,
  IPasswordBodyDto,
} from "@/modules/shared";

export interface IResetPasswordService {
  sendResetToken(email: string): Promise<void>;
  resetPassword(token: string, password: string): Promise<void>;
  verifyResetToken(token: string): Promise<string>;
}
export interface IResetPasswordController {
  forgotPassword(
    req: TypedRequest<IEmailBodyDto>,
    res: Response
  ): Promise<void>;
  resetPassword(
    req: TypedRequest<IPasswordBodyDto, IParamTokenDto>,
    res: Response
  ): Promise<void>;
  verifyResetToken(
    req: TypedRequest<EmptyRecord, IParamTokenDto>,
    res: Response
  ): Promise<void>;
}
