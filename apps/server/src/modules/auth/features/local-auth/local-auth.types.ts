import type { Response } from "express";

import type { ILoginDto, IRegisterDto } from "@tubenote/dtos";
import type { User } from "@tubenote/types";

import type { TypedRequest } from "@/modules/shared/types";

import type { IUserService } from "@/modules/user";

import type { IAuthResponseDto } from "@/modules/auth/dtos";

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

/**
 * Interface representing the local authentication service.
 */
export interface ILocalAuthService {
  /**
   * Registers a new user in the system.
   *
   * @param registerUserDto - The data transfer object containing user registration details.
   * @returns A promise that resolves to the created user or undefined if registration fails.
   */
  registerUser: (registerUserDto: IRegisterDto) => Promise<User | undefined>;

  /**
   * Logs in a user using their credentials.
   *
   * @param loginDto - The data transfer object containing user login details.
   * @returns A promise that resolves to an authentication response DTO.
   */
  loginUser: (loginDto: ILoginDto) => Promise<IAuthResponseDto>;
}

/**
 * Interface representing the Local Authentication Controller.
 */
export interface ILocalAuthController {
  /**
   * Handles user registration.
   *
   * @param req - The request object containing the user registration data.
   * @param res - The response object used to send the result of the registration process.
   *
   * @returns A promise that resolves when the registration process is complete.
   */
  register(req: TypedRequest<IRegisterDto>, res: Response): Promise<void>;

  /**
   * Handles user login.
   *
   * @param req - The request object containing the user login credentials.
   * @param res - The response object used to send the result of the login process.
   *
   * @returns A promise that resolves when the login process is complete.
   */
  login(req: TypedRequest<ILoginDto>, res: Response): Promise<void>;
}

/**
 * Options required to initialize the Local Authentication Service.
 */
export interface ILocalAuthServiceOptions {
  /**
   * Service for interacting with the Prisma database.
   */
  prismaService: IPrismaService;

  /**
   * Service for managing user-related operations.
   */
  userService: IUserService;

  /**
   * Service for handling email verification processes.
   */
  verifyEmailService: IVerifyEmailService;

  /**
   * Service for managing refresh tokens.
   */
  refreshTokenService: IRefreshTokenService;

  /**
   * Service for handling JSON Web Token (JWT) operations.
   */
  jwtService: IJwtService;

  /**
   * Service for cryptographic operations.
   */
  cryptoService: ICryptoService;

  /**
   * Service for sending emails.
   */
  mailSenderService: IMailSenderService;

  /**
   * Service for logging operations.
   */
  loggerService: ILoggerService;
}

/**
 * Options for configuring the Local Authentication Controller.
 */
export interface ILocalAuthControllerOptions {
  /**
   * Service responsible for handling local authentication logic.
   */
  localAuthService: ILocalAuthService;

  /**
   * Service for rate limiting requests to prevent abuse.
   */
  rateLimiter: IRateLimitService;

  /**
   * Service for logging application events and errors.
   */
  logger: ILoggerService;

  /**
   * Utility for formatting responses sent to the client.
   */
  responseFormatter: IResponseFormatter;
}
