import type { Response } from "express";
import httpStatus from "http-status";
import verificationTokenService from "../services/verificationTokenService";
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

    await verificationTokenService.sendToken(email);

    // Responds with an OK status indicating that the verification email has been sent.
    res.status(httpStatus.OK).json({ message: "Verification email sent." });
  }

  async verifyEmail(
    req: TypedRequest<EmptyRecord, VerifyEmailParam>,
    res: Response
  ): Promise<void> {
    const { token } = req.params;

    await verificationTokenService.verifyToken(token);

    res.status(httpStatus.OK);
  }
}

export default new VerifyEmailController();
