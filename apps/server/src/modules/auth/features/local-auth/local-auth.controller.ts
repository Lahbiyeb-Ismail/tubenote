import type { Response } from "express";
import httpStatus from "http-status";

import { refreshTokenCookieConfig } from "@/modules/auth/config";
import { REFRESH_TOKEN_NAME } from "@/modules/auth/constants";

import { BadRequestError } from "@/modules/shared/api-errors";

import type { ICreateBodyDto } from "@/modules/shared/dtos";
import type { TypedRequest } from "@/modules/shared/types";
import type { User } from "@/modules/user";

import type { ILoginDto } from "@/modules/auth/dtos";

import type {
  ILocalAuthController,
  ILocalAuthControllerOptions,
  ILocalAuthService,
} from "./local-auth.types";

export class LocalAuthController implements ILocalAuthController {
  private static instance: LocalAuthController;

  constructor(private readonly _localAuthService: ILocalAuthService) {}

  static getInstance(
    options: ILocalAuthControllerOptions
  ): LocalAuthController {
    if (!LocalAuthController.instance) {
      LocalAuthController.instance = new LocalAuthController(
        options.localAuthService
      );
    }

    return LocalAuthController.instance;
  }

  /**
   * Registers a new user.
   * @param req - The request object containing user registration credentials.
   * @param res - The response object.
   */
  async register(req: TypedRequest<ICreateBodyDto<User>>, res: Response) {
    const user = await this._localAuthService.registerUser({ data: req.body });

    if (!user) throw new BadRequestError("User registration failed.");

    res.status(httpStatus.CREATED).json({
      message: "A verification email has been sent to your email.",
      email: user.email,
    });
  }

  /**
   * Logs in a user.
   * @param req - The request object containing user login credentials.
   * @param res - The response object.
   */
  async login(req: TypedRequest<ILoginDto>, res: Response) {
    const { accessToken, refreshToken } =
      await this._localAuthService.loginUser(req.body);

    res.cookie(REFRESH_TOKEN_NAME, refreshToken, refreshTokenCookieConfig);

    res.status(httpStatus.OK).json({
      message: "Login successful",
      accessToken,
    });
  }
}
