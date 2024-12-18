import type { Response } from "express";
import httpStatus from "http-status";
import resetPasswordService from "../services/resetPasswordService";
import type { EmptyRecord, TypedRequest } from "../types";
import type {
  ForgotPasswordBody,
  ResetPasswordBody,
  ResetPasswordParams,
} from "../types/resetPassword.type";

class ResetPasswordController {
  async forgotPassword(
    req: TypedRequest<ForgotPasswordBody>,
    res: Response
  ): Promise<void> {
    const { email } = req.body;

    await resetPasswordService.sendResetToken(email);

    res
      .status(httpStatus.OK)
      .json({ message: "Password reset link sent to your email." });
  }

  async resetPassword(
    req: TypedRequest<ResetPasswordBody, ResetPasswordParams>,
    res: Response
  ): Promise<void> {
    const { password } = req.body;
    const { token } = req.params;

    await resetPasswordService.reset(token, password);

    res.status(httpStatus.OK).json({ message: "Password reset successful." });
  }

  async verifyResetToken(
    req: TypedRequest<EmptyRecord, ResetPasswordParams>,
    res: Response
  ): Promise<void> {
    const { token } = req.params;

    await resetPasswordService.verfiyResetToken(token);

    res.status(httpStatus.OK).json({ message: "Reset token verified." });
  }
}

export default new ResetPasswordController();
