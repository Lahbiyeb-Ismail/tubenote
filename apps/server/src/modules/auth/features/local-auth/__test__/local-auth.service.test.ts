import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "@/errors";
import { ERROR_MESSAGES } from "@constants/error-messages.contants";

import { LocalAuthService } from "../local-auth.service";

import type { AuthResponseDto, RegisterDto } from "@/modules/auth/dtos";
import type { IJwtService } from "@/modules/auth/utils/services/jwt/jwt.types";
import type { IMailSenderService } from "@/modules/mailSender/mail-sender.types";
import type { User } from "@/modules/user/user.model";
import type { IUserService } from "@/modules/user/user.types";
import type { ICryptoService } from "@/modules/utils/crypto";
import type { IRefreshTokenService } from "../../refresh-token/refresh-token.types";
import type { IVerifyEmailService } from "../../verify-email/verify-email.types";

describe("LocalAuthService", () => {
  // Mock dependencies
  const mockJwtService: Partial<IJwtService> = {
    generateAuthTokens: jest.fn(),
  };

  const mockUserService: Partial<IUserService> = {
    createUser: jest.fn(),
    getUserByEmail: jest.fn(),
  };

  const mockVerifyEmailService: Partial<IVerifyEmailService> = {
    generateToken: jest.fn(),
  };

  const mockCryptoService: Partial<ICryptoService> = {
    comparePasswords: jest.fn(),
  };

  const mockRefreshTokenService: Partial<IRefreshTokenService> = {
    saveToken: jest.fn(),
  };

  const mockMailSenderService: Partial<IMailSenderService> = {
    sendVerificationEmail: jest.fn(),
  };

  let localAuthService: LocalAuthService;

  // Mock data
  const mockUser: User = {
    id: "user-123",
    email: "test@example.com",
    password: "hashed-password",
    username: "Test User",
    createdAt: new Date(),
    updatedAt: new Date(),
    isEmailVerified: true,
  };

  const mockTokens: AuthResponseDto = {
    accessToken: "mock-access-token",
    refreshToken: "mock-refresh-token",
  };

  const registerUserDto: RegisterDto = {
    email: "test@example.com",
    password: "password123",
    username: "Test User",
  };

  beforeEach(() => {
    localAuthService = new LocalAuthService(
      mockJwtService as any,
      mockUserService as any,
      mockVerifyEmailService as any,
      mockCryptoService as any,
      mockRefreshTokenService as any,
      mockMailSenderService as any
    );

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe("LocalAuthService - registerUser method", () => {
    const verifyEmailToken = "verify-email-token";

    it("should successfully register a new user", async () => {
      (mockUserService.createUser as jest.Mock).mockResolvedValue(mockUser);

      (mockVerifyEmailService.generateToken as jest.Mock).mockResolvedValue(
        verifyEmailToken
      );

      (
        mockMailSenderService.sendVerificationEmail as jest.Mock
      ).mockResolvedValue(undefined);

      const result = await localAuthService.registerUser(registerUserDto);

      expect(result).toEqual(mockUser);
      expect(mockUserService.createUser).toHaveBeenCalledWith(registerUserDto);
      expect(mockMailSenderService.sendVerificationEmail).toHaveBeenCalledWith(
        mockUser.email,
        verifyEmailToken
      );
    });

    it("should throw error if user creation fails", async () => {
      const error = new Error("User creation failed");
      (mockUserService.createUser as jest.Mock).mockRejectedValue(error);

      await expect(
        localAuthService.registerUser(registerUserDto)
      ).rejects.toThrow(error);

      expect(mockVerifyEmailService.generateToken).not.toHaveBeenCalled();

      expect(
        mockMailSenderService.sendVerificationEmail
      ).not.toHaveBeenCalled();
    });

    it("should throw error if verification token generation fails", async () => {
      const error = new Error("Token generation failed");

      (mockUserService.createUser as jest.Mock).mockResolvedValue(mockUser);

      (mockVerifyEmailService.generateToken as jest.Mock).mockRejectedValue(
        error
      );

      await expect(
        localAuthService.registerUser(registerUserDto)
      ).rejects.toThrow(error);

      expect(
        mockMailSenderService.sendVerificationEmail
      ).not.toHaveBeenCalled();
    });

    it("should throw error if email verification sending fails", async () => {
      const error = new Error("Email sending failed");
      (mockUserService.createUser as jest.Mock).mockResolvedValue(mockUser);

      (mockVerifyEmailService.generateToken as jest.Mock).mockResolvedValue(
        verifyEmailToken
      );

      (
        mockMailSenderService.sendVerificationEmail as jest.Mock
      ).mockRejectedValue(error);

      await expect(
        localAuthService.registerUser(registerUserDto)
      ).rejects.toThrow(error);
    });

    it("should handle empty email in registerUserDto", async () => {
      const invalidDto = {
        ...registerUserDto,
        email: "",
      };

      await expect(localAuthService.registerUser(invalidDto)).rejects.toThrow();
    });

    it("should handle invalid email format in registerUserDto", async () => {
      const invalidDto = {
        ...registerUserDto,
        email: "invalid-email",
      };

      await expect(localAuthService.registerUser(invalidDto)).rejects.toThrow();
    });

    it("should handle empty username in registerUserDto", async () => {
      const invalidDto = {
        ...registerUserDto,
        username: "",
      };

      await expect(localAuthService.registerUser(invalidDto)).rejects.toThrow();
    });

    it("should handle concurrent user registration with same email", async () => {
      const conflictError = new ConflictError(
        ERROR_MESSAGES.EMAIL_ALREADY_EXISTS
      );

      (mockUserService.createUser as jest.Mock).mockRejectedValueOnce(
        conflictError
      );

      await expect(
        localAuthService.registerUser(registerUserDto)
      ).rejects.toThrow(conflictError);
    });
  });

  describe("LocalAuthService - loginUser method", () => {
    const LoginDto = {
      email: "test@example.com",
      password: "password123",
    };

    beforeEach(() => {
      (mockJwtService.generateAuthTokens as jest.Mock).mockReturnValue(
        mockTokens
      );
      (mockRefreshTokenService.saveToken as jest.Mock).mockResolvedValue(
        undefined
      );
    });

    it("should successfully login a user", async () => {
      (mockUserService.getUserByEmail as jest.Mock).mockResolvedValue(mockUser);
      (mockCryptoService.comparePasswords as jest.Mock).mockResolvedValue(true);

      const result = await localAuthService.loginUser(LoginDto);

      expect(result).toEqual(mockTokens);
      expect(mockUserService.getUserByEmail).toHaveBeenCalledWith(
        LoginDto.email
      );
      expect(mockCryptoService.comparePasswords).toHaveBeenCalledWith({
        plainText: LoginDto.password,
        hash: mockUser.password,
      });
      expect(mockJwtService.generateAuthTokens).toHaveBeenCalledWith(
        mockUser.id
      );
      expect(mockRefreshTokenService.saveToken).toHaveBeenCalledWith({
        userId: mockUser.id,
        token: mockTokens.refreshToken,
        expiresAt: expect.any(Date),
      });
    });

    it("should throw NotFoundError if user does not exist", async () => {
      (mockUserService.getUserByEmail as jest.Mock).mockResolvedValue(null);

      await expect(localAuthService.loginUser(LoginDto)).rejects.toThrow(
        new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND)
      );
      expect(mockCryptoService.comparePasswords).not.toHaveBeenCalled();
    });

    it("should throw UnauthorizedError if email is not verified", async () => {
      (mockUserService.getUserByEmail as jest.Mock).mockResolvedValue({
        ...mockUser,
        isEmailVerified: false,
      });

      await expect(localAuthService.loginUser(LoginDto)).rejects.toThrow(
        new UnauthorizedError(ERROR_MESSAGES.EMAIL_NOT_VERIFIED)
      );
      expect(mockCryptoService.comparePasswords).not.toHaveBeenCalled();
    });

    it("should throw ForbiddenError if password is incorrect", async () => {
      (mockUserService.getUserByEmail as jest.Mock).mockResolvedValue(mockUser);
      (mockCryptoService.comparePasswords as jest.Mock).mockResolvedValue(
        false
      );

      await expect(localAuthService.loginUser(LoginDto)).rejects.toThrow(
        new ForbiddenError(ERROR_MESSAGES.INVALID_CREDENTIALS)
      );
      expect(mockJwtService.generateAuthTokens).not.toHaveBeenCalled();
    });

    it("should throw error if refresh token creation fails", async () => {
      (mockUserService.getUserByEmail as jest.Mock).mockResolvedValue(mockUser);
      (mockCryptoService.comparePasswords as jest.Mock).mockResolvedValue(true);
      const error = new Error("Token creation failed");
      (mockRefreshTokenService.saveToken as jest.Mock).mockRejectedValue(error);

      await expect(localAuthService.loginUser(LoginDto)).rejects.toThrow(error);
    });

    it("should handle JWT token generation failure", async () => {
      (mockUserService.getUserByEmail as jest.Mock).mockResolvedValue(mockUser);

      (mockCryptoService.comparePasswords as jest.Mock).mockResolvedValue(true);

      (mockJwtService.generateAuthTokens as jest.Mock).mockImplementation(
        () => {
          throw new Error("Token generation failed");
        }
      );

      await expect(localAuthService.loginUser(LoginDto)).rejects.toThrow(
        "Token generation failed"
      );
    });

    it("should handle saveToken failure", async () => {
      (mockUserService.getUserByEmail as jest.Mock).mockResolvedValue(mockUser);

      (mockCryptoService.comparePasswords as jest.Mock).mockResolvedValue(true);

      const error = new Error("Database error");

      (mockRefreshTokenService.saveToken as jest.Mock).mockRejectedValue(error);

      await expect(localAuthService.loginUser(LoginDto)).rejects.toThrow(error);
    });
  });

  describe("error handling", () => {
    it("should handle unexpected errors from user service", async () => {
      const error = new Error("Database connection failed");
      (mockUserService.getUserByEmail as jest.Mock).mockRejectedValue(error);

      await expect(
        localAuthService.loginUser({
          email: "test@example.com",
          password: "password123",
        })
      ).rejects.toThrow(error);
    });

    it("should handle unexpected errors from password hasher service", async () => {
      (mockUserService.getUserByEmail as jest.Mock).mockResolvedValue(mockUser);
      const error = new Error("Comparison failed");
      (mockCryptoService.comparePasswords as jest.Mock).mockRejectedValue(
        error
      );

      await expect(
        localAuthService.loginUser({
          email: "test@example.com",
          password: "password123",
        })
      ).rejects.toThrow(error);
    });
  });

  describe("Integration scenarios", () => {
    it("should handle complete flow of registration and login", async () => {
      // Registration
      (mockUserService.createUser as jest.Mock).mockResolvedValue(mockUser);
      (mockVerifyEmailService.generateToken as jest.Mock).mockResolvedValue(
        "verify-email-token"
      );
      (
        mockMailSenderService.sendVerificationEmail as jest.Mock
      ).mockResolvedValue(undefined);

      const registeredUser =
        await localAuthService.registerUser(registerUserDto);

      // Login
      (mockUserService.getUserByEmail as jest.Mock).mockResolvedValue(
        registeredUser
      );
      (mockCryptoService.comparePasswords as jest.Mock).mockResolvedValue(true);
      (mockJwtService.generateAuthTokens as jest.Mock).mockReturnValue(
        mockTokens
      );
      (mockRefreshTokenService.saveToken as jest.Mock).mockResolvedValue(
        undefined
      );

      const loginResult = await localAuthService.loginUser({
        email: registeredUser.email,
        password: "password123",
      });

      expect(loginResult).toEqual(mockTokens);
    });

    it("should handle registration success but email verification failure", async () => {
      (mockUserService.createUser as jest.Mock).mockResolvedValue(mockUser);
      (mockVerifyEmailService.generateToken as jest.Mock).mockResolvedValue(
        "token"
      );
      (
        mockMailSenderService.sendVerificationEmail as jest.Mock
      ).mockRejectedValue(new Error("Email service down"));

      await expect(
        localAuthService.registerUser(registerUserDto)
      ).rejects.toThrow("Email service down");
    });
  });
});
