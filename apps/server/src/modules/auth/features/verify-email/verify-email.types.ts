import type { Response } from "express";

import type { EmptyRecord, TypedRequest } from "@/types";

import type { VerifyEmailToken } from "./verify-email.model";

import type { ICreateDto, IParamTokenDto } from "@/modules/shared";
import type { FindActiveTokenDto } from "./dtos/find-active-token.dto";

export interface IVerifyEmailRepository {
  findActiveToken(dto: FindActiveTokenDto): Promise<VerifyEmailToken | null>;
  createToken(
    createTokenDto: ICreateDto<VerifyEmailToken>
  ): Promise<VerifyEmailToken>;
  deleteMany(userId: string): Promise<void>;
}

export interface IVerifyEmailService {
  generateToken(email: string): Promise<string>;
  verifyUserEmail(token: string): Promise<void>;
}

export interface IVerifyEmailController {
  verifyEmail(
    req: TypedRequest<EmptyRecord, IParamTokenDto>,
    res: Response
  ): Promise<void>;
}
