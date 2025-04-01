import type { Response } from "express";

import type { EmptyRecord, TypedRequest } from "@/modules/shared/types";

import type {
  IEmailBodyDto,
  IParamTokenDto,
  IPasswordBodyDto,
} from "@/modules/shared/dtos";
import type {
  ICacheService,
  ICryptoService,
  ILoggerService,
  IMailSenderService,
  IRateLimitService,
  IResponseFormatter,
} from "@/modules/shared/services";
import type { IUserService } from "@/modules/user";

export interface IResetPasswordService {
  sendResetToken(email: string): Promise<void>;
  resetPassword(token: string, password: string): Promise<void>;
  verifyResetToken(token: string): Promise<string>;
}
export interface IResetPasswordController {
  forgotPassword(
    req: TypedRequest<IEmailBodyDto>,
    res: Response
  ): Promise<void>;
  resetPassword(
    req: TypedRequest<IPasswordBodyDto, IParamTokenDto>,
    res: Response
  ): Promise<void>;
  verifyResetToken(
    req: TypedRequest<EmptyRecord, IParamTokenDto>,
    res: Response
  ): Promise<void>;
}

export interface IResetPasswordServiceOptions {
  userService: IUserService;
  cryptoService: ICryptoService;
  cacheService: ICacheService;
  mailSenderService: IMailSenderService;
  loggerService: ILoggerService;
}

export interface IResetPasswordControllerOptions {
  resetPasswordService: IResetPasswordService;
  responseFormatter: IResponseFormatter;
  rateLimitService: IRateLimitService;
  loggerService: ILoggerService;
}
