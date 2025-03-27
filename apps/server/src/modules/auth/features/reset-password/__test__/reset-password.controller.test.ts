import type { Response } from "express";
import httpStatus from "http-status";
import { mock, mockReset } from "jest-mock-extended";

import type {
  IEmailBodyDto,
  IParamTokenDto,
  IPasswordBodyDto,
} from "@/modules/shared/dtos";
import type {
  ApiResponse,
  IResponseFormatter,
} from "@/modules/shared/services";
import type { TypedRequest } from "@/modules/shared/types";

import { ResetPasswordController } from "../reset-password.controller";
import type {
  IResetPasswordControllerOptions,
  IResetPasswordService,
} from "../reset-password.types";

describe("ResetPasswordController", () => {
  let controller: ResetPasswordController;
  const resetPasswordService = mock<IResetPasswordService>();
  const responseFormatter = mock<IResponseFormatter>();

  const options: IResetPasswordControllerOptions = {
    resetPasswordService,
    responseFormatter,
  };

  const forgotReq = mock<TypedRequest<IEmailBodyDto>>();
  const resetReq = mock<TypedRequest<IPasswordBodyDto, IParamTokenDto>>();
  const verifyReq = mock<TypedRequest<{}, IParamTokenDto>>();

  const res = mock<Response>();

  beforeEach(() => {
    mockReset(resetPasswordService);
    mockReset(responseFormatter);

    resetPasswordService.sendResetToken.mockResolvedValue(undefined);
    resetPasswordService.resetPassword.mockResolvedValue(undefined);
    resetPasswordService.verifyResetToken.mockResolvedValue("user_id_001");

    // Reset the singleton instance for isolation.
    // @ts-ignore: resetting private static property for testing purposes.
    ResetPasswordController._instance = undefined;

    // Create the controller instance using the provided options.
    controller = ResetPasswordController.getInstance(options);

    forgotReq.body = { email: "test@example.com" };
    resetReq.body = { password: "newSecurePassword1!" };
    resetReq.params = { token: "reset_token_123" };
    verifyReq.params = { token: "reset_token_123" };

    res.status.mockReturnThis();
    res.json.mockReturnThis();
  });

  describe("Singleton behavior", () => {
    it("should create a new instance if none exists", () => {
      const instance = ResetPasswordController.getInstance(options);
      expect(instance).toBeInstanceOf(ResetPasswordController);
    });

    it("should return the same instance on subsequent calls", () => {
      const instance1 = ResetPasswordController.getInstance(options);
      const instance2 = ResetPasswordController.getInstance(options);
      expect(instance1).toBe(instance2);
    });
  });

  describe("forgotPassword", () => {
    const formattedForgotRes: ApiResponse<unknown> = {
      success: true,
      status: httpStatus.OK,
      message: "Password reset link sent to your email.",
    };

    it("should call sendResetToken with the provided email and respond with a success message", async () => {
      // Arrange
      responseFormatter.formatResponse.mockReturnValue(formattedForgotRes);

      // Act
      await controller.forgotPassword(forgotReq, res);

      // Assert
      expect(resetPasswordService.sendResetToken).toHaveBeenCalledWith(
        forgotReq.body.email
      );

      expect(res.status).toHaveBeenCalledWith(httpStatus.OK);

      expect(res.json).toHaveBeenCalledWith(formattedForgotRes);
    });

    it("should propagate errors if sendResetToken fails", async () => {
      // Arrange
      const error = new Error("Service error");
      resetPasswordService.sendResetToken.mockRejectedValueOnce(error);

      // Act & Assert
      await expect(controller.forgotPassword(forgotReq, res)).rejects.toThrow(
        error
      );
    });
  });

  describe("resetPassword", () => {
    const formattedResetRes: ApiResponse<unknown> = {
      success: true,
      status: httpStatus.OK,
      message: "Password reset successfully.",
    };

    it("should call resetPassword with the provided token and new password, then respond with a success message", async () => {
      // Arrange
      responseFormatter.formatResponse.mockReturnValue(formattedResetRes);

      // Act
      await controller.resetPassword(resetReq, res);

      // Assert
      expect(resetPasswordService.resetPassword).toHaveBeenCalledWith(
        resetReq.params.token,
        resetReq.body.password
      );
      expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
      expect(res.json).toHaveBeenCalledWith(formattedResetRes);
    });

    it("should propagate errors if resetPassword fails", async () => {
      const error = new Error("Reset failed");
      resetPasswordService.resetPassword.mockRejectedValueOnce(error);

      // Act & Assert
      await expect(controller.resetPassword(resetReq, res)).rejects.toThrow(
        error
      );
    });
  });

  describe("verifyResetToken", () => {
    const formattedVerifyRes: ApiResponse<unknown> = {
      success: true,
      status: httpStatus.OK,
      message: "Reset password token is valid.",
    };

    it("should call verifyResetToken with the provided token and respond with a verification message", async () => {
      // Arrange
      responseFormatter.formatResponse.mockReturnValue(formattedVerifyRes);

      // Act
      await controller.verifyResetToken(verifyReq, res);

      // Assert
      expect(resetPasswordService.verifyResetToken).toHaveBeenCalledWith(
        verifyReq.params.token
      );
      expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
      expect(res.json).toHaveBeenCalledWith(formattedVerifyRes);
    });

    it("should propagate errors if verifyResetToken fails", async () => {
      // Arrange
      const error = new Error("Token invalid");
      resetPasswordService.verifyResetToken.mockRejectedValueOnce(error);

      // Act & Assert
      await expect(controller.verifyResetToken(verifyReq, res)).rejects.toThrow(
        error
      );
    });
  });
});
