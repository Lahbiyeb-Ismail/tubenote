import httpStatus from "http-status";
import request from "supertest";

import app from "@/app";

import { verifyEmailController } from "../verify-email.module";

jest.mock("../verify-email.module", () => ({
  verifyEmailController: {
    verifyEmail: jest.fn(),
  },
}));

describe("Verify Email Route", () => {
  const mockValidToken = "valid-verification-token";
  const mockInvalidToken = "invalid-verification-token";
  const mockNonExistentToken = "non-existent-token";

  beforeAll(() => {
    jest.clearAllMocks();
  });

  describe("GET /verify-email/:token", () => {
    it("should verify email with a valid token", async () => {
      const message = "Email verified successfully.";

      (verifyEmailController.verifyEmail as jest.Mock).mockImplementation(
        (_req, res) => {
          res.status(httpStatus.OK).json({ message });
        }
      );

      const response = await request(app).get(
        `/api/v1/auth/verify-email/${mockValidToken}`
      );

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body.message).toBe(message);
    });

    it("should handle BadRequestError for an invalid token", async () => {
      (verifyEmailController.verifyEmail as jest.Mock).mockImplementation(
        (_req, res) => {
          res.status(httpStatus.BAD_REQUEST).json();
        }
      );

      const response = await request(app).get(
        `/api/v1/auth/verify-email/${mockInvalidToken}`
      );

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should handle NotFoundError if user is not found", async () => {
      (verifyEmailController.verifyEmail as jest.Mock).mockImplementation(
        (_req, res) => {
          res.status(httpStatus.NOT_FOUND).json();
        }
      );

      const response = await request(app).get(
        `/api/v1/auth/verify-email/${mockValidToken}`
      );

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("should handle BadRequestError if token is not found in the database", async () => {
      (verifyEmailController.verifyEmail as jest.Mock).mockImplementation(
        (_req, res) => {
          res.status(httpStatus.BAD_REQUEST).json();
        }
      );

      const response = await request(app).get(
        `/api/v1/auth/verify-email/${mockNonExistentToken}`
      );

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should handle InternalServerError for database operation failure", async () => {
      (verifyEmailController.verifyEmail as jest.Mock).mockImplementation(
        (_req, res) => {
          res.status(httpStatus.INTERNAL_SERVER_ERROR).json();
        }
      );

      const response = await request(app).get(
        `/api/v1/auth/verify-email/${mockValidToken}`
      );

      expect(response.status).toBe(httpStatus.INTERNAL_SERVER_ERROR);
    });
  });
});
