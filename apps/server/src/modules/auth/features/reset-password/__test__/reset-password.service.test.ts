import {
  BadRequestError,
  ERROR_MESSAGES,
  ForbiddenError,
  NotFoundError,
} from "@modules/shared";

import { IResetPasswordService, ResetPasswordService } from "@modules/auth";

import type { IUserService, User } from "@modules/user";

import type {
  ICacheService,
  ICryptoService,
  ILoggerService,
  IMailSenderService,
} from "@modules/shared";

describe("ResetPasswordService test suites", () => {
  let resetPasswordService: IResetPasswordService;
  let mockUserService: IUserService;
  let mockCryptoService: ICryptoService;
  let mockCacheService: ICacheService;
  let mockMailSenderService: IMailSenderService;
  let mockLoggerService: ILoggerService;

  beforeEach(() => {
    mockUserService = {
      createUser: jest.fn(),
      getOrCreateUser: jest.fn(),
      getUser: jest.fn(),
      updateUser: jest.fn(),
      updatePassword: jest.fn(),
      resetPassword: jest.fn(),
      verifyUserEmail: jest.fn(),
    };

    mockCryptoService = {
      comparePasswords: jest.fn(),
      hashPassword: jest.fn(),
      generateRandomSecureToken: jest.fn(),
      hashToken: jest.fn(),
    };

    mockCacheService = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
      flush: jest.fn(),
      getStats: jest.fn(),
    };

    mockMailSenderService = {
      sendVerificationEmail: jest.fn(),
      sendResetPasswordEmail: jest.fn(),
      sendMail: jest.fn(),
    };

    mockLoggerService = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
      http: jest.fn(),
    };

    resetPasswordService = new ResetPasswordService(
      mockUserService,
      mockCryptoService,
      mockCacheService,
      mockMailSenderService,
      mockLoggerService
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

  const mockValidToken = "valid-reset-token";
  const mockInvalidToken = "invalid-reset-token";

  beforeAll(() => {
    jest.clearAllMocks();
  });

  describe("ResetPasswordService - sendResetToken", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should generate token, store it, and send email for valid user", async () => {
      (mockUserService.getUser as jest.Mock).mockResolvedValue(mockUser);

      (
        mockCryptoService.generateRandomSecureToken as jest.Mock
      ).mockReturnValue(mockValidToken);

      (mockCacheService.set as jest.Mock).mockReturnValue(true);

      (
        mockMailSenderService.sendResetPasswordEmail as jest.Mock
      ).mockResolvedValue(undefined);

      await resetPasswordService.sendResetToken(mockEmail);

      expect(mockUserService.getUser).toHaveBeenCalledWith({
        email: mockEmail,
      });

      expect(mockCryptoService.generateRandomSecureToken).toHaveBeenCalled();

      expect(mockCacheService.set).toHaveBeenCalledWith(mockValidToken, {
        userId: mockUserId,
      });

      expect(mockMailSenderService.sendResetPasswordEmail).toHaveBeenCalledWith(
        mockEmail,
        mockValidToken
      );
    });

    it("should throw a NotFoundError for a not registered email", async () => {
      (mockUserService.getUser as jest.Mock).mockRejectedValue(
        new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND)
      );

      await expect(
        resetPasswordService.sendResetToken("nonexistent@test.com")
      ).rejects.toThrow(NotFoundError);

      expect(
        mockCryptoService.generateRandomSecureToken
      ).not.toHaveBeenCalled();

      expect(mockCacheService.set).not.toHaveBeenCalled();

      expect(
        mockMailSenderService.sendResetPasswordEmail
      ).not.toHaveBeenCalled();
    });

    it("should throw a ForbiddenError if the email is not verified", async () => {
      (mockUserService.getUser as jest.Mock).mockResolvedValue({
        ...mockUser,
        isEmailVerified: false,
      });

      await expect(
        resetPasswordService.sendResetToken(mockEmail)
      ).rejects.toThrow(new ForbiddenError(ERROR_MESSAGES.NOT_VERIFIED));

      expect(mockUserService.getUser).toHaveBeenCalledWith({
        email: mockEmail,
      });

      expect(
        mockCryptoService.generateRandomSecureToken
      ).not.toHaveBeenCalled();

      expect(mockCacheService.set).not.toHaveBeenCalled();

      expect(
        mockMailSenderService.sendResetPasswordEmail
      ).not.toHaveBeenCalled();
    });

    it("should propagate userService errors", async () => {
      const error = new Error("Failed to get user");

      (mockUserService.getUser as jest.Mock).mockRejectedValue(error);

      await expect(
        resetPasswordService.sendResetToken(mockEmail)
      ).rejects.toThrow(error);
    });

    it("should propagate mailSenderService errors", async () => {
      const error = new Error("Failed to send email");

      (mockUserService.getUser as jest.Mock).mockResolvedValue(mockUser);

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

    it("should delete token and reset password for valid reset token", async () => {
      const newPassword = "newpassword123";
      const hashedPassword = "hashedPassword";

      jest
        .spyOn(resetPasswordService, "verifyResetToken")
        .mockResolvedValue(mockUserId);

      (mockCacheService.del as jest.Mock).mockResolvedValue(true);

      (mockUserService.resetPassword as jest.Mock).mockResolvedValue({
        ...mockUser,
        password: hashedPassword,
      });

      await resetPasswordService.resetPassword(mockValidToken, newPassword);

      expect(resetPasswordService.verifyResetToken).toHaveBeenCalledWith(
        mockValidToken
      );

      expect(mockCacheService.del).toHaveBeenCalledWith(mockValidToken);

      expect(mockUserService.resetPassword).toHaveBeenCalledWith({
        id: mockUserId,
        newPassword,
      });
    });

    it("should throw BadRequestError for invalid or expired token", async () => {
      const error = new BadRequestError(ERROR_MESSAGES.INVALID_TOKEN);

      jest
        .spyOn(resetPasswordService, "verifyResetToken")
        .mockRejectedValue(error);

      await expect(
        resetPasswordService.resetPassword(mockInvalidToken, "password123")
      ).rejects.toThrow(error);

      expect(resetPasswordService.verifyResetToken);

      expect(mockCacheService.del).not.toHaveBeenCalled();

      expect(mockUserService.resetPassword).not.toHaveBeenCalled();
    });

    it("should propagate userService errors during password reset", async () => {
      const error = new Error("Password reset failed");

      jest
        .spyOn(resetPasswordService, "verifyResetToken")
        .mockResolvedValue(mockUserId);

      (mockUserService.resetPassword as jest.Mock).mockRejectedValue(error);

      await expect(
        resetPasswordService.resetPassword(mockValidToken, "newPassword")
      ).rejects.toThrow(error);

      expect(mockCacheService.del).toHaveBeenCalled();
    });
  });

  describe("ResetPasswordService - verifyResetToken", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should return userId for a valid reset token", async () => {
      (mockCacheService.get as jest.Mock).mockReturnValue({
        userId: mockUserId,
      });

      const result =
        await resetPasswordService.verifyResetToken(mockValidToken);

      expect(result).toEqual(mockUserId);

      expect(mockCacheService.get).toHaveBeenCalledWith(mockValidToken);
    });

    it("should throw a BadRequestError for an invalid or expired token", async () => {
      const error = new BadRequestError(ERROR_MESSAGES.INVALID_TOKEN);

      (mockCacheService.get as jest.Mock).mockReturnValue(null);

      await expect(
        resetPasswordService.verifyResetToken(mockInvalidToken)
      ).rejects.toThrow(error);
    });

    it("should throw error if cached token data is malformed", async () => {
      // Missing userId
      (mockCacheService.get as jest.Mock).mockReturnValue({});

      await expect(
        resetPasswordService.verifyResetToken(mockValidToken)
      ).rejects.toThrow(new BadRequestError(ERROR_MESSAGES.INVALID_TOKEN));

      // Invalid userId type
      (mockCacheService.get as jest.Mock).mockReturnValue({ userId: 12345 });
      await expect(
        resetPasswordService.verifyResetToken(mockValidToken)
      ).rejects.toThrow(new BadRequestError(ERROR_MESSAGES.INVALID_TOKEN));
    });

    it("should propagate cacheService errors during token verification", async () => {
      const error = new Error("Cache read failure");
      (mockCacheService.get as jest.Mock).mockImplementation(() => {
        throw error;
      });

      await expect(
        resetPasswordService.verifyResetToken(mockValidToken)
      ).rejects.toThrow(error);
    });
  });
});
