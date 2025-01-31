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

  beforeAll(() => {
    jest.clearAllMocks();
  });

  describe("GET /verify-email/:token", () => {
    it("should return 400 Bad Request for invalid token format", async () => {
      const invalidToken = "inv"; // Assuming token schema requires longer tokens
      const response = await request(app).get(
        `/api/v1/auth/verify-email/${invalidToken}`
      );

      expect(response.status).toBe(httpStatus.BAD_REQUEST);

      expect(response.body.error).toEqual({
        message: expect.stringContaining("Validation error in token"),
        name: "BAD_REQUEST",
        statusCode: httpStatus.BAD_REQUEST,
      });

      // Ensure controller is never invoked
      expect(verifyEmailController.verifyEmail).not.toHaveBeenCalled();
    });

    it("should propagate verifyEmailController errors", async () => {
      (verifyEmailController.verifyEmail as jest.Mock).mockImplementation(
        (_req, res) => {
          res.status(httpStatus.BAD_REQUEST).json();
        }
      );

      const response = await request(app).get(
        `/api/v1/auth/verify-email/${mockValidToken}`
      );

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should return 404 Not Found for non-GET methods", async () => {
      const methods = ["post", "put", "delete", "patch"];

      for (const method of methods) {
        const response = await (request(app) as any)[method](
          `/api/v1/auth/verify-email/${mockValidToken}`
        );
        expect(response.status).toBe(httpStatus.NOT_FOUND);
      }
    });
  });
});
