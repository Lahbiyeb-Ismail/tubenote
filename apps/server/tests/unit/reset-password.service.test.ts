import { ERROR_MESSAGES } from "../../src/constants/errorMessages";
import { ForbiddenError, NotFoundError } from "../../src/errors";
import type { IPasswordService } from "../../src/modules/password/password.service";
import type { ResetTokenDto } from "../../src/modules/resetPasswordToken/dtos/reset-token.dto";
import type { IResetPasswordTokenDatabase } from "../../src/modules/resetPasswordToken/reset-password.db";
import {
  IResetPasswordService,
  ResetPasswordService,
} from "../../src/modules/resetPasswordToken/reset-password.service";
import type { UserDto } from "../../src/modules/user/dtos/user.dto";
import type { IUserService } from "../../src/modules/user/user.service";
import type { IEmailService } from "../../src/services/emailService";

describe("resetPasswordService tests", () => {
  let resetPasswordService: IResetPasswordService;
  let mockResetTokenDB: IResetPasswordTokenDatabase;
  let mockUserService: IUserService;
  let mockPasswordService: IPasswordService;
  let mockEmailService: IEmailService;

  beforeEach(() => {
    mockResetTokenDB = {
      create: jest.fn(),
      findByUserId: jest.fn(),
      findByToken: jest.fn(),
      deleteMany: jest.fn(),
    };

    mockUserService = {
      createUser: jest.fn(),
      getUserById: jest.fn(),
      verifyUserEmail: jest.fn(),
      getUserByEmail: jest.fn(),
      updateUser: jest.fn(),
    };

    mockPasswordService = {
      hashPassword: jest.fn(),
      comparePasswords: jest.fn(),
      updatePassword: jest.fn(),
      resetPassword: jest.fn(),
    };

    mockEmailService = {
      sendVerificationEmail: jest.fn(),
      createEmailVerififcationToken: jest.fn(),
      sendResetPasswordEmail: jest.fn(),
      sendEmail: jest.fn(),
    };

    resetPasswordService = new ResetPasswordService(
      mockResetTokenDB,
      mockUserService,
      mockPasswordService,
      mockEmailService
    );
  });

  const mockEmail = "test@example.com";

  const mockUser: UserDto = {
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

  const mockValidResetToken: ResetTokenDto = {
    id: "1",
    token: mockValidToken,
    userId: "user123",
    expiresAt: new Date(Date.now() + 3600000), // 1 hour from now
    createdAt: new Date(),
  };

  const mockExpiredResetToken: ResetTokenDto = {
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
      (mockUserService.getUserByEmail as jest.Mock).mockResolvedValue(null);

      await expect(
        resetPasswordService.sendResetToken(mockEmail)
      ).rejects.toThrow(new ForbiddenError(ERROR_MESSAGES.FORBIDDEN));

      expect(mockUserService.getUserByEmail).toHaveBeenCalledWith(mockEmail);

      expect(mockUserService.getUserByEmail).toHaveBeenCalledTimes(1);
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

      expect(mockUserService.getUserByEmail).toHaveBeenCalledTimes(1);
    });

    it("should throw a ForbiddenError if the reset token is already sent", async () => {
      (mockUserService.getUserByEmail as jest.Mock).mockResolvedValue(mockUser);

      (mockResetTokenDB.findByUserId as jest.Mock).mockResolvedValue(
        mockValidResetToken
      );

      await expect(
        resetPasswordService.sendResetToken(mockEmail)
      ).rejects.toThrow(new ForbiddenError(ERROR_MESSAGES.RESET_LINK_SENT));

      expect(mockUserService.getUserByEmail).toHaveBeenCalledWith(mockEmail);

      expect(mockUserService.getUserByEmail).toHaveBeenCalledTimes(1);

      expect(mockResetTokenDB.findByUserId).toHaveBeenCalledWith(mockUser.id);

      expect(mockValidResetToken.userId).toBe(mockUser.id);
    });

    it("should send a reset token email", async () => {
      (mockUserService.getUserByEmail as jest.Mock).mockResolvedValue(mockUser);

      (mockResetTokenDB.findByUserId as jest.Mock).mockResolvedValue(null);

      jest
        .spyOn(resetPasswordService, "createToken")
        .mockResolvedValue(mockValidResetToken.token);

      await resetPasswordService.sendResetToken(mockEmail);

      expect(mockUserService.getUserByEmail).toHaveBeenCalledWith(mockEmail);

      expect(mockUserService.getUserByEmail).toHaveBeenCalledTimes(1);

      expect(mockResetTokenDB.findByUserId).toHaveBeenCalledWith(mockUser.id);

      expect(mockResetTokenDB.findByUserId).toHaveBeenCalledTimes(1);
    });
  });

  describe("createToken method tests", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should create a reset token", async () => {
      (mockResetTokenDB.create as jest.Mock).mockResolvedValue(mockValidToken);

      const result = await resetPasswordService.createToken(mockUser.id);

      expect(result).toBe(mockValidToken);
      expect(typeof result).toBe("string");
    });
  });

  describe("reset method tests", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should throw a ForbiddenError if the reset token is invalid", async () => {
      jest
        .spyOn(resetPasswordService, "findResetToken")
        .mockResolvedValue(null);

      await expect(
        resetPasswordService.reset(mockNonExistentToken, "password123")
      ).rejects.toThrow(new ForbiddenError(ERROR_MESSAGES.INVALID_TOKEN));

      expect(resetPasswordService.findResetToken).toHaveBeenCalledWith(
        mockNonExistentToken
      );

      expect(mockPasswordService.hashPassword).not.toHaveBeenCalled();

      expect(mockPasswordService.updatePassword).not.toHaveBeenCalled();

      expect(mockResetTokenDB.deleteMany).not.toHaveBeenCalled();
    });

    it("should throw a ForbiddenError if the reset token is expired", async () => {
      jest
        .spyOn(resetPasswordService, "findResetToken")
        .mockResolvedValue(mockExpiredResetToken);

      jest
        .spyOn(resetPasswordService, "isResetTokenExpired")
        .mockResolvedValue(true);

      await expect(
        resetPasswordService.reset(mockExpiredToken, "password123")
      ).rejects.toThrow(new ForbiddenError(ERROR_MESSAGES.EXPIRED_TOKEN));

      expect(resetPasswordService.findResetToken).toHaveBeenCalledWith(
        mockExpiredToken
      );

      expect(resetPasswordService.isResetTokenExpired).toHaveBeenCalledWith(
        mockExpiredResetToken
      );

      expect(mockResetTokenDB.deleteMany).toHaveBeenCalledWith(
        mockExpiredResetToken.userId
      );

      expect(mockPasswordService.hashPassword).not.toHaveBeenCalled();

      expect(mockPasswordService.updatePassword).not.toHaveBeenCalled();
    });

    // it("should reset the user's password", async () => {
    //   const newPassword = "newpassword123";

    //   jest
    //     .spyOn(resetPasswordService, "findResetToken")
    //     .mockResolvedValue(mockValidResetToken);

    //   jest
    //     .spyOn(resetPasswordService, "isResetTokenExpired")
    //     .mockResolvedValue(false);

    //   (mockPasswordService.hashPassword as jest.Mock).mockResolvedValue(
    //     "hashedPassword"
    //   );

    //   (mockPasswordService.updatePassword as jest.Mock).mockResolvedValue(null);

    //   await resetPasswordService.reset(mockValidToken, newPassword);

    //   expect(resetPasswordService.findResetToken).toHaveBeenCalledWith(
    //     mockValidToken
    //   );

    //   expect(resetPasswordService.isResetTokenExpired).toHaveBeenCalledWith(
    //     mockValidResetToken
    //   );

    //   expect(mockPasswordService.updatePassword).toHaveBeenCalledWith({
    //     userId: mockValidResetToken.userId,
    //     password: "newpassword123",
    //   });

    //   expect(mockResetTokenDB.deleteMany).toHaveBeenCalledWith(
    //     mockValidResetToken.userId
    //   );
    // });
  });

  describe("findResetToken method tests", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should return the found ResetToken", async () => {
      (mockResetTokenDB.findByToken as jest.Mock).mockResolvedValue(
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
      expect(mockResetTokenDB.deleteMany).toHaveBeenCalledWith(
        mockExpiredResetToken.userId
      );
    });
  });
});
