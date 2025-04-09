import type { Prisma } from "@prisma/client";
import type { Response } from "express";

import type { ICreateDto } from "@/modules/shared/dtos";
import type { TypedRequest } from "@/modules/shared/types";

import type { IAuthResponseDto, IRefreshDto } from "@/modules/auth/dtos";
import type {
  ILoggerService,
  IPrismaService,
  IResponseFormatter,
} from "@/modules/shared/services";

import type { IJwtService } from "../../utils";
import type { RefreshToken } from "./refresh-token.model";

export interface IRefreshTokenRepository {
  create(
    createTokenDto: ICreateDto<RefreshToken>,
    tx?: Prisma.TransactionClient
  ): Promise<RefreshToken>;
  findValid(
    token: string,
    tx?: Prisma.TransactionClient
  ): Promise<RefreshToken | null>;
  delete(token: string, tx?: Prisma.TransactionClient): Promise<void>;
  deleteAll(userId: string, tx?: Prisma.TransactionClient): Promise<void>;
}

export interface IRefreshTokenService {
  refreshToken(refreshDto: IRefreshDto): Promise<IAuthResponseDto>;
  deleteAllTokens(userId: string): Promise<void>;
  createToken(createTokenDto: ICreateDto<RefreshToken>): Promise<RefreshToken>;
}

export interface IRefreshTokenController {
  refreshToken(req: TypedRequest, res: Response): Promise<void>;
}

export interface IRefreshTokenRepositoryOptions {
  db: IPrismaService;
}

export interface IRefreshTokenServiceOptions {
  refreshTokenRepository: IRefreshTokenRepository;
  prismaService: IPrismaService;
  jwtService: IJwtService;
  loggerService: ILoggerService;
}

export interface IRefreshTokenControllerOptions {
  refreshTokenService: IRefreshTokenService;
  responseFormatter: IResponseFormatter;
}
