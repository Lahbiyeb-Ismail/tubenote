import envConfig from "@config/env.config";
import logger from "@utils/logger";
import jwt from "jsonwebtoken";
import { JwtService } from "../jwt.service";

// Mock dependencies
jest.mock("jsonwebtoken");
jest.mock("@config/env.config");
jest.mock("@utils/logger");

describe("JwtService", () => {
  let jwtService: JwtService;
  const mockUserId = "test-user-123";
  const mockSecret = "test-secret";
  const mockToken = "mock.jwt.token";

  beforeEach(() => {
    jwtService = new JwtService();
    jest.clearAllMocks();
  });

  describe("JwtService - verify method", () => {
    it("should successfully verify a valid token", async () => {
      const mockPayload = { userId: mockUserId };

      (jwt.verify as jest.Mock).mockImplementation(
        (_token, _secret, callback) => {
          callback(null, mockPayload);
        }
      );

      const result = await jwtService.verify({
        token: mockToken,
        secret: mockSecret,
      });

      expect(result).toEqual(mockPayload);
      expect(jwt.verify).toHaveBeenCalledWith(
        mockToken,
        mockSecret,
        expect.any(Function)
      );
    });

    it("should return null and log error when token verification fails", async () => {
      const mockError = new Error("Token verification failed");
      (jwt.verify as jest.Mock).mockImplementation(
        (_token, _secret, callback) => {
          callback(mockError, null);
        }
      );

      const result = await jwtService.verify({
        token: mockToken,
        secret: mockSecret,
      });

      expect(result).toBeNull();
      expect(logger.error).toHaveBeenCalledWith(
        `Error verifying token: ${mockError}`
      );
    });
  });

  describe("JwtService- sign method", () => {
    it("should successfully sign a token", () => {
      const mockSignedToken = "signed.jwt.token";

      (jwt.sign as jest.Mock).mockReturnValue(mockSignedToken);

      const result = jwtService.sign({
        userId: mockUserId,
        secret: mockSecret,
        expiresIn: "1h",
      });

      expect(result).toBe(mockSignedToken);
      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: mockUserId },
        mockSecret,
        { expiresIn: "1h" }
      );
    });
  });

  describe("JwtService- generateAuthTokens method", () => {
    beforeEach(() => {
      // Mock environment config
      (envConfig.jwt as any) = {
        access_token: {
          secret: "access-secret",
          expire: "15m",
        },
        refresh_token: {
          secret: "refresh-secret",
          expire: "7d",
        },
      };
    });

    it("should generate both access and refresh tokens", () => {
      const mockAccessToken = "mock.access.token";
      const mockRefreshToken = "mock.refresh.token";

      // Mock sign method to return different tokens
      (jwt.sign as jest.Mock)
        .mockReturnValueOnce(mockAccessToken)
        .mockReturnValueOnce(mockRefreshToken);

      const result = jwtService.generateAuthTokens(mockUserId);

      expect(result).toEqual({
        accessToken: mockAccessToken,
        refreshToken: mockRefreshToken,
      });

      // Verify access token generation
      expect(jwt.sign).toHaveBeenNthCalledWith(
        1,
        { userId: mockUserId },
        envConfig.jwt.access_token.secret,
        { expiresIn: envConfig.jwt.access_token.expire }
      );

      // Verify refresh token generation
      expect(jwt.sign).toHaveBeenNthCalledWith(
        2,
        { userId: mockUserId },
        envConfig.jwt.refresh_token.secret,
        { expiresIn: envConfig.jwt.refresh_token.expire }
      );
    });
  });
});
