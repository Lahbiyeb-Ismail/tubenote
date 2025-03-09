import type { Prisma } from "@prisma/client";
import type { Response } from "express";

import type { EmptyRecord, TypedRequest } from "@/modules/shared/types";

import type { ICreateDto, IParamTokenDto } from "@/modules/shared/dtos";

import type { FindActiveTokenDto } from "./dtos";
import type { VerifyEmailToken } from "./verify-email.model";

export interface IVerifyEmailRepository {
  findActiveToken(
    dto: FindActiveTokenDto,
    tx?: Prisma.TransactionClient
  ): Promise<VerifyEmailToken | null>;
  createToken(
    createTokenDto: ICreateDto<VerifyEmailToken>,
    tx?: Prisma.TransactionClient
  ): Promise<VerifyEmailToken>;
  deleteMany(userId: string, tx?: Prisma.TransactionClient): Promise<void>;
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
