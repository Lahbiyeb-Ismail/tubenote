import { ERROR_MESSAGES } from "@/modules/shared/constants";

import {
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "@/modules/shared/api-errors";

import type {
  ICryptoService,
  ILoggerService,
  IMailSenderService,
  IPrismaService,
} from "@/modules/shared/services";

import type { ICreateUserDto, IUserService, User } from "@/modules/user";

import type { IAuthResponseDto, ILoginDto } from "@/modules/auth/dtos";

import type {
  ILocalAuthServiceOptions,
  IRefreshTokenService,
  IVerifyEmailService,
} from "@/modules/auth/features";

import type { IJwtService } from "@/modules/auth/utils";

import type { ICreateAccountDto } from "@/modules/user/features/account/dtos";
import { mock, mockReset } from "jest-mock-extended";
import { LocalAuthService } from "../local-auth.service";

describe("LocalAuthService", () => {
  let localAuthService: LocalAuthService;

  // Mock dependencies
  const jwtService = mock<IJwtService>();

  const prismaService = mock<IPrismaService>();

  const userService = mock<IUserService>();

  const verifyEmailService = mock<IVerifyEmailService>();

  const cryptoService = mock<ICryptoService>();

  const refreshTokenService = mock<IRefreshTokenService>();

  const mailSenderService = mock<IMailSenderService>();

  const loggerService = mock<ILoggerService>();

  const serviceOptions: ILocalAuthServiceOptions = {
    prismaService,
    userService,
    verifyEmailService,
    refreshTokenService,
    jwtService,
    cryptoService,
    mailSenderService,
    loggerService,
  };

  // const localAuthService = LocalAuthService.getInstance();

  // Mock data
  const mockUser: User = {
    id: "user-123",
    email: "test@example.com",
    username: "Test User",
    password: "hashed-password",
    isEmailVerified: true,
    profilePicture: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockTokens: IAuthResponseDto = {
    accessToken: "mock-access-token",
    refreshToken: "mock-refresh-token",
  };

  const createUserDto: ICreateUserDto = {
    email: "test@example.com",
    password: "password123",
    username: "Test User",
    isEmailVerified: false,
  };

  const createAccountDto: ICreateAccountDto = {
    providerAccountId: mockUser.email,
    provider: "credentials",
    type: "email",
  };

  beforeEach(() => {
    mockReset(prismaService);
    mockReset(userService);
    mockReset(verifyEmailService);
    mockReset(cryptoService);
    mockReset(jwtService);
    mockReset(refreshTokenService);
    mockReset(mailSenderService);
    mockReset(loggerService);

    // Clear all mocks before each test
    jest.clearAllMocks();

    // Reset singleton instance before each test to ensure a clean state.
    // @ts-ignore: resetting the private _instance for testing purposes
    LocalAuthService._instance = undefined;

    localAuthService = LocalAuthService.getInstance(serviceOptions);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Singleton behavior", () => {
    it("should create a new instance when none exists", () => {
      const instance1 = LocalAuthService.getInstance(serviceOptions);
      expect(instance1).toBeInstanceOf(LocalAuthService);
    });

    it("should return the existing instance when called multiple times", () => {
      const instance1 = LocalAuthService.getInstance(serviceOptions);
      const instance2 = LocalAuthService.getInstance(serviceOptions);
      expect(instance1).toBe(instance2);
    });
  });

  describe("LocalAuthService - loginUser method", () => {
    const loginDto: ILoginDto = {
      email: "test@example.com",
      password: "password123",
    };

    beforeEach(() => {
      (jwtService.generateAuthTokens as jest.Mock).mockReturnValue(mockTokens);
      (refreshTokenService.createToken as jest.Mock).mockResolvedValue(
        undefined
      );
    });

    it("should successfully login a user", async () => {
      (userService.getUserByEmail as jest.Mock).mockResolvedValue(mockUser);
      (cryptoService.comparePasswords as jest.Mock).mockResolvedValue(true);

      const result = await localAuthService.loginUser(loginDto);

      expect(result).toEqual(mockTokens);
      expect(userService.getUserByEmail).toHaveBeenCalledWith(loginDto.email);
      expect(cryptoService.comparePasswords).toHaveBeenCalledWith({
        plainText: loginDto.password,
        hash: mockUser.password,
      });
      expect(jwtService.generateAuthTokens).toHaveBeenCalledWith(mockUser.id);
      expect(refreshTokenService.createToken).toHaveBeenCalledWith({
        userId: mockUser.id,
        data: {
          token: mockTokens.refreshToken,
          expiresAt: expect.any(Date),
        },
      });
    });

    it("should throw NotFoundError if user does not exist", async () => {
      (userService.getUserByEmail as jest.Mock).mockRejectedValue(
        new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND)
      );

      await expect(localAuthService.loginUser(loginDto)).rejects.toThrow(
        new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND)
      );
      expect(cryptoService.comparePasswords).not.toHaveBeenCalled();
    });

    it("should throw UnauthorizedError if email is not verified", async () => {
      (userService.getUserByEmail as jest.Mock).mockResolvedValue({
        ...mockUser,
        isEmailVerified: false,
      });

      await expect(localAuthService.loginUser(loginDto)).rejects.toThrow(
        new UnauthorizedError(ERROR_MESSAGES.NOT_VERIFIED)
      );
      expect(cryptoService.comparePasswords).not.toHaveBeenCalled();
    });

    it("should throw ForbiddenError if password is incorrect", async () => {
      (userService.getUserByEmail as jest.Mock).mockResolvedValue(mockUser);
      (cryptoService.comparePasswords as jest.Mock).mockResolvedValue(false);

      await expect(localAuthService.loginUser(loginDto)).rejects.toThrow(
        new ForbiddenError(ERROR_MESSAGES.INVALID_CREDENTIALS)
      );
      expect(jwtService.generateAuthTokens).not.toHaveBeenCalled();
    });

    it("should throw error if refresh token creation fails", async () => {
      (userService.getUserByEmail as jest.Mock).mockResolvedValue(mockUser);
      (cryptoService.comparePasswords as jest.Mock).mockResolvedValue(true);
      const error = new Error("Token creation failed");
      (refreshTokenService.createToken as jest.Mock).mockRejectedValue(error);

      await expect(localAuthService.loginUser(loginDto)).rejects.toThrow(error);
    });

    it("should handle JWT token generation failure", async () => {
      (userService.getUserByEmail as jest.Mock).mockResolvedValue(mockUser);

      (cryptoService.comparePasswords as jest.Mock).mockResolvedValue(true);

      (jwtService.generateAuthTokens as jest.Mock).mockImplementation(() => {
        throw new Error("Token generation failed");
      });

      await expect(localAuthService.loginUser(loginDto)).rejects.toThrow(
        "Token generation failed"
      );
    });

    it("should handle createToken failure", async () => {
      (userService.getUserByEmail as jest.Mock).mockResolvedValue(mockUser);

      (cryptoService.comparePasswords as jest.Mock).mockResolvedValue(true);

      const error = new Error("Database error");

      (refreshTokenService.createToken as jest.Mock).mockRejectedValue(error);

      await expect(localAuthService.loginUser(loginDto)).rejects.toThrow(error);
    });
  });

  describe("error handling", () => {
    it("should handle unexpected errors from user service", async () => {
      const error = new Error("Database connection failed");
      (userService.getUserByEmail as jest.Mock).mockRejectedValue(error);

      await expect(
        localAuthService.loginUser({
          email: "test@example.com",
          password: "password123",
        })
      ).rejects.toThrow(error);
    });

    it("should handle unexpected errors from password hasher service", async () => {
      (userService.getUserByEmail as jest.Mock).mockResolvedValue(mockUser);
      const error = new Error("Comparison failed");
      (cryptoService.comparePasswords as jest.Mock).mockRejectedValue(error);

      await expect(
        localAuthService.loginUser({
          email: "test@example.com",
          password: "password123",
        })
      ).rejects.toThrow(error);
    });
  });

  // describe("Integration scenarios", () => {
  //   it("should handle complete flow of registration and login", async () => {
  //     // Registration
  //     (userService.createUserWithAccount as jest.Mock).mockResolvedValue(
  //       mockUser
  //     );
  //     (verifyEmailService.createToken as jest.Mock).mockResolvedValue(
  //       "verify-email-token"
  //     );
  //     (
  //       mailSenderService.sendVerificationEmail as jest.Mock
  //     ).mockResolvedValue(undefined);

  //     const registeredUser = await localAuthService.registerUser(createUserDto);

  //     // Login
  //     (userService.getUserByEmail as jest.Mock).mockResolvedValue(
  //       registeredUser
  //     );
  //     (cryptoService.comparePasswords as jest.Mock).mockResolvedValue(true);
  //     (jwtService.generateAuthTokens as jest.Mock).mockReturnValue(
  //       mockTokens
  //     );
  //     (refreshTokenService.createToken as jest.Mock).mockResolvedValue(
  //       undefined
  //     );

  //     const loginResult = await localAuthService.loginUser({
  //       email: createUserDto.email,
  //       password: "password123",
  //     });

  //     expect(loginResult).toEqual(mockTokens);
  //   });

  //   // it("should handle registration success but email verification failure", async () => {
  //   //   (userService.createUserWithAccount as jest.Mock).mockResolvedValue(
  //   //     mockUser
  //   //   );
  //   //   (verifyEmailService.createToken as jest.Mock).mockResolvedValue(
  //   //     "token"
  //   //   );
  //   //   (
  //   //     mailSenderService.sendVerificationEmail as jest.Mock
  //   //   ).mockRejectedValue(new Error("Email service down"));

  //   //   await expect(
  //   //     localAuthService.registerUser(createUserDto)
  //   //   ).rejects.toThrow("Email service down");
  //   // });
  // });

  describe("LocalAuthService - registerUser method with transaction handling", () => {
    const verifyEmailToken = "verify-email-token";
    const mockTransaction = jest.fn();

    beforeEach(() => {
      // Set up transaction mock for proper testing
      (prismaService.transaction as jest.Mock).mockImplementation(
        (callback) => {
          return callback(mockTransaction);
        }
      );
    });

    it("should register a user within a transaction", async () => {
      (userService.createUserWithAccount as jest.Mock).mockResolvedValue(
        mockUser
      );

      (verifyEmailService.createToken as jest.Mock).mockResolvedValue(
        verifyEmailToken
      );

      (mailSenderService.sendVerificationEmail as jest.Mock).mockResolvedValue(
        undefined
      );

      await localAuthService.registerUser(createUserDto);

      expect(prismaService.transaction).toHaveBeenCalled();

      expect(userService.createUserWithAccount).toHaveBeenCalledWith(
        mockTransaction,
        createUserDto,
        createAccountDto
      );

      expect(verifyEmailService.createToken).toHaveBeenCalledWith(
        mockTransaction,
        mockUser.email
      );

      expect(mailSenderService.sendVerificationEmail).toHaveBeenCalledWith(
        mockUser.email,
        verifyEmailToken
      );
    });

    // it("should rollback transaction if user creation fails", async () => {
    //   const error = new Error("User creation failed");
    //   (userService.createUserWithAccount as jest.Mock).mockRejectedValue(
    //     error
    //   );

    //   (prismaService.transaction as jest.Mock).mockImplementation(
    //     async (callback) => {
    //       await expect(callback(mockTransaction)).rejects.toThrow(error);
    //     }
    //   );

    //   await expect(
    //     localAuthService.registerUser(createUserDto)
    //   ).rejects.toThrow(error);

    //   expect(verifyEmailService.createToken).not.toHaveBeenCalled();
    // });

    // it("should rollback transaction if email token creation fails", async () => {
    //   const error = new Error("Token creation failed");
    //   (userService.createUserWithAccount as jest.Mock).mockResolvedValue(
    //     mockUser
    //   );
    //   (verifyEmailService.createToken as jest.Mock).mockRejectedValue(
    //     error
    //   );

    //   (prismaService.transaction as jest.Mock).mockImplementation(
    //     async (callback) => {
    //       try {
    //         await callback(mockTransaction);
    //       } catch (e) {
    //         // Simulate transaction rollback
    //         throw e;
    //       }
    //     }
    //   );

    //   await expect(
    //     localAuthService.registerUser(createUserDto)
    //   ).rejects.toThrow(error);
    // });

    it("should not send verification email if transaction fails", async () => {
      const error = new Error("Transaction failed");
      (prismaService.transaction as jest.Mock).mockRejectedValue(error);

      await expect(
        localAuthService.registerUser(createUserDto)
      ).rejects.toThrow(error);
      expect(mailSenderService.sendVerificationEmail).not.toHaveBeenCalled();
    });

    it("should handle email sending failure without affecting user creation", async () => {
      const emailError = new Error("Email sending failed");

      (userService.createUserWithAccount as jest.Mock).mockResolvedValue(
        mockUser
      );
      (verifyEmailService.createToken as jest.Mock).mockResolvedValue(
        verifyEmailToken
      );
      (mailSenderService.sendVerificationEmail as jest.Mock).mockRejectedValue(
        emailError
      );

      await expect(
        localAuthService.registerUser(createUserDto)
      ).rejects.toThrow(emailError);

      // Even though email sending failed, transaction should have completed
      expect(prismaService.transaction).toHaveBeenCalled();
      expect(userService.createUserWithAccount).toHaveBeenCalled();
      expect(verifyEmailService.createToken).toHaveBeenCalled();
    });
  });

  describe("LocalAuthService - registerUser data validation", () => {
    beforeEach(() => {
      (prismaService.transaction as jest.Mock).mockImplementation((callback) =>
        callback("tx")
      );
    });

    it("should handle case when createUserDto has missing email", async () => {
      const invalidDto = {
        data: {
          ...createUserDto,
          email: undefined,
        },
      };

      await expect(
        localAuthService.registerUser(invalidDto as any)
      ).rejects.toThrow();
      expect(prismaService.transaction).toHaveBeenCalled();
    });

    it("should handle case when createUserDto has missing password", async () => {
      const invalidDto = {
        data: {
          ...createUserDto,
          password: undefined,
        },
      };

      await expect(
        localAuthService.registerUser(invalidDto as any)
      ).rejects.toThrow();
      expect(prismaService.transaction).toHaveBeenCalled();
    });

    it("should propagate validation errors from userService", async () => {
      const validationError = new Error("Validation failed");
      (userService.createUserWithAccount as jest.Mock).mockRejectedValue(
        validationError
      );

      await expect(
        localAuthService.registerUser(createUserDto)
      ).rejects.toThrow(validationError);
    });
  });

  describe("LocalAuthService - registerUser integration scenarios", () => {
    beforeEach(() => {
      (prismaService.transaction as jest.Mock).mockImplementation((callback) =>
        callback("tx")
      );
    });

    it("should handle retry scenario when first email attempt fails", async () => {
      (userService.createUserWithAccount as jest.Mock).mockResolvedValue(
        mockUser
      );
      (verifyEmailService.createToken as jest.Mock).mockResolvedValue("token");

      // First call fails, second call succeeds
      (mailSenderService.sendVerificationEmail as jest.Mock)
        .mockRejectedValueOnce(new Error("Email temporary failure"))
        .mockResolvedValueOnce(undefined);

      await expect(
        localAuthService.registerUser(createUserDto)
      ).rejects.toThrow("Email temporary failure");

      // The transaction should have completed successfully
      expect(userService.createUserWithAccount).toHaveBeenCalled();
      expect(verifyEmailService.createToken).toHaveBeenCalled();

      // Try again with the same user data
      await localAuthService.registerUser(createUserDto);

      // Second attempt should succeed
      expect(mailSenderService.sendVerificationEmail).toHaveBeenCalledTimes(2);
    });

    it("should handle database being down during registration", async () => {
      const dbError = new Error("Database connection lost");
      (prismaService.transaction as jest.Mock).mockRejectedValue(dbError);

      await expect(
        localAuthService.registerUser(createUserDto)
      ).rejects.toThrow(dbError);
      expect(userService.createUserWithAccount).not.toHaveBeenCalled();
      expect(verifyEmailService.createToken).not.toHaveBeenCalled();
      expect(mailSenderService.sendVerificationEmail).not.toHaveBeenCalled();
    });

    it("should properly handle transaction retry mechanism from prisma service", async () => {
      // Setup mock for transaction method that simulates a retry scenario
      const mockRetryableTx = jest.fn().mockImplementation((callback) => {
        // Simulate retry logic
        return callback("tx");
      });

      (prismaService.transaction as jest.Mock).mockImplementation(
        mockRetryableTx
      );
      (userService.createUserWithAccount as jest.Mock).mockResolvedValue(
        mockUser
      );

      (verifyEmailService.createToken as jest.Mock).mockResolvedValue("token");

      (mailSenderService.sendVerificationEmail as jest.Mock).mockResolvedValue(
        undefined
      );

      await localAuthService.registerUser(createUserDto);

      expect(prismaService.transaction).toHaveBeenCalled();
      expect(mailSenderService.sendVerificationEmail).toHaveBeenCalledTimes(1);
    });
  });
});
