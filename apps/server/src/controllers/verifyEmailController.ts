import type { Response } from "express";
import httpStatus from "http-status";

import type { EmptyRecord, TypedRequest } from "../types";
import type {
  SendVerifyEmailBody,
  VerifyEmailParam,
} from "../types/verifyEmail.type";

import verifyEmailService from "../services/verifyEmailService";

/**
 * Controller for handling email verification operations.
 */
class VerifyEmailController {
  /**
   * Send a verification email to the user.
   * @param req - The request object containing the email to send the verification to.
   * @param res - The response object to confirm the email was sent.
   */
  async sendEmail(
    req: TypedRequest<SendVerifyEmailBody>,
    res: Response
  ): Promise<void> {
    const { email } = req.body;

    await verifyEmailService.generateAndSendToken(email);

    res
      .status(httpStatus.OK)
      .json({ message: "Verification email sent successfully." });
  }

  /**
   * Verify the user's email using the token.
   * @param req - The request object containing the verification token.
   * @param res - The response object to confirm the email was verified.
   */
  async verifyEmail(
    req: TypedRequest<EmptyRecord, VerifyEmailParam>,
    res: Response
  ): Promise<void> {
    const { token } = req.params;

    await verifyEmailService.verifyUserEmail(token);

    res.status(httpStatus.OK).json({ message: "Email verified successfully." });
  }
}

export default new VerifyEmailController();
