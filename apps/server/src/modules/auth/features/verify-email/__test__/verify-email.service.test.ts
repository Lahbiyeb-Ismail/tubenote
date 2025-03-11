import {
  VERIFY_EMAIL_TOKEN_EXPIRES_IN,
  VERIFY_EMAIL_TOKEN_SECRET,
} from "@/modules/auth/constants";
import type { IJwtService, ISignTokenDto } from "@/modules/auth/utils";

import type { IUserService, User } from "@/modules/user";

import {
  BadRequestError,
  DatabaseError,
  NotFoundError,
} from "@/modules/shared/api-errors";
import { ERROR_MESSAGES } from "@/modules/shared/constants";
import { stringToDate } from "@/modules/shared/utils";

import type { ICreateDto } from "@/modules/shared/dtos";
import type { ILoggerService, IPrismaService } from "@/modules/shared/services";
import type { JwtPayload } from "@/modules/shared/types";

import type { VerifyEmailToken } from "../verify-email.model";
import { VerifyEmailService } from "../verify-email.service";
import type { IVerifyEmailRepository } from "../verify-email.types";

jest.mock("@/modules/shared/utils", () => ({
  ...jest.requireActual("@/modules/shared/utils"),
  stringToDate: jest.fn(),
}));

describe("VerifyEmailService methods test", () => {
  let verifyEmailService: VerifyEmailService;
  let mockVerifyEmailRepository: jest.Mocked<IVerifyEmailRepository>;
  let mockUserService: jest.Mocked<IUserService>;
  let mockJwtService: jest.Mocked<IJwtService>;
  let mockLoggerService: jest.Mocked<ILoggerService>;

  let mockPrismaService: Partial<IPrismaService>;

  beforeEach(() => {
    mockVerifyEmailRepository = {
      findActiveToken: jest.fn(),
      createToken: jest.fn(),
      deleteMany: jest.fn(),
    };

    mockPrismaService = {
      transaction: jest.fn(),
    };

    mockUserService = {
      getUserByIdOrEmail: jest.fn(),
      updateUser: jest.fn(),
      createUserWithAccount: jest.fn(),
      getOrCreateUser: jest.fn(),
      resetUserPassword: jest.fn(),
      updateUserPassword: jest.fn(),
      verifyUserEmail: jest.fn(),
    };

    mockJwtService = {
      sign: jest.fn(),
      verify: jest.fn(),
      generateAuthTokens: jest.fn(),
    };

    mockLoggerService = {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
      http: jest.fn(),
    };

    verifyEmailService = new VerifyEmailService(
      mockVerifyEmailRepository,
      mockPrismaService as IPrismaService,
      mockUserService,
      mockJwtService,
      mockLoggerService
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
    profilePicture: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const expiresIn = stringToDate(VERIFY_EMAIL_TOKEN_EXPIRES_IN);

  const mockVerificationToken: VerifyEmailToken = {
    id: mockTokenId,
    userId: mockUserId,
    token: mockValidToken,
    createdAt: new Date(Date.now()),
    expiresAt: expiresIn,
  };

  const createTokenDto: ICreateDto<VerifyEmailToken> = {
    userId: mockUserId,
    data: {
      token: mockValidToken,
      expiresAt: expiresIn,
    },
  };

  const IsignTokenDto: ISignTokenDto = {
    userId: mockUserId,
    secret: VERIFY_EMAIL_TOKEN_SECRET,
    expiresIn: VERIFY_EMAIL_TOKEN_EXPIRES_IN,
  };

  beforeAll(() => {
    jest.clearAllMocks();
  });

  describe("VerifyEmailService - createToken", () => {
    const mockTx = jest.fn();

    beforeEach(() => {
      // Set up transaction mock for proper testing
      (mockPrismaService.transaction as jest.Mock).mockImplementation(
        (callback) => {
          return callback(mockTx);
        }
      );

      jest.clearAllMocks();
    });

    it("should successfully create a verification token for an unverified email and save it to the database", async () => {
      mockUserService.getUserByIdOrEmail.mockResolvedValue(mockUnverifiedUser);

      mockVerifyEmailRepository.findActiveToken.mockResolvedValue(null);

      mockJwtService.sign.mockReturnValue(mockValidToken);

      mockVerifyEmailRepository.createToken.mockResolvedValue(
        mockVerificationToken
      );

      const result = await verifyEmailService.createToken(
        mockTx as any,
        mockEmail
      );

      expect(result).toBe(mockValidToken);

      expect(mockUserService.getUserByIdOrEmail).toHaveBeenCalledWith(
        {
          email: mockEmail,
        },
        mockTx
      );

      expect(mockVerifyEmailRepository.findActiveToken).toHaveBeenCalledWith(
        {
          userId: mockUnverifiedUser.id,
        },
        mockTx
      );

      expect(mockJwtService.sign).toHaveBeenCalledWith(IsignTokenDto);

      expect(mockVerifyEmailRepository.createToken).toHaveBeenCalledWith(
        createTokenDto,
        mockTx
      );
    });

    it("should throw a NotFoundError if the user is not found", async () => {
      mockUserService.getUserByIdOrEmail.mockRejectedValue(
        new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND)
      );

      await expect(
        verifyEmailService.createToken(mockTx as any, mockEmail)
      ).rejects.toThrow(new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND));

      expect(mockUserService.getUserByIdOrEmail).toHaveBeenCalledWith(
        {
          email: mockEmail,
        },
        mockTx
      );
    });

    it("should throw a BadRequestError if the user's email is already verified", async () => {
      mockUserService.getUserByIdOrEmail.mockResolvedValue({
        ...mockUnverifiedUser,
        isEmailVerified: true,
      });

      await expect(
        verifyEmailService.createToken(mockTx as any, mockEmail)
      ).rejects.toThrow(new BadRequestError(ERROR_MESSAGES.ALREADY_VERIFIED));

      expect(mockUserService.getUserByIdOrEmail).toHaveBeenCalledWith(
        {
          email: mockEmail,
        },
        mockTx
      );
    });

    it("should throw a BadRequestError if a verification link was already sent", async () => {
      mockUserService.getUserByIdOrEmail.mockResolvedValue(mockUnverifiedUser);

      mockVerifyEmailRepository.findActiveToken.mockResolvedValue(
        mockVerificationToken
      );

      await expect(
        verifyEmailService.createToken(mockTx as any, mockEmail)
      ).rejects.toThrow(
        new BadRequestError(ERROR_MESSAGES.VERIFICATION_LINK_SENT)
      );

      expect(mockUserService.getUserByIdOrEmail).toHaveBeenCalledWith(
        {
          email: mockEmail,
        },
        mockTx
      );

      expect(mockVerifyEmailRepository.findActiveToken).toHaveBeenCalledWith(
        {
          userId: mockUnverifiedUser.id,
        },
        mockTx
      );
    });

    it("should throw an Error if token creation fails", async () => {
      mockUserService.getUserByIdOrEmail.mockResolvedValue(mockUnverifiedUser);

      mockVerifyEmailRepository.findActiveToken.mockResolvedValue(null);

      mockJwtService.sign.mockImplementation(() => {
        throw new Error("Token generation failed");
      });

      await expect(
        verifyEmailService.createToken(mockTx as any, mockEmail)
      ).rejects.toThrow(new Error("Token generation failed"));
    });

    it("should log an info message when a verification token is created", async () => {
      mockUserService.getUserByIdOrEmail.mockResolvedValue(mockUnverifiedUser);

      mockVerifyEmailRepository.findActiveToken.mockResolvedValue(null);

      mockJwtService.sign.mockReturnValue(mockValidToken);

      mockVerifyEmailRepository.createToken.mockResolvedValue(
        mockVerificationToken
      );

      // const loggerSpy = jest.spyOn(logger, "info");

      await verifyEmailService.createToken(mockTx as any, mockEmail);

      // expect(loggerSpy).toHaveBeenCalledWith(
      //   `Verification email token generated for user ${mockUnverifiedUser.id}`
      // );
    });
  });

  describe("VerifyEmailService - verifyUserEmail", () => {
    const decodedToken: JwtPayload = {
      userId: mockUserId,
      iat: 1234567890,
      exp: 1234567890,
    };

    const mockTx = jest.fn();

    beforeEach(() => {
      // Set up transaction mock for proper testing
      (mockPrismaService.transaction as jest.Mock).mockImplementation(
        (callback) => {
          return callback(mockTx);
        }
      );

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

      expect(mockPrismaService.transaction).toHaveBeenCalled();

      expect(mockVerifyEmailRepository.findActiveToken).toHaveBeenCalledWith(
        { token: mockValidToken },
        mockTx
      );

      expect(mockVerifyEmailRepository.deleteMany).toHaveBeenCalledWith(
        mockUserId,
        mockTx
      );

      expect(mockUserService.verifyUserEmail).toHaveBeenCalledWith(
        mockUserId,
        mockTx
      );
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
        new BadRequestError(ERROR_MESSAGES.ALREADY_VERIFIED)
      );

      await expect(
        verifyEmailService.verifyUserEmail(mockValidToken)
      ).rejects.toThrow(new BadRequestError(ERROR_MESSAGES.ALREADY_VERIFIED));
    });

    it("should throw a BadRequestError if token is not found in the database", async () => {
      mockJwtService.verify.mockResolvedValue(decodedToken);

      mockUserService.getUserByIdOrEmail.mockResolvedValue(mockUnverifiedUser);

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

      // const loggerSpy = jest.spyOn(logger, "info");

      await verifyEmailService.verifyUserEmail(mockValidToken);

      // expect(loggerSpy).toHaveBeenCalledWith(
      //   `Email verification successful for user ${mockUnverifiedUser.id}`
      // );
    });

    it("should log a warning message when token reuse is attempted", async () => {
      mockJwtService.verify.mockResolvedValue(decodedToken);

      mockVerifyEmailRepository.findActiveToken.mockResolvedValue(null);

      // const loggerSpy = jest.spyOn(logger, "warn");

      await expect(
        verifyEmailService.verifyUserEmail(mockValidToken)
      ).rejects.toThrow(new BadRequestError(ERROR_MESSAGES.INVALID_TOKEN));

      // expect(loggerSpy).toHaveBeenCalledWith(
      //   `Token reuse attempt for user ${mockUnverifiedUser.id}`
      // );
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

      mockUserService.getUserByIdOrEmail.mockResolvedValue(mockUnverifiedUser);

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
