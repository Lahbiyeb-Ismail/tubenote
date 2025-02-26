import type { Response } from "express";
import httpStatus from "http-status";

import type { TypedRequest } from "@/types";
import { refreshTokenCookieConfig } from "@config/cookie.config";

import { type ILoginDto, REFRESH_TOKEN_NAME } from "@modules/auth";

import type { ICreateBodyDto } from "@/modules/shared";
import type { User } from "@/modules/user";

import type {
  ILocalAuthController,
  ILocalAuthService,
} from "./local-auth.types";

export class LocalAuthController implements ILocalAuthController {
  constructor(private readonly _localAuthService: ILocalAuthService) {}

  /**
   * Registers a new user.
   * @param req - The request object containing user registration credentials.
   * @param res - The response object.
   */
  async register(req: TypedRequest<ICreateBodyDto<User>>, res: Response) {
    const user = await this._localAuthService.registerUser({ data: req.body });

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
