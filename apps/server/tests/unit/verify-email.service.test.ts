import { ERROR_MESSAGES } from "../../src/constants/errorMessages";
import { ForbiddenError } from "../../src/errors";

import { VerifyEmailService } from "../../src/modules/verifyEmailToken/verify-email.service";

import type { User } from "../../src/modules/user/user.model";
import type { VerifyEmailToken } from "../../src/modules/verifyEmailToken/verify-email.model";

import type { IAuthService } from "../../src/modules/auth/auth.types";
import type { IUserRepository } from "../../src/modules/user/user.types";
import type {
  IVerifyEmailRepository,
  IVerifyEmailService,
} from "../../src/modules/verifyEmailToken/verify-email.types";

describe("VerifyEmailService methods test", () => {
  let verifyEmailService: IVerifyEmailService;
  let mockVerifyEmailRepository: IVerifyEmailRepository;
  let mockUserRepository: IUserRepository;
  let mockAuthService: IAuthService;

  beforeEach(() => {
    mockVerifyEmailRepository = {
      findByToken: jest.fn(),
      findByUserId: jest.fn(),
      create: jest.fn(),
      deleteMany: jest.fn(),
    };

    mockUserRepository = {
      findByEmail: jest.fn(),
      create: jest.fn(),
      findById: jest.fn(),
      updateUser: jest.fn(),
      updatePassword: jest.fn(),
    };

    mockAuthService = {
      verifyEmail: jest.fn(),
      registerUser: jest.fn(),
      loginUser: jest.fn(),
      logoutUser: jest.fn(),
      refreshToken: jest.fn(),
      googleLogin: jest.fn(),
    };

    verifyEmailService = new VerifyEmailService(
      mockUserRepository,
      mockVerifyEmailRepository,
      mockAuthService
    );
  });

  const mockEmail = "test@example.com";
  const mockToken = "verificationtoken";

  const mockUser: User = {
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

  const mockValidToken: VerifyEmailToken = {
    id: "token-001",
    userId: "user-123",
    token: "verificationtoken",
    expiresAt: new Date(Date.now() + 1000 * 60 * 60),
    createdAt: new Date(),
  };

  const mockExpiredToken: VerifyEmailToken = {
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
      (mockUserRepository.findByEmail as jest.Mock).mockResolvedValue(null);

      await expect(verifyEmailService.generateToken(mockEmail)).rejects.toThrow(
        new ForbiddenError(ERROR_MESSAGES.FORBIDDEN)
      );

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(mockEmail);
      expect(mockUserRepository.findByEmail).toHaveBeenCalledTimes(1);
    });

    it("should throw a ForbiddenError if the user email is already verified", async () => {
      (mockUserRepository.findByEmail as jest.Mock).mockResolvedValue(mockUser);

      await expect(verifyEmailService.generateToken(mockEmail)).rejects.toThrow(
        new ForbiddenError(ERROR_MESSAGES.EMAIL_ALREADY_VERIFIED)
      );

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(mockEmail);
      expect(mockUserRepository.findByEmail).toHaveBeenCalledTimes(1);
    });

    it("should throw a ForbiddenError if the user already has a verification token", async () => {
      (mockUserRepository.findByEmail as jest.Mock).mockResolvedValue({
        ...mockUser,
        isEmailVerified: false,
      });
      (mockVerifyEmailRepository.findByUserId as jest.Mock).mockResolvedValue(
        mockValidToken
      );

      await expect(verifyEmailService.generateToken(mockEmail)).rejects.toThrow(
        new ForbiddenError(ERROR_MESSAGES.VERIFICATION_LINK_SENT)
      );

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(mockEmail);
      expect(mockUserRepository.findByEmail).toHaveBeenCalledTimes(1);

      expect(mockVerifyEmailRepository.findByUserId).toHaveBeenCalledWith(
        mockUser.id
      );
      expect(mockVerifyEmailRepository.findByUserId).toHaveBeenCalledTimes(1);
    });

    it("should return the new created verification token", async () => {
      (mockUserRepository.findByEmail as jest.Mock).mockResolvedValue({
        ...mockUser,
        isEmailVerified: false,
      });

      (mockVerifyEmailRepository.findByUserId as jest.Mock).mockResolvedValue(
        null
      );

      (mockVerifyEmailRepository.create as jest.Mock).mockResolvedValue(
        mockToken
      );

      const result = await verifyEmailService.generateToken(mockEmail);

      expect(result).toBe(mockToken);

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(mockEmail);
      expect(mockUserRepository.findByEmail).toHaveBeenCalledTimes(1);

      expect(mockVerifyEmailRepository.findByUserId).toHaveBeenCalledWith(
        mockUser.id
      );
      expect(mockVerifyEmailRepository.findByUserId).toHaveBeenCalledTimes(1);

      expect(mockVerifyEmailRepository.create).toHaveBeenCalledWith(
        mockUser.id
      );
      expect(mockVerifyEmailRepository.create).toHaveBeenCalledTimes(1);
    });
  });

  describe("VerifyEmailService - verifyUserEmail", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should throw aForbiddenError if the token is invalid", async () => {
      (mockVerifyEmailRepository.findByToken as jest.Mock).mockResolvedValue(
        null
      );

      await expect(
        verifyEmailService.verifyUserEmail(mockToken)
      ).rejects.toThrow(new ForbiddenError(ERROR_MESSAGES.INVALID_TOKEN));

      expect(mockVerifyEmailRepository.findByToken).toHaveBeenCalledWith(
        mockToken
      );
      expect(mockVerifyEmailRepository.findByToken).toHaveBeenCalledTimes(1);

      expect(mockAuthService.verifyEmail).not.toHaveBeenCalled();

      expect(mockVerifyEmailRepository.deleteMany).not.toHaveBeenCalled();
    });

    it("should throw a ForbiddenError if the token is expired", async () => {
      (mockVerifyEmailRepository.findByToken as jest.Mock).mockResolvedValue(
        mockExpiredToken
      );

      await expect(
        verifyEmailService.verifyUserEmail(mockToken)
      ).rejects.toThrow(new ForbiddenError(ERROR_MESSAGES.EXPIRED_TOKEN));

      expect(mockVerifyEmailRepository.findByToken).toHaveBeenCalledWith(
        mockToken
      );
      expect(mockVerifyEmailRepository.findByToken).toHaveBeenCalledTimes(1);

      expect(mockAuthService.verifyEmail).not.toHaveBeenCalled();

      expect(mockVerifyEmailRepository.deleteMany).not.toHaveBeenCalled();
    });

    it("should verify the user email and delete the verification token", async () => {
      (mockVerifyEmailRepository.findByToken as jest.Mock).mockResolvedValue(
        mockValidToken
      );

      await verifyEmailService.verifyUserEmail(mockToken);

      expect(mockVerifyEmailRepository.findByToken).toHaveBeenCalledWith(
        mockToken
      );
      expect(mockVerifyEmailRepository.findByToken).toHaveBeenCalledTimes(1);

      expect(mockAuthService.verifyEmail).toHaveBeenCalledWith(
        mockValidToken.userId
      );
      expect(mockAuthService.verifyEmail).toHaveBeenCalledTimes(1);

      expect(mockVerifyEmailRepository.deleteMany).toHaveBeenCalledWith(
        mockValidToken.userId
      );
      expect(mockVerifyEmailRepository.deleteMany).toHaveBeenCalledTimes(1);
    });

    it("should throw a ForbiddenError if the user email is already verified", async () => {
      (mockVerifyEmailRepository.findByToken as jest.Mock).mockResolvedValue(
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

      expect(mockVerifyEmailRepository.findByToken).toHaveBeenCalledWith(
        mockToken
      );
      expect(mockVerifyEmailRepository.findByToken).toHaveBeenCalledTimes(1);

      expect(mockAuthService.verifyEmail).toHaveBeenCalledWith(
        mockValidToken.userId
      );

      expect(mockAuthService.verifyEmail).toHaveBeenCalledWith(
        mockValidToken.userId
      );
      expect(mockAuthService.verifyEmail).toHaveBeenCalledTimes(1);

      expect(mockVerifyEmailRepository.deleteMany).not.toHaveBeenCalled();
    });
  });
});
