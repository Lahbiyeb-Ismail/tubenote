import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "@/modules/shared/api-errors";

import { ERROR_MESSAGES } from "@/modules/shared/constants";

import { ResetPasswordService } from "@/modules/auth/features";

import type { IUserService, User } from "@/modules/user";

import type {
  ICacheService,
  ICryptoService,
  ILoggerService,
  IMailSenderService,
} from "@/modules/shared/services";
import { mock, mockReset } from "jest-mock-extended";

describe("ResetPasswordService test suites", () => {
  const userService = mock<IUserService>();
  const cryptoService = mock<ICryptoService>();
  const cacheService = mock<ICacheService>();
  const mailSenderService = mock<IMailSenderService>();
  const loggerService = mock<ILoggerService>();

  const resetPasswordService = ResetPasswordService.getInstance({
    userService,
    cryptoService,
    cacheService,
    mailSenderService,
    loggerService,
  });

  beforeEach(() => {
    mockReset(userService);
    mockReset(cryptoService);
    mockReset(cacheService);
    mockReset(mailSenderService);
    mockReset(loggerService);
  });

  const mockEmail = "test@example.com";
  const mockUserId = "user-id-123";

  const mockUser: User = {
    id: mockUserId,
    email: "test@example.com",
    username: "testuser",
    password: "hashedpassword",
    isEmailVerified: true,
    profilePicture: null,
    createdAt: new Date(),
    updatedAt: new Date(),
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
      userService.getUserByIdOrEmail.mockResolvedValue(mockUser);

      cryptoService.generateRandomSecureToken.mockReturnValue(mockValidToken);

      cacheService.set.mockReturnValue(true);

      mailSenderService.sendResetPasswordEmail.mockResolvedValue(undefined);

      await resetPasswordService.sendResetToken(mockEmail);

      expect(userService.getUserByIdOrEmail).toHaveBeenCalledWith({
        email: mockEmail,
      });

      expect(cryptoService.generateRandomSecureToken).toHaveBeenCalled();

      expect(cacheService.set).toHaveBeenCalledWith(mockValidToken, {
        userId: mockUserId,
      });

      expect(mailSenderService.sendResetPasswordEmail).toHaveBeenCalledWith(
        mockEmail,
        mockValidToken
      );
    });

    it("should throw a NotFoundError for a not registered email", async () => {
      userService.getUserByIdOrEmail.mockRejectedValue(
        new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND)
      );

      await expect(
        resetPasswordService.sendResetToken("nonexistent@test.com")
      ).rejects.toThrow(NotFoundError);

      expect(cryptoService.generateRandomSecureToken).not.toHaveBeenCalled();

      expect(cacheService.set).not.toHaveBeenCalled();

      expect(mailSenderService.sendResetPasswordEmail).not.toHaveBeenCalled();
    });

    it("should throw a ForbiddenError if the email is not verified", async () => {
      userService.getUserByIdOrEmail.mockResolvedValue({
        ...mockUser,
        isEmailVerified: false,
      });

      await expect(
        resetPasswordService.sendResetToken(mockEmail)
      ).rejects.toThrow(new ForbiddenError(ERROR_MESSAGES.NOT_VERIFIED));

      expect(userService.getUserByIdOrEmail).toHaveBeenCalledWith({
        email: mockEmail,
      });

      expect(cryptoService.generateRandomSecureToken).not.toHaveBeenCalled();

      expect(cacheService.set).not.toHaveBeenCalled();

      expect(mailSenderService.sendResetPasswordEmail).not.toHaveBeenCalled();
    });

    it("should propagate userService errors", async () => {
      const error = new Error("Failed to get user");

      userService.getUserByIdOrEmail.mockRejectedValue(error);

      await expect(
        resetPasswordService.sendResetToken(mockEmail)
      ).rejects.toThrow(error);
    });

    it("should propagate mailSenderService errors", async () => {
      const error = new Error("Failed to send email");

      userService.getUserByIdOrEmail.mockResolvedValue(mockUser);

      mailSenderService.sendResetPasswordEmail.mockRejectedValue(error);

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

      (cacheService.del as jest.Mock).mockResolvedValue(true);

      userService.resetUserPassword.mockResolvedValue({
        ...mockUser,
        password: hashedPassword,
      });

      await resetPasswordService.resetPassword(mockValidToken, newPassword);

      expect(resetPasswordService.verifyResetToken).toHaveBeenCalledWith(
        mockValidToken
      );

      expect(cacheService.del).toHaveBeenCalledWith(mockValidToken);

      expect(userService.resetUserPassword).toHaveBeenCalledWith({
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

      expect(cacheService.del).not.toHaveBeenCalled();

      expect(userService.resetUserPassword).not.toHaveBeenCalled();
    });

    it("should propagate userService errors during password reset", async () => {
      const error = new Error("Password reset failed");

      jest
        .spyOn(resetPasswordService, "verifyResetToken")
        .mockResolvedValue(mockUserId);

      userService.resetUserPassword.mockRejectedValue(error);

      await expect(
        resetPasswordService.resetPassword(mockValidToken, "newPassword")
      ).rejects.toThrow(error);

      expect(cacheService.del).toHaveBeenCalled();
    });
  });

  describe("ResetPasswordService - verifyResetToken", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should return userId for a valid reset token", async () => {
      cacheService.get.mockReturnValue({
        userId: mockUserId,
      });

      const result =
        await resetPasswordService.verifyResetToken(mockValidToken);

      expect(result).toEqual(mockUserId);

      expect(cacheService.get).toHaveBeenCalledWith(mockValidToken);
    });

    it("should throw a BadRequestError for an invalid or expired token", async () => {
      const error = new BadRequestError(ERROR_MESSAGES.INVALID_TOKEN);

      cacheService.get.mockReturnValue(null);

      await expect(
        resetPasswordService.verifyResetToken(mockInvalidToken)
      ).rejects.toThrow(error);
    });

    it("should throw error if cached token data is malformed", async () => {
      // Missing userId
      cacheService.get.mockReturnValue({});

      await expect(
        resetPasswordService.verifyResetToken(mockValidToken)
      ).rejects.toThrow(new BadRequestError(ERROR_MESSAGES.INVALID_TOKEN));

      // Invalid userId type
      cacheService.get.mockReturnValue({ userId: 12345 });
      await expect(
        resetPasswordService.verifyResetToken(mockValidToken)
      ).rejects.toThrow(new BadRequestError(ERROR_MESSAGES.INVALID_TOKEN));
    });

    it("should propagate cacheService errors during token verification", async () => {
      const error = new Error("Cache read failure");
      cacheService.get.mockImplementation(() => {
        throw error;
      });

      await expect(
        resetPasswordService.verifyResetToken(mockValidToken)
      ).rejects.toThrow(error);
    });
  });
});
