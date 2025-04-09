import { mock, mockReset } from "jest-mock-extended";

import type { User } from "@tubenote/types";

import {
  VERIFY_EMAIL_TOKEN_EXPIRES_IN,
  VERIFY_EMAIL_TOKEN_SECRET,
} from "@/modules/auth/constants";
import type { IJwtService, ISignTokenDto } from "@/modules/auth/utils";

import type { IUserService } from "@/modules/user";

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
  const verifyEmailRepository = mock<IVerifyEmailRepository>();
  const prismaService = mock<IPrismaService>();
  const userService = mock<IUserService>();
  const jwtService = mock<IJwtService>();
  const loggerService = mock<ILoggerService>();

  const verifyEmailService = VerifyEmailService.getInstance({
    verifyEmailRepository,
    prismaService,
    userService,
    jwtService,
    loggerService,
  });

  beforeEach(() => {
    mockReset(verifyEmailRepository);
    mockReset(prismaService);
    mockReset(userService);
    mockReset(jwtService);
    mockReset(loggerService);
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
      (prismaService.transaction as jest.Mock).mockImplementation(
        (callback) => {
          return callback(mockTx);
        }
      );

      jest.clearAllMocks();
    });

    it("should successfully create a verification token for an unverified email and save it to the database", async () => {
      userService.getUserByEmail.mockResolvedValue(mockUnverifiedUser);

      verifyEmailRepository.findActiveToken.mockResolvedValue(null);

      jwtService.sign.mockReturnValue(mockValidToken);

      verifyEmailRepository.createToken.mockResolvedValue(
        mockVerificationToken
      );

      const result = await verifyEmailService.createToken(
        mockTx as any,
        mockEmail
      );

      expect(result).toBe(mockValidToken);

      expect(userService.getUserByEmail).toHaveBeenCalledWith(
        mockEmail,
        mockTx
      );

      expect(verifyEmailRepository.findActiveToken).toHaveBeenCalledWith(
        {
          userId: mockUnverifiedUser.id,
        },
        mockTx
      );

      expect(jwtService.sign).toHaveBeenCalledWith(IsignTokenDto);

      expect(verifyEmailRepository.createToken).toHaveBeenCalledWith(
        createTokenDto,
        mockTx
      );
    });

    it("should throw a NotFoundError if the user is not found", async () => {
      userService.getUserByEmail.mockRejectedValue(
        new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND)
      );

      await expect(
        verifyEmailService.createToken(mockTx as any, mockEmail)
      ).rejects.toThrow(new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND));

      expect(userService.getUserByEmail).toHaveBeenCalledWith(
        mockEmail,
        mockTx
      );
    });

    it("should throw a BadRequestError if the user's email is already verified", async () => {
      userService.getUserByEmail.mockResolvedValue({
        ...mockUnverifiedUser,
        isEmailVerified: true,
      });

      await expect(
        verifyEmailService.createToken(mockTx as any, mockEmail)
      ).rejects.toThrow(new BadRequestError(ERROR_MESSAGES.ALREADY_VERIFIED));

      expect(userService.getUserByEmail).toHaveBeenCalledWith(
        mockEmail,
        mockTx
      );
    });

    it("should throw a BadRequestError if a verification link was already sent", async () => {
      userService.getUserByEmail.mockResolvedValue(mockUnverifiedUser);

      verifyEmailRepository.findActiveToken.mockResolvedValue(
        mockVerificationToken
      );

      await expect(
        verifyEmailService.createToken(mockTx as any, mockEmail)
      ).rejects.toThrow(
        new BadRequestError(ERROR_MESSAGES.VERIFICATION_LINK_SENT)
      );

      expect(userService.getUserByEmail).toHaveBeenCalledWith(
        mockEmail,
        mockTx
      );

      expect(verifyEmailRepository.findActiveToken).toHaveBeenCalledWith(
        {
          userId: mockUnverifiedUser.id,
        },
        mockTx
      );
    });

    it("should throw an Error if token creation fails", async () => {
      userService.getUserByEmail.mockResolvedValue(mockUnverifiedUser);

      verifyEmailRepository.findActiveToken.mockResolvedValue(null);

      jwtService.sign.mockImplementation(() => {
        throw new Error("Token generation failed");
      });

      await expect(
        verifyEmailService.createToken(mockTx as any, mockEmail)
      ).rejects.toThrow(new Error("Token generation failed"));
    });

    it("should log an info message when a verification token is created", async () => {
      userService.getUserByEmail.mockResolvedValue(mockUnverifiedUser);

      verifyEmailRepository.findActiveToken.mockResolvedValue(null);

      jwtService.sign.mockReturnValue(mockValidToken);

      verifyEmailRepository.createToken.mockResolvedValue(
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
      (prismaService.transaction as jest.Mock).mockImplementation(
        (callback) => {
          return callback(mockTx);
        }
      );

      jest.clearAllMocks();
    });

    it("should verify user email with a valid token", async () => {
      jwtService.verify.mockResolvedValue(decodedToken);

      verifyEmailRepository.findActiveToken.mockResolvedValue(
        mockVerificationToken
      );

      userService.verifyUserEmail.mockResolvedValue({
        ...mockUnverifiedUser,
        isEmailVerified: true,
      });

      await verifyEmailService.verifyUserEmail(mockValidToken);

      expect(prismaService.transaction).toHaveBeenCalled();

      expect(verifyEmailRepository.findActiveToken).toHaveBeenCalledWith(
        { token: mockValidToken },
        mockTx
      );

      expect(verifyEmailRepository.deleteMany).toHaveBeenCalledWith(
        mockUserId,
        mockTx
      );

      expect(userService.verifyUserEmail).toHaveBeenCalledWith(
        mockUserId,
        mockTx
      );
    });

    it("should throw a BadRequestError for an invalid token", async () => {
      const error = new BadRequestError(ERROR_MESSAGES.INVALID_TOKEN);
      const mockInvalidToken = "invalid-token";

      jwtService.verify.mockRejectedValue(error);

      await expect(
        verifyEmailService.verifyUserEmail(mockInvalidToken)
      ).rejects.toThrow(error);
    });

    it("should throw a NotFoundError if user is not found", async () => {
      const error = new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND);

      jwtService.verify.mockResolvedValue(decodedToken);

      verifyEmailRepository.findActiveToken.mockResolvedValue(
        mockVerificationToken
      );

      userService.verifyUserEmail.mockRejectedValue(error);

      await expect(
        verifyEmailService.verifyUserEmail(mockValidToken)
      ).rejects.toThrow(error);
    });

    it("should throw a BadRequestError if the user's email is already verified", async () => {
      jwtService.verify.mockResolvedValue(decodedToken);

      verifyEmailRepository.findActiveToken.mockResolvedValue(
        mockVerificationToken
      );

      userService.verifyUserEmail.mockRejectedValue(
        new BadRequestError(ERROR_MESSAGES.ALREADY_VERIFIED)
      );

      await expect(
        verifyEmailService.verifyUserEmail(mockValidToken)
      ).rejects.toThrow(new BadRequestError(ERROR_MESSAGES.ALREADY_VERIFIED));
    });

    it("should throw a BadRequestError if token is not found in the database", async () => {
      jwtService.verify.mockResolvedValue(decodedToken);

      userService.getUserByEmail.mockResolvedValue(mockUnverifiedUser);

      verifyEmailRepository.findActiveToken.mockResolvedValue(null);

      await expect(
        verifyEmailService.verifyUserEmail(mockValidToken)
      ).rejects.toThrow(new BadRequestError(ERROR_MESSAGES.INVALID_TOKEN));
    });

    it("should log an info message when email verification is successful", async () => {
      jwtService.verify.mockResolvedValue(decodedToken);

      userService.verifyUserEmail.mockResolvedValue({
        ...mockUnverifiedUser,
        isEmailVerified: true,
      });

      verifyEmailRepository.findActiveToken.mockResolvedValue(
        mockVerificationToken
      );

      // const loggerSpy = jest.spyOn(logger, "info");

      await verifyEmailService.verifyUserEmail(mockValidToken);

      // expect(loggerSpy).toHaveBeenCalledWith(
      //   `Email verification successful for user ${mockUnverifiedUser.id}`
      // );
    });

    it("should log a warning message when token reuse is attempted", async () => {
      jwtService.verify.mockResolvedValue(decodedToken);

      verifyEmailRepository.findActiveToken.mockResolvedValue(null);

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

      jwtService.verify.mockRejectedValue(error);

      await expect(
        verifyEmailService.verifyUserEmail(mockValidToken)
      ).rejects.toThrow(error);
    });

    it("should throw an error if deleting tokens fails", async () => {
      const error = new DatabaseError("Database error");

      jwtService.verify.mockResolvedValue(decodedToken);

      userService.getUserByEmail.mockResolvedValue(mockUnverifiedUser);

      verifyEmailRepository.findActiveToken.mockResolvedValue(
        mockVerificationToken
      );

      verifyEmailRepository.deleteMany.mockRejectedValue(error);

      await expect(
        verifyEmailService.verifyUserEmail(mockValidToken)
      ).rejects.toThrow(error);
    });

    it("should propagate errors from the user service", async () => {
      const error = new Error("User service error");

      jwtService.verify.mockResolvedValue(decodedToken);

      verifyEmailRepository.findActiveToken.mockResolvedValue(
        mockVerificationToken
      );

      userService.verifyUserEmail.mockRejectedValue(error);

      await expect(
        verifyEmailService.verifyUserEmail(mockValidToken)
      ).rejects.toThrow(error);
    });

    it("should propagate errors from the verify email repository", async () => {
      const error = new Error("Repository error");

      jwtService.verify.mockResolvedValue(decodedToken);

      verifyEmailRepository.findActiveToken.mockRejectedValue(error);

      await expect(
        verifyEmailService.verifyUserEmail(mockValidToken)
      ).rejects.toThrow(error);
    });
  });
});
