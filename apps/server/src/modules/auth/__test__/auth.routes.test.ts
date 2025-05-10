import type { Request, Response } from "express";
import httpStatus from "http-status";
import request from "supertest";

import app from "@/app";

import { authController } from "../auth.module";
import { ACCESS_TOKEN_NAME, REFRESH_TOKEN_NAME } from "../constants";

const MOCK_USER_ID = "user_id_001";

// **********************************************
// MOCK THE JSONWEBTOKEN MODULE TO SIMULATE TOKEN VERIFICATION
// **********************************************
jest.mock("jsonwebtoken", () => {
  // Get the actual module to spread the rest of its exports.
  const actualJwt = jest.requireActual("jsonwebtoken");
  return {
    ...actualJwt,
    verify: jest.fn(
      (
        token: string,
        _secret: string,
        callback: (err: Error | null, payload?: any) => void
      ) => {
        if (token === "valid-access-token") {
          // Simulate a successful verification with a payload.
          callback(null, { userId: MOCK_USER_ID });
        } else {
          // Simulate an error during verification.
          callback(new Error("Invalid token"), null);
        }
      }
    ),
  };
});

describe("Auth Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock authController methods
    (authController.logout as jest.Mock) = jest.fn();
  });

  describe("POST /api/v1/auth/logout", () => {
    it("should log out the user if authenticated", async () => {
      (authController.logout as jest.Mock).mockImplementation(
        async (_req, res: Response) => {
          res.clearCookie(REFRESH_TOKEN_NAME);
          res.sendStatus(httpStatus.NO_CONTENT);
        }
      );

      // Arrange: provide a valid Authorization header and cookie.
      const res = await request(app)
        .post("/api/v1/auth/logout")
        .set("Cookie", [
          `${ACCESS_TOKEN_NAME}=valid-access-token`,
          `${REFRESH_TOKEN_NAME}=valid-refresh-token`,
        ]);

      // Assert: authController.logout should have been called and the response should be 204.
      expect(authController.logout).toHaveBeenCalled();
      expect(res.status).toBe(httpStatus.NO_CONTENT);
    });

    it("should return 401 Unauthorized if not authenticated", async () => {
      await request(app)
        .post("/api/v1/auth/logout")
        .expect(httpStatus.UNAUTHORIZED);
    });

    it("should propagate errors from authController.logout", async () => {
      // Arrange: force authController.logout to throw an error.
      (authController.logout as jest.Mock).mockImplementationOnce(
        async (_req: Request, _res: Response) => {
          throw new Error("Logout error");
        }
      );

      const res = await request(app)
        .post("/api/v1/auth/logout")
        .set("Cookie", [
          `${ACCESS_TOKEN_NAME}=valid-access-token`,
          `${REFRESH_TOKEN_NAME}=valid-refresh-token`,
        ]);

      expect(res.status).toBe(httpStatus.INTERNAL_SERVER_ERROR);
      expect(res.body.payload).toHaveProperty("message", "Logout error");
    });

    it("should use the isAuthenticated middleware to attach userId", async () => {
      (authController.logout as jest.Mock).mockImplementation(
        async (req: Request, res: Response) => {
          // Assert: the userId should be attached to the request.
          expect(req.userId).toBe(MOCK_USER_ID);

          res.clearCookie(REFRESH_TOKEN_NAME);
          res.sendStatus(httpStatus.NO_CONTENT);
        }
      );

      // Arrange: send a request with a valid token and check that the logout
      // function receives a userId (mocked via our isAuthenticated).
      // We simulate this by checking that authController.logout is called with a request having userId.
      await request(app)
        .post("/api/v1/auth/logout")
        .set("Cookie", [
          `${ACCESS_TOKEN_NAME}=valid-access-token`,
          `${REFRESH_TOKEN_NAME}=valid-refresh-token`,
        ]);

      // Access the first call's first argument to authController.logout.
      const calledReq = (authController.logout as jest.Mock).mock.calls[0][0];
      expect(calledReq.userId).toBe(MOCK_USER_ID);
    });

    it("should reject request with invalid token", async () => {
      await request(app)
        .post("/api/v1/auth/logout")
        .set("Cookie", [
          `${ACCESS_TOKEN_NAME}=invalid-access-token`,
          `${REFRESH_TOKEN_NAME}=valid-refresh-token`,
        ])
        .expect(httpStatus.BAD_REQUEST);
    });

    it("should handle malformed authorization header", async () => {
      await request(app)
        .post("/api/v1/auth/logout")
        .set("Cookie", [
          `${ACCESS_TOKEN_NAME}=malformed-access-token`,
          `${REFRESH_TOKEN_NAME}=valid-refresh-token`,
        ])
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe("Route Method Restrictions", () => {
    it("should not accept GET method on /api/v1/auth/logout", async () => {
      const res = await request(app)
        .get("/api/v1/auth/logout")
        .set("Cookie", [
          `${ACCESS_TOKEN_NAME}=valid-access-token`,
          `${REFRESH_TOKEN_NAME}=valid-refresh-token`,
        ]);
      expect(res.status).toBe(httpStatus.NOT_FOUND);
    });

    it("should not accept PUT method on /api/v1/auth/logout", async () => {
      const res = await request(app)
        .put("/api/v1/auth/logout")
        .set("Cookie", [
          `${ACCESS_TOKEN_NAME}=valid-access-token`,
          `${REFRESH_TOKEN_NAME}=valid-refresh-token`,
        ]);
      expect(res.status).toBe(httpStatus.NOT_FOUND);
    });

    it("should not accept DELETE method on /api/v1/auth/logout", async () => {
      const res = await request(app)
        .delete("/api/v1/auth/logout")
        .set("Cookie", [
          `${ACCESS_TOKEN_NAME}=valid-access-token`,
          `${REFRESH_TOKEN_NAME}=valid-refresh-token`,
        ]);
      expect(res.status).toBe(httpStatus.NOT_FOUND);
    });
  });
});
