import type { EmailBodyDto } from "@/common/dtos/email-body.dto";
import type { TokenParamDto } from "@/common/dtos/token-param.dto";
import type { TypedRequest } from "@/types";
import type { Response } from "express";
import httpStatus from "http-status";
import type { PasswordBodyDto } from "../dtos/password-body.dto";
import { ResetPasswordController } from "../reset-password.controller";
import type { ResetPasswordToken } from "../reset-password.model";
import type {
  IResetPasswordController,
  IResetPasswordService,
} from "../reset-password.types";

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
  const mockResetTokenValue = "reset-password-token";
  const mockUserId = "user_id_001";

  const mockResetToken: ResetPasswordToken = {
    id: "token_id_001",
    token: mockResetTokenValue,
    userId: mockUserId,
    createdAt: new Date(Date.now()),
    expiresAt: new Date(Date.now() + 36000),
  };

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
    } as TypedRequest<EmailBodyDto>;

    it("should successfully send a forgot password email", async () => {
      mockResetPasswordService.sendResetToken.mockResolvedValue(undefined);

      // Act
      await resetPasswordController.forgotPassword(
        mockRequest as TypedRequest<EmailBodyDto>,
        mockResponse as Response
      );

      // Assert
      expect(mockResetPasswordService.sendResetToken).toHaveBeenCalledWith(
        mockEmail
      );

      expect(mockResponse.status).toHaveBeenCalledWith(httpStatus.OK);

      expect(mockResponse.json).toHaveBeenCalled();
    });

    it("should handle error if the sendResetToken service method fails", async () => {
      const error = new Error("Something went wrong");

      mockResetPasswordService.sendResetToken.mockRejectedValue(error);

      // Act
      await expect(
        resetPasswordController.forgotPassword(
          mockRequest as TypedRequest<EmailBodyDto>,
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
        token: mockResetTokenValue,
      },
    } as TypedRequest<PasswordBodyDto, TokenParamDto>;

    it("should successfully reset password", async () => {
      mockResetPasswordService.resetPassword.mockResolvedValue(undefined);

      // Act
      await resetPasswordController.resetPassword(
        mockRequest as TypedRequest<PasswordBodyDto, TokenParamDto>,
        mockResponse as Response
      );

      // Assert
      expect(mockResetPasswordService.resetPassword).toHaveBeenCalledWith(
        mockResetTokenValue,
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
          mockRequest as TypedRequest<PasswordBodyDto, TokenParamDto>,
          mockResponse as Response
        )
      ).rejects.toThrow(error);
    });
  });

  describe("ResetPasswordController - verifyResetToken", () => {
    const mockRequest = {
      params: {
        token: mockResetTokenValue,
      },
    } as TypedRequest<{}, TokenParamDto>;

    it("should successfully verify the provided reset token", async () => {
      mockResetPasswordService.verifyResetToken.mockResolvedValue(
        mockResetToken
      );

      // Act
      await resetPasswordController.verifyResetToken(
        mockRequest as TypedRequest<{}, TokenParamDto>,
        mockResponse as Response
      );

      // Assert
      expect(mockResetPasswordService.verifyResetToken).toHaveBeenCalledWith(
        mockResetTokenValue
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
          mockRequest as TypedRequest<{}, TokenParamDto>,
          mockResponse as Response
        )
      ).rejects.toThrow(error);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
