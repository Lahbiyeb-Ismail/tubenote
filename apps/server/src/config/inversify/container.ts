import "reflect-metadata";
import { Container } from "inversify";

import type { IAnalyticsController, IAnalyticsRepository, IAnalyticsService } from "@/modules/analytics";
// Auth Module
import type {
  IAuthController,
  IAuthService,
  IJwtService,
  ILocalAuthController,
  ILocalAuthService,
  IOAuthController,
  IOAuthService,
  IRefreshTokenController,
  IRefreshTokenRepository,
  IRefreshTokenService,
  IResetPasswordController,
  IResetPasswordService,
  IVerifyEmailController,
  IVerifyEmailRepository,
  IVerifyEmailService,
} from "@/modules/auth";
import type { INoteController, INoteRepository, INoteService } from "@/modules/note";
import type { ICacheService, ICryptoService, ILoggerService, IMailSenderService, IPrismaService, IRateLimitService, IResponseFormatter } from "@/modules/shared/services";
// User Module
import type {
  IUserController,
  IUserRepository,
  IUserService,
} from "@/modules/user";
// Account Module
import type {
  IAccountRepository,
  IAccountService,
} from "@/modules/user/features/account/account.types";
import type { IVideoController, IVideoRepository, IVideoService } from "@/modules/video";

// Analytics Module
import {
  AnalyticsController,
  AnalyticsRepository,
  AnalyticsService,
} from "@/modules/analytics";
import { AuthController, AuthService, JwtService, LocalAuthController, LocalAuthService, OAuthController, OAuthService, RefreshTokenController, RefreshTokenRepository, RefreshTokenService, ResetPasswordController, ResetPasswordService, VerifyEmailController, VerifyEmailRepository, VerifyEmailService } from "@/modules/auth";
// Note Module
import {
  NoteController,
  NoteRepository,
  NoteService,
} from "@/modules/note";
// Import shared services
import {
  CacheService,
  CryptoService,
  LoggerService,
  MailSenderService,
  PrismaService,
  ResponseFormatter,
} from "@/modules/shared/services";
// Import RateLimitService
import { RateLimitService } from "@/modules/shared/services/rate-limit/rate-limit.service";
import {
  UserController,
  UserRepository,
  UserService,
} from "@/modules/user";
import { AccountRepository } from "@/modules/user/features/account/account.repository";
import { AccountService } from "@/modules/user/features/account/account.service";
// Video Module
import {

  VideoController,
  VideoRepository,
  VideoService,
} from "@/modules/video";

import { TYPES } from "./types";

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

  // Bind analytics services
  container
    .bind<IAnalyticsRepository>(TYPES.AnalyticsRepository)
    .to(AnalyticsRepository)
    .inSingletonScope();
  container
    .bind<IAnalyticsService>(TYPES.AnalyticsService)
    .to(AnalyticsService)
    .inSingletonScope();
  container
    .bind<IAnalyticsController>(TYPES.AnalyticsController)
    .to(AnalyticsController)
    .inSingletonScope();

  return container;
}

// Bootstrap the container
const bootstrappedContainer = bootstrapContainer();

export { bootstrappedContainer as container };
