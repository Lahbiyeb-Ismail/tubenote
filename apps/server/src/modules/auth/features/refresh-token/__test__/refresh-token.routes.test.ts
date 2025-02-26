import httpStatus from "http-status";
import request from "supertest";

import app from "@/app";

import isAuthenticated from "@/middlewares/auth.middleware";

import { UnauthorizedError } from "@modules/shared";

import { ERROR_MESSAGES } from "@/constants/error-messages.contants";
import { REFRESH_TOKEN_NAME } from "@modules/auth";

import { refreshTokenController } from "../refresh-token.module";

jest.mock("../refresh-token.module", () => ({
  refreshTokenController: {
    refreshToken: jest.fn(),
  },
}));

jest.mock("@/middlewares/auth.middleware", () => jest.fn());

describe("Refresh Token Routes", () => {
  const mockUserId = "user-id-001";
  const validRefreshToken = "valid-refresh-token";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/v1/auth/refresh", () => {
    it("should successfully refresh token when valid refresh token is provided", async () => {
      // Arrange
      const mockAccessToken = "new-access-token";

      (isAuthenticated as jest.Mock).mockImplementation((req, _res, next) => {
        req.userId = mockUserId;
        next();
      });

      (refreshTokenController.refreshToken as jest.Mock).mockImplementation(
        (_req, res) => {
          res.status(httpStatus.OK).json({ accessToken: mockAccessToken });
        }
      );

      // Act & Assert
      const response = await request(app)
        .post("/api/v1/auth/refresh")
        .set("Cookie", [`${REFRESH_TOKEN_NAME}=${validRefreshToken}`]);

      expect(response.statusCode).toBe(httpStatus.OK);
      expect(response.body).toEqual({ accessToken: mockAccessToken });

      expect(refreshTokenController.refreshToken).toHaveBeenCalled();
    });

    it("should return 401 UNAUTHORIZED error when no refresh token cookie is provided", async () => {
      // Arrange
      (refreshTokenController.refreshToken as jest.Mock).mockImplementation(
        () => {
          throw new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED);
        }
      );

      // Act & Assert
      await request(app)
        .post("/api/v1/auth/refresh")
        .expect(httpStatus.UNAUTHORIZED);

      expect(refreshTokenController.refreshToken).toHaveBeenCalled();
    });

    it("should handle internal server errors", async () => {
      // Arrange
      (refreshTokenController.refreshToken as jest.Mock).mockImplementation(
        () => {
          throw new Error("Internal Server Error");
        }
      );

      // Act & Assert
      await request(app)
        .post("/api/v1/auth/refresh")
        .set("Cookie", [`${REFRESH_TOKEN_NAME}=valid-refresh-token`])
        .expect(httpStatus.INTERNAL_SERVER_ERROR);

      expect(refreshTokenController.refreshToken).toHaveBeenCalled();
    });

    it("should not accept GET method", async () => {
      // Act & Assert
      await request(app)
        .get("/api/v1/auth/refresh")
        .expect(httpStatus.NOT_FOUND);
    });

    it("should not accept PUT method", async () => {
      // Act & Assert
      await request(app)
        .put("/api/v1/auth/refresh")
        .expect(httpStatus.NOT_FOUND);
    });

    it("should not accept DELETE method", async () => {
      // Act & Assert
      await request(app)
        .delete("/api/v1/auth/refresh")
        .expect(httpStatus.NOT_FOUND);
    });

    it("should handle malformed cookies", async () => {
      // Arrange
      (refreshTokenController.refreshToken as jest.Mock).mockImplementation(
        () => {
          throw new Error("Invalid cookie format");
        }
      );

      // Act & Assert
      await request(app)
        .post("/api/v1/auth/refresh")
        .set("Cookie", ["malformed-cookie-format"])
        .expect(httpStatus.INTERNAL_SERVER_ERROR);

      expect(refreshTokenController.refreshToken).toHaveBeenCalled();
    });

    it("should preserve headers set by the controller", async () => {
      // Arrange
      const mockAccessToken = "new-access-token";
      (refreshTokenController.refreshToken as jest.Mock).mockImplementation(
        (_req, res) => {
          res
            .set("Custom-Header", "test-value")
            .status(httpStatus.OK)
            .json({ accessToken: mockAccessToken });
        }
      );

      // Act & Assert
      await request(app)
        .post("/api/v1/auth/refresh")
        .set("Cookie", [`${REFRESH_TOKEN_NAME}=valid-refresh-token`])
        .expect(httpStatus.OK)
        .expect("Custom-Header", "test-value")
        .expect((res) => {
          expect(res.body).toEqual({
            accessToken: mockAccessToken,
          });
        });
    });

    it("should handle multiple cookies correctly", async () => {
      // Arrange
      const mockAccessToken = "new-access-token";
      (refreshTokenController.refreshToken as jest.Mock).mockImplementation(
        (_req, res) => {
          res.status(httpStatus.OK).json({ accessToken: mockAccessToken });
        }
      );

      // Act & Assert
      await request(app)
        .post("/api/v1/auth/refresh")
        .set("Cookie", [
          `${REFRESH_TOKEN_NAME}=valid-refresh-token`,
          "other-cookie=some-value",
        ])
        .expect(httpStatus.OK)
        .expect((res) => {
          expect(res.body).toEqual({
            accessToken: mockAccessToken,
          });
        });

      expect(refreshTokenController.refreshToken).toHaveBeenCalled();
    });

    it("should handle concurrent refresh requests", async () => {
      const requests = Array(5)
        .fill(0)
        .map(() =>
          request(app)
            .post("/api/v1/auth/refresh")
            .set("Cookie", `${REFRESH_TOKEN_NAME}=valid-token`)
        );

      const responses = await Promise.all(requests);
      responses.forEach((response) => {
        expect(response.status).toBe(httpStatus.OK);
      });
    });
  });
});
