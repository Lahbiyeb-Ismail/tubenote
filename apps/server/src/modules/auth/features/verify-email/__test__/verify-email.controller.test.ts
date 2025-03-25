import type { Response } from "express";
import httpStatus from "http-status";
import { mock, mockReset } from "jest-mock-extended";

import { VerifyEmailController } from "../verify-email.controller";
import type {
  IVerifyEmailControllerOptions,
  IVerifyEmailService,
} from "../verify-email.types";

import type { IParamTokenDto } from "@/modules/shared/dtos";
import type { EmptyRecord, TypedRequest } from "@/modules/shared/types";

describe("VerifyEmailController", () => {
  let controller: VerifyEmailController;

  const verifyEmailService = mock<IVerifyEmailService>();

  const verifyReq = mock<TypedRequest<EmptyRecord, IParamTokenDto>>();
  const res = mock<Response>();

  const controllerOptions: IVerifyEmailControllerOptions = {
    verifyEmailService,
  };

  const validResetToken = "valid_reset_token";

  beforeEach(() => {
    mockReset(verifyEmailService);

    // Create fresh mocks for the verifyEmailService methods
    verifyEmailService.verifyUserEmail.mockResolvedValue(undefined);

    // Reset singleton instance for isolation.
    // @ts-ignore: resetting private static property for testing purposes.
    VerifyEmailController._instance = undefined;

    controller = VerifyEmailController.getInstance(controllerOptions);

    verifyReq.params = {
      token: validResetToken,
    };

    res.status.mockReturnThis();
    res.json.mockReturnThis();
  });

  describe("Singleton Instance", () => {
    it("should create a new instance if none exists", () => {
      const instance = VerifyEmailController.getInstance(controllerOptions);
      expect(instance).toBeInstanceOf(VerifyEmailController);
    });

    it("should return the same instance on subsequent calls", () => {
      const instance1 = VerifyEmailController.getInstance(controllerOptions);
      const instance2 = VerifyEmailController.getInstance(controllerOptions);
      expect(instance1).toBe(instance2);
    });
  });

  describe("verifyEmail", () => {
    it("should verify the user email and return a success response", async () => {
      // Act
      await controller.verifyEmail(verifyReq, res);

      // Assert
      expect(verifyEmailService.verifyUserEmail).toHaveBeenCalledWith(
        validResetToken
      );
      expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        message: "Email verified successfully.",
      });
    });

    it("should propagate error if verifyUserEmail fails", async () => {
      // Arrange
      const error = new Error("Verification failed");
      verifyEmailService.verifyUserEmail.mockRejectedValueOnce(error);

      // Act & Assert
      await expect(controller.verifyEmail(verifyReq, res)).rejects.toThrow(
        error
      );
    });
  });
});
