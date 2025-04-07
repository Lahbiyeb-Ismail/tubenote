import httpStatus from "http-status";
import request from "supertest";

import app from "@/app";

import { ERROR_MESSAGES } from "@/modules/shared/constants";

import type { IEmailBodyDto } from "@/modules/shared/dtos";

import { UnauthorizedError } from "@/modules/shared/api-errors";
import { resetPasswordController } from "../reset-password.module";
// import { BadRequestError } from "@/modules/shared/api-errors";

jest.mock("../reset-password.module", () => ({
  resetPasswordController: {
    forgotPassword: jest.fn(),
    resetPassword: jest.fn(),
    verifyResetToken: jest.fn(),
  },
}));

describe("Reset password Routes", () => {
  const mockEmail = "user@test.com";

  const mockValidEmailBody: IEmailBodyDto = {
    email: mockEmail,
  };

  const mockInValidEmailBody: IEmailBodyDto = {
    email: "invalidemail.com",
  };

  const mockValidToken = "valid-token";
  const mockInvalidToken = "invalid-token";

  const mockErrorResponse = {
    statusCode: httpStatus.BAD_REQUEST,
    name: "BAD_REQUEST",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/v1/auth/forgot-password", () => {
    it("should return 200 status code and send a reset link for a valid email", async () => {
      // Arrange
      const message = "Password reset link sent to your email.";

      (resetPasswordController.forgotPassword as jest.Mock).mockImplementation(
        (_req, res) => {
          res.status(httpStatus.OK).json({ message });
        }
      );

      const response = await request(app)
        .post("/api/v1/auth/forgot-password")
        .send(mockValidEmailBody)
        .expect("Content-Type", /json/);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body.message).toBe(message);
    });

    it("should return 400 status code and throw a BadRequest Error for and invalid email format", async () => {
      // Act & Assert
      const response = await request(app)
        .post("/api/v1/auth/forgot-password")
        .send(mockInValidEmailBody)
        .expect("Content-Type", /json/);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);

      expect(response.body.error.message).toContain("Invalid email format");

      expect(response.body.error.statusCode).toBe(httpStatus.BAD_REQUEST);

      expect(response.body.error.name).toBe("BAD_REQUEST");
    });

    it("should return 400 status code and throw a BadRequest Error for a missing email field", async () => {
      // Act & Assert
      const response = await request(app)
        .post("/api/v1/auth/forgot-password")
        .expect("Content-Type", /json/);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);

      expect(response.body.error.message).toBe(
        "Validation error in email field: Required"
      );

      expect(response.body.error.statusCode).toBe(httpStatus.BAD_REQUEST);

      expect(response.body.error.name).toBe("BAD_REQUEST");
    });

    it("should return 400 status code and throw a BadRequest Error for an empty email field", async () => {
      // Act & Assert
      const response = await request(app)
        .post("/api/v1/auth/forgot-password")
        .send({ email: "" })
        .expect("Content-Type", /json/);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);

      expect(response.body.error.message).toContain("Invalid email format");

      expect(response.body.error.statusCode).toBe(httpStatus.BAD_REQUEST);

      expect(response.body.error.name).toBe("BAD_REQUEST");
    });
  });

  describe("GET /api/v1/auth/reset-password/:token/verify", () => {
    const validResetToken = "valid-token";
    const invalidResetToken = "invalid-token";

    it("should return a 200 status code for a valid token", async () => {
      const message = "Reset token verified.";

      (
        resetPasswordController.verifyResetToken as jest.Mock
      ).mockImplementation((_req, res) => {
        res.status(httpStatus.OK).json({ message });
      });

      const response = await request(app).get(
        `/api/v1/auth/reset-password/${validResetToken}/verify`
      );

      expect(response.status).toBe(httpStatus.OK);

      expect(response.body.message).toBe(message);
    });

    it("should return a 400 status code for an invalid or expired token", async () => {
      (
        resetPasswordController.verifyResetToken as jest.Mock
      ).mockImplementation((_req, res) => {
        res.status(httpStatus.BAD_REQUEST).json({
          error: {
            ...mockErrorResponse,
            message: ERROR_MESSAGES.INVALID_TOKEN,
          },
        });
      });

      const response = await request(app).get(
        `/api/v1/auth/reset-password/${invalidResetToken}/verify`
      );

      expect(response.status).toBe(httpStatus.BAD_REQUEST);

      expect(response.body.error.message).toBe(ERROR_MESSAGES.INVALID_TOKEN);
    });

    it("should return 404 for empty token in verify endpoint", async () => {
      const response = await request(app).get(
        "/api/v1/auth/reset-password//verify"
      );
      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });
  });

  describe("POST /api/v1/auth/reset-password/:token", () => {
    it("should return a 200 status code for a valid token and password", async () => {
      const message = "Password reset successfully";

      (resetPasswordController.resetPassword as jest.Mock).mockImplementation(
        (_req, res) => {
          res.status(httpStatus.OK).json({ message });
        }
      );
      const response = await request(app)
        .post(`/api/v1/auth/reset-password/${mockValidToken}`)
        .send({ password: "newPassword123!" });

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body.message).toBe(message);
    });

    it("should return a 400 status code for an invalid or expired token", async () => {
      (resetPasswordController.resetPassword as jest.Mock).mockImplementation(
        (_req, res) => {
          res.status(httpStatus.BAD_REQUEST).json({
            error: {
              ...mockErrorResponse,
              message: ERROR_MESSAGES.INVALID_TOKEN,
            },
          });
        }
      );

      const response = await request(app)
        .post(`/api/v1/auth/reset-password/${mockInvalidToken}`)
        .send({ password: "newPassword123!" });

      expect(response.status).toBe(httpStatus.BAD_REQUEST);

      expect(response.body.error.message).toBe(ERROR_MESSAGES.INVALID_TOKEN);
    });

    it("should throw a BadRequest validation error if the password is to short", async () => {
      const response = await request(app)
        .post(`/api/v1/auth/reset-password/${mockValidToken}`)
        .send({ password: "weak" });

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
      expect(response.body.error.name).toBe("BAD_REQUEST");
    });

    it("should throw a BadRequest validation error for a missing password field", async () => {
      const response = await request(app)
        .post(`/api/v1/auth/reset-password/${mockValidToken}`)
        .send({});

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
      expect(response.body.error.name).toBe("BAD_REQUEST");
    });

    it("should throw a BadRequest validation error for an empty password field", async () => {
      const response = await request(app)
        .post(`/api/v1/auth/reset-password/${mockValidToken}`)
        .send({ password: "" });

      expect(response.status).toBe(httpStatus.BAD_REQUEST);

      expect(response.body.error.name).toBe("BAD_REQUEST");
    });

    it("should throw a BadRequest validation error for passwords without special characters (numbers/symbols)", async () => {
      const response = await request(app)
        .post(`/api/v1/auth/reset-password/${mockValidToken}`)
        .send({ password: "WeakPassword" }); // No numbers/symbols

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should return a 404 status code for a missing token", async () => {
      const response = await request(app)
        .post("/api/v1/auth/reset-password/")
        .send({ password: "newPassword123!" });

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("should return 400 for malformed token (e.g., spaces)", async () => {
      const response = await request(app)
        .post("/api/v1/auth/reset-password/%20%20%20") // URL-encoded spaces
        .send({ password: "newPassword123!" });
      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });
  });

  // describe("Brute Force Protection", () => {
  //   it("should implement rate limiting for forgot password endpoint", async () => {
  //     // // Arrange
  //     (createRateLimitMiddleware as jest.Mock).mockImplementationOnce(() => {
  //       let requestCount = 0;
  //       return (_req: Request, res: Response, next: NextFunction) => {
  //         requestCount++;
  //         if (requestCount > 5) {
  //           res.status(429).json({ error: "Rate limit exceeded" });
  //           return;
  //         }
  //         next();
  //       };
  //     });

  //     // Mock controller to simulate successful response
  //     (resetPasswordController.forgotPassword as jest.Mock).mockImplementation(
  //       (_req, res) => {
  //         res
  //           .status(200)
  //           .json({ message: "Password reset link sent to your email." });
  //       }
  //     );

  //     // Act & Assert
  //     // Make 6 requests, the 6th should be rate limited
  //     for (let i = 0; i < 5; i++) {
  //       const response = await request(app)
  //         .post("/api/v1/auth/forgot-password")
  //         .send({ email: "test@example.com" });

  //       expect(response.status).toBe(200);
  //     }

  //     // The 6th request should be rate limited
  //     const response = await request(app)
  //       .post("/api/v1/auth/forgot-password")
  //       .send({ email: "test@example.com" });

  //     expect(response.status).toBe(429);
  //     expect(response.body.error).toBe("Rate limit exceeded");
  //   });

  //   it("should implement rate limiting for reset password endpoint", async () => {
  //     // Arrange
  //     // (
  //     //   middlewares.createRateLimitMiddleware as jest.Mock
  //     // ).mockImplementationOnce(() => {
  //     //   let requestCount = 0;
  //     //   return (
  //     //     _req: express.Request,
  //     //     res: express.Response,
  //     //     next: express.NextFunction
  //     //   ) => {
  //     //     requestCount++;
  //     //     if (requestCount > 5) {
  //     //       res.status(429).json({ error: "Rate limit exceeded" });
  //     //       return;
  //     //     }
  //     //     next();
  //     //   };
  //     // });

  //     // Mock controller to simulate successful response
  //     (resetPasswordController.resetPassword as jest.Mock).mockImplementation(
  //       (_req, res) => {
  //         res.status(200).json({ message: "Password reset successfully." });
  //       }
  //     );

  //     // Act & Assert
  //     // Make 6 requests, the 6th should be rate limited
  //     for (let i = 0; i < 5; i++) {
  //       const response = await request(app)
  //         .post("/api/v1/auth/reset-password/valid-token-123")
  //         .send({ password: "NewPassword123!" });

  //       expect(response.status).toBe(200);
  //     }

  //     // The 6th request should be rate limited
  //     const response = await request(app)
  //       .post("/api/v1/auth/reset-password/valid-token-123")
  //       .send({ password: "NewPassword123!" });

  //     expect(response.status).toBe(429);
  //     expect(response.body.error).toBe("Rate limit exceeded");
  //   });
  // });

  describe("Input Validation Security", () => {
    it("should reject overly long emails", async () => {
      // Arrange
      const longEmail = `${"a".repeat(1000)}@${"b".repeat(1000)}.com`;

      // Act
      const response = await request(app)
        .post("/api/v1/auth/forgot-password")
        .send({ email: longEmail });

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.error.message).toContain(
        "Email must be at most 255 characters long."
      );
      expect(resetPasswordController.forgotPassword).not.toHaveBeenCalled();
    });

    it("should reject overly long passwords", async () => {
      // Arrange
      const longPassword = "A".repeat(10000);

      // Act
      const response = await request(app)
        .post("/api/v1/auth/reset-password/valid-token-123")
        .send({ password: longPassword });

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.error.message).toContain(
        "Password must be at most 128 characters."
      );
      expect(resetPasswordController.resetPassword).not.toHaveBeenCalled();
    });

    it("should reject overly long tokens", async () => {
      // Arrange
      const longToken = "a".repeat(10000);

      // Act
      const response = await request(app).get(
        `/api/v1/auth/reset-password/${longToken}/verify`
      );

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.error.message).toContain(
        "The provided token is invalid."
      );
      expect(resetPasswordController.verifyResetToken).not.toHaveBeenCalled();
    });
  });

  describe("Token Security", () => {
    it("should not expose token generation details in responses", async () => {
      // Arrange
      (resetPasswordController.forgotPassword as jest.Mock).mockImplementation(
        (_req, res) => {
          // The controller should not include the token in the response
          res.status(200).json({
            message: "Password reset link sent to your email.",
            // No token should be included here
          });
        }
      );

      // Act
      const response = await request(app)
        .post("/api/v1/auth/forgot-password")
        .send({ email: "test@example.com" });

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.message).toBe(
        "Password reset link sent to your email."
      );
      // Ensure no token is in the response
      expect(response.body).not.toHaveProperty("token");
      expect(JSON.stringify(response.body)).not.toContain("token");
    });
  });

  describe("SQL Injection Prevention", () => {
    it("should handle SQL injection attempts in email field", async () => {
      // Arrange
      const sqlInjectionPayloads = [
        "' OR 1=1 --",
        "admin@example.com'; DROP TABLE users; --",
        "admin@example.com' UNION SELECT * FROM users --",
      ];

      // Act & Assert
      for (const payload of sqlInjectionPayloads) {
        const response = await request(app)
          .post("/api/v1/auth/forgot-password")
          .send({ email: payload });

        expect(response.status).toBe(400);
        expect(response.body.error.message).toContain("Invalid email format");
        expect(resetPasswordController.forgotPassword).not.toHaveBeenCalled();
      }
    });

    it("should handle SQL injection attempts in token parameter", async () => {
      // Arrange
      const sqlInjectionPayloads = [
        "' OR 1=1 --",
        "valid-token'; DROP TABLE users; --",
        "valid-token' UNION SELECT * FROM users --",
      ];

      // Act & Assert
      for (const payload of sqlInjectionPayloads) {
        const response = await request(app).get(
          `/api/v1/auth/reset-password/${payload}/verify`
        );

        expect(response.status).toBe(400);
        expect(response.body.error.message).toContain("Invalid token format.");
        expect(resetPasswordController.verifyResetToken).not.toHaveBeenCalled();
      }
    });
  });

  describe("NoSQL Injection Prevention", () => {
    it("should handle NoSQL injection attempts in password field", async () => {
      // Arrange
      const nosqlInjectionPayloads = [
        { password: { $gt: "" } },
        { password: { $ne: null } },
      ];

      // Act & Assert
      for (const payload of nosqlInjectionPayloads) {
        const response = await request(app)
          .post("/api/v1/auth/reset-password/valid-token-123")
          .send({ password: payload });

        expect(response.status).toBe(400);
        expect(response.body.error.message).toContain(
          "Validation error in password field"
        );
        expect(resetPasswordController.resetPassword).not.toHaveBeenCalled();
      }
    });

    it("should handle NoSQL injection attempts in email field", async () => {
      // Arrange
      const nosqlInjectionPayloads = [
        { email: { $ne: null } },
        { email: { $gt: "" } },
      ];
      // Act & Assert
      for (const payload of nosqlInjectionPayloads) {
        const response = await request(app)
          .post("/api/v1/auth/forgot-password")
          .send({ email: payload });

        expect(response.status).toBe(400);
        expect(response.body.error.message).toContain(
          "Validation error in email field"
        );
        expect(resetPasswordController.forgotPassword).not.toHaveBeenCalled();
      }
    });

    it("should handle NoSQL injection attempts in request params", async () => {
      // Arrange
      const nosqlInjectionPayloads = [
        { token: { $ne: null } },
        { token: { $gt: "" } },
      ];

      // Act & Assert
      for (const payload of nosqlInjectionPayloads) {
        const response = await request(app).get(
          `/api/v1/auth/reset-password/${payload.token}/verify`
        );

        expect(response.status).toBe(400);
        expect(response.body.error.message).toContain("Invalid token format.");
        expect(resetPasswordController.verifyResetToken).not.toHaveBeenCalled();
      }
    });
  });

  describe("Complete Password Reset Flow", () => {
    it("should handle the entire password reset flow successfully", async () => {
      // Step 1: Request password reset
      (resetPasswordController.forgotPassword as jest.Mock).mockImplementation(
        (_req, res) => {
          res.status(httpStatus.OK).json({
            message: "Password reset link sent to your email.",
          });
        }
      );

      const forgotPasswordResponse = await request(app)
        .post("/api/v1/auth/forgot-password")
        .send({ email: "test@example.com" });

      expect(forgotPasswordResponse.status).toBe(httpStatus.OK);
      expect(forgotPasswordResponse.body.message).toBe(
        "Password reset link sent to your email."
      );
      expect(resetPasswordController.forgotPassword).toHaveBeenCalled();

      // Step 2: Verify token
      (
        resetPasswordController.verifyResetToken as jest.Mock
      ).mockImplementation((_req, res) => {
        res.status(httpStatus.OK).json({
          message: "Reset password token is valid.",
        });
      });

      const verifyTokenResponse = await request(app).get(
        "/api/v1/auth/reset-password/valid-token-123/verify"
      );

      expect(verifyTokenResponse.status).toBe(httpStatus.OK);
      expect(verifyTokenResponse.body.message).toBe(
        "Reset password token is valid."
      );
      expect(resetPasswordController.verifyResetToken).toHaveBeenCalled();

      // Step 3: Reset password
      (resetPasswordController.resetPassword as jest.Mock).mockImplementation(
        (_req, res) => {
          res.status(httpStatus.OK).json({
            message: "Password reset successfully.",
          });
        }
      );

      const resetPasswordResponse = await request(app)
        .post("/api/v1/auth/reset-password/valid-token-123")
        .send({ password: "NewPassword123!" });

      expect(resetPasswordResponse.status).toBe(httpStatus.OK);
      expect(resetPasswordResponse.body.message).toBe(
        "Password reset successfully."
      );
      expect(resetPasswordController.resetPassword).toHaveBeenCalled();
    });

    it("should handle a failed password reset flow with invalid token", async () => {
      // Step 1: Request password reset
      (resetPasswordController.forgotPassword as jest.Mock).mockImplementation(
        (_req, res) => {
          res.status(httpStatus.OK).json({
            message: "Password reset link sent to your email.",
          });
        }
      );

      const forgotPasswordResponse = await request(app)
        .post("/api/v1/auth/forgot-password")
        .send({ email: "test@example.com" });

      expect(forgotPasswordResponse.status).toBe(httpStatus.OK);

      // Step 2: Verify token (fails)
      (resetPasswordController.verifyResetToken as jest.Mock).mockRejectedValue(
        new UnauthorizedError("Invalid reset token")
      );

      const verifyTokenResponse = await request(app).get(
        "/api/v1/auth/reset-password/invalid-token/verify"
      );

      expect(verifyTokenResponse.status).toBe(httpStatus.UNAUTHORIZED);
      expect(verifyTokenResponse.body.error).toHaveProperty(
        "message",
        "Invalid reset token"
      );

      // Step 3: Attempt to reset password (should also fail)
      (resetPasswordController.resetPassword as jest.Mock).mockRejectedValue(
        new UnauthorizedError("Invalid reset token")
      );

      const resetPasswordResponse = await request(app)
        .post("/api/v1/auth/reset-password/invalid-token")
        .send({ password: "NewPassword123!" });

      expect(resetPasswordResponse.status).toBe(httpStatus.UNAUTHORIZED);
      expect(resetPasswordResponse.body.error).toHaveProperty(
        "message",
        "Invalid reset token"
      );
    });

    it("should handle a failed password reset flow with expired token", async () => {
      // Step 1: Request password reset
      (resetPasswordController.forgotPassword as jest.Mock).mockImplementation(
        (_req, res) => {
          res.status(httpStatus.OK).json({
            message: "Password reset link sent to your email.",
          });
        }
      );

      const forgotPasswordResponse = await request(app)
        .post("/api/v1/auth/forgot-password")
        .send({ email: "test@example.com" });

      expect(forgotPasswordResponse.status).toBe(httpStatus.OK);

      // Step 2: Verify token (fails due to expiration)
      (resetPasswordController.verifyResetToken as jest.Mock).mockRejectedValue(
        new UnauthorizedError("Reset token has expired")
      );

      const verifyTokenResponse = await request(app).get(
        "/api/v1/auth/reset-password/expired-token/verify"
      );

      expect(verifyTokenResponse.status).toBe(httpStatus.UNAUTHORIZED);
      expect(verifyTokenResponse.body.error).toHaveProperty(
        "message",
        "Reset token has expired"
      );

      // Step 3: Attempt to reset password (should also fail)
      (resetPasswordController.resetPassword as jest.Mock).mockRejectedValue(
        new UnauthorizedError("Reset token has expired")
      );

      const resetPasswordResponse = await request(app)
        .post("/api/v1/auth/reset-password/expired-token")
        .send({ password: "NewPassword123!" });

      expect(resetPasswordResponse.status).toBe(httpStatus.UNAUTHORIZED);
      expect(resetPasswordResponse.body.error).toHaveProperty(
        "message",
        "Reset token has expired"
      );
    });
  });

  describe("Security Considerations", () => {
    beforeEach(() => {
      jest.clearAllMocks();

      (resetPasswordController.forgotPassword as jest.Mock).mockImplementation(
        (_req, res) => {
          res.status(httpStatus.OK).json({
            message: "Password reset link sent to your email.",
          });
        }
      );
    });

    it("should not reveal if an email exists in the system", async () => {
      // Act - Test with existing email
      const existingResponse = await request(app)
        .post("/api/v1/auth/forgot-password")
        .send({ email: "existing@example.com" });

      // Act - Test with non-existing email
      const nonExistingResponse = await request(app)
        .post("/api/v1/auth/forgot-password")
        .send({ email: "nonexistent@example.com" });

      // Assert - Both responses should be identical
      expect(existingResponse.status).toBe(nonExistingResponse.status);
      expect(existingResponse.body).toEqual(nonExistingResponse.body);
    });

    it("should not include token in forgot password response", async () => {
      // Act
      const response = await request(app)
        .post("/api/v1/auth/forgot-password")
        .send({ email: "test@example.com" });

      // Assert
      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).not.toHaveProperty("token");
      expect(JSON.stringify(response.body)).not.toContain("token");
    });

    it("should enforce password complexity requirements", async () => {
      // Arrange
      const weakPasswords = [
        "short", // Too short
        "onlylowercase", // Missing uppercase
        "ONLYUPPERCASE", // Missing lowercase
        "NoNumbers", // Missing numbers
        "NoSpecial123", // Missing special characters
      ];

      // Act & Assert
      for (const weakPassword of weakPasswords) {
        const response = await request(app)
          .post("/api/v1/auth/reset-password/valid-token-123")
          .send({ password: weakPassword });

        expect(response.status).toBe(httpStatus.BAD_REQUEST);
        expect(response.body.error.message).toContain("Password must");
        expect(resetPasswordController.resetPassword).not.toHaveBeenCalled();
      }

      // Reset the mock for the next test
      jest.clearAllMocks();
    });
  });
});
