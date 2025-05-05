import type { Response } from "express";
import { inject, injectable } from "inversify";

import type { IParamTokenDto } from "@tubenote/dtos";

import { TYPES } from "@/config/inversify/types";

import type { EmptyRecord, TypedRequest } from "@/modules/shared/types";

import type { IResponseFormatter } from "@/modules/shared/services";
import type {
  IVerifyEmailController,
  IVerifyEmailService,
} from "./verify-email.types";

/**
 * Controller for handling email verification operations.
 */
@injectable()
export class VerifyEmailController implements IVerifyEmailController {
  constructor(
    @inject(TYPES.VerifyEmailService)
    private _verifyEmailService: IVerifyEmailService,
    @inject(TYPES.ResponseFormatter)
    private _responseFormatter: IResponseFormatter
  ) {}

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

    const formattedResponse =
      this._responseFormatter.formatSuccessResponse<null>({
        responseOptions: {
          message: "Email verified successfully.",
          data: null,
        },
      });

    res.status(formattedResponse.statusCode).json(formattedResponse);
  }
}
