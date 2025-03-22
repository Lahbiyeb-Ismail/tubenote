import type { Response } from "express";
import httpStatus from "http-status";
import { mock, mockReset } from "jest-mock-extended";

import type { TypedRequest } from "@/modules/shared/types";

import type {
  IEmailBodyDto,
  IParamTokenDto,
  IPasswordBodyDto,
} from "@/modules/shared/dtos";

import {
  IResetPasswordService,
  ResetPasswordController,
} from "@/modules/auth/features";

describe("ResetPasswordController", () => {
  // Mock the reset password service
  const resetPasswordService = mock<IResetPasswordService>();

  const resetPasswordController = ResetPasswordController.getInstance({
    resetPasswordService,
  });

  const forgotReq = mock<TypedRequest<IEmailBodyDto>>();
  const resetReq = mock<TypedRequest<IPasswordBodyDto, IParamTokenDto>>();
  const verifyReq = mock<TypedRequest<{}, IParamTokenDto>>();

  const res = mock<Response>();

  const mockEmail = "user@test.com";
  const mockNewPassword = "newpassword";
  const mockResetToken = "reset-password-token";

  beforeEach(() => {
    mockReset(resetPasswordService);

    forgotReq.body = { email: mockEmail };
    resetReq.body = { password: mockNewPassword };
    resetReq.params = { token: mockResetToken };
    verifyReq.params = { token: mockResetToken };

    res.status.mockReturnThis();
    res.json.mockReturnThis();
  });

  describe("ResetPasswordController - forgotPassword", () => {
    it("should successfully send a forgot password email", async () => {
      resetPasswordService.sendResetToken.mockResolvedValue(undefined);

      // Act
      await resetPasswordController.forgotPassword(forgotReq, res);

      // Assert
      expect(resetPasswordService.sendResetToken).toHaveBeenCalledWith(
        mockEmail
      );

      expect(res.status).toHaveBeenCalledWith(httpStatus.OK);

      expect(res.json).toHaveBeenCalled();
    });

    it("should propagate sendResetToken service errors", async () => {
      const error = new Error("Something went wrong");

      resetPasswordService.sendResetToken.mockRejectedValue(error);

      // Act
      await expect(
        resetPasswordController.forgotPassword(forgotReq, res)
      ).rejects.toThrow(error);
    });
  });

  describe("ResetPasswordController - resetPassword", () => {
    it("should successfully reset password", async () => {
      resetPasswordService.resetPassword.mockResolvedValue(undefined);

      // Act
      await resetPasswordController.resetPassword(resetReq, res);

      // Assert
      expect(resetPasswordService.resetPassword).toHaveBeenCalledWith(
        resetReq.params.token,
        resetReq.body.password
      );

      expect(res.status).toHaveBeenCalledWith(httpStatus.OK);

      expect(res.json).toHaveBeenCalled();
    });

    it("should handle error if the resetPassword service method fails", async () => {
      const error = new Error("Something went wrong");

      resetPasswordService.resetPassword.mockRejectedValue(error);

      // Act
      await expect(
        resetPasswordController.resetPassword(resetReq, res)
      ).rejects.toThrow(error);
    });
  });

  describe("ResetPasswordController - verifyResetToken", () => {
    it("should successfully verify the provided reset token", async () => {
      resetPasswordService.verifyResetToken.mockResolvedValue(mockResetToken);

      // Act
      await resetPasswordController.verifyResetToken(verifyReq, res);

      // Assert
      expect(resetPasswordService.verifyResetToken).toHaveBeenCalledWith(
        verifyReq.params.token
      );

      expect(res.status).toHaveBeenCalledWith(httpStatus.OK);

      expect(res.json).toHaveBeenCalled();
    });

    it("should handle error if the verifyResetToken service method fails", async () => {
      const error = new Error("Something went wrong");

      resetPasswordService.verifyResetToken.mockRejectedValue(error);

      // Act
      await expect(
        resetPasswordController.verifyResetToken(verifyReq, res)
      ).rejects.toThrow(error);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
