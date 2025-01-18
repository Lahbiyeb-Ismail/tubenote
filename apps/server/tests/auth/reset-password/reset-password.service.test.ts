import { ERROR_MESSAGES } from "../../../src/constants/error-messages.contants";
import { ForbiddenError, NotFoundError } from "../../../src/errors";

import type { ResetPasswordToken } from "../../../src/modules/auth/reset-password/reset-password.model";
import type { User } from "../../../src/modules/user/user.model";

import { ResetPasswordService } from "../../../src/modules/auth/reset-password/reset-password.service";

import type {
  IResetPasswordRespository,
  IResetPasswordService,
} from "../../../src/modules/auth/reset-password/reset-password.types";
import type { IMailSenderService } from "../../../src/modules/mailSender/mail-sender.types";
import type { IPasswordHasherService } from "../../../src/modules/password-hasher/password-hasher.types";
import type { IUserRepository } from "../../../src/modules/user/user.types";

describe("resetPasswordService tests", () => {
  let resetPasswordService: IResetPasswordService;
  let mockResetPasswordRepository: IResetPasswordRespository;
  let mockUserRpository: IUserRepository;
  let mockPasswordHasherService: IPasswordHasherService;
  let mockMailSenderService: IMailSenderService;

  beforeEach(() => {
    mockResetPasswordRepository = {
      create: jest.fn(),
      findByUserId: jest.fn(),
      findByToken: jest.fn(),
      deleteMany: jest.fn(),
    };

    mockUserRpository = {
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
      mockUserRpository,
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
    expiresAt: new Date(Date.now() + 3600000), // 1 hour from now
    createdAt: new Date(),
  };

  const mockExpiredResetToken: ResetPasswordToken = {
    id: "2",
    userId: "user123",
    token: mockExpiredToken,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() - 3600000), // 1 hour ago
  };

  beforeAll(() => {
    jest.clearAllMocks();
  });

  describe("sendResetToken email method tests", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should throw a ForbiddenError if the user is not found", async () => {
      (mockUserRpository.findByEmail as jest.Mock).mockResolvedValue(null);

      await expect(
        resetPasswordService.sendResetToken(mockEmail)
      ).rejects.toThrow(new ForbiddenError(ERROR_MESSAGES.FORBIDDEN));

      expect(mockUserRpository.findByEmail).toHaveBeenCalledWith(mockEmail);

      expect(mockUserRpository.findByEmail).toHaveBeenCalledTimes(1);
    });

    it("should throw a ForbiddenError if the user's email is not verified", async () => {
      (mockUserRpository.findByEmail as jest.Mock).mockResolvedValue({
        ...mockUser,
        isEmailVerified: false,
      });

      await expect(
        resetPasswordService.sendResetToken(mockEmail)
      ).rejects.toThrow(new ForbiddenError(ERROR_MESSAGES.EMAIL_NOT_VERIFIED));

      expect(mockUserRpository.findByEmail).toHaveBeenCalledWith(mockEmail);

      expect(mockUserRpository.findByEmail).toHaveBeenCalledTimes(1);
    });

    it("should throw a ForbiddenError if the reset token is already sent", async () => {
      (mockUserRpository.findByEmail as jest.Mock).mockResolvedValue(mockUser);

      (mockResetPasswordRepository.findByUserId as jest.Mock).mockResolvedValue(
        mockValidResetToken
      );

      await expect(
        resetPasswordService.sendResetToken(mockEmail)
      ).rejects.toThrow(new ForbiddenError(ERROR_MESSAGES.RESET_LINK_SENT));

      expect(mockUserRpository.findByEmail).toHaveBeenCalledWith(mockEmail);

      expect(mockUserRpository.findByEmail).toHaveBeenCalledTimes(1);

      expect(mockResetPasswordRepository.findByUserId).toHaveBeenCalledWith(
        mockUser.id
      );

      expect(mockValidResetToken.userId).toBe(mockUser.id);
    });

    it("should send a reset token email", async () => {
      (mockUserRpository.findByEmail as jest.Mock).mockResolvedValue(mockUser);

      (mockResetPasswordRepository.findByUserId as jest.Mock).mockResolvedValue(
        null
      );

      jest
        .spyOn(resetPasswordService, "createToken")
        .mockResolvedValue(mockValidResetToken.token);

      await resetPasswordService.sendResetToken(mockEmail);

      expect(mockUserRpository.findByEmail).toHaveBeenCalledWith(mockEmail);

      expect(mockUserRpository.findByEmail).toHaveBeenCalledTimes(1);

      expect(mockResetPasswordRepository.findByUserId).toHaveBeenCalledWith(
        mockUser.id
      );

      expect(mockResetPasswordRepository.findByUserId).toHaveBeenCalledTimes(1);
    });
  });

  describe("createToken method tests", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should create a reset token", async () => {
      (mockResetPasswordRepository.create as jest.Mock).mockResolvedValue(
        mockValidToken
      );

      const result = await resetPasswordService.createToken(mockUser.id);

      expect(result).toBe(mockValidToken);
      expect(typeof result).toBe("string");
    });
  });

  describe("resetPassword method tests", () => {
    beforeEach(() => {
      jest.clearAllMocks();
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

      // expect(mockPasswordHasherService.updatePassword).not.toHaveBeenCalled();

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

      // expect(mockPasswordHasherService.updatePassword).not.toHaveBeenCalled();
    });

    // it("should reset the user's password", async () => {
    //   const newPassword = "newpassword123";

    //   jest
    //     .spyOn(resetPasswordService, "findResetToken")
    //     .mockResolvedValue(mockValidResetToken);

    //   jest
    //     .spyOn(resetPasswordService, "isResetTokenExpired")
    //     .mockResolvedValue(false);

    //   (mockPasswordHasherService.hashPassword as jest.Mock).mockResolvedValue(
    //     "hashedPassword"
    //   );

    //   (mockUserRpository.updateUser as jest.Mock).mockResolvedValue({
    //     ...mockUser,
    //     password: "hashedPassword",
    //   });

    //   await resetPasswordService.resetPassword(mockValidToken, newPassword);

    //   expect(resetPasswordService.findResetToken).toHaveBeenCalledWith(
    //     mockValidToken
    //   );

    //   expect(resetPasswordService.isResetTokenExpired).toHaveBeenCalledWith(
    //     mockValidResetToken
    //   );

    //   expect(mockUserRpository.updateUser).toHaveBeenCalledWith({
    //     userId: mockValidResetToken.userId,
    //     password: "newpassword123",
    //   });

    //   expect(mockResetPasswordRepository.deleteMany).toHaveBeenCalledWith(
    //     mockValidResetToken.userId
    //   );
    // });
  });

  describe("findResetToken method tests", () => {
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

  describe("verifyResetToken method tests", () => {
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
