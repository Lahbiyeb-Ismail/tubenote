import type { Response } from "express";

import type { EmptyRecord, TypedRequest } from "@/types";

import type { VerifyEmailToken } from "./verify-email.model";

import type { TokenParamDto } from "@common/dtos/token-param.dto";
import type { FindActiveTokenDto } from "./dtos/find-active-token.dto";
import type { SaveTokenDto } from "./dtos/save-token.dto";

export interface IVerifyEmailRepository {
  findActiveToken(params: FindActiveTokenDto): Promise<VerifyEmailToken | null>;
  saveToken(params: SaveTokenDto): Promise<VerifyEmailToken>;
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
