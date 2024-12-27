import { ERROR_MESSAGES } from "../../../constants/errorMessages";
import { ForbiddenError } from "../../../errors";
import AuthService from "../../auth/authService";
import type { UserEntry } from "../../user/user.type";
import UserDB from "../../user/userDB";
import UserService from "../../user/userService";
import type { ResetTokenEntry } from "../resetPassword.type";
import ResetPasswordDB from "../resetPasswordDB";
import ResetPasswordService from "../resetPasswordService";

jest.mock("../resetPasswordDB");
jest.mock("../../user/userDB");
jest.mock("../../user/userService");
jest.mock("../../auth/authService");

describe("ResetPasswordService tests", () => {
  beforeAll(() => {
    jest.clearAllMocks();
  });

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

  const mockResetTokenEntry: ResetTokenEntry = {
    id: "token123",
    userId: "user123",
    createdAt: new Date(),
    expiresAt: new Date(),
    token: "mockResetTokenValue",
  };

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
        mockResetTokenEntry
      );

      await expect(
        ResetPasswordService.sendResetToken(mockEmail)
      ).rejects.toThrow(new ForbiddenError(ERROR_MESSAGES.RESET_LINK_SENT));

      expect(UserService.getUserByEmail).toHaveBeenCalledWith(mockEmail);

      expect(UserService.getUserByEmail).toHaveBeenCalledTimes(1);

      expect(ResetPasswordDB.findByUserId).toHaveBeenCalledWith(mockUser.id);

      expect(mockResetTokenEntry.userId).toBe(mockUser.id);
    });

    it("should send a reset token email", async () => {
      (UserService.getUserByEmail as jest.Mock).mockResolvedValue(mockUser);

      (ResetPasswordDB.findByUserId as jest.Mock).mockResolvedValue(null);

      jest
        .spyOn(ResetPasswordService, "createToken")
        .mockResolvedValue(mockResetTokenEntry.token);

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
      (ResetPasswordDB.create as jest.Mock).mockResolvedValue(
        mockResetTokenEntry.token
      );

      const result = await ResetPasswordService.createToken(mockUser.id);

      expect(result).toBe(mockResetTokenEntry.token);
      expect(typeof result).toBe("string");
    });
  });

  describe("reset method tests", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should throw a ForbiddenError if the reset token is invalid", async () => {
      const inValidResetToken = "invalidToken";

      (ResetPasswordDB.findByToken as jest.Mock).mockResolvedValue(null);

      await expect(
        ResetPasswordService.reset(inValidResetToken, "password123")
      ).rejects.toThrow(new ForbiddenError(ERROR_MESSAGES.INVALID_TOKEN));

      expect(ResetPasswordDB.findByToken).toHaveBeenCalledWith(
        inValidResetToken
      );
    });

    it("should throw a ForbiddenError if the reset token is expired", async () => {
      (ResetPasswordDB.findByToken as jest.Mock).mockResolvedValue({
        ...mockResetTokenEntry,
        expiresAt: new Date(Date.now() - 1000),
      });

      await expect(
        ResetPasswordService.reset(mockResetTokenEntry.token, "password123")
      ).rejects.toThrow(new ForbiddenError(ERROR_MESSAGES.INVALID_TOKEN));

      expect(ResetPasswordDB.findByToken).toHaveBeenCalledWith(
        mockResetTokenEntry.token
      );
      expect(ResetPasswordDB.deleteMany).toHaveBeenCalledWith(
        mockResetTokenEntry.userId
      );
    });

    it("should reset the user's password", async () => {
      const newPassword = "newpassword123";

      jest
        .spyOn(ResetPasswordService, "verfiyResetToken")
        .mockResolvedValue(mockResetTokenEntry);

      jest
        .spyOn(AuthService, "hashPassword")
        .mockResolvedValue("hashedPassword");

      (UserDB.update as jest.Mock).mockResolvedValue(null);

      await ResetPasswordService.reset(mockResetTokenEntry.token, newPassword);

      expect(ResetPasswordService.verfiyResetToken).toHaveBeenCalledWith(
        mockResetTokenEntry.token
      );

      expect(AuthService.hashPassword).toHaveBeenCalledWith(newPassword);

      expect(AuthService.hashPassword).toHaveBeenCalledTimes(1);

      expect(UserDB.update).toHaveBeenCalledWith({
        userId: mockResetTokenEntry.userId,
        data: { password: "hashedPassword" },
      });

      expect(ResetPasswordDB.deleteMany).toHaveBeenCalledWith(
        mockResetTokenEntry.userId
      );
    });
  });
});
