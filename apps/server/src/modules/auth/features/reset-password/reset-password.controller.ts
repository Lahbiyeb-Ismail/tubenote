import type { Response } from "express";
import httpStatus from "http-status";

import { AUTH_RATE_LIMIT_CONFIG } from "../../config";

import type { EmptyRecord, TypedRequest } from "@/modules/shared/types";

import type {
  IEmailBodyDto,
  IParamTokenDto,
  IPasswordBodyDto,
} from "@/modules/shared/dtos";

import type {
  ILoggerService,
  IRateLimitService,
  IResponseFormatter,
} from "@/modules/shared/services";

import type {
  IResetPasswordController,
  IResetPasswordControllerOptions,
  IResetPasswordService,
} from "./reset-password.types";

/**
 * Controller for handling password reset operations.
 */
export class ResetPasswordController implements IResetPasswordController {
  private static _instance: ResetPasswordController;

  private constructor(
    private readonly _resetPasswordService: IResetPasswordService,
    private readonly _responseFormatter: IResponseFormatter,
    private readonly _rateLimitService: IRateLimitService,
    private readonly _loggerService: ILoggerService
  ) {}

  public static getInstance(
    options: IResetPasswordControllerOptions
  ): ResetPasswordController {
    if (!this._instance) {
      this._instance = new ResetPasswordController(
        options.resetPasswordService,
        options.responseFormatter,
        options.rateLimitService,
        options.loggerService
      );
    }

    return this._instance;
  }

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

      const formattedResponse = this._responseFormatter.formatResponse({
        responseOptions: {
          status: httpStatus.OK,
          message: "Password reset link sent to your email.",
        },
      });

      await this._rateLimitService.reset(req.rateLimitKey);

      res.status(httpStatus.OK).json(formattedResponse);
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

      const formattedResponse = this._responseFormatter.formatResponse({
        responseOptions: {
          status: httpStatus.OK,
          message: "Password reset successfully.",
        },
      });

      await this._rateLimitService.reset(req.rateLimitKey);

      res.status(httpStatus.OK).json(formattedResponse);
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

    const formattedResponse = this._responseFormatter.formatResponse({
      responseOptions: {
        status: httpStatus.OK,
        message: "Reset password token is valid.",
      },
    });

    res.status(httpStatus.OK).json(formattedResponse);
  }
}
