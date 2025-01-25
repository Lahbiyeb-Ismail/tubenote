import type { Response } from "express";

import type { EmptyRecord, TypedRequest } from "@/types";

import type { TokenParamDto } from "@common/dtos/token-param.dto";
import type { SaveTokenDto } from "./dtos/save-token.dto";
import type { VerifyEmailToken } from "./verify-email.model";

export interface IVerifyEmailRepository {
  findByUserId(userId: string): Promise<VerifyEmailToken | null>;
  findByToken(token: string): Promise<VerifyEmailToken | null>;
  saveToken(saveTokenDto: SaveTokenDto): Promise<VerifyEmailToken>;
  deleteMany(userId: string): Promise<void>;
}

export interface IVerifyEmailService {
  generateToken(email: string): Promise<string>;
  verifyUserEmail(token: string): Promise<void>;
}

export interface IVerifyEmailController {
  verifyEmail(
    req: TypedRequest<EmptyRecord, TokenParamDto>,
    res: Response
  ): Promise<void>;
}
