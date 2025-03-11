import { ERROR_MESSAGES } from "@/modules/shared/constants";

import {
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "@/modules/shared/api-errors";

import type {
  ICryptoService,
  IMailSenderService,
  IPrismaService,
} from "@/modules/shared/services";

import type { ICreateUserDto, IUserService, User } from "@/modules/user";

import type { IAuthResponseDto, ILoginDto } from "@/modules/auth/dtos";

import type {
  IRefreshTokenService,
  IVerifyEmailService,
} from "@/modules/auth/features";

import type { IJwtService } from "@/modules/auth/utils";

import type { ICreateAccountDto } from "@/modules/user/features/account/dtos";
import { LocalAuthService } from "../local-auth.service";

describe("LocalAuthService", () => {
  // Mock dependencies
  const mockJwtService: Partial<IJwtService> = {
    generateAuthTokens: jest.fn(),
  };

  const mockPrismaService: Partial<IPrismaService> = {
    transaction: jest.fn(),
  };

  const mockUserService: Partial<IUserService> = {
    createUserWithAccount: jest.fn(),
    getUserByIdOrEmail: jest.fn(),
  };

  const mockVerifyEmailService: Partial<IVerifyEmailService> = {
    createToken: jest.fn(),
  };

  const mockCryptoService: Partial<ICryptoService> = {
    comparePasswords: jest.fn(),
  };

  const mockRefreshTokenService: Partial<IRefreshTokenService> = {
    createToken: jest.fn(),
  };

  const mockMailSenderService: Partial<IMailSenderService> = {
    sendVerificationEmail: jest.fn(),
  };

  let localAuthService: LocalAuthService;

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
    data: {
      email: "test@example.com",
      password: "password123",
      username: "Test User",
      isEmailVerified: false,
      profilePicture: null,
    },
  };

  const createAccountDto: ICreateAccountDto = {
    data: {
      providerAccountId: mockUser.email,
      provider: "credentials",
      type: "email",
    },
  };

  beforeEach(() => {
    localAuthService = new LocalAuthService(
      mockJwtService as any,
      mockPrismaService as any,
      mockUserService as any,
      mockVerifyEmailService as any,
      mockCryptoService as any,
      mockRefreshTokenService as any,
      mockMailSenderService as any
    );

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // describe("LocalAuthService - registerUser method", () => {
  //   const verifyEmailToken = "verify-email-token";

  //   it("should successfully register a new user", async () => {
  //     (mockUserService.createUserWithAccount as jest.Mock).mockResolvedValue(
  //       mockUser
  //     );

  //     (mockVerifyEmailService.createToken as jest.Mock).mockResolvedValue(
  //       verifyEmailToken
  //     );

  //     (
  //       mockMailSenderService.sendVerificationEmail as jest.Mock
  //     ).mockResolvedValue(undefined);

  //     const result = await localAuthService.registerUser(createUserDto);

  //     expect(result).toEqual(mockUser);

  //     expect(mockUserService.createUserWithAccount).toHaveBeenCalledWith(
  //       createUserDto,
  //       createAccountDto
  //     );

  //     expect(mockMailSenderService.sendVerificationEmail).toHaveBeenCalledWith(
  //       mockUser.email,
  //       verifyEmailToken
  //     );
  //   });

  //   it("should throw error if user creation fails", async () => {
  //     const error = new Error("User creation failed");
  //     (mockUserService.createUserWithAccount as jest.Mock).mockRejectedValue(
  //       error
  //     );

  //     await expect(
  //       localAuthService.registerUser(createUserDto)
  //     ).rejects.toThrow(error);

  //     expect(mockVerifyEmailService.createToken).not.toHaveBeenCalled();

  //     expect(
  //       mockMailSenderService.sendVerificationEmail
  //     ).not.toHaveBeenCalled();
  //   });

  //   it("should throw error if verification token generation fails", async () => {
  //     const error = new Error("Token generation failed");

  //     (mockUserService.createUserWithAccount as jest.Mock).mockResolvedValue(
  //       mockUser
  //     );

  //     (mockVerifyEmailService.createToken as jest.Mock).mockRejectedValue(
  //       error
  //     );

  //     await expect(
  //       localAuthService.registerUser(createUserDto)
  //     ).rejects.toThrow(error);

  //     expect(
  //       mockMailSenderService.sendVerificationEmail
  //     ).not.toHaveBeenCalled();
  //   });

  //   it("should throw error if email verification sending fails", async () => {
  //     const error = new Error("Email sending failed");
  //     (mockUserService.createUserWithAccount as jest.Mock).mockResolvedValue(
  //       mockUser
  //     );

  //     (mockVerifyEmailService.createToken as jest.Mock).mockResolvedValue(
  //       verifyEmailToken
  //     );

  //     (
  //       mockMailSenderService.sendVerificationEmail as jest.Mock
  //     ).mockRejectedValue(error);

  //     await expect(
  //       localAuthService.registerUser(createUserDto)
  //     ).rejects.toThrow(error);
  //   });

  //   it("should handle empty email in createUserDto", async () => {
  //     const invalidDto = {
  //       ...createUserDto,
  //       email: "",
  //     };

  //     await expect(localAuthService.registerUser(invalidDto)).rejects.toThrow();
  //   });

  //   it("should handle invalid email format in createUserDto", async () => {
  //     const invalidDto = {
  //       ...createUserDto,
  //       email: "invalid-email",
  //     };

  //     await expect(localAuthService.registerUser(invalidDto)).rejects.toThrow();
  //   });

  //   it("should handle empty username in createUserDto", async () => {
  //     const invalidDto = {
  //       ...createUserDto,
  //       username: "",
  //     };

  //     await expect(localAuthService.registerUser(invalidDto)).rejects.toThrow();
  //   });

  //   it("should handle concurrent user registration with same email", async () => {
  //     const conflictError = new ConflictError(ERROR_MESSAGES.ALREADY_EXISTS);

  //     (
  //       mockUserService.createUserWithAccount as jest.Mock
  //     ).mockRejectedValueOnce(conflictError);

  //     await expect(
  //       localAuthService.registerUser(createUserDto)
  //     ).rejects.toThrow(conflictError);
  //   });
  // });

  describe("LocalAuthService - loginUser method", () => {
    const loginDto: ILoginDto = {
      email: "test@example.com",
      password: "password123",
    };

    beforeEach(() => {
      (mockJwtService.generateAuthTokens as jest.Mock).mockReturnValue(
        mockTokens
      );
      (mockRefreshTokenService.createToken as jest.Mock).mockResolvedValue(
        undefined
      );
    });

    it("should successfully login a user", async () => {
      (mockUserService.getUserByIdOrEmail as jest.Mock).mockResolvedValue(
        mockUser
      );
      (mockCryptoService.comparePasswords as jest.Mock).mockResolvedValue(true);

      const result = await localAuthService.loginUser(loginDto);

      expect(result).toEqual(mockTokens);
      expect(mockUserService.getUserByIdOrEmail).toHaveBeenCalledWith({
        email: loginDto.email,
      });
      expect(mockCryptoService.comparePasswords).toHaveBeenCalledWith({
        plainText: loginDto.password,
        hash: mockUser.password,
      });
      expect(mockJwtService.generateAuthTokens).toHaveBeenCalledWith(
        mockUser.id
      );
      expect(mockRefreshTokenService.createToken).toHaveBeenCalledWith({
        userId: mockUser.id,
        data: {
          token: mockTokens.refreshToken,
          expiresAt: expect.any(Date),
        },
      });
    });

    it("should throw NotFoundError if user does not exist", async () => {
      (mockUserService.getUserByIdOrEmail as jest.Mock).mockRejectedValue(
        new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND)
      );

      await expect(localAuthService.loginUser(loginDto)).rejects.toThrow(
        new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND)
      );
      expect(mockCryptoService.comparePasswords).not.toHaveBeenCalled();
    });

    it("should throw UnauthorizedError if email is not verified", async () => {
      (mockUserService.getUserByIdOrEmail as jest.Mock).mockResolvedValue({
        ...mockUser,
        isEmailVerified: false,
      });

      await expect(localAuthService.loginUser(loginDto)).rejects.toThrow(
        new UnauthorizedError(ERROR_MESSAGES.NOT_VERIFIED)
      );
      expect(mockCryptoService.comparePasswords).not.toHaveBeenCalled();
    });

    it("should throw ForbiddenError if password is incorrect", async () => {
      (mockUserService.getUserByIdOrEmail as jest.Mock).mockResolvedValue(
        mockUser
      );
      (mockCryptoService.comparePasswords as jest.Mock).mockResolvedValue(
        false
      );

      await expect(localAuthService.loginUser(loginDto)).rejects.toThrow(
        new ForbiddenError(ERROR_MESSAGES.INVALID_CREDENTIALS)
      );
      expect(mockJwtService.generateAuthTokens).not.toHaveBeenCalled();
    });

    it("should throw error if refresh token creation fails", async () => {
      (mockUserService.getUserByIdOrEmail as jest.Mock).mockResolvedValue(
        mockUser
      );
      (mockCryptoService.comparePasswords as jest.Mock).mockResolvedValue(true);
      const error = new Error("Token creation failed");
      (mockRefreshTokenService.createToken as jest.Mock).mockRejectedValue(
        error
      );

      await expect(localAuthService.loginUser(loginDto)).rejects.toThrow(error);
    });

    it("should handle JWT token generation failure", async () => {
      (mockUserService.getUserByIdOrEmail as jest.Mock).mockResolvedValue(
        mockUser
      );

      (mockCryptoService.comparePasswords as jest.Mock).mockResolvedValue(true);

      (mockJwtService.generateAuthTokens as jest.Mock).mockImplementation(
        () => {
          throw new Error("Token generation failed");
        }
      );

      await expect(localAuthService.loginUser(loginDto)).rejects.toThrow(
        "Token generation failed"
      );
    });

    it("should handle createToken failure", async () => {
      (mockUserService.getUserByIdOrEmail as jest.Mock).mockResolvedValue(
        mockUser
      );

      (mockCryptoService.comparePasswords as jest.Mock).mockResolvedValue(true);

      const error = new Error("Database error");

      (mockRefreshTokenService.createToken as jest.Mock).mockRejectedValue(
        error
      );

      await expect(localAuthService.loginUser(loginDto)).rejects.toThrow(error);
    });
  });

  describe("error handling", () => {
    it("should handle unexpected errors from user service", async () => {
      const error = new Error("Database connection failed");
      (mockUserService.getUserByIdOrEmail as jest.Mock).mockRejectedValue(
        error
      );

      await expect(
        localAuthService.loginUser({
          email: "test@example.com",
          password: "password123",
        })
      ).rejects.toThrow(error);
    });

    it("should handle unexpected errors from password hasher service", async () => {
      (mockUserService.getUserByIdOrEmail as jest.Mock).mockResolvedValue(
        mockUser
      );
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

  // describe("Integration scenarios", () => {
  //   it("should handle complete flow of registration and login", async () => {
  //     // Registration
  //     (mockUserService.createUserWithAccount as jest.Mock).mockResolvedValue(
  //       mockUser
  //     );
  //     (mockVerifyEmailService.createToken as jest.Mock).mockResolvedValue(
  //       "verify-email-token"
  //     );
  //     (
  //       mockMailSenderService.sendVerificationEmail as jest.Mock
  //     ).mockResolvedValue(undefined);

  //     const registeredUser = await localAuthService.registerUser(createUserDto);

  //     // Login
  //     (mockUserService.getUserByIdOrEmail as jest.Mock).mockResolvedValue(
  //       registeredUser
  //     );
  //     (mockCryptoService.comparePasswords as jest.Mock).mockResolvedValue(true);
  //     (mockJwtService.generateAuthTokens as jest.Mock).mockReturnValue(
  //       mockTokens
  //     );
  //     (mockRefreshTokenService.createToken as jest.Mock).mockResolvedValue(
  //       undefined
  //     );

  //     const loginResult = await localAuthService.loginUser({
  //       email: createUserDto.data.email,
  //       password: "password123",
  //     });

  //     expect(loginResult).toEqual(mockTokens);
  //   });

  //   // it("should handle registration success but email verification failure", async () => {
  //   //   (mockUserService.createUserWithAccount as jest.Mock).mockResolvedValue(
  //   //     mockUser
  //   //   );
  //   //   (mockVerifyEmailService.createToken as jest.Mock).mockResolvedValue(
  //   //     "token"
  //   //   );
  //   //   (
  //   //     mockMailSenderService.sendVerificationEmail as jest.Mock
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
      (mockPrismaService.transaction as jest.Mock).mockImplementation(
        (callback) => {
          return callback(mockTransaction);
        }
      );
    });

    it("should register a user within a transaction", async () => {
      (mockUserService.createUserWithAccount as jest.Mock).mockResolvedValue(
        mockUser
      );

      (mockVerifyEmailService.createToken as jest.Mock).mockResolvedValue(
        verifyEmailToken
      );

      (
        mockMailSenderService.sendVerificationEmail as jest.Mock
      ).mockResolvedValue(undefined);

      await localAuthService.registerUser(createUserDto);

      expect(mockPrismaService.transaction).toHaveBeenCalled();

      expect(mockUserService.createUserWithAccount).toHaveBeenCalledWith(
        mockTransaction,
        createUserDto,
        createAccountDto
      );

      expect(mockVerifyEmailService.createToken).toHaveBeenCalledWith(
        mockTransaction,
        mockUser.email
      );

      expect(mockMailSenderService.sendVerificationEmail).toHaveBeenCalledWith(
        mockUser.email,
        verifyEmailToken
      );
    });

    // it("should rollback transaction if user creation fails", async () => {
    //   const error = new Error("User creation failed");
    //   (mockUserService.createUserWithAccount as jest.Mock).mockRejectedValue(
    //     error
    //   );

    //   (mockPrismaService.transaction as jest.Mock).mockImplementation(
    //     async (callback) => {
    //       await expect(callback(mockTransaction)).rejects.toThrow(error);
    //     }
    //   );

    //   await expect(
    //     localAuthService.registerUser(createUserDto)
    //   ).rejects.toThrow(error);

    //   expect(mockVerifyEmailService.createToken).not.toHaveBeenCalled();
    // });

    // it("should rollback transaction if email token creation fails", async () => {
    //   const error = new Error("Token creation failed");
    //   (mockUserService.createUserWithAccount as jest.Mock).mockResolvedValue(
    //     mockUser
    //   );
    //   (mockVerifyEmailService.createToken as jest.Mock).mockRejectedValue(
    //     error
    //   );

    //   (mockPrismaService.transaction as jest.Mock).mockImplementation(
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
      (mockPrismaService.transaction as jest.Mock).mockRejectedValue(error);

      await expect(
        localAuthService.registerUser(createUserDto)
      ).rejects.toThrow(error);
      expect(
        mockMailSenderService.sendVerificationEmail
      ).not.toHaveBeenCalled();
    });

    it("should handle email sending failure without affecting user creation", async () => {
      const emailError = new Error("Email sending failed");

      (mockUserService.createUserWithAccount as jest.Mock).mockResolvedValue(
        mockUser
      );
      (mockVerifyEmailService.createToken as jest.Mock).mockResolvedValue(
        verifyEmailToken
      );
      (
        mockMailSenderService.sendVerificationEmail as jest.Mock
      ).mockRejectedValue(emailError);

      await expect(
        localAuthService.registerUser(createUserDto)
      ).rejects.toThrow(emailError);

      // Even though email sending failed, transaction should have completed
      expect(mockPrismaService.transaction).toHaveBeenCalled();
      expect(mockUserService.createUserWithAccount).toHaveBeenCalled();
      expect(mockVerifyEmailService.createToken).toHaveBeenCalled();
    });
  });

  describe("LocalAuthService - registerUser data validation", () => {
    beforeEach(() => {
      (mockPrismaService.transaction as jest.Mock).mockImplementation(
        (callback) => callback("tx")
      );
    });

    it("should handle case when createUserDto has missing email", async () => {
      const invalidDto = {
        data: {
          ...createUserDto.data,
          email: undefined,
        },
      };

      await expect(
        localAuthService.registerUser(invalidDto as any)
      ).rejects.toThrow();
      expect(mockPrismaService.transaction).toHaveBeenCalled();
    });

    it("should handle case when createUserDto has missing password", async () => {
      const invalidDto = {
        data: {
          ...createUserDto.data,
          password: undefined,
        },
      };

      await expect(
        localAuthService.registerUser(invalidDto as any)
      ).rejects.toThrow();
      expect(mockPrismaService.transaction).toHaveBeenCalled();
    });

    it("should propagate validation errors from userService", async () => {
      const validationError = new Error("Validation failed");
      (mockUserService.createUserWithAccount as jest.Mock).mockRejectedValue(
        validationError
      );

      await expect(
        localAuthService.registerUser(createUserDto)
      ).rejects.toThrow(validationError);
    });
  });

  describe("LocalAuthService - registerUser integration scenarios", () => {
    beforeEach(() => {
      (mockPrismaService.transaction as jest.Mock).mockImplementation(
        (callback) => callback("tx")
      );
    });

    it("should handle retry scenario when first email attempt fails", async () => {
      (mockUserService.createUserWithAccount as jest.Mock).mockResolvedValue(
        mockUser
      );
      (mockVerifyEmailService.createToken as jest.Mock).mockResolvedValue(
        "token"
      );

      // First call fails, second call succeeds
      (mockMailSenderService.sendVerificationEmail as jest.Mock)
        .mockRejectedValueOnce(new Error("Email temporary failure"))
        .mockResolvedValueOnce(undefined);

      await expect(
        localAuthService.registerUser(createUserDto)
      ).rejects.toThrow("Email temporary failure");

      // The transaction should have completed successfully
      expect(mockUserService.createUserWithAccount).toHaveBeenCalled();
      expect(mockVerifyEmailService.createToken).toHaveBeenCalled();

      // Try again with the same user data
      await localAuthService.registerUser(createUserDto);

      // Second attempt should succeed
      expect(mockMailSenderService.sendVerificationEmail).toHaveBeenCalledTimes(
        2
      );
    });

    it("should handle database being down during registration", async () => {
      const dbError = new Error("Database connection lost");
      (mockPrismaService.transaction as jest.Mock).mockRejectedValue(dbError);

      await expect(
        localAuthService.registerUser(createUserDto)
      ).rejects.toThrow(dbError);
      expect(mockUserService.createUserWithAccount).not.toHaveBeenCalled();
      expect(mockVerifyEmailService.createToken).not.toHaveBeenCalled();
      expect(
        mockMailSenderService.sendVerificationEmail
      ).not.toHaveBeenCalled();
    });

    it("should properly handle transaction retry mechanism from prisma service", async () => {
      // Setup mock for transaction method that simulates a retry scenario
      const mockRetryableTx = jest.fn().mockImplementation((callback) => {
        // Simulate retry logic
        return callback("tx");
      });

      (mockPrismaService.transaction as jest.Mock).mockImplementation(
        mockRetryableTx
      );
      (mockUserService.createUserWithAccount as jest.Mock).mockResolvedValue(
        mockUser
      );

      (mockVerifyEmailService.createToken as jest.Mock).mockResolvedValue(
        "token"
      );

      (
        mockMailSenderService.sendVerificationEmail as jest.Mock
      ).mockResolvedValue(undefined);

      await localAuthService.registerUser(createUserDto);

      expect(mockPrismaService.transaction).toHaveBeenCalled();
      expect(mockMailSenderService.sendVerificationEmail).toHaveBeenCalledTimes(
        1
      );
    });
  });
});
