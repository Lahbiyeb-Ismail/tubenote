import type { Response } from "express";
import httpStatus from "http-status";

import type { EmptyRecord, TypedRequest } from "../../types";

import type {
  IResetPasswordController,
  IResetPasswordService,
} from "./reset-password.types";

import type { EmailBodyDto } from "../../common/dtos/email-body.dto";
import type { TokenParamDto } from "../../common/dtos/token-param.dto";
import type { PasswordBodyDto } from "./dtos/password-body.dto";

/**
 * Controller for handling password reset operations.
 */
export class ResetPasswordController implements IResetPasswordController {
  constructor(private readonly _resetPasswordService: IResetPasswordService) {}

  /**
   * Handles the forgot password request by sending a reset token to the user's email.
   *
   * @param req - The request object containing the user's email.
   * @param res - The response object to send the status and message.
   * @returns A promise that resolves to void.
   */
  async forgotPassword(
    req: TypedRequest<EmailBodyDto>,
    res: Response
  ): Promise<void> {
    const { email } = req.body;

    await this._resetPasswordService.sendResetToken(email);

    res
      .status(httpStatus.OK)
      .json({ message: "Password reset link sent to your email." });
  }

  /**
   * Handles the password reset request by resetting the user's password using the provided token.
   *
   * @param req - The request object containing the new password and reset token.
   * @param res - The response object to send the status and message.
   * @returns A promise that resolves to void.
   */
  async resetPassword(
    req: TypedRequest<PasswordBodyDto, TokenParamDto>,
    res: Response
  ): Promise<void> {
    const { password } = req.body;
    const { token } = req.params;

    await this._resetPasswordService.reset(token, password);

    res.status(httpStatus.OK).json({ message: "Password reset successful." });
  }

  /**
   * Verifies the provided reset token.
   *
   * @param req - The request object containing the reset token.
   * @param res - The response object to send the status and message.
   * @returns A promise that resolves to void.
   */
  async verifyResetToken(
    req: TypedRequest<EmptyRecord, TokenParamDto>,
    res: Response
  ): Promise<void> {
    const { token } = req.params;

    await this._resetPasswordService.verifyResetToken(token);

    res.status(httpStatus.OK).json({ message: "Reset token verified." });
  }
}
