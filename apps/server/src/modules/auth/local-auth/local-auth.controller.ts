import type { Response } from "express";
import httpStatus from "http-status";
import type { UpdatePasswordDto } from "../../../common/dtos/update-password.dto";
import { refreshTokenCookieConfig } from "../../../config/cookie.config";
import { REFRESH_TOKEN_NAME } from "../../../constants/auth.contants";
import type { TypedRequest } from "../../../types";
import type { LoginUserDto } from "../dtos/login-user.dto";
import type { RegisterUserDto } from "../dtos/register-user.dto";
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
  async register(req: TypedRequest<RegisterUserDto>, res: Response) {
    const user = await this._localAuthService.registerUser(req.body);

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
  async login(req: TypedRequest<LoginUserDto>, res: Response) {
    const { accessToken, refreshToken } =
      await this._localAuthService.loginUser(req.body);

    res.cookie(REFRESH_TOKEN_NAME, refreshToken, refreshTokenCookieConfig);

    res.status(httpStatus.OK).json({
      message: "Login successful",
      accessToken,
    });
  }

  async updatePassword(req: TypedRequest<UpdatePasswordDto>, res: Response) {
    const userId = req.userId;

    const user = await this._localAuthService.updatePassword(userId, req.body);

    res.status(httpStatus.OK).json({
      message: "Password updated successfully",
      email: user.email,
    });
  }
}
