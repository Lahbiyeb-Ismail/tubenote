import type { Response } from "express";
import httpStatus from "http-status";

import { IResetPasswordService } from "./reset-password.service";

import type { EmptyRecord, TypedRequest } from "../../types";

import type { EmailBodyDto } from "../../common/dtos/email-body.dto";
import type { TokenParamDto } from "../../common/dtos/token-param.dto";
import type { PasswordBodyDto } from "./dtos/password-body.dto";

export interface IResetPasswordController {
  forgotPassword(req: TypedRequest<EmailBodyDto>, res: Response): Promise<void>;
  resetPassword(
    req: TypedRequest<PasswordBodyDto, TokenParamDto>,
    res: Response
  ): Promise<void>;
  verifyResetToken(
    req: TypedRequest<EmptyRecord, TokenParamDto>,
    res: Response
  ): Promise<void>;
}

/**
 * Controller for handling password reset operations.
 */
export class ResetPasswordController implements IResetPasswordController {
  private resetPasswordService: IResetPasswordService;

  constructor(resetPasswordService: IResetPasswordService) {
    this.resetPasswordService = resetPasswordService;
  }

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

    await this.resetPasswordService.sendResetToken(email);

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

    await this.resetPasswordService.reset(token, password);

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

    await this.resetPasswordService.verifyResetToken(token);

    res.status(httpStatus.OK).json({ message: "Reset token verified." });
  }
}
