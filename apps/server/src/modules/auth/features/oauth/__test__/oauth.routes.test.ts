import type { Request, Response } from "express";
import httpStatus from "http-status";
import request from "supertest";

import app from "@/app";
import { oauthController } from "../oauth.module";

describe("OAuth Routes", () => {
  const mockResponse = {
    message: "Access token exchanged successfully",
    accessToken: "mocked-access-token",
  };

  const disallowedMethods = ["get", "put", "delete"];

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock the OAuth controller methods
    (oauthController.exchangeOauthCodeForTokens as jest.Mock) = jest.fn();
    (
      oauthController.exchangeOauthCodeForTokens as jest.Mock
    ).mockImplementation(async (_req: Request, res: Response) => {
      res.json(mockResponse);
    });
  });

  describe("POST /api/v1/oauth/exchange-oauth-code", () => {
    it("should exchange a valid OAuth code for tokens and return an access token", async () => {
      // Arrange: Provide a valid request body.
      const validBody = { code: "valid-oauth-code" };

      // Act
      const response = await request(app)
        .post("/api/v1/oauth/exchange-oauth-code")
        .send(validBody);

      // Assert
      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual(mockResponse);

      // Verify that the controller method was called with the request.
      expect(oauthController.exchangeOauthCodeForTokens).toHaveBeenCalled();
    });

    it("should return a BAD_REQUEST error for an invalid request body", async () => {
      // Arrange: Missing the required 'code' property.
      const invalidBody = {};

      // Act
      const response = await request(app)
        .post("/api/v1/oauth/exchange-oauth-code")
        .send(invalidBody);

      // Assert: The validateRequest middleware should catch the schema violation.
      expect(response.status).toBe(httpStatus.BAD_REQUEST);
      expect(response.body.payload).toHaveProperty("name", "BAD_REQUEST");
    });

    it("should handle unexpected errors gracefully", async () => {
      // Arrange: Force the controller method to throw an error.
      (
        oauthController.exchangeOauthCodeForTokens as jest.Mock
      ).mockImplementationOnce((_req: Request, _res: Response) => {
        throw new Error("Unexpected error");
      });

      const validBody = { code: "valid-oauth-code" };

      // Act
      const response = await request(app)
        .post("/api/v1/oauth/exchange-oauth-code")
        .send(validBody);

      // Assert: The error-handling middleware should return a INTERNAL_SERVER_ERROR status.
      expect(response.status).toBe(httpStatus.INTERNAL_SERVER_ERROR);
    });

    it.each(disallowedMethods)(
      "should not accept %s method",
      async (method) => {
        await (request(app) as any)
          [method]("/api/v1/oauth/exchange-oauth-code")
          .expect(httpStatus.NOT_FOUND);
      }
    );
  });
});
