import { ForbiddenError, NotFoundError } from "@/errors";
import { ERROR_MESSAGES } from "@constants/error-messages.contants";

import type { ResetPasswordToken } from "@modules/auth/features/reset-password/reset-password.model";
import type { User } from "@modules/user/user.model";

import { ResetPasswordService } from "@modules/auth/features/reset-password/reset-password.service";

import type { IPasswordHasherService } from "@modules/auth/core/services/password-hasher/password-hasher.types";
import type {
  IResetPasswordRepository,
  IResetPasswordService,
} from "@modules/auth/features/reset-password/reset-password.types";
import type { IMailSenderService } from "@modules/mailSender/mail-sender.types";
import type { IUserRepository } from "@modules/user/user.types";

describe("ResetPasswordService test suites", () => {
  let resetPasswordService: IResetPasswordService;
  let mockResetPasswordRepository: IResetPasswordRepository;
  let mockUserRepository: IUserRepository;
  let mockPasswordHasherService: IPasswordHasherService;
  let mockMailSenderService: IMailSenderService;

  beforeEach(() => {
    mockResetPasswordRepository = {
      create: jest.fn(),
      findByUserId: jest.fn(),
      findByToken: jest.fn(),
      deleteMany: jest.fn(),
    };

    mockUserRepository = {
      create: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
      updatePassword: jest.fn(),
      updateUser: jest.fn(),
    };

    mockPasswordHasherService = {
      hashPassword: jest.fn(),
      comparePassword: jest.fn(),
    };

    mockMailSenderService = {
      sendVerificationEmail: jest.fn(),
      sendResetPasswordEmail: jest.fn(),
      sendMail: jest.fn(),
    };

    resetPasswordService = new ResetPasswordService(
      mockResetPasswordRepository,
      mockUserRepository,
      mockPasswordHasherService,
      mockMailSenderService
    );
  });

  const mockEmail = "test@example.com";

  const mockUser: User = {
    id: "user123",
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

  const mockValidToken = "valid-token";
  const mockExpiredToken = "expired-token";
  const mockNonExistentToken = "non-existent-token";

  const mockValidResetToken: ResetPasswordToken = {
    id: "1",
    token: mockValidToken,
    userId: "user123",
    createdAt: new Date(Date.now()),
    expiresAt: new Date(Date.now() + 3600000), // 1 hour from now
  };

  const mockExpiredResetToken: ResetPasswordToken = {
    id: "2",
    userId: "user123",
    token: mockExpiredToken,
    createdAt: new Date(Date.now()),
    expiresAt: new Date(Date.now() - 3600000), // 1 hour ago
  };

  beforeAll(() => {
    jest.clearAllMocks();
  });

  describe("ResetPasswordService - sendResetToken", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should successfully send reset token email", async () => {
      (mockUserRepository.findByEmail as jest.Mock).mockResolvedValue(mockUser);

      (mockResetPasswordRepository.findByUserId as jest.Mock).mockResolvedValue(
        null
      );

      await resetPasswordService.sendResetToken(mockEmail);

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(mockEmail);

      expect(mockResetPasswordRepository.findByUserId).toHaveBeenCalledWith(
        mockUser.id
      );

      expect(mockMailSenderService.sendResetPasswordEmail).toHaveBeenCalledWith(
        mockEmail
      );
    });

    it("should throw a ForbiddenError if user does not exist", async () => {
      (mockUserRepository.findByEmail as jest.Mock).mockResolvedValue(null);

      await expect(
        resetPasswordService.sendResetToken(mockEmail)
      ).rejects.toThrow(new ForbiddenError(ERROR_MESSAGES.FORBIDDEN));

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(mockEmail);

      expect(mockResetPasswordRepository.findByUserId).not.toHaveBeenCalled();

      expect(
        mockMailSenderService.sendResetPasswordEmail
      ).not.toHaveBeenCalled();
    });

    it("should throw a ForbiddenError if the user's email is not verified", async () => {
      (mockUserRepository.findByEmail as jest.Mock).mockResolvedValue({
        ...mockUser,
        isEmailVerified: false,
      });

      await expect(
        resetPasswordService.sendResetToken(mockEmail)
      ).rejects.toThrow(new ForbiddenError(ERROR_MESSAGES.EMAIL_NOT_VERIFIED));

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(mockEmail);

      expect(mockResetPasswordRepository.findByUserId).not.toHaveBeenCalled();

      expect(
        mockMailSenderService.sendResetPasswordEmail
      ).not.toHaveBeenCalled();
    });

    it("should throw a ForbiddenError if the reset token is already sent", async () => {
      (mockUserRepository.findByEmail as jest.Mock).mockResolvedValue(mockUser);

      (mockResetPasswordRepository.findByUserId as jest.Mock).mockResolvedValue(
        mockValidResetToken
      );

      await expect(
        resetPasswordService.sendResetToken(mockEmail)
      ).rejects.toThrow(new ForbiddenError(ERROR_MESSAGES.RESET_LINK_SENT));

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(mockEmail);

      expect(mockResetPasswordRepository.findByUserId).toHaveBeenCalledWith(
        mockUser.id
      );

      expect(mockValidResetToken.userId).toBe(mockUser.id);

      expect(
        mockMailSenderService.sendResetPasswordEmail
      ).not.toHaveBeenCalled();
    });
  });

  describe("ResetPasswordService - createToken", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should successfully create a reset token", async () => {
      (mockResetPasswordRepository.create as jest.Mock).mockResolvedValue(
        mockValidToken
      );

      const result = await resetPasswordService.createToken(mockUser.id);

      expect(result).toBe(mockValidToken);

      expect(typeof result).toBe("string");

      expect(mockResetPasswordRepository.create).toHaveBeenCalledWith(
        mockUser.id
      );
    });

    it("should handle unexpected errors from reset Token repository create method", async () => {
      const DbError = new Error("Database Error");

      (mockResetPasswordRepository.create as jest.Mock).mockRejectedValue(
        DbError
      );

      await expect(
        resetPasswordService.createToken(mockUser.id)
      ).rejects.toThrow(DbError);

      expect(mockResetPasswordRepository.create).toHaveBeenCalledWith(
        mockUser.id
      );
    });
  });

  describe("ResetPasswordService - resetPassword", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should reset the user's password", async () => {
      const newPassword = "newpassword123";
      const hashedPassword = "hashedPassword";

      jest
        .spyOn(resetPasswordService, "findResetToken")
        .mockResolvedValue(mockValidResetToken);

      jest
        .spyOn(resetPasswordService, "isResetTokenExpired")
        .mockResolvedValue(false);

      (mockPasswordHasherService.hashPassword as jest.Mock).mockResolvedValue(
        hashedPassword
      );

      (mockUserRepository.updatePassword as jest.Mock).mockResolvedValue({
        ...mockUser,
        password: hashedPassword,
      });

      await resetPasswordService.resetPassword(mockValidToken, newPassword);

      expect(resetPasswordService.findResetToken).toHaveBeenCalledWith(
        mockValidToken
      );

      expect(resetPasswordService.isResetTokenExpired).toHaveBeenCalledWith(
        mockValidResetToken
      );

      expect(mockUserRepository.updatePassword).toHaveBeenCalledWith(
        mockValidResetToken.userId,
        hashedPassword
      );

      expect(mockResetPasswordRepository.deleteMany).toHaveBeenCalledWith(
        mockValidResetToken.userId
      );
    });

    it("should throw a ForbiddenError if the reset token is invalid", async () => {
      jest
        .spyOn(resetPasswordService, "findResetToken")
        .mockResolvedValue(null);

      await expect(
        resetPasswordService.resetPassword(mockNonExistentToken, "password123")
      ).rejects.toThrow(new ForbiddenError(ERROR_MESSAGES.INVALID_TOKEN));

      expect(resetPasswordService.findResetToken).toHaveBeenCalledWith(
        mockNonExistentToken
      );

      expect(mockPasswordHasherService.hashPassword).not.toHaveBeenCalled();

      expect(mockUserRepository.updatePassword).not.toHaveBeenCalled();

      expect(mockResetPasswordRepository.deleteMany).not.toHaveBeenCalled();
    });

    it("should throw a ForbiddenError if the reset token is expired", async () => {
      jest
        .spyOn(resetPasswordService, "findResetToken")
        .mockResolvedValue(mockExpiredResetToken);

      jest
        .spyOn(resetPasswordService, "isResetTokenExpired")
        .mockResolvedValue(true);

      await expect(
        resetPasswordService.resetPassword(mockExpiredToken, "password123")
      ).rejects.toThrow(new ForbiddenError(ERROR_MESSAGES.EXPIRED_TOKEN));

      expect(resetPasswordService.findResetToken).toHaveBeenCalledWith(
        mockExpiredToken
      );

      expect(resetPasswordService.isResetTokenExpired).toHaveBeenCalledWith(
        mockExpiredResetToken
      );

      expect(mockResetPasswordRepository.deleteMany).toHaveBeenCalledWith(
        mockExpiredResetToken.userId
      );

      expect(mockPasswordHasherService.hashPassword).not.toHaveBeenCalled();

      expect(mockUserRepository.updatePassword).not.toHaveBeenCalled();
    });
  });

  describe("ResetPasswordService - findResetToken", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should return the found ResetToken", async () => {
      (mockResetPasswordRepository.findByToken as jest.Mock).mockResolvedValue(
        mockValidResetToken
      );

      const result = await resetPasswordService.findResetToken(mockValidToken);

      expect(result).toBeTruthy();
      expect(result).toBe(mockValidResetToken);
    });
  });

  describe("ResetPasswordService - verifyResetToken", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should return the reset token if valid", async () => {
      jest
        .spyOn(resetPasswordService, "findResetToken")
        .mockResolvedValue(mockValidResetToken);

      jest
        .spyOn(resetPasswordService, "isResetTokenExpired")
        .mockResolvedValue(false);

      const result =
        await resetPasswordService.verifyResetToken(mockValidToken);

      expect(result).toBe(mockValidResetToken);
      expect(resetPasswordService.findResetToken).toHaveBeenCalledWith(
        mockValidToken
      );
      expect(resetPasswordService.isResetTokenExpired).toHaveBeenCalledWith(
        mockValidResetToken
      );
    });

    it("should throw NotFoundError if the token is not found", async () => {
      jest
        .spyOn(resetPasswordService, "findResetToken")
        .mockResolvedValue(null);

      await expect(
        resetPasswordService.verifyResetToken(mockNonExistentToken)
      ).rejects.toThrow(new NotFoundError(ERROR_MESSAGES.INVALID_TOKEN));

      expect(resetPasswordService.findResetToken).toHaveBeenCalledWith(
        mockNonExistentToken
      );
      // expect(resetPasswordService.isResetTokenExpired).not.toHaveBeenCalled();
    });

    it("should throw ForbiddenError if the token is expired", async () => {
      jest
        .spyOn(resetPasswordService, "findResetToken")
        .mockResolvedValue(mockExpiredResetToken);

      jest
        .spyOn(resetPasswordService, "isResetTokenExpired")
        .mockResolvedValue(true);

      await expect(
        resetPasswordService.verifyResetToken(mockExpiredToken)
      ).rejects.toThrow(new ForbiddenError(ERROR_MESSAGES.EXPIRED_TOKEN));

      expect(resetPasswordService.findResetToken).toHaveBeenCalledWith(
        mockExpiredToken
      );
      expect(resetPasswordService.isResetTokenExpired).toHaveBeenCalledWith(
        mockExpiredResetToken
      );
      expect(mockResetPasswordRepository.deleteMany).toHaveBeenCalledWith(
        mockExpiredResetToken.userId
      );
    });
  });
});
