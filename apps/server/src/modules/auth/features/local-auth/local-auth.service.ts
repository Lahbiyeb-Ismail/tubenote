import { ERROR_MESSAGES } from "@/modules/shared/constants";

import {
  ForbiddenError,
  NotFoundError,
  TooManyRequestsError,
  UnauthorizedError,
} from "@/modules/shared/api-errors";
import { stringToDate } from "@/modules/shared/utils";

import type { ICreateUserDto, IUserService, User } from "@/modules/user";

import type {
  ICryptoService,
  ILoggerService,
  IMailSenderService,
  IPrismaService,
  IRateLimitService,
} from "@/modules/shared/services";

import type {
  IRefreshTokenService,
  IVerifyEmailService,
} from "@/modules/auth/features";

import { REFRESH_TOKEN_EXPIRES_IN } from "@/modules/auth/constants";

import type { IAuthResponseDto, ILoginDto } from "@/modules/auth/dtos";
import type { IJwtService } from "@/modules/auth/utils";

import { AUTH_RATE_LIMIT_CONFIG } from "../../config";
import type {
  ILocalAuthService,
  ILocalAuthServiceOptions,
} from "./local-auth.types";

export class LocalAuthService implements ILocalAuthService {
  private static _instance: LocalAuthService;

  private constructor(
    private readonly _prismaService: IPrismaService,
    private readonly _userService: IUserService,
    private readonly _verifyEmailService: IVerifyEmailService,
    private readonly _refreshTokenService: IRefreshTokenService,
    private readonly _jwtService: IJwtService,
    private readonly _cryptoService: ICryptoService,
    private readonly _mailSenderService: IMailSenderService,
    private readonly _rateLimitService: IRateLimitService,
    private readonly _loggerService: ILoggerService
  ) {}

  public static getInstance(
    options: ILocalAuthServiceOptions
  ): LocalAuthService {
    if (!this._instance) {
      this._instance = new LocalAuthService(
        options.prismaService,
        options.userService,
        options.verifyEmailService,
        options.refreshTokenService,
        options.jwtService,
        options.cryptoService,
        options.mailSenderService,
        options.rateLimitService,
        options.loggerService
      );
    }
    return this._instance;
  }

  async registerUser(createUserDto: ICreateUserDto): Promise<User | undefined> {
    let newUser: User | undefined;
    let verifyEmailToken: string | undefined;

    await this._prismaService.transaction(async (tx) => {
      newUser = await this._userService.createUserWithAccount(
        tx,
        createUserDto,
        {
          data: {
            provider: "credentials",
            providerAccountId: createUserDto.data.email,
            type: "email",
          },
        }
      );

      verifyEmailToken = await this._verifyEmailService.createToken(
        tx,
        newUser.email
      );
    });

    // Only send the email **after** the transaction is committed
    if (newUser && verifyEmailToken) {
      await this._mailSenderService.sendVerificationEmail(
        newUser.email,
        verifyEmailToken
      );
    }

    return newUser;
  }

