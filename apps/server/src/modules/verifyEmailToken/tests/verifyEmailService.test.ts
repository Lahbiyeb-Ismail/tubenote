import { ERROR_MESSAGES } from "../../../constants/errorMessages";
import { ForbiddenError } from "../../../errors";
import EmailService from "../../../services/emailService";
import type { UserEntry } from "../../user/user.type";
import UserDB from "../../user/userDB";
import VerificationTokenDB from "../verificationTokenDB";
import type { VerificationTokenEntry } from "../verifyEmail.type";
import VerifyEmailService from "../verifyEmailService";

jest.mock("../verificationTokenDB");
jest.mock("../../user/userDB");
jest.mock("../../../services/emailService");

describe("VerifyEmailService methods test", () => {
  const mockEmail = "test@example.com";
  const mockToken = "verificationtoken";

  const mockUser: UserEntry = {
    id: "1",
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

  const mockVerificationToken: VerificationTokenEntry = {
    id: "token-001",
    userId: "user-123",
    token: "verificationtoken",
    expiresAt: new Date(),
    createdAt: new Date(),
  };

  beforeAll(() => {
    jest.clearAllMocks();
  });

  describe("generateToken method test cases", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should throw a ForbiddenError if the user does not exist", async () => {
      (UserDB.findByEmail as jest.Mock).mockResolvedValue(null);

      await expect(VerifyEmailService.generateToken(mockEmail)).rejects.toThrow(
        new ForbiddenError(ERROR_MESSAGES.FORBIDDEN)
      );

      expect(UserDB.findByEmail).toHaveBeenCalledWith(mockEmail);
      expect(UserDB.findByEmail).toHaveBeenCalledTimes(1);
    });

    it("should throw a ForbiddenError if the user email is already verified", async () => {
      (UserDB.findByEmail as jest.Mock).mockResolvedValue(mockUser);

      await expect(VerifyEmailService.generateToken(mockEmail)).rejects.toThrow(
        new ForbiddenError(ERROR_MESSAGES.EMAIL_ALREADY_VERIFIED)
      );

      expect(UserDB.findByEmail).toHaveBeenCalledWith(mockEmail);
      expect(UserDB.findByEmail).toHaveBeenCalledTimes(1);
    });

    it("should throw a ForbiddenError if the user already has a verification token", async () => {
      (UserDB.findByEmail as jest.Mock).mockResolvedValue({
        ...mockUser,
        isEmailVerified: false,
      });
      (VerificationTokenDB.findByUserId as jest.Mock).mockResolvedValue(
        mockVerificationToken
      );

      await expect(VerifyEmailService.generateToken(mockEmail)).rejects.toThrow(
        new ForbiddenError(ERROR_MESSAGES.VERIFICATION_LINK_SENT)
      );

      expect(UserDB.findByEmail).toHaveBeenCalledWith(mockEmail);
      expect(UserDB.findByEmail).toHaveBeenCalledTimes(1);

      expect(VerificationTokenDB.findByUserId).toHaveBeenCalledWith(
        mockUser.id
      );
      expect(VerificationTokenDB.findByUserId).toHaveBeenCalledTimes(1);
    });

    it("should return the new created verification token", async () => {
      (UserDB.findByEmail as jest.Mock).mockResolvedValue({
        ...mockUser,
        isEmailVerified: false,
      });

      (VerificationTokenDB.findByUserId as jest.Mock).mockResolvedValue(null);

      (VerificationTokenDB.create as jest.Mock).mockResolvedValue(mockToken);

      const result = await VerifyEmailService.generateToken(mockEmail);

      expect(result).toBe(mockToken);

      expect(UserDB.findByEmail).toHaveBeenCalledWith(mockEmail);
      expect(UserDB.findByEmail).toHaveBeenCalledTimes(1);

      expect(VerificationTokenDB.findByUserId).toHaveBeenCalledWith(
        mockUser.id
      );
      expect(VerificationTokenDB.findByUserId).toHaveBeenCalledTimes(1);

      expect(VerificationTokenDB.create).toHaveBeenCalledWith(mockUser.id);
      expect(VerificationTokenDB.create).toHaveBeenCalledTimes(1);
    });
  });

  describe("sendVerificationToken method test cases", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should call generateToken and sendVerificationEmail methods", async () => {
      jest
        .spyOn(VerifyEmailService, "generateToken")
        .mockResolvedValue(mockToken);

      (EmailService.sendVerificationEmail as jest.Mock).mockResolvedValue(
        undefined
      );

      await VerifyEmailService.sendVerificationToken(mockEmail);

      expect(VerifyEmailService.generateToken).toHaveBeenCalledWith(mockEmail);
      expect(VerifyEmailService.generateToken).toHaveBeenCalledTimes(1);

      expect(EmailService.sendVerificationEmail).toHaveBeenCalledWith({
        email: mockEmail,
        token: mockToken,
      });
      expect(EmailService.sendVerificationEmail).toHaveBeenCalledTimes(1);
    });

    it("should throw an error if generateToken method throws an error", async () => {
      jest
        .spyOn(VerifyEmailService, "generateToken")
        .mockRejectedValue(new ForbiddenError(ERROR_MESSAGES.FORBIDDEN));

      await expect(
        VerifyEmailService.sendVerificationToken(mockEmail)
      ).rejects.toThrow(new ForbiddenError(ERROR_MESSAGES.FORBIDDEN));

      expect(VerifyEmailService.generateToken).toHaveBeenCalledWith(mockEmail);
      expect(VerifyEmailService.generateToken).toHaveBeenCalledTimes(1);

      expect(EmailService.sendVerificationEmail).not.toHaveBeenCalled();
    });
  });
});
