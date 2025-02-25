import httpStatus from "http-status";
import request from "supertest";

import app from "@/app";

import { ERROR_MESSAGES } from "@/constants/error-messages.contants";

import { resetPasswordController } from "../reset-password.module";

import type { IEmailBodyDto } from "@modules/shared";

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

      expect(response.body.error.message).toContain("Invalid email address");

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

      expect(response.body.error.message).toContain("Invalid email address");

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
});
