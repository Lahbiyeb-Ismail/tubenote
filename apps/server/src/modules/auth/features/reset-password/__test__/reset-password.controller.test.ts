import type { Response } from "express";
import httpStatus from "http-status";
import { mock, mockReset } from "jest-mock-extended";

import type { IApiResponse } from "@tubenote/types";

import type {
  IEmailBodyDto,
  IParamTokenDto,
  IPasswordBodyDto,
} from "@tubenote/dtos";

import type {
  ILoggerService,
  IRateLimitService,
  IResponseFormatter,
} from "@/modules/shared/services";

import type { TypedRequest } from "@/modules/shared/types";

import { AUTH_RATE_LIMIT_CONFIG } from "@/modules/auth/config";
import {
  BadRequestError,
  UnauthorizedError,
} from "@/modules/shared/api-errors";
import { ResetPasswordController } from "../reset-password.controller";
import type {
  IResetPasswordControllerOptions,
  IResetPasswordService,
} from "../reset-password.types";

describe("ResetPasswordController", () => {
  let controller: ResetPasswordController;

  const resetPasswordService = mock<IResetPasswordService>();
  const responseFormatter = mock<IResponseFormatter>();
  const rateLimitService = mock<IRateLimitService>();
  const loggerService = mock<ILoggerService>();

  const controllerOptions: IResetPasswordControllerOptions = {
    resetPasswordService,
    responseFormatter,
    rateLimitService,
    loggerService,
  };

  const forgotReq = mock<TypedRequest<IEmailBodyDto>>();
  const resetReq = mock<TypedRequest<IPasswordBodyDto, IParamTokenDto>>();
  const verifyReq = mock<TypedRequest<{}, IParamTokenDto>>();

  const res = mock<Response>();

  beforeEach(() => {
    mockReset(resetPasswordService);
    mockReset(responseFormatter);
    mockReset(rateLimitService);
    mockReset(loggerService);

    resetPasswordService.sendResetToken.mockResolvedValue(undefined);
    resetPasswordService.resetPassword.mockResolvedValue(undefined);
    resetPasswordService.verifyResetToken.mockResolvedValue("user_id_001");

    // Set default response formatter behavior
    responseFormatter.formatResponse.mockImplementation(
      ({ responseOptions }) => ({
        success: true,
        status: responseOptions.status,
        message: responseOptions.message,
        data: responseOptions.data,
      })
    );

    // Reset the singleton instance for isolation.
    // @ts-ignore: resetting private static property for testing purposes.
    ResetPasswordController._instance = undefined;

    // Create the controller instance using the provided controllerOptions.
    controller = ResetPasswordController.getInstance(controllerOptions);

    forgotReq.body = { email: "test@example.com" };
    resetReq.body = { password: "newSecurePassword1!" };
    resetReq.params = { token: "reset_token_123" };
    verifyReq.params = { token: "reset_token_123" };

    res.status.mockReturnThis();
    res.json.mockReturnThis();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Singleton behavior", () => {
    it("should create a new instance if none exists", () => {
      const instance = ResetPasswordController.getInstance(controllerOptions);
      expect(instance).toBeInstanceOf(ResetPasswordController);
    });

    it("should return the same instance on subsequent calls", () => {
      const instance1 = ResetPasswordController.getInstance(controllerOptions);
      const instance2 = ResetPasswordController.getInstance(controllerOptions);
      expect(instance1).toBe(instance2);
    });
  });

  describe("forgotPassword", () => {
    const formattedForgotRes: IApiResponse<unknown> = {
      success: true,
      status: httpStatus.OK,
      message: "Password reset link sent to your email.",
    };

    // 2. Success Scenarios
    describe("Success Scenarios", () => {
      it("should successfully send a reset password token to a valid email", async () => {
        // Arrange
        responseFormatter.formatResponse.mockReturnValue(formattedForgotRes);

        // Act
        await controller.forgotPassword(forgotReq, res);

        // Assert
        expect(resetPasswordService.sendResetToken).toHaveBeenCalledWith(
          forgotReq.body.email
        );

        expect(responseFormatter.formatResponse).toHaveBeenCalledWith({
          responseOptions: {
            success: true,
            status: httpStatus.OK,
            message: "Password reset link sent to your email.",
          },
        });

        expect(rateLimitService.reset).toHaveBeenCalledWith(
          forgotReq.rateLimitKey
        );

        expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
        expect(res.json).toHaveBeenCalledWith(formattedForgotRes);
      });
    });

    // 2. Error Scenarios
    describe("Error Scenarios", () => {
      it("should propagate service errors during forgotPassword", async () => {
        // Arrange
        const serviceError = new Error("Service error");
        resetPasswordService.sendResetToken.mockRejectedValueOnce(serviceError);

        // Act & Assert
        await expect(controller.forgotPassword(forgotReq, res)).rejects.toThrow(
          serviceError
        );

        expect(resetPasswordService.sendResetToken).toHaveBeenCalledWith(
          forgotReq.body.email
        );
        expect(rateLimitService.increment).toHaveBeenCalledWith({
          key: forgotReq.rateLimitKey,
          ...AUTH_RATE_LIMIT_CONFIG.forgotPassword,
        });

        expect(loggerService.error).toHaveBeenCalledWith(
          "Error in forgotPassword",
          serviceError
        );
      });
    });

    // 3. Rate Limiting
    describe("Rate Limiting", () => {
      it("should reset rate limiter on successful forgotPassword", async () => {
        // Arrange
        resetPasswordService.sendResetToken.mockResolvedValue(undefined);

        // Act
        await controller.forgotPassword(forgotReq, res);

        // Assert
        expect(rateLimitService.reset).toHaveBeenCalledWith(
          forgotReq.rateLimitKey
        );
      });

      it("should increment rate limiter on failed forgotPassword", async () => {
        // Arrange
        resetPasswordService.sendResetToken.mockRejectedValue(
          new Error("Service error")
        );

        // Act & Assert
        await expect(
          controller.forgotPassword(forgotReq, res)
        ).rejects.toThrow();

        expect(rateLimitService.increment).toHaveBeenCalledWith({
          key: forgotReq.rateLimitKey,
          ...AUTH_RATE_LIMIT_CONFIG.forgotPassword,
        });
      });
    });
  });

  describe("resetPassword", () => {
    const formattedResetRes: IApiResponse<unknown> = {
      success: true,
      status: httpStatus.OK,
      message: "Password reset successfully.",
    };

    // 1. Success Scenarios
    describe("Success Scenarios", () => {
      it("should successfully reset password with valid token and password", async () => {
        // Arrange
        responseFormatter.formatResponse.mockReturnValue(formattedResetRes);

        // Act
        await controller.resetPassword(resetReq, res);

        // Assert
        expect(resetPasswordService.resetPassword).toHaveBeenCalledWith(
          resetReq.params.token,
          resetReq.body.password
        );

        expect(rateLimitService.reset).toHaveBeenCalledWith(
          resetReq.rateLimitKey
        );

        expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
        expect(res.json).toHaveBeenCalledWith(formattedResetRes);
      });
    });

    // 2. Error Scenarios
    describe("Error Scenarios", () => {
      it("should handle invalid token errors", async () => {
        // Arrange
        resetReq.params.token = "invalid-token";

        const tokenError = new UnauthorizedError(
          "Invalid or expired reset token"
        );
        resetPasswordService.resetPassword.mockRejectedValue(tokenError);

        // Act & Assert
        await expect(controller.resetPassword(resetReq, res)).rejects.toThrow(
          tokenError
        );

        expect(resetPasswordService.resetPassword).toHaveBeenCalledWith(
          resetReq.params.token,
          resetReq.body.password
        );
        expect(rateLimitService.increment).toHaveBeenCalledWith({
          key: resetReq.rateLimitKey,
          ...AUTH_RATE_LIMIT_CONFIG.resetPassword,
        });
        expect(loggerService.error).toHaveBeenCalled();
      });

      it("should handle expired token errors", async () => {
        // Arrange
        resetReq.params.token = "expired-token";

        const tokenError = new UnauthorizedError("Reset token has expired");
        resetPasswordService.resetPassword.mockRejectedValue(tokenError);

        // Act & Assert
        await expect(controller.resetPassword(resetReq, res)).rejects.toThrow(
          tokenError
        );
        expect(resetPasswordService.resetPassword).toHaveBeenCalledWith(
          resetReq.params.token,
          resetReq.body.password
        );
        expect(rateLimitService.increment).toHaveBeenCalled();
        expect(loggerService.error).toHaveBeenCalled();
      });

      it("should handle already used token errors", async () => {
        // Arrange
        resetReq.params.token = "already-used-token";

        const tokenError = new UnauthorizedError(
          "Reset token has already been used"
        );
        resetPasswordService.resetPassword.mockRejectedValue(tokenError);

        // Act & Assert
        await expect(controller.resetPassword(resetReq, res)).rejects.toThrow(
          tokenError
        );
        expect(resetPasswordService.resetPassword).toHaveBeenCalledWith(
          resetReq.params.token,
          resetReq.body.password
        );
        expect(rateLimitService.increment).toHaveBeenCalled();
        expect(loggerService.error).toHaveBeenCalled();
      });

      it("should handle weak password errors", async () => {
        // Arrange
        resetReq.body.password = "weak";

        const passwordError = new BadRequestError(
          "Password does not meet security requirements"
        );

        resetPasswordService.resetPassword.mockRejectedValue(passwordError);

        // Act & Assert
        await expect(controller.resetPassword(resetReq, res)).rejects.toThrow(
          passwordError
        );
        expect(resetPasswordService.resetPassword).toHaveBeenCalledWith(
          resetReq.params.token,
          resetReq.body.password
        );
        expect(rateLimitService.increment).toHaveBeenCalled();
        expect(loggerService.error).toHaveBeenCalled();
      });

      it("should handle database errors during password update", async () => {
        // Arrange
        const dbError = new Error("Database error during password update");
        resetPasswordService.resetPassword.mockRejectedValue(dbError);

        // Act & Assert
        await expect(controller.resetPassword(resetReq, res)).rejects.toThrow(
          dbError
        );
        expect(resetPasswordService.resetPassword).toHaveBeenCalledWith(
          resetReq.params.token,
          resetReq.body.password
        );
        expect(rateLimitService.increment).toHaveBeenCalled();
        expect(loggerService.error).toHaveBeenCalled();
      });
    });

    // 3. Rate Limiting
    describe("Rate Limiting", () => {
      it("should reset rate limiter on successful password reset", async () => {
        // Arrange
        resetPasswordService.resetPassword.mockResolvedValue(undefined);

        // Act
        await controller.resetPassword(resetReq, res);

        // Assert
        expect(rateLimitService.reset).toHaveBeenCalledWith(
          resetReq.rateLimitKey
        );
      });

      it("should increment rate limiter on failed password reset", async () => {
        // Arrange
        resetPasswordService.resetPassword.mockRejectedValue(
          new Error("Service error")
        );

        // Act & Assert
        await expect(controller.resetPassword(resetReq, res)).rejects.toThrow();

        expect(rateLimitService.increment).toHaveBeenCalledWith({
          key: resetReq.rateLimitKey,
          ...AUTH_RATE_LIMIT_CONFIG.resetPassword,
        });
      });
    });
  });

  describe("verifyResetToken", () => {
    const formattedVerifyRes: IApiResponse<unknown> = {
      success: true,
      status: httpStatus.OK,
      message: "Reset password token is valid.",
    };

    // 1. Success Scenarios
    describe("Success Scenarios", () => {
      it("should successfully verify a valid token", async () => {
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
    });

    // 2. Error Scenarios
    describe("Error Scenarios", () => {
      it("should propagate service errors during verifyResetToken", async () => {
        // Arrange
        const error = new Error("Token invalid");
        resetPasswordService.verifyResetToken.mockRejectedValueOnce(error);

        // Act & Assert
        await expect(
          controller.verifyResetToken(verifyReq, res)
        ).rejects.toThrow(error);
      });
    });
  });

  describe("ResetPasswordController Security Tests", () => {
    describe("Token Security", () => {
      it("should not expose token generation details in responses", async () => {
        // Arrange
        resetPasswordService.sendResetToken.mockResolvedValue(undefined);

        // Act
        await controller.forgotPassword(forgotReq, res);

        // Assert
        expect(responseFormatter.formatResponse).toHaveBeenCalledWith({
          responseOptions: {
            success: true,
            status: httpStatus.OK,
            message: "Password reset link sent to your email.",
          },
        });

        // Ensure token is not included in the response
        const formatResponseArgs =
          responseFormatter.formatResponse.mock.calls[0][0];
        expect(JSON.stringify(formatResponseArgs)).not.toContain(
          "secret-token"
        );
      });
    });

    describe("Password Security", () => {
      it("should not log or expose passwords", async () => {
        // Arrange
        resetPasswordService.resetPassword.mockResolvedValue(undefined);

        // Act
        await controller.resetPassword(resetReq, res);

        // Assert
        // Check that password is not logged
        expect(loggerService.info).not.toHaveBeenCalledWith(
          expect.stringContaining(resetReq.body.password)
        );
        expect(loggerService.debug).not.toHaveBeenCalledWith(
          expect.stringContaining(resetReq.body.password)
        );

        // Check that password is not included in the response
        const formatResponseArgs =
          responseFormatter.formatResponse.mock.calls[0][0];
        expect(JSON.stringify(formatResponseArgs)).not.toContain(
          resetReq.body.password
        );
      });
    });

    describe("Brute Force Protection", () => {
      it("should implement rate limiting for forgotPassword", async () => {
        // First call succeeds
        resetPasswordService.sendResetToken.mockResolvedValue(undefined);
        await controller.forgotPassword(forgotReq, res);
        expect(rateLimitService.reset).toHaveBeenCalledWith(
          forgotReq.rateLimitKey
        );

        // Reset mocks
        jest.clearAllMocks();

        // Second call fails
        resetPasswordService.sendResetToken.mockRejectedValue(
          new Error("Service error")
        );
        await expect(controller.forgotPassword(forgotReq, res)).rejects.toThrow(
          "Service error"
        );

        expect(rateLimitService.increment).toHaveBeenCalledWith({
          key: forgotReq.rateLimitKey,
          ...AUTH_RATE_LIMIT_CONFIG.forgotPassword,
        });
      });

      it("should implement rate limiting for resetPassword", async () => {
        // First call succeeds
        resetPasswordService.resetPassword.mockResolvedValue(undefined);
        await controller.resetPassword(resetReq, res);
        expect(rateLimitService.reset).toHaveBeenCalledWith(
          resetReq.rateLimitKey
        );

        // Reset mocks
        jest.clearAllMocks();

        // Second call fails
        resetPasswordService.resetPassword.mockRejectedValue(
          new Error("Service error")
        );
        await expect(controller.resetPassword(resetReq, res)).rejects.toThrow(
          "Service error"
        );
        expect(rateLimitService.increment).toHaveBeenCalledWith({
          key: resetReq.rateLimitKey,
          ...AUTH_RATE_LIMIT_CONFIG.resetPassword,
        });
      });
    });
  });
});
