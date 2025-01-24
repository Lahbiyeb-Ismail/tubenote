import type { Response } from "express";

import type { EmptyRecord, TypedRequest } from "@/types";

import type { ResetPasswordToken } from "./reset-password.model";

import type { EmailBodyDto } from "@common/dtos/email-body.dto";
import type { TokenParamDto } from "@common/dtos/token-param.dto";
import type { PasswordBodyDto } from "./dtos/password-body.dto";
import type { SaveTokenDto } from "./dtos/save-token.dto";

export interface IResetPasswordRepository {
  findByUserId(userId: string): Promise<ResetPasswordToken | null>;
  findByToken(token: string): Promise<ResetPasswordToken | null>;
  saveToken(saveTokenDto: SaveTokenDto): Promise<ResetPasswordToken>;
  deleteMany(userId: string): Promise<void>;
}

export interface IResetPasswordService {
  sendResetToken(email: string): Promise<void>;
  resetPassword(token: string, password: string): Promise<void>;
  verifyResetToken(token: string): Promise<ResetPasswordToken>;
}
export interface IResetPasswordController {
  forgotPassword(req: TypedRequest<EmailBodyDto>, res: Response): Promise<void>;
  resetPassword(
    req: TypedRequest<PasswordBodyDto, TokenParamDto>,
    res: Response
  ): Promise<void>;
  verifyResetToken(
    req: TypedRequest<EmptyRecord, TokenParamDto>,
    res: Response
  ): Promise<void>;
}
