import type { Response } from "express";
import httpStatus from "http-status";

import type { ILoginDto, IRegisterDto } from "@tubenote/dtos";

import {
  AUTH_RATE_LIMIT_CONFIG,
  refreshTokenCookieConfig,
} from "@/modules/auth/config";
import { REFRESH_TOKEN_NAME } from "@/modules/auth/constants";

import { BadRequestError } from "@/modules/shared/api-errors";

import type { TypedRequest } from "@/modules/shared/types";

import type {
  ILoggerService,
  IRateLimitService,
  IResponseFormatter,
} from "@/modules/shared/services";

import type {
  ILocalAuthController,
  ILocalAuthControllerOptions,
  ILocalAuthService,
} from "./local-auth.types";

export class LocalAuthController implements ILocalAuthController {
  private static _instance: LocalAuthController;

  private constructor(
    private readonly _localAuthService: ILocalAuthService,
    private readonly _rateLimiter: IRateLimitService,
    private readonly _logger: ILoggerService,
    private readonly _responseFormatter: IResponseFormatter
  ) {}

  public static getInstance(
    options: ILocalAuthControllerOptions
  ): LocalAuthController {
    if (!this._instance) {
      this._instance = new LocalAuthController(
        options.localAuthService,
        options.rateLimiter,
        options.logger,
        options.responseFormatter
      );
    }

    return this._instance;
  }

  /**
   * Registers a new user.
   * @param req - The request object containing user registration credentials.
   * @param res - The response object.
   */
  async register(req: TypedRequest<IRegisterDto>, res: Response) {
    try {
      const user = await this._localAuthService.registerUser(req.body);

      if (!user) throw new BadRequestError("User registration failed.");

      const formattedResponse =
        this._responseFormatter.formatSuccessResponse<string>({
          responseOptions: {
            statusCode: httpStatus.CREATED,
            message: "A verification email has been sent to your email.",
            data: user.email,
          },
        });

      // Reset rate limiters on successful registration
      await this._rateLimiter.reset(req.rateLimitKey);

      res.status(formattedResponse.statusCode).json(formattedResponse);
    } catch (error: any) {
      await this._rateLimiter.increment({
        key: req.rateLimitKey,
        ...AUTH_RATE_LIMIT_CONFIG.registration,
      });

      throw error;
    }
  }

  /**
   * Logs in a user.
   * @param req - The request object containing user login credentials.
   * @param res - The response object.
   */
  async login(req: TypedRequest<ILoginDto>, res: Response) {
    const rateLimitKey = req.rateLimitKey;

    try {
      const { accessToken, refreshToken } =
        await this._localAuthService.loginUser({ ...req.body });

      const formattedResponse =
        this._responseFormatter.formatSuccessResponse<string>({
          responseOptions: {
            message: "Login successful",
            data: accessToken,
          },
        });

      // Reset rate limiters on successful login
      await this._rateLimiter.reset(rateLimitKey);

      res.cookie(REFRESH_TOKEN_NAME, refreshToken, refreshTokenCookieConfig);

      res.status(formattedResponse.statusCode).json(formattedResponse);
    } catch (error: any) {
      await this._rateLimiter.increment({
        key: rateLimitKey,
        ...AUTH_RATE_LIMIT_CONFIG.login,
      });

      throw error;
    }
  }
}
