import type { Response } from "express";
import httpStatus from "http-status";
import { inject, injectable } from "inversify";

import type { ILoginDto, IRegisterDto } from "@tubenote/dtos";

import { TYPES } from "@/config/inversify/types";

import {
  AUTH_RATE_LIMIT_CONFIG,
  accessTokenCookieConfig,
  refreshTokenCookieConfig,
} from "@/modules/auth/config";
import {
  ACCESS_TOKEN_NAME,
  REFRESH_TOKEN_NAME,
} from "@/modules/auth/constants";

import { BadRequestError } from "@/modules/shared/api-errors";

import type { TypedRequest } from "@/modules/shared/types";

import type {
  ILoggerService,
  IRateLimitService,
  IResponseFormatter,
} from "@/modules/shared/services";

import type {
  ILocalAuthController,
  ILocalAuthService,
} from "./local-auth.types";

@injectable()
export class LocalAuthController implements ILocalAuthController {
  constructor(
    @inject(TYPES.LocalAuthService)
    private readonly _localAuthService: ILocalAuthService,
    @inject(TYPES.RateLimitService)
    private readonly _rateLimiter: IRateLimitService,
    @inject(TYPES.LoggerService) private readonly _logger: ILoggerService,
    @inject(TYPES.ResponseFormatter)
    private readonly _responseFormatter: IResponseFormatter
  ) {}

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
    const deviceId = [
      req.headers["user-agent"],
      req.headers["accept-language"],
      req.headers["sec-ch-ua-platform"],
    ].join("|");

    const ipAddress = req.clientIp as string;

    try {
      const { accessToken, refreshToken } =
        await this._localAuthService.loginUser(
          req.body,
          deviceId,
          ipAddress,
          req.clientContext
        );

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
      res.cookie(ACCESS_TOKEN_NAME, accessToken, accessTokenCookieConfig);

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
