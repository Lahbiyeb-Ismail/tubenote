import {
  VERIFY_EMAIL_TOKEN_EXPIRES_IN,
  VERIFY_EMAIL_TOKEN_SECRET,
} from "@/constants/auth.contants";
import { BadRequestError, DatabaseError, NotFoundError } from "@/errors";
import { ERROR_MESSAGES } from "@constants/error-messages.contants";

import logger from "@/utils/logger";
import { stringToDate } from "@utils/convert-string-to-date";

import { VerifyEmailService } from "../verify-email.service";

import type { User } from "@modules/user/user.model";
import type { VerifyEmailToken } from "../verify-email.model";

import type { SignTokenDto } from "@/modules/auth/utils/services/jwt/dtos/sign-token.dto";
import type { IJwtService } from "@/modules/auth/utils/services/jwt/jwt.types";
import type { JwtPayload } from "@/types";
import type { IUserService } from "@modules/user/user.types";
import type { SaveTokenDto } from "../dtos/save-token.dto";
import type { IVerifyEmailRepository } from "../verify-email.types";

jest.mock("@utils/convert-string-to-date");
jest.mock("@/utils/logger");

describe("VerifyEmailService methods test", () => {
  let verifyEmailService: VerifyEmailService;
  let mockVerifyEmailRepository: jest.Mocked<IVerifyEmailRepository>;
  let mockUserService: jest.Mocked<IUserService>;
  let mockJwtService: jest.Mocked<IJwtService>;

  beforeEach(() => {
    mockVerifyEmailRepository = {
      findActiveToken: jest.fn(),
      saveToken: jest.fn(),
      deleteMany: jest.fn(),
    };

    mockUserService = {
      getUser: jest.fn(),
      updateUser: jest.fn(),
      createUser: jest.fn(),
      getOrCreateUser: jest.fn(),
      resetPassword: jest.fn(),
      updatePassword: jest.fn(),
      verifyUserEmail: jest.fn(),
    };

    mockJwtService = {
      sign: jest.fn(),
      verify: jest.fn(),
      generateAuthTokens: jest.fn(),
    };

    verifyEmailService = new VerifyEmailService(
      mockVerifyEmailRepository,
      mockUserService,
      mockJwtService
    );
  });

  const mockEmail = "test@example.com";
  const mockValidToken = "jwt-verification-token";
  const mockUserId = "user-id-123";
  const mockTokenId = "token-id-123";

  const mockUnverifiedUser: User = {
    id: mockUserId,
    email: mockEmail,
    username: "testuser",
    password: "hashedpassword",
    isEmailVerified: false,
    googleId: "",
    profilePicture: "",
    createdAt: new Date(),
    updatedAt: new Date(),
    videoIds: [],
  };

  const expiresIn = stringToDate(VERIFY_EMAIL_TOKEN_EXPIRES_IN);

  const mockVerificationToken: VerifyEmailToken = {
    id: mockTokenId,
    userId: mockUserId,
    token: mockValidToken,
    createdAt: new Date(Date.now()),
    expiresAt: expiresIn,
  };

  const saveTokenDto: SaveTokenDto = {
    userId: mockUserId,
    token: mockValidToken,
    expiresAt: expiresIn,
  };

  const signTokenDto: SignTokenDto = {
    userId: mockUserId,
    secret: VERIFY_EMAIL_TOKEN_SECRET,
    expiresIn: VERIFY_EMAIL_TOKEN_EXPIRES_IN,
  };

  beforeAll(() => {
    jest.clearAllMocks();
  });

  describe("VerifyEmailService - generateToken", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should successfully generate a verification token for an unverified email and save it to the database", async () => {
      mockUserService.getUser.mockResolvedValue(mockUnverifiedUser);

      mockVerifyEmailRepository.findActiveToken.mockResolvedValue(null);

      mockJwtService.sign.mockReturnValue(mockValidToken);

      mockVerifyEmailRepository.saveToken.mockResolvedValue(
        mockVerificationToken
      );

      const result = await verifyEmailService.generateToken(mockEmail);

      expect(result).toBe(mockValidToken);

      expect(mockUserService.getUser).toHaveBeenCalledWith({
        email: mockEmail,
      });

      expect(mockVerifyEmailRepository.findActiveToken).toHaveBeenCalledWith({
        userId: mockUnverifiedUser.id,
      });

      expect(mockJwtService.sign).toHaveBeenCalledWith(signTokenDto);

      expect(mockVerifyEmailRepository.saveToken).toHaveBeenCalledWith(
        saveTokenDto
      );
    });

    it("should throw a NotFoundError if the user is not found", async () => {
      mockUserService.getUser.mockRejectedValue(
        new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND)
      );

      await expect(verifyEmailService.generateToken(mockEmail)).rejects.toThrow(
        new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND)
      );

      expect(mockUserService.getUser).toHaveBeenCalledWith({
        email: mockEmail,
      });
    });

    it("should throw a BadRequestError if the user's email is already verified", async () => {
      mockUserService.getUser.mockResolvedValue({
        ...mockUnverifiedUser,
        isEmailVerified: true,
      });

      await expect(verifyEmailService.generateToken(mockEmail)).rejects.toThrow(
        new BadRequestError(ERROR_MESSAGES.EMAIL_ALREADY_VERIFIED)
      );

      expect(mockUserService.getUser).toHaveBeenCalledWith({
        email: mockEmail,
      });
    });

    it("should throw a BadRequestError if a verification link was already sent", async () => {
      mockUserService.getUser.mockResolvedValue(mockUnverifiedUser);

      mockVerifyEmailRepository.findActiveToken.mockResolvedValue(
        mockVerificationToken
      );

      await expect(verifyEmailService.generateToken(mockEmail)).rejects.toThrow(
        new BadRequestError(ERROR_MESSAGES.VERIFICATION_LINK_SENT)
      );

      expect(mockUserService.getUser).toHaveBeenCalledWith({
        email: mockEmail,
      });

      expect(mockVerifyEmailRepository.findActiveToken).toHaveBeenCalledWith({
        userId: mockUnverifiedUser.id,
      });
    });

    it("should throw an Error if token generation fails", async () => {
      mockUserService.getUser.mockResolvedValue(mockUnverifiedUser);

      mockVerifyEmailRepository.findActiveToken.mockResolvedValue(null);

      mockJwtService.sign.mockImplementation(() => {
        throw new Error("Token generation failed");
      });

      await expect(verifyEmailService.generateToken(mockEmail)).rejects.toThrow(
        new Error("Token generation failed")
      );
    });

    it("should log an info message when a verification token is generated", async () => {
      mockUserService.getUser.mockResolvedValue(mockUnverifiedUser);

      mockVerifyEmailRepository.findActiveToken.mockResolvedValue(null);

      mockJwtService.sign.mockReturnValue(mockValidToken);

      mockVerifyEmailRepository.saveToken.mockResolvedValue(
        mockVerificationToken
      );

      const loggerSpy = jest.spyOn(logger, "info");

      await verifyEmailService.generateToken(mockEmail);

      expect(loggerSpy).toHaveBeenCalledWith(
        `Verification email token generated for user ${mockUnverifiedUser.id}`
      );
    });
  });

  describe("VerifyEmailService - verifyUserEmail", () => {
    const decodedToken: JwtPayload = {
      userId: mockUserId,
      iat: 1234567890,
      exp: 1234567890,
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should verify user email with a valid token", async () => {
      mockJwtService.verify.mockResolvedValue(decodedToken);

      mockVerifyEmailRepository.findActiveToken.mockResolvedValue(
        mockVerificationToken
      );

      mockUserService.verifyUserEmail.mockResolvedValue({
        ...mockUnverifiedUser,
        isEmailVerified: true,
      });

      await verifyEmailService.verifyUserEmail(mockValidToken);

      expect(mockVerifyEmailRepository.deleteMany).toHaveBeenCalledWith(
        mockUserId
      );

      expect(mockUserService.verifyUserEmail).toHaveBeenCalledWith(mockUserId);
    });

    it("should throw a BadRequestError for an invalid token", async () => {
      const error = new BadRequestError(ERROR_MESSAGES.INVALID_TOKEN);
      const mockInvalidToken = "invalid-token";

      mockJwtService.verify.mockRejectedValue(error);

      await expect(
        verifyEmailService.verifyUserEmail(mockInvalidToken)
      ).rejects.toThrow(error);
    });

    it("should throw a NotFoundError if user is not found", async () => {
      const error = new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND);

      mockJwtService.verify.mockResolvedValue(decodedToken);

      mockVerifyEmailRepository.findActiveToken.mockResolvedValue(
        mockVerificationToken
      );

      mockUserService.verifyUserEmail.mockRejectedValue(error);

      await expect(
        verifyEmailService.verifyUserEmail(mockValidToken)
      ).rejects.toThrow(error);
    });

    it("should throw a BadRequestError if the user's email is already verified", async () => {
      mockJwtService.verify.mockResolvedValue(decodedToken);

      mockVerifyEmailRepository.findActiveToken.mockResolvedValue(
        mockVerificationToken
      );

      mockUserService.verifyUserEmail.mockRejectedValue(
        new BadRequestError(ERROR_MESSAGES.EMAIL_ALREADY_VERIFIED)
      );

      await expect(
        verifyEmailService.verifyUserEmail(mockValidToken)
      ).rejects.toThrow(
        new BadRequestError(ERROR_MESSAGES.EMAIL_ALREADY_VERIFIED)
      );
    });

    it("should throw a BadRequestError if token is not found in the database", async () => {
      mockJwtService.verify.mockResolvedValue(decodedToken);

      mockUserService.getUser.mockResolvedValue(mockUnverifiedUser);

      mockVerifyEmailRepository.findActiveToken.mockResolvedValue(null);

      await expect(
        verifyEmailService.verifyUserEmail(mockValidToken)
      ).rejects.toThrow(new BadRequestError(ERROR_MESSAGES.INVALID_TOKEN));
    });

    it("should log an info message when email verification is successful", async () => {
      mockJwtService.verify.mockResolvedValue(decodedToken);

      mockUserService.verifyUserEmail.mockResolvedValue({
        ...mockUnverifiedUser,
        isEmailVerified: true,
      });

      mockVerifyEmailRepository.findActiveToken.mockResolvedValue(
        mockVerificationToken
      );

      const loggerSpy = jest.spyOn(logger, "info");

      await verifyEmailService.verifyUserEmail(mockValidToken);

      expect(loggerSpy).toHaveBeenCalledWith(
        `Email verification successful for user ${mockUnverifiedUser.id}`
      );
    });

    it("should log a warning message when token reuse is attempted", async () => {
      mockJwtService.verify.mockResolvedValue(decodedToken);

      mockVerifyEmailRepository.findActiveToken.mockResolvedValue(null);

      const loggerSpy = jest.spyOn(logger, "warn");

      await expect(
        verifyEmailService.verifyUserEmail(mockValidToken)
      ).rejects.toThrow(new BadRequestError(ERROR_MESSAGES.INVALID_TOKEN));

      expect(loggerSpy).toHaveBeenCalledWith(
        `Token reuse attempt for user ${mockUnverifiedUser.id}`
      );
    });

    it("should throw an error if the token verification fails", async () => {
      const error = new Error("Token verification failed");

      mockJwtService.verify.mockRejectedValue(error);

      await expect(
        verifyEmailService.verifyUserEmail(mockValidToken)
      ).rejects.toThrow(error);
    });

    it("should throw an error if deleting tokens fails", async () => {
      const error = new DatabaseError("Database error");

      mockJwtService.verify.mockResolvedValue(decodedToken);

      mockUserService.getUser.mockResolvedValue(mockUnverifiedUser);

      mockVerifyEmailRepository.findActiveToken.mockResolvedValue(
        mockVerificationToken
      );

      mockVerifyEmailRepository.deleteMany.mockRejectedValue(error);

      await expect(
        verifyEmailService.verifyUserEmail(mockValidToken)
      ).rejects.toThrow(error);
    });

    it("should propagate errors from the user service", async () => {
      const error = new Error("User service error");

      mockJwtService.verify.mockResolvedValue(decodedToken);

      mockVerifyEmailRepository.findActiveToken.mockResolvedValue(
        mockVerificationToken
      );

      mockUserService.verifyUserEmail.mockRejectedValue(error);

      await expect(
        verifyEmailService.verifyUserEmail(mockValidToken)
      ).rejects.toThrow(error);
    });

    it("should propagate errors from the verify email repository", async () => {
      const error = new Error("Repository error");

      mockJwtService.verify.mockResolvedValue(decodedToken);

      mockVerifyEmailRepository.findActiveToken.mockRejectedValue(error);

      await expect(
        verifyEmailService.verifyUserEmail(mockValidToken)
      ).rejects.toThrow(error);
    });
  });
});
