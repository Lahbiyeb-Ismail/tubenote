import type { Response } from "express";
import httpStatus from "http-status";
import resetPasswordService from "../services/resetPasswordService";
import type { TypedRequest } from "../types";
import type { ForgotPasswordBody } from "../types/resetPassword.type";

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
}

export default new ResetPasswordController();
