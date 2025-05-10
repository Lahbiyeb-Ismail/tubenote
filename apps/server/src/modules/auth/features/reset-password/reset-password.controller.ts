import type { Response } from "express";
import { inject, injectable } from "inversify";

import type {
  IEmailBodyDto,
  IParamTokenDto,
  IPasswordBodyDto,
} from "@tubenote/dtos";

import { TYPES } from "@/config/inversify/types";

import { AUTH_RATE_LIMIT_CONFIG } from "@/modules/auth/config";

import type { EmptyRecord, TypedRequest } from "@/modules/shared/types";

import type {
  ILoggerService,
  IRateLimitService,
  IResponseFormatter,
} from "@/modules/shared/services";

import type {
  IResetPasswordController,
  IResetPasswordService,
} from "./reset-password.types";

/**
 * Controller for handling password reset operations.
 */
@injectable()
export class ResetPasswordController implements IResetPasswordController {
  constructor(
    @inject(TYPES.ResetPasswordService)
    private _resetPasswordService: IResetPasswordService,
    @inject(TYPES.ResponseFormatter)
    private _responseFormatter: IResponseFormatter,
    @inject(TYPES.RateLimitService)
    private _rateLimitService: IRateLimitService,
    @inject(TYPES.LoggerService) private _loggerService: ILoggerService
  ) {}

  /**
   * Handles the forgot password request by sending a reset token to the user's email.
   *
   * @param req - The request object containing the user's email.
   * @param res - The response object to send the status and message.
   * @returns A promise that resolves to void.
   */
  async forgotPassword(
    req: TypedRequest<IEmailBodyDto>,
    res: Response
  ): Promise<void> {
    try {
      const { email } = req.body;

      await this._resetPasswordService.sendResetToken(email);

      const formattedResponse =
        this._responseFormatter.formatSuccessResponse<null>({
          responseOptions: {
            message: "Password reset link sent to your email.",
            data: null,
          },
        });

      await this._rateLimitService.reset(req.rateLimitKey);

      res.status(formattedResponse.statusCode).json(formattedResponse);
    } catch (error: any) {
      await this._rateLimitService.increment({
        key: req.rateLimitKey,
        ...AUTH_RATE_LIMIT_CONFIG.forgotPassword,
      });

      this._loggerService.error("Error in forgotPassword", error);

      throw error;
    }
  }

  /**
   * Handles the password reset request by resetting the user's password using the provided token.
   *
   * @param req - The request object containing the new password and reset token.
   * @param res - The response object to send the status and message.
   * @returns A promise that resolves to void.
   */
  async resetPassword(
    req: TypedRequest<IPasswordBodyDto, IParamTokenDto>,
    res: Response
  ): Promise<void> {
    try {
      const { password } = req.body;
      const { token } = req.params;

      await this._resetPasswordService.resetPassword(token, password);

      const formattedResponse =
        this._responseFormatter.formatSuccessResponse<null>({
          responseOptions: {
            message: "Password reset successfully.",
            data: null,
          },
        });

      await this._rateLimitService.reset(req.rateLimitKey);

      res.status(formattedResponse.statusCode).json(formattedResponse);
    } catch (error: any) {
      await this._rateLimitService.increment({
        key: req.rateLimitKey,
        ...AUTH_RATE_LIMIT_CONFIG.resetPassword,
      });

      this._loggerService.error("Error in resetPassword", error);

      throw error;
    }
  }

  /**
   * Verifies the provided reset token.
   *
   * @param req - The request object containing the reset token.
   * @param res - The response object to send the status and message.
   * @returns A promise that resolves to void.
   */
  async verifyResetToken(
    req: TypedRequest<EmptyRecord, IParamTokenDto>,
    res: Response
  ): Promise<void> {
    const { token } = req.params;

    await this._resetPasswordService.verifyResetToken(token);

    const formattedResponse =
      this._responseFormatter.formatSuccessResponse<null>({
        responseOptions: {
          message: "Reset password token is valid.",
          data: null,
        },
      });

    res.status(formattedResponse.statusCode).json(formattedResponse);
  }
}
