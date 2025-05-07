import "reflect-metadata";
import { Container } from "inversify";
import { TYPES } from "./types";

// Import shared services
import {
  CacheService,
  CryptoService,
  CsrfService,
  type ICacheService,
  type ICryptoService,
  type ICsrfService,
  type ILoggerService,
  type IMailSenderService,
  type IPrismaService,
  type IRateLimitService,
  type IResponseFormatter,
  LoggerService,
  MailSenderService,
  PrismaService,
  ResponseFormatter,
} from "@/modules/shared/services";

// JWT Service
import { IJwtService, JwtService } from "@/modules/auth";

// Auth Module
import {
  AuthController,
  AuthService,
  IAuthController,
  IAuthService,
} from "@/modules/auth";

// Local Auth Module
import {
  ILocalAuthController,
  ILocalAuthService,
  LocalAuthController,
  LocalAuthService,
} from "@/modules/auth";

// OAuth Module
import {
  IOAuthController,
  IOAuthService,
  OAuthController,
  OAuthService,
} from "@/modules/auth";

// RefreshToken Module
import {
  IRefreshTokenController,
  IRefreshTokenRepository,
  IRefreshTokenService,
  RefreshTokenController,
  RefreshTokenRepository,
  RefreshTokenService,
} from "@/modules/auth";

// VerifyEmail Module
import {
  IVerifyEmailController,
  IVerifyEmailRepository,
  IVerifyEmailService,
  VerifyEmailController,
  VerifyEmailRepository,
  VerifyEmailService,
} from "@/modules/auth";

// ResetPassword Module
import {
  type IResetPasswordController,
  type IResetPasswordService,
  ResetPasswordController,
  ResetPasswordService,
} from "@/modules/auth";

// User Module
import {
  type IUserController,
  type IUserRepository,
  IUserService,
  UserController,
  UserRepository,
  UserService,
} from "@/modules/user";

import { AccountRepository } from "@/modules/user/features/account/account.repository";
import { AccountService } from "@/modules/user/features/account/account.service";
// Account Module
import {
  type IAccountRepository,
  IAccountService,
} from "@/modules/user/features/account/account.types";

// Import RateLimitService
import { RateLimitService } from "@/modules/shared/services/rate-limit/rate-limit.service";

// Video Module
import {
  type IVideoController,
  type IVideoRepository,
  type IVideoService,
  VideoController,
  VideoRepository,
  VideoService,
} from "@/modules/video";

// Note Module
import {
  type INoteController,
  type INoteRepository,
  type INoteService,
  NoteController,
  NoteRepository,
  NoteService,
} from "@/modules/note";

// Create and configure the container
const container = new Container();

// Initialize container - this function sets up all the bindings
function bootstrapContainer() {
  // Bind shared services
  container
    .bind<IPrismaService>(TYPES.PrismaService)
    .to(PrismaService)
    .inSingletonScope();
  container
    .bind<ILoggerService>(TYPES.LoggerService)
    .to(LoggerService)
    .inSingletonScope();
  container
    .bind<ICryptoService>(TYPES.CryptoService)
    .to(CryptoService)
    .inSingletonScope();
  container
    .bind<IResponseFormatter>(TYPES.ResponseFormatter)
    .to(ResponseFormatter);
  container
    .bind<IMailSenderService>(TYPES.MailSenderService)
    .to(MailSenderService);
  container
    .bind<ICacheService>(TYPES.CacheService)
    .to(CacheService)
    .inSingletonScope();
  container
    .bind<IRateLimitService>(TYPES.RateLimitService)
    .to(RateLimitService)
    .inSingletonScope();
  container
    .bind<ICsrfService>(TYPES.CsrfService)
    .to(CsrfService)
    .inSingletonScope();

  // Bind JWT service
  container
    .bind<IJwtService>(TYPES.JwtService)
    .to(JwtService)
    .inSingletonScope();

  // Bind User service
  container
    .bind<IUserController>(TYPES.UserController)
    .to(UserController)
    .inSingletonScope();
  container
    .bind<IUserService>(TYPES.UserService)
    .to(UserService)
    .inSingletonScope();
  container
    .bind<IUserRepository>(TYPES.UserRepository)
    .to(UserRepository)
    .inSingletonScope();

  // Bind Account service
  container
    .bind<IAccountService>(TYPES.AccountService)
    .to(AccountService)
    .inSingletonScope();
  container
    .bind<IAccountRepository>(TYPES.AccountRepository)
    .to(AccountRepository)
    .inSingletonScope();

  // Bind VerifyEmail module
  container
    .bind<IVerifyEmailRepository>(TYPES.VerifyEmailRepository)
    .to(VerifyEmailRepository)
    .inSingletonScope();
  container
    .bind<IVerifyEmailService>(TYPES.VerifyEmailService)
    .to(VerifyEmailService)
    .inSingletonScope();
  container
    .bind<IVerifyEmailController>(TYPES.VerifyEmailController)
    .to(VerifyEmailController)
    .inSingletonScope();

  // Bind Refresh Token module
  container
    .bind<IRefreshTokenRepository>(TYPES.RefreshTokenRepository)
    .to(RefreshTokenRepository)
    .inSingletonScope();
  container
    .bind<IRefreshTokenService>(TYPES.RefreshTokenService)
    .to(RefreshTokenService)
    .inSingletonScope();
  container
    .bind<IRefreshTokenController>(TYPES.RefreshTokenController)
    .to(RefreshTokenController)
    .inSingletonScope();

  // Bind Reset Password module
  container
    .bind<IResetPasswordService>(TYPES.ResetPasswordService)
    .to(ResetPasswordService)
    .inSingletonScope();
  container
    .bind<IResetPasswordController>(TYPES.ResetPasswordController)
    .to(ResetPasswordController)
    .inSingletonScope();

  // Bind Local Auth module
  container
    .bind<ILocalAuthService>(TYPES.LocalAuthService)
    .to(LocalAuthService)
    .inSingletonScope();
  container
    .bind<ILocalAuthController>(TYPES.LocalAuthController)
    .to(LocalAuthController)
    .inSingletonScope();

  // Bind OAuth module
  container
    .bind<IOAuthService>(TYPES.OAuthService)
    .to(OAuthService)
    .inSingletonScope();
  container
    .bind<IOAuthController>(TYPES.OAuthController)
    .to(OAuthController)
    .inSingletonScope();

  // Bind Auth module
  container
    .bind<IAuthService>(TYPES.AuthService)
    .to(AuthService)
    .inSingletonScope();
  container
    .bind<IAuthController>(TYPES.AuthController)
    .to(AuthController)
    .inSingletonScope();

  // Bind Video module
  container
    .bind<IVideoRepository>(TYPES.VideoRepository)
    .to(VideoRepository)
    .inSingletonScope();
  container
    .bind<IVideoService>(TYPES.VideoService)
    .to(VideoService)
    .inSingletonScope();
  container
    .bind<IVideoController>(TYPES.VideoController)
    .to(VideoController)
    .inSingletonScope();

  // Bind Note module
  container
    .bind<INoteRepository>(TYPES.NoteRepository)
    .to(NoteRepository)
    .inSingletonScope();
  container
    .bind<INoteService>(TYPES.NoteService)
    .to(NoteService)
    .inSingletonScope();
  container
    .bind<INoteController>(TYPES.NoteController)
    .to(NoteController)
    .inSingletonScope();

  return container;
}

// Bootstrap the container
const bootstrappedContainer = bootstrapContainer();

export { bootstrappedContainer as container };
