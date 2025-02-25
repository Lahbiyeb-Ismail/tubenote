import type { Response } from "express";

import type { EmptyRecord, TypedRequest } from "@/types";

import type { ICreateDto, IParamTokenDto } from "@/modules/shared";

import type { FindActiveTokenDto } from "./dtos";
import type { VerifyEmailToken } from "./verify-email.model";

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
