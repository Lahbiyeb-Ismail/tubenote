import type { Response } from "express";
import httpStatus from "http-status";

import type { TypedRequest } from "@/types";

import {
  IResetPasswordController,
  IResetPasswordService,
  ResetPasswordController,
} from "@modules/auth";

import type {
  IEmailBodyDto,
  IParamTokenDto,
  IPasswordBodyDto,
} from "@/modules/shared";

describe("ResetPassowrdController", () => {
  let resetPasswordController: IResetPasswordController;
  let mockResponse: Partial<Response>;

  // Mock the refresh token service
  const mockResetPasswordService: jest.Mocked<IResetPasswordService> = {
    resetPassword: jest.fn(),
    sendResetToken: jest.fn(),
    verifyResetToken: jest.fn(),
  };

  const mockEmail = "user@test.com";
  const mockNewPassword = "newpassword";
  const mockResetToken = "reset-password-token";

  beforeEach(() => {
    // Create controller instance
    resetPasswordController = new ResetPasswordController(
      mockResetPasswordService
    );

    // Mock response object
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe("ResetPasswordController - forgotPassword", () => {
    const mockRequest = {
      body: {
        email: mockEmail,
      },
    } as TypedRequest<IEmailBodyDto>;

    it("should successfully send a forgot password email", async () => {
      mockResetPasswordService.sendResetToken.mockResolvedValue(undefined);

      // Act
      await resetPasswordController.forgotPassword(
        mockRequest as TypedRequest<IEmailBodyDto>,
        mockResponse as Response
      );

      // Assert
      expect(mockResetPasswordService.sendResetToken).toHaveBeenCalledWith(
        mockEmail
      );

      expect(mockResponse.status).toHaveBeenCalledWith(httpStatus.OK);

      expect(mockResponse.json).toHaveBeenCalled();
    });

    it("should propagate sendResetToken service errors", async () => {
      const error = new Error("Something went wrong");

      mockResetPasswordService.sendResetToken.mockRejectedValue(error);

      // Act
      await expect(
        resetPasswordController.forgotPassword(
          mockRequest as TypedRequest<IEmailBodyDto>,
          mockResponse as Response
        )
      ).rejects.toThrow(error);
    });
  });

  describe("ResetPasswordController - resetPassword", () => {
    const mockRequest = {
      body: {
        password: mockNewPassword,
      },
      params: {
        token: mockResetToken,
      },
    } as TypedRequest<IPasswordBodyDto, IParamTokenDto>;

    it("should successfully reset password", async () => {
      mockResetPasswordService.resetPassword.mockResolvedValue(undefined);

      // Act
      await resetPasswordController.resetPassword(
        mockRequest as TypedRequest<IPasswordBodyDto, IParamTokenDto>,
        mockResponse as Response
      );

      // Assert
      expect(mockResetPasswordService.resetPassword).toHaveBeenCalledWith(
        mockResetToken,
        mockNewPassword
      );

      expect(mockResponse.status).toHaveBeenCalledWith(httpStatus.OK);

      expect(mockResponse.json).toHaveBeenCalled();
    });

    it("should handle error if the resetPassword service method fails", async () => {
      const error = new Error("Something went wrong");

      mockResetPasswordService.resetPassword.mockRejectedValue(error);

      // Act
      await expect(
        resetPasswordController.resetPassword(
          mockRequest as TypedRequest<IPasswordBodyDto, IParamTokenDto>,
          mockResponse as Response
        )
      ).rejects.toThrow(error);
    });
  });

  describe("ResetPasswordController - verifyResetToken", () => {
    const mockRequest = {
      params: {
        token: mockResetToken,
      },
    } as TypedRequest<{}, IParamTokenDto>;

    it("should successfully verify the provided reset token", async () => {
      mockResetPasswordService.verifyResetToken.mockResolvedValue(
        mockResetToken
      );

      // Act
      await resetPasswordController.verifyResetToken(
        mockRequest as TypedRequest<{}, IParamTokenDto>,
        mockResponse as Response
      );

      // Assert
      expect(mockResetPasswordService.verifyResetToken).toHaveBeenCalledWith(
        mockResetToken
      );

      expect(mockResponse.status).toHaveBeenCalledWith(httpStatus.OK);

      expect(mockResponse.json).toHaveBeenCalled();
    });

    it("should handle error if the verifyResetToken service method fails", async () => {
      const error = new Error("Something went wrong");

      mockResetPasswordService.verifyResetToken.mockRejectedValue(error);

      // Act
      await expect(
        resetPasswordController.verifyResetToken(
          mockRequest as TypedRequest<{}, IParamTokenDto>,
          mockResponse as Response
        )
      ).rejects.toThrow(error);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
