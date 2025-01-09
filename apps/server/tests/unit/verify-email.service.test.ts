import { ERROR_MESSAGES } from "../../src/constants/errorMessages";
import { ForbiddenError } from "../../src/errors";
import { IAuthService } from "../../src/modules/auth/auth.service";
import type { UserDto } from "../../src/modules/user/dtos/user.dto";
import type { IUserDatabase } from "../../src/modules/user/user.db";
import type { VerifyEmailTokenDto } from "../../src/modules/verifyEmailToken/dtos/verify-email-token.dto";
import type { IVerificationTokenDB } from "../../src/modules/verifyEmailToken/verification-token.db";
import {
  IVerifyEmailService,
  VerifyEmailService,
} from "../../src/modules/verifyEmailToken/verify-email.service";

describe("VerifyEmailService methods test", () => {
  let verifyEmailService: IVerifyEmailService;
  let mockVerificationTokenDB: IVerificationTokenDB;
  let mockUserDB: IUserDatabase;
  let mockAuthService: IAuthService;

  beforeEach(() => {
    mockVerificationTokenDB = {
      findByToken: jest.fn(),
      findByUserId: jest.fn(),
      create: jest.fn(),
      deleteMany: jest.fn(),
    };

    mockUserDB = {
      findByEmail: jest.fn(),
      create: jest.fn(),
      findById: jest.fn(),
      updateUser: jest.fn(),
      updatePassword: jest.fn(),
    };

    mockAuthService = {
      verifyEmail: jest.fn(),
      generateJwtToken: jest.fn(),
      createJwtTokens: jest.fn(),
      registerUser: jest.fn(),
      loginUser: jest.fn(),
      logoutUser: jest.fn(),
      refreshToken: jest.fn(),
      googleLogin: jest.fn(),
      verifyToken: jest.fn(),
    };

    verifyEmailService = new VerifyEmailService(
      mockUserDB,
      mockVerificationTokenDB,
      mockAuthService
    );
  });

  const mockEmail = "test@example.com";
  const mockToken = "verificationtoken";

  const mockUser: UserDto = {
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

  const mockValidToken: VerifyEmailTokenDto = {
    id: "token-001",
    userId: "user-123",
    token: "verificationtoken",
    expiresAt: new Date(Date.now() + 1000 * 60 * 60),
    createdAt: new Date(),
  };

  const mockExpiredToken: VerifyEmailTokenDto = {
    id: "token-001",
    userId: "user-123",
    token: "verificationtoken",
    expiresAt: new Date(0),
    createdAt: new Date(),
  };

  beforeAll(() => {
    jest.clearAllMocks();
  });

  describe("VerifyEmailService - generateToken", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should throw a ForbiddenError if the user does not exist", async () => {
      (mockUserDB.findByEmail as jest.Mock).mockResolvedValue(null);

      await expect(verifyEmailService.generateToken(mockEmail)).rejects.toThrow(
        new ForbiddenError(ERROR_MESSAGES.FORBIDDEN)
      );

      expect(mockUserDB.findByEmail).toHaveBeenCalledWith(mockEmail);
      expect(mockUserDB.findByEmail).toHaveBeenCalledTimes(1);
    });

    it("should throw a ForbiddenError if the user email is already verified", async () => {
      (mockUserDB.findByEmail as jest.Mock).mockResolvedValue(mockUser);

      await expect(verifyEmailService.generateToken(mockEmail)).rejects.toThrow(
        new ForbiddenError(ERROR_MESSAGES.EMAIL_ALREADY_VERIFIED)
      );

      expect(mockUserDB.findByEmail).toHaveBeenCalledWith(mockEmail);
      expect(mockUserDB.findByEmail).toHaveBeenCalledTimes(1);
    });

    it("should throw a ForbiddenError if the user already has a verification token", async () => {
      (mockUserDB.findByEmail as jest.Mock).mockResolvedValue({
        ...mockUser,
        isEmailVerified: false,
      });
      (mockVerificationTokenDB.findByUserId as jest.Mock).mockResolvedValue(
        mockValidToken
      );

      await expect(verifyEmailService.generateToken(mockEmail)).rejects.toThrow(
        new ForbiddenError(ERROR_MESSAGES.VERIFICATION_LINK_SENT)
      );

      expect(mockUserDB.findByEmail).toHaveBeenCalledWith(mockEmail);
      expect(mockUserDB.findByEmail).toHaveBeenCalledTimes(1);

      expect(mockVerificationTokenDB.findByUserId).toHaveBeenCalledWith(
        mockUser.id
      );
      expect(mockVerificationTokenDB.findByUserId).toHaveBeenCalledTimes(1);
    });

    it("should return the new created verification token", async () => {
      (mockUserDB.findByEmail as jest.Mock).mockResolvedValue({
        ...mockUser,
        isEmailVerified: false,
      });

      (mockVerificationTokenDB.findByUserId as jest.Mock).mockResolvedValue(
        null
      );

      (mockVerificationTokenDB.create as jest.Mock).mockResolvedValue(
        mockToken
      );

      const result = await verifyEmailService.generateToken(mockEmail);

      expect(result).toBe(mockToken);

      expect(mockUserDB.findByEmail).toHaveBeenCalledWith(mockEmail);
      expect(mockUserDB.findByEmail).toHaveBeenCalledTimes(1);

      expect(mockVerificationTokenDB.findByUserId).toHaveBeenCalledWith(
        mockUser.id
      );
      expect(mockVerificationTokenDB.findByUserId).toHaveBeenCalledTimes(1);

      expect(mockVerificationTokenDB.create).toHaveBeenCalledWith(mockUser.id);
      expect(mockVerificationTokenDB.create).toHaveBeenCalledTimes(1);
    });
  });

  describe("VerifyEmailService - verifyUserEmail", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should throw aForbiddenError if the token is invalid", async () => {
      (mockVerificationTokenDB.findByToken as jest.Mock).mockResolvedValue(
        null
      );

      await expect(
        verifyEmailService.verifyUserEmail(mockToken)
      ).rejects.toThrow(new ForbiddenError(ERROR_MESSAGES.INVALID_TOKEN));

      expect(mockVerificationTokenDB.findByToken).toHaveBeenCalledWith(
        mockToken
      );
      expect(mockVerificationTokenDB.findByToken).toHaveBeenCalledTimes(1);

      expect(mockAuthService.verifyEmail).not.toHaveBeenCalled();

      expect(mockVerificationTokenDB.deleteMany).not.toHaveBeenCalled();
    });

    it("should throw a ForbiddenError if the token is expired", async () => {
      (mockVerificationTokenDB.findByToken as jest.Mock).mockResolvedValue(
        mockExpiredToken
      );

      await expect(
        verifyEmailService.verifyUserEmail(mockToken)
      ).rejects.toThrow(new ForbiddenError(ERROR_MESSAGES.EXPIRED_TOKEN));

      expect(mockVerificationTokenDB.findByToken).toHaveBeenCalledWith(
        mockToken
      );
      expect(mockVerificationTokenDB.findByToken).toHaveBeenCalledTimes(1);

      expect(mockAuthService.verifyEmail).not.toHaveBeenCalled();

      expect(mockVerificationTokenDB.deleteMany).not.toHaveBeenCalled();
    });

    it("should verify the user email and delete the verification token", async () => {
      (mockVerificationTokenDB.findByToken as jest.Mock).mockResolvedValue(
        mockValidToken
      );

      await verifyEmailService.verifyUserEmail(mockToken);

      expect(mockVerificationTokenDB.findByToken).toHaveBeenCalledWith(
        mockToken
      );
      expect(mockVerificationTokenDB.findByToken).toHaveBeenCalledTimes(1);

      expect(mockAuthService.verifyEmail).toHaveBeenCalledWith(
        mockValidToken.userId
      );
      expect(mockAuthService.verifyEmail).toHaveBeenCalledTimes(1);

      expect(mockVerificationTokenDB.deleteMany).toHaveBeenCalledWith(
        mockValidToken.userId
      );
      expect(mockVerificationTokenDB.deleteMany).toHaveBeenCalledTimes(1);
    });

    it("should throw a ForbiddenError if the user email is already verified", async () => {
      (mockVerificationTokenDB.findByToken as jest.Mock).mockResolvedValue(
        mockValidToken
      );

      (mockAuthService.verifyEmail as jest.Mock).mockRejectedValue(
        new ForbiddenError(ERROR_MESSAGES.EMAIL_ALREADY_VERIFIED)
      );

      await expect(
        verifyEmailService.verifyUserEmail(mockToken)
      ).rejects.toThrow(
        new ForbiddenError(ERROR_MESSAGES.EMAIL_ALREADY_VERIFIED)
      );

      expect(mockVerificationTokenDB.findByToken).toHaveBeenCalledWith(
        mockToken
      );
      expect(mockVerificationTokenDB.findByToken).toHaveBeenCalledTimes(1);

      expect(mockAuthService.verifyEmail).toHaveBeenCalledWith(
        mockValidToken.userId
      );

      expect(mockAuthService.verifyEmail).toHaveBeenCalledWith(
        mockValidToken.userId
      );
      expect(mockAuthService.verifyEmail).toHaveBeenCalledTimes(1);

      expect(mockVerificationTokenDB.deleteMany).not.toHaveBeenCalled();
    });
  });
});
