import type { Prisma } from "@prisma/client";
import type { Response } from "express";

import type { EmptyRecord, TypedRequest } from "@/modules/shared/types";

import type { ICreateDto, IParamTokenDto } from "@/modules/shared/dtos";

import type {
  ILoggerService,
  IPrismaService,
  IResponseFormatter,
} from "@/modules/shared/services";
import type { IUserService } from "@/modules/user";
import type { IJwtService } from "../../utils";
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
