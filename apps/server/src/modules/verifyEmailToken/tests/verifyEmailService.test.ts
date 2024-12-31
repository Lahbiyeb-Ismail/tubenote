import { ERROR_MESSAGES } from "../../../constants/errorMessages";
import { ForbiddenError } from "../../../errors";
import type { UserEntry } from "../../user/user.type";
import UserDB from "../../user/userDB";
import VerificationTokenDB from "../verificationTokenDB";
import type { VerificationTokenEntry } from "../verifyEmail.type";
import verifyEmailService from "../verifyEmailService";

jest.mock("../verificationTokenDB");
jest.mock("../../user/userDB");

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

      await expect(verifyEmailService.generateToken(mockEmail)).rejects.toThrow(
        new ForbiddenError(ERROR_MESSAGES.FORBIDDEN)
      );

      expect(UserDB.findByEmail).toHaveBeenCalledWith(mockEmail);
      expect(UserDB.findByEmail).toHaveBeenCalledTimes(1);
    });

    it("should throw a ForbiddenError if the user email is already verified", async () => {
      (UserDB.findByEmail as jest.Mock).mockResolvedValue(mockUser);

      await expect(verifyEmailService.generateToken(mockEmail)).rejects.toThrow(
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

      await expect(verifyEmailService.generateToken(mockEmail)).rejects.toThrow(
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

      const result = await verifyEmailService.generateToken(mockEmail);

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
});
