import { ForbiddenError, NotFoundError, UnauthorizedError } from "@/errors";
import type { RegisterUserDto } from "@/modules/auth/dtos/register-user.dto";
import { ERROR_MESSAGES } from "@constants/error-messages.contants";
import { LocalAuthService } from "../local-auth.service";

describe("LocalAuthService", () => {
  // Mock dependencies
  const mockJwtService = {
    generateAuthTokens: jest.fn(),
  };

  const mockUserService = {
    createUser: jest.fn(),
    getUserByEmail: jest.fn(),
  };

  const mockPasswordHasherService = {
    comparePassword: jest.fn(),
  };

  const mockRefreshTokenService = {
    createToken: jest.fn(),
  };

  const mockMailSenderService = {
    sendVerificationEmail: jest.fn(),
  };

  let localAuthService: LocalAuthService;

  // Mock data
  const mockUser = {
    id: "user-123",
    email: "test@example.com",
    password: "hashed-password",
    isEmailVerified: true,
  };

  const mockTokens = {
    accessToken: "mock-access-token",
    refreshToken: "mock-refresh-token",
  };

  beforeEach(() => {
    localAuthService = new LocalAuthService(
      mockJwtService as any,
      mockUserService as any,
      mockPasswordHasherService as any,
      mockRefreshTokenService as any,
      mockMailSenderService as any
    );

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe("LocalAuthService - registerUser method", () => {
    const registerUserDto: RegisterUserDto = {
      email: "test@example.com",
      password: "password123",
      username: "Test User",
    };

    it("should successfully register a new user", async () => {
      mockUserService.createUser.mockResolvedValue(mockUser);

      mockMailSenderService.sendVerificationEmail.mockResolvedValue(undefined);

      const result = await localAuthService.registerUser(registerUserDto);

      expect(result).toEqual(mockUser);
      expect(mockUserService.createUser).toHaveBeenCalledWith(registerUserDto);
      expect(mockMailSenderService.sendVerificationEmail).toHaveBeenCalledWith(
        mockUser.email
      );
    });

    it("should throw error if user creation fails", async () => {
      const error = new Error("User creation failed");
      mockUserService.createUser.mockRejectedValue(error);

      await expect(
        localAuthService.registerUser(registerUserDto)
      ).rejects.toThrow(error);
      expect(
        mockMailSenderService.sendVerificationEmail
      ).not.toHaveBeenCalled();
    });

    it("should throw error if email verification sending fails", async () => {
      mockUserService.createUser.mockResolvedValue(mockUser);
      const error = new Error("Email sending failed");
      mockMailSenderService.sendVerificationEmail.mockRejectedValue(error);

      await expect(
        localAuthService.registerUser(registerUserDto)
      ).rejects.toThrow(error);
    });
  });

  describe("LocalAuthService - loginUser method", () => {
    const loginUserDto = {
      email: "test@example.com",
      password: "password123",
    };

    beforeEach(() => {
      mockJwtService.generateAuthTokens.mockReturnValue(mockTokens);
      mockRefreshTokenService.createToken.mockResolvedValue(undefined);
    });

    it("should successfully login a user", async () => {
      mockUserService.getUserByEmail.mockResolvedValue(mockUser);
      mockPasswordHasherService.comparePassword.mockResolvedValue(true);

      const result = await localAuthService.loginUser(loginUserDto);

      expect(result).toEqual(mockTokens);
      expect(mockUserService.getUserByEmail).toHaveBeenCalledWith(
        loginUserDto.email
      );
      expect(mockPasswordHasherService.comparePassword).toHaveBeenCalledWith({
        password: loginUserDto.password,
        hashedPassword: mockUser.password,
      });
      expect(mockJwtService.generateAuthTokens).toHaveBeenCalledWith(
        mockUser.id
      );
      expect(mockRefreshTokenService.createToken).toHaveBeenCalledWith({
        userId: mockUser.id,
        token: mockTokens.refreshToken,
      });
    });

    it("should throw NotFoundError if user does not exist", async () => {
      mockUserService.getUserByEmail.mockResolvedValue(null);

      await expect(localAuthService.loginUser(loginUserDto)).rejects.toThrow(
        new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND)
      );
      expect(mockPasswordHasherService.comparePassword).not.toHaveBeenCalled();
    });

    it("should throw UnauthorizedError if email is not verified", async () => {
      mockUserService.getUserByEmail.mockResolvedValue({
        ...mockUser,
        isEmailVerified: false,
      });

      await expect(localAuthService.loginUser(loginUserDto)).rejects.toThrow(
        new UnauthorizedError(ERROR_MESSAGES.EMAIL_NOT_VERIFIED)
      );
      expect(mockPasswordHasherService.comparePassword).not.toHaveBeenCalled();
    });

    it("should throw ForbiddenError if password is incorrect", async () => {
      mockUserService.getUserByEmail.mockResolvedValue(mockUser);
      mockPasswordHasherService.comparePassword.mockResolvedValue(false);

      await expect(localAuthService.loginUser(loginUserDto)).rejects.toThrow(
        new ForbiddenError(ERROR_MESSAGES.INVALID_CREDENTIALS)
      );
      expect(mockJwtService.generateAuthTokens).not.toHaveBeenCalled();
    });

    it("should throw error if refresh token creation fails", async () => {
      mockUserService.getUserByEmail.mockResolvedValue(mockUser);
      mockPasswordHasherService.comparePassword.mockResolvedValue(true);
      const error = new Error("Token creation failed");
      mockRefreshTokenService.createToken.mockRejectedValue(error);

      await expect(localAuthService.loginUser(loginUserDto)).rejects.toThrow(
        error
      );
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
});
