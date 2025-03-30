import type { Response } from "express";

import type { TypedRequest } from "@/modules/shared/types";

import type { ICreateBodyDto } from "@/modules/shared/dtos";
import type { ICreateUserDto, IUserService, User } from "@/modules/user";

import type { IAuthResponseDto, ILoginDto } from "@/modules/auth/dtos";

import type {
  ICryptoService,
  ILoggerService,
  IMailSenderService,
  IPrismaService,
  IRateLimitService,
  IResponseFormatter,
} from "@/modules/shared/services";
import type { IJwtService } from "../../utils";
import type { IRefreshTokenService } from "../refresh-token";
import type { IVerifyEmailService } from "../verify-email";

export interface ILocalAuthService {
  registerUser: (createUserDto: ICreateUserDto) => Promise<User | undefined>;
  loginUser: (loginDto: ILoginDto) => Promise<IAuthResponseDto>;
}

export interface ILocalAuthController {
  register(
    req: TypedRequest<ICreateBodyDto<User>>,
    res: Response
  ): Promise<void>;
  login(req: TypedRequest<ILoginDto>, res: Response): Promise<void>;
}

export interface ILocalAuthServiceOptions {
  prismaService: IPrismaService;
  userService: IUserService;
  verifyEmailService: IVerifyEmailService;
  refreshTokenService: IRefreshTokenService;
  jwtService: IJwtService;
  cryptoService: ICryptoService;
  mailSenderService: IMailSenderService;
  loggerService: ILoggerService;
}

export interface ILocalAuthControllerOptions {
  localAuthService: ILocalAuthService;
  rateLimiter: IRateLimitService;
  logger: ILoggerService;
  responseFormatter: IResponseFormatter;
}
