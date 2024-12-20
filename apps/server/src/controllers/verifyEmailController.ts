import type { Response } from "express";
import httpStatus from "http-status";

import emailVerificationService from "../services/verifyEmailService";

import { EMAIL_VERIFICATION_REDIRECT_URL } from "../constants";
import type { EmptyRecord, TypedRequest } from "../types";
import type {
  SendVerifyEmailBody,
  VerifyEmailParam,
} from "../types/verifyEmail.type";

class VerifyEmailController {
  async sendEmail(
    req: TypedRequest<SendVerifyEmailBody>,
    res: Response
  ): Promise<void> {
    const { email } = req.body;

    await emailVerificationService.generateAndSendToken(email);

    // Responds with an OK status indicating that the verification email has been sent.
    res.status(httpStatus.OK).json({ message: "Verification email sent." });
  }

  async verifyEmail(
    req: TypedRequest<EmptyRecord, VerifyEmailParam>,
    res: Response
  ): Promise<void> {
    const { token } = req.params;

    await emailVerificationService.verifyUserEmail(token);

    res.status(httpStatus.OK).redirect(EMAIL_VERIFICATION_REDIRECT_URL);
  }
}

export default new VerifyEmailController();
