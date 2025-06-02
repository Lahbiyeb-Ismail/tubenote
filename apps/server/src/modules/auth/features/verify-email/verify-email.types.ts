import type { Response } from "express";

import type { EmptyRecord, TypedRequest } from "@/modules/shared/types";
import type { EmailVerificationToken, Prisma } from "@tubenote/db";
import type { IParamTokenDto } from "@tubenote/dtos";

export interface ICreateVerifyEmailTokenDto {
  token: string;
  expiresAt: Date;
}
export interface IVerifyEmailRepository {
  findByUserId(
    userId: string,
    tx?: Prisma.TransactionClient
  ): Promise<EmailVerificationToken | null>;

  findByToken(
    token: string,
    tx?: Prisma.TransactionClient
  ): Promise<EmailVerificationToken | null>;

  createToken(
    userId: string,
    data: ICreateVerifyEmailTokenDto,
    tx?: Prisma.TransactionClient
  ): Promise<EmailVerificationToken>;

  deleteMany(userId: string, tx?: Prisma.TransactionClient): Promise<void>;
}

export interface IVerifyEmailService {
  createToken(tx: Prisma.TransactionClient, email: string): Promise<string>;
  verifyUserEmail(token: string): Promise<void>;
}

export interface IVerifyEmailController {
  verifyEmail(
    req: TypedRequest<EmptyRecord, IParamTokenDto>,
    res: Response
  ): Promise<void>;
}
