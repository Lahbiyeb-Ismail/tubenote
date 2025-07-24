import type { IParamTokenDto } from "@tubenote/dtos";
import type { IApiSuccessResponse } from "@tubenote/types";
import type { Response } from "express";

import httpStatus from "http-status";
import { mock, mockReset } from "jest-mock-extended";

import type { IResponseFormatter } from "@/modules/shared/services";
import type { EmptyRecord, TypedRequest } from "@/modules/shared/types";

import type {
  IVerifyEmailService,
} from "../verify-email.types";

import { VerifyEmailController } from "../verify-email.controller";

describe("verifyEmailController", () => {
  let controller: VerifyEmailController;

  const verifyEmailService = mock<IVerifyEmailService>();
  const responseFormatter = mock<IResponseFormatter>();

  const verifyReq = mock<TypedRequest<EmptyRecord, IParamTokenDto>>();
  const res = mock<Response>();

  const validResetToken = "valid_reset_token";

  beforeEach(() => {
    mockReset(verifyEmailService);
    mockReset(responseFormatter);

    // Create fresh mocks for the verifyEmailService methods
    verifyEmailService.verifyUserEmail.mockResolvedValue(undefined);

    controller = new VerifyEmailController(
      verifyEmailService,
      responseFormatter,
    );

    verifyReq.params = {
      token: validResetToken,
    };

    res.status.mockReturnThis();
    res.json.mockReturnThis();
  });

  describe("verifyEmail", () => {
    const formattedRes: IApiSuccessResponse<null> = {
      success: true,
      statusCode: httpStatus.OK,
      payload: {
        message: "Email verified successfully.",
        data: null,
      },
    };
    it("should verify the user email and return a success response", async () => {
      // Arrange
      responseFormatter.formatSuccessResponse.mockReturnValue(formattedRes);

      // Act
      await controller.verifyEmail(verifyReq, res);

      // Assert
      expect(verifyEmailService.verifyUserEmail).toHaveBeenCalledWith(
        validResetToken,
      );
      expect(res.status).toHaveBeenCalledWith(formattedRes.statusCode);
      expect(res.json).toHaveBeenCalledWith(formattedRes);
    });

    it("should propagate error if verifyUserEmail fails", async () => {
      // Arrange
      const error = new Error("Verification failed");
      verifyEmailService.verifyUserEmail.mockRejectedValueOnce(error);

      // Act & Assert
      await expect(controller.verifyEmail(verifyReq, res)).rejects.toThrow(
        error,
      );
    });
  });
});
