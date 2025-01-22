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
    it("should successfully send a forgot password email", async () => {
      // Arrange
      const message = "Password reset link sent to your email.";

      (resetPasswordController.forgotPassword as jest.Mock).mockImplementation(
        (_req, res) => {
          res.status(httpStatus.OK).json({ message });
        }
      );

      // Act & Assert
      await request(app)
        .post("/api/v1/auth/forgot-password")
        .send(mockValidEmailBody)
        .expect(httpStatus.OK)
        .expect((res) => {
          expect(res.body).toEqual({
            message,
          });
        });

      expect(resetPasswordController.forgotPassword).toHaveBeenCalled();
    });

    it("should throw a BadRequest Error if no email is provided", async () => {
      // Act & Assert
      await request(app)
        .post("/api/v1/auth/forgot-password")
        .expect(httpStatus.BAD_REQUEST);

      expect(resetPasswordController.forgotPassword).not.toHaveBeenCalled();
    });

    it("should throw a BadRequest Error if the email is not valid", async () => {
      // Act & Assert
      await request(app)
        .post("/api/v1/auth/forgot-password")
        .send(mockInValidEmailBody)
        .expect(httpStatus.BAD_REQUEST);

      expect(resetPasswordController.forgotPassword).not.toHaveBeenCalled();
    });

    it("should handle internal server errors", async () => {
      // Arrange
      (resetPasswordController.forgotPassword as jest.Mock).mockImplementation(
        () => {
          throw new Error("Internal Server Error");
        }
      );

      // Act & Assert
      await request(app)
        .post("/api/v1/auth/forgot-password")
        .send(mockValidEmailBody)
        .expect(httpStatus.INTERNAL_SERVER_ERROR);

      expect(resetPasswordController.forgotPassword).toHaveBeenCalled();
    });

    it("should not accept GET method", async () => {
      // Act & Assert
      await request(app)
        .get("/api/v1/auth/forgot-password")
        .expect(httpStatus.NOT_FOUND);
    });

    it("should not accept PUT method", async () => {
      // Act & Assert
      await request(app)
        .put("/api/v1/auth/forgot-password")
        .expect(httpStatus.NOT_FOUND);
    });

    it("should not accept DELETE method", async () => {
      // Act & Assert
      await request(app)
        .delete("/api/v1/auth/forgot-password")
        .expect(httpStatus.NOT_FOUND);
    });
  });
});
