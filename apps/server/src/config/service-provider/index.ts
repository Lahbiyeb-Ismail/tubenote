// Import reflect-metadata to enable decorators
import "reflect-metadata";

// Import the container from inversify
import { container } from "@/config/inversify/container";
import { TYPES } from "@/config/inversify/types";

// Import service interfaces directly
import type {
  IAuthController,
  IAuthService,
  IJwtService,
} from "@/modules/auth";

import type { ILocalAuthController, ILocalAuthService } from "@/modules/auth";

import type { IOAuthController, IOAuthService } from "@/modules/auth";

import type {
  IRefreshTokenController,
  IRefreshTokenService,
} from "@/modules/auth";

import type {
  IVerifyEmailController,
  IVerifyEmailRepository,
  IVerifyEmailService,
} from "@/modules/auth";

import type {
  IResetPasswordController,
  IResetPasswordService,
} from "@/modules/auth";

import type {
  ICacheService,
  ICryptoService,
  ILoggerService,
  IMailSenderService,
  IPrismaService,
  IRateLimitService,
  IResponseFormatter,
} from "@/modules/shared/services";

import type {
  IUserController,
  IUserRepository,
  IUserService,
} from "@/modules/user";
import type {
  IAccountRepository,
  IAccountService,
} from "@/modules/user/features/account/account.types";

import type {
  INoteController,
  INoteRepository,
  INoteService,
} from "@/modules/note";
import type {
  IVideoController,
  IVideoRepository,
  IVideoService,
} from "@/modules/video";

// Initialize the services using the container
// We're initializing these here to ensure they're created before being used
// This helps break circular dependencies
export const authService = container.get<IAuthService>(TYPES.AuthService);
export const authController = container.get<IAuthController>(
  TYPES.AuthController
);

export const localAuthService = container.get<ILocalAuthService>(
  TYPES.LocalAuthService
);
export const localAuthController = container.get<ILocalAuthController>(
  TYPES.LocalAuthController
);

export const oauthService = container.get<IOAuthService>(TYPES.OAuthService);
export const oauthController = container.get<IOAuthController>(
  TYPES.OAuthController
);

export const refreshTokenService = container.get<IRefreshTokenService>(
  TYPES.RefreshTokenService
);
export const refreshTokenController = container.get<IRefreshTokenController>(
  TYPES.RefreshTokenController
);

export const verifyEmailController = container.get<IVerifyEmailController>(
  TYPES.VerifyEmailController
);
export const verifyEmailService = container.get<IVerifyEmailService>(
  TYPES.VerifyEmailService
);
export const verifyEmailRepository = container.get<IVerifyEmailRepository>(
  TYPES.VerifyEmailRepository
);

export const resetPasswordService = container.get<IResetPasswordService>(
  TYPES.ResetPasswordService
);
export const resetPasswordController = container.get<IResetPasswordController>(
  TYPES.ResetPasswordController
);

export const userController = container.get<IUserController>(
  TYPES.UserController
);
export const userService = container.get<IUserService>(TYPES.UserService);
export const userRepository = container.get<IUserRepository>(
  TYPES.UserRepository
);

export const accountService = container.get<IAccountService>(
  TYPES.AccountService
);
export const accountRepository = container.get<IAccountRepository>(
  TYPES.AccountRepository
);

export const videoController = container.get<IVideoController>(
  TYPES.VideoController
);
export const videoService = container.get<IVideoService>(TYPES.VideoService);
export const videoRepository = container.get<IVideoRepository>(
  TYPES.VideoRepository
);

export const noteController = container.get<INoteController>(
  TYPES.NoteController
);
export const noteService = container.get<INoteService>(TYPES.NoteService);
export const noteRepository = container.get<INoteRepository>(
  TYPES.NoteRepository
);

export const cacheService = container.get<ICacheService>(TYPES.CacheService);
export const rateLimitService = container.get<IRateLimitService>(
  TYPES.RateLimitService
);
export const prismaService = container.get<IPrismaService>(TYPES.PrismaService);
export const loggerService = container.get<ILoggerService>(TYPES.LoggerService);
export const cryptoService = container.get<ICryptoService>(TYPES.CryptoService);
export const responseFormatter = container.get<IResponseFormatter>(
  TYPES.ResponseFormatter
);
export const mailSenderService = container.get<IMailSenderService>(
  TYPES.MailSenderService
);

export const jwtService = container.get<IJwtService>(TYPES.JwtService);

// This file is imported in app.ts and executes before any routes are registered
// to ensure that all services are initialized properly
