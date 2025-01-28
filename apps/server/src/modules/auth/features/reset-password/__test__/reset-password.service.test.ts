import {
  RESET_PASSWORD_TOKEN_EXPIRES_IN,
  RESET_PASSWORD_TOKEN_SECRET,
} from "@/constants/auth.contants";
import {
  BadRequestError,
  DatabaseError,
  ForbiddenError,
  NotFoundError,
} from "@/errors";
import { ERROR_MESSAGES } from "@constants/error-messages.contants";

import { stringToDate } from "@utils/convert-string-to-date";

import type { JwtPayload } from "@/types";

import type { ResetPasswordToken } from "@modules/auth/features/reset-password/reset-password.model";
import type { User } from "@modules/user/user.model";

import { ResetPasswordService } from "@modules/auth/features/reset-password/reset-password.service";

import type { IJwtService } from "@/modules/auth/utils/services/jwt/jwt.types";
import type {
  IResetPasswordRepository,
  IResetPasswordService,
} from "@modules/auth/features/reset-password/reset-password.types";
import type { IMailSenderService } from "@modules/mailSender/mail-sender.types";
import type { IUserService } from "@modules/user/user.types";

jest.mock("@utils/convert-string-to-date");

describe("ResetPasswordService test suites", () => {
  let resetPasswordService: IResetPasswordService;
  let mockResetPasswordRepository: IResetPasswordRepository;
  let mockUserService: IUserService;
  let mockJwtService: IJwtService;
  let mockMailSenderService: IMailSenderService;

  beforeEach(() => {
    mockResetPasswordRepository = {
      saveToken: jest.fn(),
      findByUserId: jest.fn(),
      findByToken: jest.fn(),
      deleteMany: jest.fn(),
    };

    mockUserService = {
      createUser: jest.fn(),
      findOrCreateUser: jest.fn(),
      getUserByEmail: jest.fn(),
      getUserById: jest.fn(),
      updateUser: jest.fn(),
      updatePassword: jest.fn(),
      resetPassword: jest.fn(),
    };

    mockJwtService = {
      sign: jest.fn(),
      verify: jest.fn(),
      generateAuthTokens: jest.fn(),
    };

    mockMailSenderService = {
      sendVerificationEmail: jest.fn(),
      sendResetPasswordEmail: jest.fn(),
      sendMail: jest.fn(),
    };

    resetPasswordService = new ResetPasswordService(
      mockResetPasswordRepository,
      mockUserService,
      mockJwtService,
      mockMailSenderService
    );
  });

  const mockEmail = "test@example.com";
  const mockUserId = "user-id-123";

  const mockUser: User = {
    id: mockUserId,
    email: "test@example.com",
    username: "testuser",
    password: "hashedpassword",
    isEmailVerified: true,
    googleId: "",
    profilePicture: "",
    createdAt: new Date(),
    updatedAt: new Date(),
    videoIds: [],
  };

  const mockExpiresInDate = stringToDate(RESET_PASSWORD_TOKEN_EXPIRES_IN);

  const mockValidToken = "valid-jwt-token";
  const mockNonExistentToken = "non-existent-token";

  const mockValidResetToken: ResetPasswordToken = {
    id: "1",
    token: mockValidToken,
    userId: mockUserId,
    createdAt: new Date(Date.now()),
    expiresAt: mockExpiresInDate, // 1 day from now
  };

  beforeAll(() => {
    jest.clearAllMocks();
  });

  describe("ResetPasswordService - sendResetToken", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should successfully send a reset password email if the user exist and save the generated reset token to the database", async () => {
      (mockUserService.getUserByEmail as jest.Mock).mockResolvedValue(mockUser);

      (mockResetPasswordRepository.findByUserId as jest.Mock).mockResolvedValue(
        null
      );

      (mockJwtService.sign as jest.Mock).mockReturnValue(mockValidToken);

      (mockResetPasswordRepository.saveToken as jest.Mock).mockResolvedValue(
        mockValidResetToken
      );

      (
        mockMailSenderService.sendResetPasswordEmail as jest.Mock
      ).mockResolvedValue(undefined);

      await resetPasswordService.sendResetToken(mockEmail);

      expect(mockUserService.getUserByEmail).toHaveBeenCalledWith(mockEmail);

      expect(mockResetPasswordRepository.findByUserId).toHaveBeenCalledWith(
        mockUser.id
      );

      expect(mockJwtService.sign).toHaveBeenCalledWith({
        userId: mockUser.id,
        secret: RESET_PASSWORD_TOKEN_SECRET,
        expiresIn: RESET_PASSWORD_TOKEN_EXPIRES_IN,
      });

      expect(mockResetPasswordRepository.saveToken).toHaveBeenCalledWith({
        userId: mockUser.id,
        token: mockValidToken,
        expiresAt: mockExpiresInDate,
      });

      expect(mockMailSenderService.sendResetPasswordEmail).toHaveBeenCalledWith(
        mockEmail,
        mockValidToken
      );
    });

    it("should throw a NotFoundError if user does not exist", async () => {
      (mockUserService.getUserByEmail as jest.Mock).mockResolvedValue(null);

      await expect(
        resetPasswordService.sendResetToken(mockEmail)
      ).rejects.toThrow(new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND));

      expect(mockUserService.getUserByEmail).toHaveBeenCalledWith(mockEmail);

      expect(mockResetPasswordRepository.findByUserId).not.toHaveBeenCalled();

      expect(mockJwtService.sign).not.toHaveBeenCalled();

      expect(mockResetPasswordRepository.saveToken).not.toHaveBeenCalled();

      expect(
        mockMailSenderService.sendResetPasswordEmail
      ).not.toHaveBeenCalled();
    });

    it("should throw a ForbiddenError if the user's email is not verified", async () => {
      (mockUserService.getUserByEmail as jest.Mock).mockResolvedValue({
        ...mockUser,
        isEmailVerified: false,
      });

      await expect(
        resetPasswordService.sendResetToken(mockEmail)
      ).rejects.toThrow(new ForbiddenError(ERROR_MESSAGES.EMAIL_NOT_VERIFIED));

      expect(mockUserService.getUserByEmail).toHaveBeenCalledWith(mockEmail);

      expect(mockResetPasswordRepository.findByUserId).not.toHaveBeenCalled();

      expect(mockJwtService.sign).not.toHaveBeenCalled();

      expect(mockResetPasswordRepository.saveToken).not.toHaveBeenCalled();

      expect(
        mockMailSenderService.sendResetPasswordEmail
      ).not.toHaveBeenCalled();
    });

    it("should throw a ForbiddenError if the reset token is already been sent", async () => {
      (mockUserService.getUserByEmail as jest.Mock).mockResolvedValue(mockUser);

      (mockResetPasswordRepository.findByUserId as jest.Mock).mockResolvedValue(
        mockValidResetToken
      );

      await expect(
        resetPasswordService.sendResetToken(mockEmail)
      ).rejects.toThrow(new ForbiddenError(ERROR_MESSAGES.RESET_LINK_SENT));

      expect(mockUserService.getUserByEmail).toHaveBeenCalledWith(mockEmail);

      expect(mockResetPasswordRepository.findByUserId).toHaveBeenCalledWith(
        mockUser.id
      );

      expect(mockValidResetToken.userId).toBe(mockUser.id);

      expect(mockJwtService.sign).not.toHaveBeenCalled();

      expect(mockResetPasswordRepository.saveToken).not.toHaveBeenCalled();

      expect(
        mockMailSenderService.sendResetPasswordEmail
      ).not.toHaveBeenCalled();
    });

    it("should propagate any error thrown by saveToken database method", async () => {
      const databaseError = new DatabaseError("Database error");

      (mockUserService.getUserByEmail as jest.Mock).mockResolvedValue(mockUser);

      (mockResetPasswordRepository.findByUserId as jest.Mock).mockResolvedValue(
        null
      );

      (mockJwtService.sign as jest.Mock).mockReturnValue(mockValidToken);

      (mockResetPasswordRepository.saveToken as jest.Mock).mockRejectedValue(
        databaseError
      );

      await expect(
        resetPasswordService.sendResetToken(mockEmail)
      ).rejects.toThrow(databaseError);
    });

    it("should propagate any error thrown by mailSenderService", async () => {
      const error = new Error("Failed to send email");

      (mockUserService.getUserByEmail as jest.Mock).mockResolvedValue(mockUser);

      (mockResetPasswordRepository.findByUserId as jest.Mock).mockResolvedValue(
        null
      );

      (mockJwtService.sign as jest.Mock).mockReturnValue(mockValidToken);

      (mockResetPasswordRepository.saveToken as jest.Mock).mockResolvedValue(
        mockValidResetToken
      );

      (
        mockMailSenderService.sendResetPasswordEmail as jest.Mock
      ).mockRejectedValue(error);

      await expect(
        resetPasswordService.sendResetToken(mockEmail)
      ).rejects.toThrow(error);
    });
  });

  describe("ResetPasswordService - resetPassword", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should successfully reset the user's password if the token is valid", async () => {
      const newPassword = "newpassword123";
      const hashedPassword = "hashedPassword";

      jest
        .spyOn(resetPasswordService, "verifyResetToken")
        .mockResolvedValue(mockValidResetToken);

      (mockUserService.resetPassword as jest.Mock).mockResolvedValue({
        ...mockUser,
        password: hashedPassword,
      });

      await resetPasswordService.resetPassword(mockValidToken, newPassword);

      expect(resetPasswordService.verifyResetToken).toHaveBeenCalledWith(
        mockValidToken
      );

      expect(mockUserService.resetPassword).toHaveBeenCalledWith(
        mockValidResetToken.userId,
        newPassword
      );

      expect(mockResetPasswordRepository.deleteMany).toHaveBeenCalledWith(
        mockValidResetToken.userId
      );
    });

    it("should throw a BadRequestError if the reset token is invalid or expired", async () => {
      const error = new BadRequestError(ERROR_MESSAGES.INVALID_TOKEN);

      jest
        .spyOn(resetPasswordService, "verifyResetToken")
        .mockRejectedValue(error);

      await expect(
        resetPasswordService.resetPassword(mockNonExistentToken, "password123")
      ).rejects.toThrow(error);

      expect(resetPasswordService.verifyResetToken).toHaveBeenCalledWith(
        mockNonExistentToken
      );

      expect(mockUserService.resetPassword).not.toHaveBeenCalled();

      expect(mockResetPasswordRepository.deleteMany).not.toHaveBeenCalled();
    });

    it("should propagate any error thrown by userService", async () => {
      const error = new Error("Failed to reset password");

      jest
        .spyOn(resetPasswordService, "verifyResetToken")
        .mockResolvedValue(mockValidResetToken);

      (mockUserService.resetPassword as jest.Mock).mockRejectedValue(error);

      await expect(
        resetPasswordService.resetPassword(mockValidToken, "password123")
      ).rejects.toThrow(error);

      expect(resetPasswordService.verifyResetToken).toHaveBeenCalledWith(
        mockValidToken
      );

      expect(mockUserService.resetPassword).toHaveBeenCalledWith(
        mockValidResetToken.userId,
        "password123"
      );

      expect(mockResetPasswordRepository.deleteMany).not.toHaveBeenCalled();
    });

    it("should propagate any error thrown by deleteMany database method", async () => {
      const databaseError = new DatabaseError("Failed to delete reset token");

      jest
        .spyOn(resetPasswordService, "verifyResetToken")
        .mockResolvedValue(mockValidResetToken);

      (mockUserService.resetPassword as jest.Mock).mockResolvedValue({
        ...mockUser,
        password: "hashedPassword",
      });

      (mockResetPasswordRepository.deleteMany as jest.Mock).mockRejectedValue(
        databaseError
      );

      await expect(
        resetPasswordService.resetPassword(mockValidToken, "password123")
      ).rejects.toThrow(databaseError);

      expect(resetPasswordService.verifyResetToken).toHaveBeenCalledWith(
        mockValidToken
      );

      expect(mockUserService.resetPassword).toHaveBeenCalledWith(
        mockValidResetToken.userId,
        "password123"
      );

      expect(mockResetPasswordRepository.deleteMany).toHaveBeenCalledWith(
        mockValidResetToken.userId
      );
    });
  });

  describe("ResetPasswordService - verifyResetToken", () => {
    const mockJwtPayload: JwtPayload = {
      userId: mockUserId,
      iat: 123456,
      exp: 123456,
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should return the reset token if it is valid", async () => {
      (mockJwtService.verify as jest.Mock).mockResolvedValue(mockJwtPayload);

      (mockUserService.getUserById as jest.Mock).mockResolvedValue(mockUser);

      (mockResetPasswordRepository.findByToken as jest.Mock).mockResolvedValue(
        mockValidResetToken
      );

      const result =
        await resetPasswordService.verifyResetToken(mockValidToken);

      expect(mockJwtService.verify).toHaveBeenCalledWith({
        token: mockValidToken,
        secret: RESET_PASSWORD_TOKEN_SECRET,
      });

      expect(result).toEqual(mockValidResetToken);

      expect(mockJwtService.verify).toHaveBeenCalledWith({
        token: mockValidToken,
        secret: RESET_PASSWORD_TOKEN_SECRET,
      });

      expect(mockUserService.getUserById).toHaveBeenCalledWith(mockUserId);

      expect(mockResetPasswordRepository.findByToken).toHaveBeenCalledWith(
        mockValidToken
      );
    });

    it("should throw a BadRequestError if the token is invalid", async () => {
      const error = new BadRequestError(ERROR_MESSAGES.INVALID_TOKEN);

      (mockJwtService.verify as jest.Mock).mockRejectedValue(error);

      await expect(
        resetPasswordService.verifyResetToken(mockNonExistentToken)
      ).rejects.toThrow(error);

      expect(mockJwtService.verify).toHaveBeenCalledWith({
        token: mockNonExistentToken,
        secret: RESET_PASSWORD_TOKEN_SECRET,
      });

      expect(mockUserService.getUserById).not.toHaveBeenCalled();

      expect(mockResetPasswordRepository.findByToken).not.toHaveBeenCalled();
    });

    it("should throw a BadRequestError if the user does not exist", async () => {
      const error = new BadRequestError(ERROR_MESSAGES.INVALID_TOKEN);

      (mockJwtService.verify as jest.Mock).mockResolvedValue(mockJwtPayload);

      (mockUserService.getUserById as jest.Mock).mockResolvedValue(null);

      await expect(
        resetPasswordService.verifyResetToken(mockValidToken)
      ).rejects.toThrow(error);

      expect(mockJwtService.verify).toHaveBeenCalledWith({
        token: mockValidToken,
        secret: RESET_PASSWORD_TOKEN_SECRET,
      });

      expect(mockUserService.getUserById).toHaveBeenCalledWith(mockUserId);

      expect(mockResetPasswordRepository.findByToken).not.toHaveBeenCalled();
    });

    it("should throw a BadRequestError if the reset token does not exist", async () => {
      const error = new BadRequestError(ERROR_MESSAGES.INVALID_TOKEN);

      (mockJwtService.verify as jest.Mock).mockResolvedValue(mockJwtPayload);

      (mockUserService.getUserById as jest.Mock).mockResolvedValue(mockUser);

      (mockResetPasswordRepository.findByToken as jest.Mock).mockResolvedValue(
        null
      );

      await expect(
        resetPasswordService.verifyResetToken(mockValidToken)
      ).rejects.toThrow(error);

      expect(mockJwtService.verify).toHaveBeenCalledWith({
        token: mockValidToken,
        secret: RESET_PASSWORD_TOKEN_SECRET,
      });

      expect(mockUserService.getUserById).toHaveBeenCalledWith(mockUserId);

      expect(mockResetPasswordRepository.findByToken).toHaveBeenCalledWith(
        mockValidToken
      );

      expect(mockResetPasswordRepository.deleteMany).toHaveBeenCalledWith(
        mockUser.id
      );
    });
  });
});
