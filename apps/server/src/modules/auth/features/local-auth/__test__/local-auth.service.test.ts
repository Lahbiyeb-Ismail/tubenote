import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "@/errors";
import { ERROR_MESSAGES } from "@constants/error-messages.contants";

import { LocalAuthService } from "../local-auth.service";

import type { AuthResponseDto, RegisterDto } from "@/modules/auth/dtos";
import type { User } from "@/modules/user/user.model";

describe("LocalAuthService", () => {
  // Mock dependencies
  const mockJwtService = {
    generateAuthTokens: jest.fn(),
  };

  const mockUserService = {
    createUser: jest.fn(),
    getUserByEmail: jest.fn(),
  };

  const mockVerifyEmailService = {
    generateToken: jest.fn(),
  };

  const mockPasswordHasherService = {
    comparePassword: jest.fn(),
  };

  const mockRefreshTokenService = {
    saveToken: jest.fn(),
  };

  const mockMailSenderService = {
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
      mockPasswordHasherService as any,
      mockRefreshTokenService as any,
      mockMailSenderService as any
    );

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe("LocalAuthService - registerUser method", () => {
    const verifyEmailToken = "verify-email-token";

    it("should successfully register a new user", async () => {
      mockUserService.createUser.mockResolvedValue(mockUser);

      mockVerifyEmailService.generateToken.mockResolvedValue(verifyEmailToken);

      mockMailSenderService.sendVerificationEmail.mockResolvedValue(undefined);

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
      mockUserService.createUser.mockRejectedValue(error);

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

      mockUserService.createUser.mockResolvedValue(mockUser);

      mockVerifyEmailService.generateToken.mockRejectedValue(error);

      await expect(
        localAuthService.registerUser(registerUserDto)
      ).rejects.toThrow(error);

      expect(
        mockMailSenderService.sendVerificationEmail
      ).not.toHaveBeenCalled();
    });

    it("should throw error if email verification sending fails", async () => {
      const error = new Error("Email sending failed");
      mockUserService.createUser.mockResolvedValue(mockUser);

      mockVerifyEmailService.generateToken.mockResolvedValue(verifyEmailToken);

      mockMailSenderService.sendVerificationEmail.mockRejectedValue(error);

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

      mockUserService.createUser.mockRejectedValueOnce(conflictError);

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
      mockJwtService.generateAuthTokens.mockReturnValue(mockTokens);
      mockRefreshTokenService.saveToken.mockResolvedValue(undefined);
    });

    it("should successfully login a user", async () => {
      mockUserService.getUserByEmail.mockResolvedValue(mockUser);
      mockPasswordHasherService.comparePassword.mockResolvedValue(true);

      const result = await localAuthService.loginUser(LoginDto);

      expect(result).toEqual(mockTokens);
      expect(mockUserService.getUserByEmail).toHaveBeenCalledWith(
        LoginDto.email
      );
      expect(mockPasswordHasherService.comparePassword).toHaveBeenCalledWith({
        password: LoginDto.password,
        hashedPassword: mockUser.password,
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
      mockUserService.getUserByEmail.mockResolvedValue(null);

      await expect(localAuthService.loginUser(LoginDto)).rejects.toThrow(
        new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND)
      );
      expect(mockPasswordHasherService.comparePassword).not.toHaveBeenCalled();
    });

    it("should throw UnauthorizedError if email is not verified", async () => {
      mockUserService.getUserByEmail.mockResolvedValue({
        ...mockUser,
        isEmailVerified: false,
      });

      await expect(localAuthService.loginUser(LoginDto)).rejects.toThrow(
        new UnauthorizedError(ERROR_MESSAGES.EMAIL_NOT_VERIFIED)
      );
      expect(mockPasswordHasherService.comparePassword).not.toHaveBeenCalled();
    });

    it("should throw ForbiddenError if password is incorrect", async () => {
      mockUserService.getUserByEmail.mockResolvedValue(mockUser);
      mockPasswordHasherService.comparePassword.mockResolvedValue(false);

      await expect(localAuthService.loginUser(LoginDto)).rejects.toThrow(
        new ForbiddenError(ERROR_MESSAGES.INVALID_CREDENTIALS)
      );
      expect(mockJwtService.generateAuthTokens).not.toHaveBeenCalled();
    });

    it("should throw error if refresh token creation fails", async () => {
      mockUserService.getUserByEmail.mockResolvedValue(mockUser);
      mockPasswordHasherService.comparePassword.mockResolvedValue(true);
      const error = new Error("Token creation failed");
      mockRefreshTokenService.saveToken.mockRejectedValue(error);

      await expect(localAuthService.loginUser(LoginDto)).rejects.toThrow(error);
    });

    it("should handle JWT token generation failure", async () => {
      mockUserService.getUserByEmail.mockResolvedValue(mockUser);

      mockPasswordHasherService.comparePassword.mockResolvedValue(true);

      mockJwtService.generateAuthTokens.mockImplementation(() => {
        throw new Error("Token generation failed");
      });

      await expect(localAuthService.loginUser(LoginDto)).rejects.toThrow(
        "Token generation failed"
      );
    });

    it("should handle saveToken failure", async () => {
      mockUserService.getUserByEmail.mockResolvedValue(mockUser);

      mockPasswordHasherService.comparePassword.mockResolvedValue(true);

      const error = new Error("Database error");

      mockRefreshTokenService.saveToken.mockRejectedValue(error);

      await expect(localAuthService.loginUser(LoginDto)).rejects.toThrow(error);
    });
  });

  describe("error handling", () => {
    it("should handle unexpected errors from user service", async () => {
      const error = new Error("Database connection failed");
      mockUserService.getUserByEmail.mockRejectedValue(error);

      await expect(
        localAuthService.loginUser({
          email: "test@example.com",
          password: "password123",
        })
      ).rejects.toThrow(error);
    });

    it("should handle unexpected errors from password hasher service", async () => {
      mockUserService.getUserByEmail.mockResolvedValue(mockUser);
      const error = new Error("Comparison failed");
      mockPasswordHasherService.comparePassword.mockRejectedValue(error);

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
      mockUserService.createUser.mockResolvedValue(mockUser);
      mockVerifyEmailService.generateToken.mockResolvedValue(
        "verify-email-token"
      );
      mockMailSenderService.sendVerificationEmail.mockResolvedValue(undefined);

      const registeredUser =
        await localAuthService.registerUser(registerUserDto);

      // Login
      mockUserService.getUserByEmail.mockResolvedValue(registeredUser);
      mockPasswordHasherService.comparePassword.mockResolvedValue(true);
      mockJwtService.generateAuthTokens.mockReturnValue(mockTokens);
      mockRefreshTokenService.saveToken.mockResolvedValue(undefined);

      const loginResult = await localAuthService.loginUser({
        email: registeredUser.email,
        password: "password123",
      });

      expect(loginResult).toEqual(mockTokens);
    });

    it("should handle registration success but email verification failure", async () => {
      mockUserService.createUser.mockResolvedValue(mockUser);
      mockVerifyEmailService.generateToken.mockResolvedValue("token");
      mockMailSenderService.sendVerificationEmail.mockRejectedValue(
        new Error("Email service down")
      );

      await expect(
        localAuthService.registerUser(registerUserDto)
      ).rejects.toThrow("Email service down");
    });
  });
});
