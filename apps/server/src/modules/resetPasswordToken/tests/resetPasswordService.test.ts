import { ERROR_MESSAGES } from "../../../constants/errorMessages";
import { ForbiddenError, NotFoundError } from "../../../errors";
import AuthService from "../../auth/authService";
import type { UserEntry } from "../../user/user.type";
import UserDB from "../../user/userDB";
import UserService from "../../user/userService";
import type { ResetTokenEntry } from "../resetPassword.type";
import ResetPasswordDB from "../resetPasswordDB";
import ResetPasswordService from "../resetPasswordService";

jest.mock("../../user/userService");
jest.mock("../../auth/authService");
jest.mock("../../user/userDB");
jest.mock("../resetPasswordDB");

describe("ResetPasswordService tests", () => {
  const mockEmail = "test@example.com";

  const mockUser: UserEntry = {
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

  const mockValidResetToken: ResetTokenEntry = {
    id: "1",
    token: mockValidToken,
    userId: "user123",
    expiresAt: new Date(Date.now() + 3600000), // 1 hour from now
    createdAt: new Date(),
  };

  const mockExpiredResetToken: ResetTokenEntry = {
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
      (UserService.getUserByEmail as jest.Mock).mockResolvedValue(null);

      await expect(
        ResetPasswordService.sendResetToken(mockEmail)
      ).rejects.toThrow(new ForbiddenError(ERROR_MESSAGES.FORBIDDEN));

      expect(UserService.getUserByEmail).toHaveBeenCalledWith(mockEmail);

      expect(UserService.getUserByEmail).toHaveBeenCalledTimes(1);
    });

    it("should throw a ForbiddenError if the user's email is not verified", async () => {
      (UserService.getUserByEmail as jest.Mock).mockResolvedValue({
        ...mockUser,
        isEmailVerified: false,
      });

      await expect(
        ResetPasswordService.sendResetToken(mockEmail)
      ).rejects.toThrow(new ForbiddenError(ERROR_MESSAGES.EMAIL_NOT_VERIFIED));

      expect(UserService.getUserByEmail).toHaveBeenCalledWith(mockEmail);

      expect(UserService.getUserByEmail).toHaveBeenCalledTimes(1);
    });

    it("should throw a ForbiddenError if the reset token is already sent", async () => {
      (UserService.getUserByEmail as jest.Mock).mockResolvedValue(mockUser);

      (ResetPasswordDB.findByUserId as jest.Mock).mockResolvedValue(
        mockValidResetToken
      );

      await expect(
        ResetPasswordService.sendResetToken(mockEmail)
      ).rejects.toThrow(new ForbiddenError(ERROR_MESSAGES.RESET_LINK_SENT));

      expect(UserService.getUserByEmail).toHaveBeenCalledWith(mockEmail);

      expect(UserService.getUserByEmail).toHaveBeenCalledTimes(1);

      expect(ResetPasswordDB.findByUserId).toHaveBeenCalledWith(mockUser.id);

      expect(mockValidResetToken.userId).toBe(mockUser.id);
    });

    it("should send a reset token email", async () => {
      (UserService.getUserByEmail as jest.Mock).mockResolvedValue(mockUser);

      (ResetPasswordDB.findByUserId as jest.Mock).mockResolvedValue(null);

      jest
        .spyOn(ResetPasswordService, "createToken")
        .mockResolvedValue(mockValidResetToken.token);

      await ResetPasswordService.sendResetToken(mockEmail);

      expect(UserService.getUserByEmail).toHaveBeenCalledWith(mockEmail);

      expect(UserService.getUserByEmail).toHaveBeenCalledTimes(1);

      expect(ResetPasswordDB.findByUserId).toHaveBeenCalledWith(mockUser.id);

      expect(ResetPasswordDB.findByUserId).toHaveBeenCalledTimes(1);
    });
  });

  describe("createToken method tests", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should create a reset token", async () => {
      (ResetPasswordDB.create as jest.Mock).mockResolvedValue(mockValidToken);

      const result = await ResetPasswordService.createToken(mockUser.id);

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
        .spyOn(ResetPasswordService, "findResetToken")
        .mockResolvedValue(null);

      await expect(
        ResetPasswordService.reset(mockNonExistentToken, "password123")
      ).rejects.toThrow(new ForbiddenError(ERROR_MESSAGES.INVALID_TOKEN));

      expect(ResetPasswordService.findResetToken).toHaveBeenCalledWith(
        mockNonExistentToken
      );

      expect(AuthService.hashPassword).not.toHaveBeenCalled();

      expect(UserDB.update).not.toHaveBeenCalled();

      expect(ResetPasswordDB.deleteMany).not.toHaveBeenCalled();
    });

    it("should throw a ForbiddenError if the reset token is expired", async () => {
      jest
        .spyOn(ResetPasswordService, "findResetToken")
        .mockResolvedValue(mockExpiredResetToken);

      jest
        .spyOn(ResetPasswordService, "isResetTokenExpired")
        .mockResolvedValue(true);

      await expect(
        ResetPasswordService.reset(mockExpiredToken, "password123")
      ).rejects.toThrow(new ForbiddenError(ERROR_MESSAGES.EXPIRED_TOKEN));

      expect(ResetPasswordService.findResetToken).toHaveBeenCalledWith(
        mockExpiredToken
      );

      expect(ResetPasswordService.isResetTokenExpired).toHaveBeenCalledWith(
        mockExpiredResetToken
      );

      expect(ResetPasswordDB.deleteMany).toHaveBeenCalledWith(
        mockExpiredResetToken.userId
      );

      expect(AuthService.hashPassword).not.toHaveBeenCalled();

      expect(UserDB.update).not.toHaveBeenCalled();
    });

    it("should reset the user's password", async () => {
      const newPassword = "newpassword123";

      jest
        .spyOn(ResetPasswordService, "findResetToken")
        .mockResolvedValue(mockValidResetToken);

      jest
        .spyOn(ResetPasswordService, "isResetTokenExpired")
        .mockResolvedValue(false);

      (AuthService.hashPassword as jest.Mock).mockResolvedValue(
        "hashedPassword"
      );

      (UserDB.update as jest.Mock).mockResolvedValue(null);

      await ResetPasswordService.reset(mockValidToken, newPassword);

      expect(ResetPasswordService.findResetToken).toHaveBeenCalledWith(
        mockValidToken
      );

      expect(ResetPasswordService.isResetTokenExpired).toHaveBeenCalledWith(
        mockValidResetToken
      );

      expect(AuthService.hashPassword).toHaveBeenCalledWith(newPassword);

      expect(AuthService.hashPassword).toHaveBeenCalledTimes(1);

      expect(UserDB.update).toHaveBeenCalledWith({
        userId: mockValidResetToken.userId,
        data: { password: "hashedPassword" },
      });

      expect(ResetPasswordDB.deleteMany).toHaveBeenCalledWith(
        mockValidResetToken.userId
      );
    });
  });

  describe("findResetToken method tests", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should return the found ResetToken", async () => {
      (ResetPasswordDB.findByToken as jest.Mock).mockResolvedValue(
        mockValidResetToken
      );

      const result = await ResetPasswordService.findResetToken(mockValidToken);

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
        .spyOn(ResetPasswordService, "findResetToken")
        .mockResolvedValue(mockValidResetToken);

      jest
        .spyOn(ResetPasswordService, "isResetTokenExpired")
        .mockResolvedValue(false);

      const result =
        await ResetPasswordService.verifyResetToken(mockValidToken);

      expect(result).toBe(mockValidResetToken);
      expect(ResetPasswordService.findResetToken).toHaveBeenCalledWith(
        mockValidToken
      );
      expect(ResetPasswordService.isResetTokenExpired).toHaveBeenCalledWith(
        mockValidResetToken
      );
    });

    it("should throw NotFoundError if the token is not found", async () => {
      jest
        .spyOn(ResetPasswordService, "findResetToken")
        .mockResolvedValue(null);

      await expect(
        ResetPasswordService.verifyResetToken(mockNonExistentToken)
      ).rejects.toThrow(new NotFoundError(ERROR_MESSAGES.INVALID_TOKEN));

      expect(ResetPasswordService.findResetToken).toHaveBeenCalledWith(
        mockNonExistentToken
      );
      expect(ResetPasswordService.isResetTokenExpired).not.toHaveBeenCalled();
    });

    it("should throw ForbiddenError if the token is expired", async () => {
      jest
        .spyOn(ResetPasswordService, "findResetToken")
        .mockResolvedValue(mockExpiredResetToken);

      jest
        .spyOn(ResetPasswordService, "isResetTokenExpired")
        .mockResolvedValue(true);

      await expect(
        ResetPasswordService.verifyResetToken(mockExpiredToken)
      ).rejects.toThrow(new ForbiddenError(ERROR_MESSAGES.EXPIRED_TOKEN));

      expect(ResetPasswordService.findResetToken).toHaveBeenCalledWith(
        mockExpiredToken
      );
      expect(ResetPasswordService.isResetTokenExpired).toHaveBeenCalledWith(
        mockExpiredResetToken
      );
      expect(ResetPasswordDB.deleteMany).toHaveBeenCalledWith(
        mockExpiredResetToken.userId
      );
    });
  });
});
