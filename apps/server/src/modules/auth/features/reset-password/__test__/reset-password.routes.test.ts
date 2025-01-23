import httpStatus from "http-status";
import request from "supertest";

import app from "@/app";

import type { EmailBodyDto } from "@/common/dtos/email-body.dto";
import { resetPasswordController } from "../reset-password.module";

jest.mock("../reset-password.module", () => ({
  resetPasswordController: {
    forgotPassword: jest.fn(),
    resetPassword: jest.fn(),
    verifyResetToken: jest.fn(),
  },
}));

describe("Reset password Routes", () => {
  const mockEmail = "user@test.com";

  const mockValidEmailBody: EmailBodyDto = {
    email: mockEmail,
  };

  const mockInValidEmailBody: EmailBodyDto = {
    email: "invalidemail.com",
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

      expect(response.body.error.message).toBe(
        "Validation error in email field: Invalid email"
      );

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

      expect(response.body.error.message).toBe(
        "Validation error in email field: Invalid email"
      );

      expect(response.body.error.statusCode).toBe(httpStatus.BAD_REQUEST);

      expect(response.body.error.name).toBe("BAD_REQUEST");
    });
  });

  // describe("GET /api/v1/auth/reset-password/:token/verify", () => {
  //   const validResetToken = "valid-token";
  //   const invalidResetToken = "invalid-token";

  //   it("should return 200 status code for a valid token", async () => {
  //     const message = "Reset token verified.";

  //     const response = await request(app).get(
  //       `/api/v1/auth/reset-password/${validResetToken}/verify`
  //     );

  //     expect(response.status).toBe(httpStatus.OK);

  //     expect(response.body.message).toBe(message);
  //   });

  //   it("should return 400 status code for an invalid token", async () => {
  //     const response = await request(app).get(
  //       `/api/v1/auth/reset-password/${invalidResetToken}/verify`
  //     );

  //     expect(response.status).toBe(httpStatus.BAD_REQUEST);
  //   });

  //   it("should return 400 for an expired token", async () => {
  //     const response = await request(app).get(
  //       "/api/v1/auth/reset-password/expired-token/verify"
  //     );

  //     expect(response.status).toBe(400);
  //     expect(response.body.error).toBe("Token has expired");
  //   });

  //   it("should return 404 for a missing token", async () => {
  //     const response = await request(app).get(
  //       "/api/v1/auth/reset-password//verify"
  //     );

  //     expect(response.status).toBe(404);
  //   });
  // });
});
