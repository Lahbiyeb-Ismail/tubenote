import { BadRequestError, ForbiddenError } from "@/modules/shared/api-errors";
import type {
  ICacheService,
  ICryptoService,
  ILoggerService,
  IMailSenderService,
} from "@/modules/shared/services";
import type { IUserService, User } from "@/modules/user";
import { mock, mockReset } from "jest-mock-extended";
import { ResetPasswordService } from "../reset-password.service";
import type { IResetPasswordServiceOptions } from "../reset-password.types";

describe("ResetPasswordService", () => {
  const userService = mock<IUserService>();
  const cryptoService = mock<ICryptoService>();
  const cacheService = mock<ICacheService>();
  const mailSenderService = mock<IMailSenderService>();
  const loggerService = mock<ILoggerService>();

  let resetPasswordService: ResetPasswordService;

  const serviceOptions: IResetPasswordServiceOptions = {
    userService,
    cryptoService,
    cacheService,
    mailSenderService,
    loggerService,
  };

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

  beforeEach(() => {
    mockReset(userService);
    mockReset(cryptoService);
    mockReset(cacheService);
    mockReset(mailSenderService);
    mockReset(loggerService);

    // Reset the singleton instance for isolation.
    // @ts-ignore: resetting private static property for testing purposes.
    ResetPasswordService._instance = undefined;

    resetPasswordService = ResetPasswordService.getInstance(serviceOptions);
  });

  describe("sendResetToken", () => {
    it("should throw ForbiddenError if the user email is not verified", async () => {
      // Arrange: simulate a user with unverified email.
      userService.getUserByIdOrEmail.mockResolvedValue({
        ...mockUser,
        isEmailVerified: false,
      });

      // Act & Assert
      await expect(
        resetPasswordService.sendResetToken(mockEmail)
      ).rejects.toThrow(ForbiddenError);

      expect(userService.getUserByIdOrEmail).toHaveBeenCalledWith({
        email: mockEmail,
      });
    });

    it("should generate a reset token, store it in cache, and send an email for a verified user", async () => {
      // Arrange: simulate a verified user.
      userService.getUserByIdOrEmail.mockResolvedValue(mockUser);

      cryptoService.generateRandomSecureToken.mockReturnValue(mockValidToken);

      // Act
      await resetPasswordService.sendResetToken(mockEmail);

      // Assert
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
      expect(loggerService.info).toHaveBeenCalledWith(
        expect.stringContaining(`Reset token generated for user ${mockUserId}`)
      );
    });

    it("should propagate mailSenderService errors", async () => {
      const error = new Error("Failed to send email");

      userService.getUserByIdOrEmail.mockResolvedValue(mockUser);

      cryptoService.generateRandomSecureToken.mockReturnValue(mockValidToken);

      mailSenderService.sendResetPasswordEmail.mockRejectedValue(error);

      await expect(
        resetPasswordService.sendResetToken(mockEmail)
      ).rejects.toThrow(error);
    });
  });

  describe("verifyResetToken", () => {
    it("should throw BadRequestError if no token data exists in cache", async () => {
      // Arrange: token not found.
      cacheService.get.mockReturnValue(null);

      // Act & Assert
      await expect(
        resetPasswordService.verifyResetToken("nonexistent-token")
      ).rejects.toThrow(BadRequestError);
      expect(loggerService.error).toHaveBeenCalledWith(
        expect.stringContaining("Invalid reset token: nonexistent-token")
      );
    });

    it("should throw BadRequestError if token data is invalid (missing userId)", async () => {
      // Arrange: token data exists but without valid userId.
      cacheService.get.mockReturnValue({ userId: null });

      // Act & Assert
      await expect(
        resetPasswordService.verifyResetToken("bad-token")
      ).rejects.toThrow(BadRequestError);
      expect(loggerService.error).toHaveBeenCalledWith(
        expect.stringContaining("Invalid reset token: bad-token")
      );
    });

    it("should return userId if token data is valid", async () => {
      // Arrange: token data with a valid userId.
      cacheService.get.mockReturnValue({ userId: mockUserId });

      // Act
      const userId = await resetPasswordService.verifyResetToken("valid-token");

      // Assert
      expect(userId).toBe(mockUserId);
    });

    it("should throw error if cached token data is malformed", async () => {
      // Missing userId
      cacheService.get.mockReturnValue({});

      await expect(
        resetPasswordService.verifyResetToken(mockValidToken)
      ).rejects.toThrow(BadRequestError);

      // Invalid userId type
      cacheService.get.mockReturnValue({ userId: 12345 });
      await expect(
        resetPasswordService.verifyResetToken(mockValidToken)
      ).rejects.toThrow(BadRequestError);
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

  describe("resetPassword", () => {
    it("should verify the reset token, delete it from cache, and reset the user's password", async () => {
      // Arrange: simulate valid token data.
      cacheService.get.mockReturnValue({ userId: mockUserId });
      const testToken = "valid-token";
      const newPassword = "newPassword123";

      // Act
      await resetPasswordService.resetPassword(testToken, newPassword);

      // Assert: verify that verifyResetToken returns the userId,
      // and then the token is deleted and user password is reset.
      expect(cacheService.get).toHaveBeenCalledWith(testToken);
      expect(cacheService.del).toHaveBeenCalledWith(testToken);
      expect(userService.resetUserPassword).toHaveBeenCalledWith({
        id: mockUserId,
        newPassword,
      });
      expect(loggerService.warn).toHaveBeenCalledWith(
        expect.stringContaining(`Remove reset token ${testToken} from cache`)
      );
      expect(loggerService.info).toHaveBeenCalledWith(
        expect.stringContaining(`Password reset for user ${mockUserId}`)
      );
    });

    it("should propagate errors thrown by verifyResetToken", async () => {
      // Arrange: simulate invalid token so that verifyResetToken throws an error.
      cacheService.get.mockReturnValue(null);
      const testToken = "invalid-token";
      const newPassword = "newPassword123";

      // Act & Assert
      await expect(
        resetPasswordService.resetPassword(testToken, newPassword)
      ).rejects.toThrow(BadRequestError);
      // Ensure that if verifyResetToken fails, resetUserPassword is never called.
      expect(userService.resetUserPassword).not.toHaveBeenCalled();
    });
  });
});
