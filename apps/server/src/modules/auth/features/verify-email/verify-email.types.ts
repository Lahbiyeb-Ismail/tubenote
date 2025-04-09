import type { Prisma } from "@prisma/client";
import type { Response } from "express";

import type { EmptyRecord, TypedRequest } from "@/modules/shared/types";
import type { IParamTokenDto } from "@tubenote/dtos";

import type {
  ILoggerService,
  IPrismaService,
  IResponseFormatter,
} from "@/modules/shared/services";

import type { IUserService } from "@/modules/user";

import type { IJwtService } from "../../utils";
import type { VerifyEmailToken } from "./verify-email.model";

export interface ICreateVerifyEmailTokenDto {
  token: string;
  expiresAt: Date;
}

export interface IVerifyEmailRepository {
  findByUserId(
    userId: string,
    tx?: Prisma.TransactionClient
  ): Promise<VerifyEmailToken | null>;

  findByToken(
    token: string,
    tx?: Prisma.TransactionClient
  ): Promise<VerifyEmailToken | null>;

  createToken(
    userId: string,
    data: ICreateVerifyEmailTokenDto,
    tx?: Prisma.TransactionClient
  ): Promise<VerifyEmailToken>;

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

export interface IVerifyEmailRepositoryOptions {
  db: IPrismaService;
}

export interface IVerifyEmailServiceOptions {
  verifyEmailRepository: IVerifyEmailRepository;
  prismaService: IPrismaService;
  userService: IUserService;
  jwtService: IJwtService;
  loggerService: ILoggerService;
}

export interface IVerifyEmailControllerOptions {
  verifyEmailService: IVerifyEmailService;
  responseFormatter: IResponseFormatter;
}
