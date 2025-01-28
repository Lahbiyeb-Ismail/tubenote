import jwt from "jsonwebtoken";

import { BadRequestError } from "@/errors";
import { ERROR_MESSAGES } from "@constants/error-messages.contants";
import { JwtService } from "../jwt.service";

describe("JwtService", () => {
  let jwtService: JwtService;

  const mockUserId = "user-id-123";
  const mockValidTokenSecret = "valid-token-secret";
  const mockInvalidToken = "invalid-jwt-token";

  beforeEach(() => {
    jwtService = new JwtService();
  });

  describe("verify", () => {
    it("should verify a valid token", async () => {
      const token = jwt.sign({ userId: mockUserId }, mockValidTokenSecret, {
        expiresIn: "1h",
      });

      const payload = await jwtService.verify({
        token,
        secret: mockValidTokenSecret,
      });

      expect(payload.userId).toBe(mockUserId);
    });

    it("should throw BadRequestError for an invalid token", async () => {
      await expect(
        jwtService.verify({
          token: mockInvalidToken,
          secret: mockValidTokenSecret,
        })
      ).rejects.toThrow(new BadRequestError(ERROR_MESSAGES.INVALID_TOKEN));
    });

    it("should throw BadRequestError for an expired token", async () => {
      const expiredToken = jwt.sign(
        { userId: mockUserId },
        mockValidTokenSecret,
        {
          expiresIn: "-1s",
        }
      );

      await expect(
        jwtService.verify({ token: expiredToken, secret: mockValidTokenSecret })
      ).rejects.toThrow(new BadRequestError(ERROR_MESSAGES.INVALID_TOKEN));
    });

    it("should throw BadRequestError for an invalid secret", async () => {
      const token = jwt.sign({ userId: mockUserId }, mockValidTokenSecret, {
        expiresIn: "1h",
      });

      await expect(
        jwtService.verify({ token, secret: "invalid-secret" })
      ).rejects.toThrow(new BadRequestError(ERROR_MESSAGES.INVALID_TOKEN));
    });
  });

  describe("sign", () => {
    it("should sign a valid payload", () => {
      const token = jwtService.sign({
        userId: mockUserId,
        secret: mockValidTokenSecret,
        expiresIn: "1h",
      });

      expect(typeof token).toBe("string");
      expect(token.length).toBeGreaterThan(0);
    });

    it("should throw Error for an invalid secret", () => {
      expect(() =>
        jwtService.sign({ userId: mockUserId, secret: "", expiresIn: "1h" })
      ).toThrow();
    });
  });

  describe("generateAuthTokens", () => {
    it("should generate valid access and refresh tokens", () => {
      const tokens = jwtService.generateAuthTokens(mockUserId);

      expect(typeof tokens.accessToken).toBe("string");
      expect(typeof tokens.refreshToken).toBe("string");

      expect(tokens.accessToken.length).toBeGreaterThan(0);
      expect(tokens.refreshToken.length).toBeGreaterThan(0);
    });

    it("should throw Error if token generation fails", () => {
      jest.spyOn(jwtService, "sign").mockImplementation(() => {
        throw new Error("Token generation failed");
      });

      expect(() => jwtService.generateAuthTokens(mockUserId)).toThrow(
        new Error("Token generation failed")
      );
    });
  });
});
