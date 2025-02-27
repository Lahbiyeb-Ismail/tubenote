import type { Response } from "express";
import httpStatus from "http-status";

import type { EmptyRecord, TypedRequest } from "@modules/shared";

import type { IParamTokenDto } from "@/modules/shared";

import type {
  IVerifyEmailController,
  IVerifyEmailService,
} from "./verify-email.types";

/**
 * Controller for handling email verification operations.
 */
export class VerifyEmailController implements IVerifyEmailController {
  constructor(private readonly _verifyEmailService: IVerifyEmailService) {}

  /**
   * Verify the user's email using the token.
   * @param req - The request object containing the verification token.
   * @param res - The response object to confirm the email was verified.
   */
  async verifyEmail(
    req: TypedRequest<EmptyRecord, IParamTokenDto>,
    res: Response
  ): Promise<void> {
    const { token } = req.params;

    await this._verifyEmailService.verifyUserEmail(token);

    res.status(httpStatus.OK).json({ message: "Email verified successfully." });
  }
}
