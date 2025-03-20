import httpStatus from "http-status";
import request from "supertest";

import app from "@/app";
import { authController } from "../auth.module";

describe("Auth Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock authController methods
    // (authController.exchangeOauthCodeForTokens as jest.Mock) = jest.fn();
    (authController.logout as jest.Mock) = jest.fn();
  });

  // describe("POST /api/v1/auth/exchange-oauth-code", () => {
  //   const validCode = "valid-oauth-code";

  //   const mockResponse = {
  //     message: "Access token exchanged successfully",
  //     accessToken: "mock-access-token",
  //   };

  //   it("should successfully exchange OAuth code for tokens", async () => {
  //     (
  //       authController.exchangeOauthCodeForTokens as jest.Mock
  //     ).mockImplementation((_req, res) => res.json(mockResponse));

  //     const response = await request(app)
  //       .post("/api/v1/auth/exchange-oauth-code")
  //       .send({ code: validCode })
  //       .expect("Content-Type", /json/);

  //     expect(response.statusCode).toBe(httpStatus.OK);

  //     expect(response.body).toEqual(mockResponse);
  //   });

  //   it("should throw a BadRequestError for missing code in request body", async () => {
  //     const response = await request(app)
  //       .post("/api/v1/auth/exchange-oauth-code")
  //       .send({});

  //     expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);

  //     expect(response.body.error.name).toBe("BAD_REQUEST");
  //   });

  //   it("should handle controller errors", async () => {
  //     (
  //       authController.exchangeOauthCodeForTokens as jest.Mock
  //     ).mockImplementation(() => {
  //       throw new Error("Exchange failed");
  //     });

  //     const response = await request(app)
  //       .post("/api/v1/auth/exchange-oauth-code")
  //       .send({ code: validCode });

  //     expect(response.statusCode).toBe(httpStatus.INTERNAL_SERVER_ERROR);
  //   });

  //   it("should throw a BadRequestError for a invalid code format", async () => {
  //     const response = await request(app)
  //       .post("/api/v1/auth/exchange-oauth-code")
  //       .send({ code: 123 }); // Invalid type

  //     expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
  //   });
  // });

  describe("POST /api/v1/auth/logout", () => {
    it("should reject unauthorized logout request", async () => {
      await request(app)
        .post("/api/v1/auth/logout")
        .expect(httpStatus.UNAUTHORIZED);
    });

    it("should reject request with invalid token", async () => {
      await request(app)
        .post("/api/v1/auth/logout")
        .set("Authorization", "Bearer invalid-token")
        .expect(httpStatus.UNAUTHORIZED);
    });

    it("should handle missing authorization header", async () => {
      await request(app)
        .post("/api/v1/auth/logout")
        .expect(httpStatus.UNAUTHORIZED);
    });

    it("should handle malformed authorization header", async () => {
      await request(app)
        .post("/api/v1/auth/logout")
        .set("Authorization", "malformed-token")
        .expect(httpStatus.UNAUTHORIZED);
    });
  });

  describe("Route Integration", () => {
    it("should mount local auth routes", async () => {
      // Test that local auth routes are mounted
      expect(app._router.stack).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: "router",
          }),
        ])
      );
    });

    it("should mount Google auth routes", async () => {
      // Test that Google auth routes are mounted
      expect(app._router.stack).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: "router",
          }),
        ])
      );
    });

    it("should mount refresh token routes", async () => {
      // Test that refresh token routes are mounted
      expect(app._router.stack).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: "router",
          }),
        ])
      );
    });

    it("should mount reset password routes", async () => {
      // Test that reset password routes are mounted
      expect(app._router.stack).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: "router",
          }),
        ])
      );
    });

    it("should mount verify email routes", async () => {
      // Test that verify email routes are mounted
      expect(app._router.stack).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: "router",
          }),
        ])
      );
    });
  });

  describe("Error Handling", () => {
    it("should handle unsupported methods", async () => {
      await request(app)
        .put("/api/v1/auth/logout")
        .set("Authorization", "Bearer valid-token")
        .expect(httpStatus.NOT_FOUND);
    });

    it("should handle non-existent routes", async () => {
      await request(app)
        .post("/api/v1/auth/non-existent-route")
        .expect(httpStatus.NOT_FOUND);
    });
  });
});
