import type { Response } from "express";
import httpStatus from "http-status";

import type { EmailBodyDto } from "../../common/dtos/email-body.dto";
import type { TokenParamDto } from "../../common/dtos/token-param.dto";
import type { EmptyRecord, TypedRequest } from "../../types";
import type { IVerifyEmailService } from "./verify-email.service";

export interface IVerifyEmailController {
  verifyEmail(
    req: TypedRequest<EmptyRecord, TokenParamDto>,
    res: Response
  ): Promise<void>;
}

/**
 * Controller for handling email verification operations.
 */
export class VerifyEmailController implements IVerifyEmailController {
  private verifyEmailService: IVerifyEmailService;

  constructor(verifyEmailService: IVerifyEmailService) {
    this.verifyEmailService = verifyEmailService;
  }

  /**
   * Verify the user's email using the token.
   * @param req - The request object containing the verification token.
   * @param res - The response object to confirm the email was verified.
   */
  async verifyEmail(
    req: TypedRequest<EmptyRecord, TokenParamDto>,
    res: Response
  ): Promise<void> {
    const { token } = req.params;

    await this.verifyEmailService.verifyUserEmail(token);

    res.status(httpStatus.OK).json({ message: "Email verified successfully." });
  }
}
