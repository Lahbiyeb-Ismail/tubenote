import httpStatus from "http-status";
import request from "supertest";

import app from "@/app";

import { UnauthorizedError } from "@/modules/shared/api-errors";
import { ERROR_MESSAGES } from "@/modules/shared/constants";

import { REFRESH_TOKEN_NAME } from "@/modules/auth/constants";

import { refreshTokenController } from "../refresh-token.module";

const MOCK_USER_ID = "user_id_001";
const MOCK_ACCESS_TOKEN = "new-access-token";

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
        if (token === "valid-token") {
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

describe("Refresh Token Routes", () => {
  const validRefreshToken = "valid-refresh-token";

  beforeAll(() => {
    (refreshTokenController.refreshToken as jest.Mock) = jest.fn();

    (refreshTokenController.refreshToken as jest.Mock).mockImplementation(
      (_req, res) => {
        res.status(httpStatus.OK).json({ accessToken: MOCK_ACCESS_TOKEN });
      }
    );
  });

  // Clear mocks between tests
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/v1/auth/refresh", () => {
    it("should successfully refresh token when valid refresh token is provided", async () => {
      // Act & Assert
      const response = await request(app)
        .post("/api/v1/auth/refresh")
        .set("Authorization", "Bearer valid-token")
        .set("Cookie", [`${REFRESH_TOKEN_NAME}=${validRefreshToken}`]);

      expect(response.statusCode).toBe(httpStatus.OK);
      expect(response.body).toEqual({ accessToken: MOCK_ACCESS_TOKEN });

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
        .set("Authorization", "Bearer valid-token")
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
        .set("Authorization", "Bearer valid-token")
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
        .set("Authorization", "Bearer valid-token")
        .set("Cookie", ["malformed-cookie-format"])
        .expect(httpStatus.INTERNAL_SERVER_ERROR);

      expect(refreshTokenController.refreshToken).toHaveBeenCalled();
    });

    it("should preserve headers set by the controller", async () => {
      // Arrange
      (refreshTokenController.refreshToken as jest.Mock).mockImplementation(
        (_req, res) => {
          res
            .set("Custom-Header", "test-value")
            .status(httpStatus.OK)
            .json({ accessToken: MOCK_ACCESS_TOKEN });
        }
      );

      // Act & Assert
      await request(app)
        .post("/api/v1/auth/refresh")
        .set("Authorization", "Bearer valid-token")
        .set("Cookie", [`${REFRESH_TOKEN_NAME}=valid-refresh-token`])
        .expect(httpStatus.OK)
        .expect("Custom-Header", "test-value")
        .expect((res) => {
          expect(res.body).toEqual({
            accessToken: MOCK_ACCESS_TOKEN,
          });
        });
    });

    it("should handle multiple cookies correctly", async () => {
      // Arrange
      (refreshTokenController.refreshToken as jest.Mock).mockImplementation(
        (_req, res) => {
          res.status(httpStatus.OK).json({ accessToken: MOCK_ACCESS_TOKEN });
        }
      );

      // Act & Assert
      await request(app)
        .post("/api/v1/auth/refresh")
        .set("Authorization", "Bearer valid-token")
        .set("Cookie", [
          `${REFRESH_TOKEN_NAME}=valid-refresh-token`,
          "other-cookie=some-value",
        ])
        .expect(httpStatus.OK)
        .expect((res) => {
          expect(res.body).toEqual({
            accessToken: MOCK_ACCESS_TOKEN,
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
            .set("Authorization", "Bearer valid-token")
            .set("Cookie", `${REFRESH_TOKEN_NAME}=valid-token`)
        );

      const responses = await Promise.all(requests);
      responses.forEach((response) => {
        expect(response.status).toBe(httpStatus.OK);
      });
    });
  });
});