  async loginUser(loginDto: ILoginDto): Promise<IAuthResponseDto> {
    const { email, password, ip } = loginDto;

    // Create rate limit keys based on both IP and email
    const ipKey = `login:ip:${ip || "unknown"}`;
    const emailKey = `login:email:${email}`;

    try {
      // Check IP-based rate limiting first
      const ipLimitResult = await this._rateLimitService.check({
        key: ipKey,
        ...AUTH_RATE_LIMIT_CONFIG.login,
      });

      if (ipLimitResult.blocked) {
        this._loggerService.warn("IP address rate limited for login attempts", {
          ip,
          resetAt: ipLimitResult.resetAt,
        });

        throw new TooManyRequestsError(ERROR_MESSAGES.TOO_MANY_ATTEMPTS, {
          resetAt: ipLimitResult.resetAt,
          remainingSeconds: ipLimitResult.resetAt
            ? Math.ceil((ipLimitResult.resetAt.getTime() - Date.now()) / 1000)
            : null,
        });
      }

      // Get the user first to check if they exist
      const user = await this._userService.getUserByEmail(email);

      if (!user) {
        // Increment the IP-based counter even for non-existent users
        await this._rateLimitService.increment({
          key: ipKey,
          ...AUTH_RATE_LIMIT_CONFIG.login,
        });

        this._loggerService.info("Login attempt with non-existent email", {
          email,
          ip,
        });
        throw new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND);
      }

      // Now check email-based rate limiting
      const emailLimitResult = await this._rateLimitService.check({
        key: emailKey,
        ...AUTH_RATE_LIMIT_CONFIG.login,
      });

      if (emailLimitResult.blocked) {
        this._loggerService.warn("Account rate limited for login attempts", {
          email,
          userId: user.id,
          resetAt: emailLimitResult.resetAt,
        });

        throw new TooManyRequestsError(
          ERROR_MESSAGES.ACCOUNT_TEMPORARILY_LOCKED,
          {
            resetAt: emailLimitResult.resetAt,
            remainingSeconds: emailLimitResult.resetAt
              ? Math.ceil(
                  (emailLimitResult.resetAt.getTime() - Date.now()) / 1000
                )
              : null,
          }
        );
      }

      if (!user.isEmailVerified) {
        // Don't increment rate limit for unverified emails
        throw new UnauthorizedError(ERROR_MESSAGES.NOT_VERIFIED);
      }

      const isPasswordMatch = await this._cryptoService.comparePasswords({
        plainText: password,
        hash: user.password,
      });

      if (!isPasswordMatch) {
        // Increment both rate limiters on failed password
        await Promise.all([
          this._rateLimitService.increment({
            key: ipKey,
            ...AUTH_RATE_LIMIT_CONFIG.login,
          }),
          this._rateLimitService.increment({
            key: emailKey,
            ...AUTH_RATE_LIMIT_CONFIG.login,
          }),
        ]);

        this._loggerService.info("Failed login attempt - invalid password", {
          userId: user.id,
          email,
          ip,
        });

        throw new ForbiddenError(ERROR_MESSAGES.INVALID_CREDENTIALS);
      }

      const { accessToken, refreshToken } = this._jwtService.generateAuthTokens(
        user.id
      );

      // Store refresh token
      await this._refreshTokenService.createToken({
        userId: user.id,
        data: {
          token: refreshToken,
          expiresAt: stringToDate(REFRESH_TOKEN_EXPIRES_IN),
        },
      });

      // Reset rate limiters on successful login
      await Promise.all([
        this._rateLimitService.reset(ipKey),
        this._rateLimitService.reset(emailKey),
      ]);

      this._loggerService.info("User logged in successfully", {
        userId: user.id,
        email,
        ip,
      });

      return { accessToken, refreshToken };
    } catch (error: any) {
      // Ensure all errors are properly logged
      if (!(error instanceof TooManyRequestsError)) {
        this._loggerService.error("Login error", {
          email,
          ip,
          errorType: error.constructor.name,
          errorMessage: error.message,
        });
      }

      throw error;
    }

    // const user = await this._userService.getUserByEmail(email);

    // if (!user) {
    //   // Increment IP-based rate limit for non-existent users
    //   await this._rateLimitService.increment({
    //     key: `login:ip:${ip}`,
    //     ...AUTH_RATE_LIMIT_CONFIG.login,
    //   });

    //   this._loggerService.warn("Login attempt with non-existent email", {
    //     email,
    //     ip,
    //   });

    //   throw new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND);
    // }

    // if (!user.isEmailVerified) {
    //   throw new UnauthorizedError(ERROR_MESSAGES.NOT_VERIFIED);
    // }

    // const isPasswordMatch = await this._cryptoService.comparePasswords({
    //   plainText: password,
    //   hash: user.password,
    // });

    // if (!isPasswordMatch) {
    //   throw new ForbiddenError(ERROR_MESSAGES.INVALID_CREDENTIALS);
    // }

    // const { accessToken, refreshToken } = this._jwtService.generateAuthTokens(
    //   user.id
    // );

    // await this._refreshTokenService.createToken({
    //   userId: user.id,
    //   data: {
    //     token: refreshToken,
    //     expiresAt: stringToDate(REFRESH_TOKEN_EXPIRES_IN),
    //   },
    // });

    // return { accessToken, refreshToken };
  }
}
