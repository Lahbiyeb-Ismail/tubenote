import type { Response } from "express";
import httpStatus from "http-status";

import type { EmptyRecord, TypedRequest } from "@/modules/shared/types";

import type { IParamTokenDto } from "@/modules/shared/dtos";

import type { IResponseFormatter } from "@/modules/shared/services";
import type {
  IVerifyEmailController,
  IVerifyEmailControllerOptions,
  IVerifyEmailService,
} from "./verify-email.types";

/**
 * Controller for handling email verification operations.
 */
export class VerifyEmailController implements IVerifyEmailController {
  private static _instance: VerifyEmailController;

  private constructor(
    private readonly _verifyEmailService: IVerifyEmailService,
    private readonly _responseFormatter: IResponseFormatter
  ) {}

  public static getInstance(
    options: IVerifyEmailControllerOptions
  ): VerifyEmailController {
    if (!this._instance) {
      this._instance = new VerifyEmailController(
        options.verifyEmailService,
        options.responseFormatter
      );
    }
    return this._instance;
  }

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

    const formattedResponse = this._responseFormatter.formatResponse({
      status: httpStatus.OK,
      message: "Email verified successfully.",
    });

    res.status(httpStatus.OK).json(formattedResponse);
  }
}
