import {
  // BadRequestError,
  // ConflictError,
  NotFoundError,
} from "@/modules/shared/api-errors";
import { ERROR_MESSAGES } from "@/modules/shared/constants";

import type { ICryptoService, IPrismaService } from "@/modules/shared/services";

import { UserService } from "../user.service";

import type {
  // ICreateUserDto,
  // IResetPasswordDto,
  // IUpdatePasswordDto,
  // IUpdateUserDto,
} from "../dtos";
import type { IAccountService } from "../features/account/account.types";
import type { User } from "../user.model";
import type { IUserRepository, IUserService } from "../user.types";
// import type { ICreateAccountDto } from "../features/account/dtos";

describe("UserService", () => {
  let userService: IUserService;
  let mockUserRepository: IUserRepository;
  let mockAccountService: IAccountService;
  let mockCryptoService: ICryptoService;

  let mockPrismaService: Partial<IPrismaService>;

  const mockUserId = "user_id_001";
  const mockUserEmail = "test@example.com";

  const mockUser: User = {
    id: mockUserId,
    username: "testuser",
    email: mockUserEmail,
    password: "hashedPassword",
    profilePicture: null,
    isEmailVerified: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    mockUserRepository = {
      create: jest.fn(),
      update: jest.fn(),
      getByEmail: jest.fn(),
      getById: jest.fn(),
      updatePassword: jest.fn(),
      verifyEmail: jest.fn(),
    };

    mockPrismaService = {
      transaction: jest.fn(),
    };

    mockAccountService = {
      createAccount: jest.fn(),
      deleteAccount: jest.fn(),
      findAccountById: jest.fn(),
      findAccountByProvider: jest.fn(),
      findAccountsByUserId: jest.fn(),
      linkAccountToUser: jest.fn(),
    };

    mockCryptoService = {
      hashPassword: jest.fn(),
      comparePasswords: jest.fn(),
      generateRandomSecureToken: jest.fn(),
      hashToken: jest.fn(),
    };

    userService = new UserService(
      mockUserRepository,
      mockAccountService,
      mockPrismaService as IPrismaService,
      mockCryptoService
    );
    jest.clearAllMocks();
  });

  // describe("UserService - createUser", () => {
  //   const createUserDto: ICreateUserDto = {
  //     data: {
  //       email: "new@example.com",
  //       password: "ValidPass123!",
  //       username: "newuser",
  //       profilePicture: null,
  //       isEmailVerified: false,
  //     },
  //   };

  //   it("should create user with hashed password within transaction", async () => {
  //     // Mock transaction flow
  //     const txMock = {
  //       getUserByEmail: jest.fn().mockResolvedValue(null),
  //       createUser: jest.fn().mockResolvedValue({
  //         ...createUserDto.data,
  //         password: "hashed123",
  //       }),
  //     };
  //     (mockUserRepository.transaction as jest.Mock).mockImplementation(
  //       async (fn) => fn(txMock)
  //     );
  //     (mockCryptoService.hashPassword as jest.Mock).mockResolvedValue(
  //       "hashed123"
  //     );

  //     const result = await userService.createUser(createUserDto);

  //     expect(txMock.getUserByEmail).toHaveBeenCalledWith(
  //       createUserDto.data.email
  //     );
  //     expect(txMock.createUser).toHaveBeenCalledWith({
  //       data: {
  //         ...createUserDto.data,
  //         password: "hashed123",
  //       },
  //     });
  //     expect(result.password).toBe("hashed123");
  //   });

  //   it("should throw ConflictError for duplicate email within transaction", async () => {
  //     const txMock = {
  //       getUserByEmail: jest.fn().mockResolvedValue(mockUser),
  //     };
  //     (mockUserRepository.transaction as jest.Mock).mockImplementation(
  //       async (fn) => fn(txMock)
  //     );

  //     await expect(userService.createUser(createUserDto)).rejects.toThrow(
  //       new ConflictError(ERROR_MESSAGES.ALREADY_EXISTS)
  //     );
  //   });

  //   it("should propagate errors if createUser in transaction fails", async () => {
  //     const txMock = {
  //       getUserByEmail: jest.fn().mockResolvedValue(null),
  //       createUser: jest.fn().mockRejectedValue(new Error("DB Error")),
  //     };

  //     (mockUserRepository.transaction as jest.Mock).mockImplementation(
  //       async (fn) => fn(txMock)
  //     );

  //     (mockCryptoService.hashPassword as jest.Mock).mockResolvedValue(
  //       "hashed123"
  //     );

  //     await expect(userService.createUser(createUserDto)).rejects.toThrow(
  //       "DB Error"
  //     );
  //   });

  //   it("should propagate errors if crypto.hashPassword rejects", async () => {
  //     const txMock = {
  //       getUserByEmail: jest.fn().mockResolvedValue(null),
  //       createUser: jest.fn(),
  //     };
  //     (mockUserRepository.transaction as jest.Mock).mockImplementation(
  //       async (fn) => fn(txMock)
  //     );
  //     (mockCryptoService.hashPassword as jest.Mock).mockRejectedValue(
  //       new Error("Hashing error")
  //     );

  //     await expect(userService.createUser(createUserDto)).rejects.toThrow(
  //       "Hashing error"
  //     );
  //   });
  // });

  // describe("UserService - getOrCreateUser", () => {
  //   const createUserDto: ICreateUserDto = {
  //     data: { ...mockUser, password: "password" },
  //   };

  //   it("should return existing user without creating", async () => {
  //     const txMock = {
  //       getByEmail: jest.fn().mockResolvedValue(mockUser),
  //       create: jest.fn(),
  //     };

  //     (mockUserRepository.transaction as jest.Mock).mockImplementation(
  //       async (fn) => fn(txMock)
  //     );

  //     const result = await userService.getOrCreateUser(createUserDto);

  //     expect(result).toEqual(mockUser);

  //     expect(txMock.create).not.toHaveBeenCalled();
  //   });

  //   it("should create new user within transaction when not exists", async () => {
  //     const txMock = {
  //       getByEmail: jest.fn().mockResolvedValue(null),
  //       create: jest.fn().mockResolvedValue(mockUser),
  //     };

  //     (mockUserRepository.transaction as jest.Mock).mockImplementation(
  //       async (fn) => fn(txMock)
  //     );

  //     (mockCryptoService.hashPassword as jest.Mock).mockResolvedValue(
  //       "hashed123"
  //     );

  //     const result = await userService.getOrCreateUser(createUserDto);

  //     expect(txMock.create).toHaveBeenCalled();
  //     expect(result).toEqual(mockUser);
  //   });

  //   it("should propagate error if user creation fails", async () => {
  //     const txMock = {
  //       getByEmail: jest.fn().mockResolvedValue(null),
  //       create: jest.fn().mockRejectedValue(new Error("Creation failed")),
  //     };

  //     (mockUserRepository.transaction as jest.Mock).mockImplementation(
  //       async (fn) => fn(txMock)
  //     );

  //     await expect(userService.getOrCreateUser(createUserDto)).rejects.toThrow(
  //       "Creation failed"
  //     );
  //   });

  //   it("should propagate error if crypto.hashPassword rejects in getOrCreateUser", async () => {
  //     const txMock = {
  //       getByEmail: jest.fn().mockResolvedValue(null),
  //       create: jest.fn(),
  //     };

  //     (mockUserRepository.transaction as jest.Mock).mockImplementation(
  //       async (fn) => fn(txMock)
  //     );

  //     (mockCryptoService.hashPassword as jest.Mock).mockRejectedValue(
  //       new Error("Hash error")
  //     );

  //     await expect(userService.getOrCreateUser(createUserDto)).rejects.toThrow(
  //       "Hash error"
  //     );
  //   });
  // });

  describe("UserService - getUserByIdOrEmail", () => {
    it("should return user by ID", async () => {
      (mockUserRepository.getById as jest.Mock).mockResolvedValue(mockUser);

      const result = await userService.getUserByIdOrEmail({ id: mockUserId });

      expect(result).toEqual(mockUser);
    });

    it("should return user by email", async () => {
      (mockUserRepository.getByEmail as jest.Mock).mockResolvedValue(mockUser);

      const result = await userService.getUserByIdOrEmail({
        email: mockUserEmail,
      });

      expect(result).toEqual(mockUser);
    });

    it("should throw NotFoundError when user not found", async () => {
      (mockUserRepository.getById as jest.Mock).mockResolvedValue(null);

      await expect(
        userService.getUserByIdOrEmail({ id: "invalid" })
      ).rejects.toThrow(new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND));
    });

    it("should propagate errors if repository.getUser rejects", async () => {
      (mockUserRepository.getByEmail as jest.Mock).mockRejectedValue(
        new Error("Repo error")
      );

      await expect(
        userService.getUserByIdOrEmail({ email: "error@example.com" })
      ).rejects.toThrow("Repo error");
    });
  });

  // describe("UserService - createUserWithAccount", () => {
  //   const createUserDto: ICreateUserDto = {
  //     data: {
  //       email: "new@example.com",
  //       password: "ValidPass123!",
  //       username: "newuser",
  //       profilePicture: null,
  //       isEmailVerified: false,
  //     },
  //   };

  //   const createAccountDto: ICreateAccountDto = {
  //     data: {
  //       provider: "google",
  //       providerAccountId: "12345",
  //       type: "oauth",
  //     },
  //   };

  //   it("should create user and account within transaction", async () => {
  //     const txMock = {
  //       getByEmail: jest.fn().mockResolvedValue(null),
  //     };

  //     (mockUserRepository.transaction as jest.Mock).mockImplementation(
  //       async (fn) => fn(txMock)
  //     );
  //     (mockUserRepository.create as jest.Mock).mockResolvedValue(mockUser);

  //     (mockCryptoService.hashPassword as jest.Mock).mockResolvedValue(
  //       "hashed123"
  //     );

  //     const result = await userService.createUserWithAccount(
  //       createUserDto,
  //       createAccountDto
  //     );

  //     expect(txMock.getByEmail).toHaveBeenCalledWith(createUserDto.data.email);

  //     expect(mockUserRepository.create).toHaveBeenCalledWith(
  //       txMock,
  //       expect.objectContaining({
  //         data: {
  //           ...createUserDto.data,
  //           password: "hashed123",
  //         },
  //       })
  //     );
  //     expect(mockAccountService.createAccount).toHaveBeenCalledWith(
  //       txMock,
  //       mockUser.id,
  //       createAccountDto
  //     );
  //     expect(result).toEqual(mockUser);
  //   });

  //   it("should throw ConflictError when email exists", async () => {
  //     const txMock = {
  //       getByEmail: jest.fn().mockResolvedValue(mockUser),
  //     };

  //     (mockUserRepository.transaction as jest.Mock).mockImplementation(
  //       async (fn) => fn(txMock)
  //     );

  //     await expect(
  //       userService.createUserWithAccount(createUserDto, createAccountDto)
  //     ).rejects.toThrow(new ConflictError(ERROR_MESSAGES.ALREADY_EXISTS));
  //   });

  //   it("should rollback transaction on account creation failure", async () => {
  //     const txMock = {
  //       getByEmail: jest.fn().mockResolvedValue(null),
  //     };

  //     (mockUserRepository.transaction as jest.Mock).mockImplementation(
  //       async (fn) => fn(txMock)
  //     );
  //     (mockUserRepository.create as jest.Mock).mockResolvedValue(mockUser);
  //     (mockCryptoService.hashPassword as jest.Mock).mockResolvedValue(
  //       "hashed123"
  //     );
  //     (mockAccountService.createAccount as jest.Mock).mockRejectedValue(
  //       new Error("Account creation failed")
  //     );

  //     await expect(
  //       userService.createUserWithAccount(createUserDto, createAccountDto)
  //     ).rejects.toThrow("Account creation failed");

  //     // Verify transaction was attempted
  //     expect(mockUserRepository.create).toHaveBeenCalled();
  //     expect(mockAccountService.createAccount).toHaveBeenCalled();
  //   });
  // });

  // describe("UserService - getUserByIdOrEmail Edge Cases", () => {
  //   it("should prioritize ID when both ID and email are provided", async () => {
  //     const differentUser: User = {
  //       ...mockUser,
  //       id: "different_id",
  //       email: "different@example.com",
  //     };

  //     (mockUserRepository.getById as jest.Mock).mockResolvedValue(mockUser);
  //     (mockUserRepository.getByEmail as jest.Mock).mockResolvedValue(
  //       differentUser
  //     );

  //     const result = await userService.getUserByIdOrEmail({
  //       id: mockUserId,
  //       email: "different@example.com",
  //     });

  //     expect(result).toEqual(mockUser);
  //     expect(mockUserRepository.getByEmail).not.toHaveBeenCalled();
  //   });

  //   it("should fallback to email when ID not found", async () => {
  //     (mockUserRepository.getById as jest.Mock).mockResolvedValue(null);
  //     (mockUserRepository.getByEmail as jest.Mock).mockResolvedValue(mockUser);

  //     const result = await userService.getUserByIdOrEmail({
  //       id: "invalid_id",
  //       email: mockUserEmail,
  //     });

  //     expect(result).toEqual(mockUser);
  //     expect(mockUserRepository.getById).toHaveBeenCalledWith("invalid_id");
  //     expect(mockUserRepository.getByEmail).toHaveBeenCalledWith(mockUserEmail);
  //   });
  // });

  // describe("UserService - updateUser Edge Cases", () => {
  //   it("should skip email uniqueness check when email remains unchanged", async () => {
  //     const txMock = {
  //       getById: jest.fn().mockResolvedValue(mockUser),
  //       getByEmail: jest.fn(),
  //       update: jest.fn().mockResolvedValue(mockUser),
  //     };

  //     (mockUserRepository.transaction as jest.Mock).mockImplementation(
  //       async (fn) => fn(txMock)
  //     );

  //     await userService.updateUser({
  //       id: mockUserId,
  //       data: { email: mockUserEmail },
  //     });

  //     expect(txMock.getByEmail).not.toHaveBeenCalled();
  //     expect(txMock.update).toHaveBeenCalled();
  //   });

  //   it("should handle database constraint violation during email update", async () => {
  //     const txMock = {
  //       getById: jest.fn().mockResolvedValue(mockUser),
  //       getByEmail: jest.fn().mockResolvedValue(null),
  //       update: jest.fn().mockRejectedValue({
  //         code: "P2002",
  //         message: "Unique constraint violation",
  //       }),
  //     };

  //     (mockUserRepository.transaction as jest.Mock).mockImplementation(
  //       async (fn) => fn(txMock)
  //     );

  //     await expect(
  //       userService.updateUser({
  //         id: mockUserId,
  //         data: { email: "new@example.com" },
  //       })
  //     ).rejects.toThrow(new ConflictError(ERROR_MESSAGES.ALREADY_EXISTS));
  //   });
  // });

  // describe("UserService - Security Checks", () => {
  //   it("should prevent password update without current password verification", async () => {
  //     const txMock = {
  //       getById: jest.fn().mockResolvedValue(mockUser),
  //     };

  //     (mockUserRepository.transaction as jest.Mock).mockImplementation(
  //       async (fn) => fn(txMock)
  //     );

  //     await expect(
  //       userService.updateUserPassword({
  //         id: mockUserId,
  //         currentPassword: "wrongPassword",
  //         newPassword: "newPassword",
  //       })
  //     ).rejects.toThrow(
  //       new BadRequestError(ERROR_MESSAGES.INVALID_CREDENTIALS)
  //     );
  //   });

  //   it("should ensure password hashing occurs during reset", async () => {
  //     const txMock = {
  //       getById: jest.fn().mockResolvedValue(mockUser),
  //       updatePassword: jest.fn().mockResolvedValue(mockUser),
  //     };

  //     (mockUserRepository.transaction as jest.Mock).mockImplementation(
  //       async (fn) => fn(txMock)
  //     );
  //     (mockCryptoService.hashPassword as jest.Mock).mockResolvedValue(
  //       "newHash"
  //     );

  //     await userService.resetUserPassword({
  //       id: mockUserId,
  //       newPassword: "plainTextPassword",
  //     });

  //     expect(mockCryptoService.hashPassword).toHaveBeenCalledWith(
  //       "plainTextPassword"
  //     );
  //     expect(txMock.updatePassword).toHaveBeenCalledWith(
  //       txMock,
  //       mockUserId,
  //       "newHash"
  //     );
  //   });
  // });

  // describe("UserService - Concurrency", () => {
  //   it("should handle parallel verifyEmail requests", async () => {
  //     const txMock1 = {
  //       getById: jest
  //         .fn()
  //         .mockResolvedValue({ ...mockUser, isEmailVerified: false }),
  //       verifyEmail: jest
  //         .fn()
  //         .mockResolvedValue({ ...mockUser, isEmailVerified: true }),
  //     };

  //     const txMock2 = {
  //       getById: jest
  //         .fn()
  //         .mockResolvedValue({ ...mockUser, isEmailVerified: false }),
  //       verifyEmail: jest
  //         .fn()
  //         .mockResolvedValue({ ...mockUser, isEmailVerified: true }),
  //     };

  //     (mockUserRepository.transaction as jest.Mock)
  //       .mockImplementationOnce(async (fn) => fn(txMock1))
  //       .mockImplementationOnce(async (fn) => fn(txMock2));

  //     const [result1, result2] = await Promise.all([
  //       userService.verifyUserEmail(mockUserId),
  //       userService.verifyUserEmail(mockUserId),
  //     ]);

  //     expect(result1.isEmailVerified).toBe(true);
  //     expect(result2.isEmailVerified).toBe(true);
  //     expect(mockUserRepository.transaction).toHaveBeenCalledTimes(2);
  //   });
  // });

  // describe("UserService - updateUser", () => {
  //   const updateUserDto: IUpdateUserDto = {
  //     id: mockUserId,
  //     data: {
  //       username: "newuser",
  //       email: "new@example.com",
  //     },
  //   };

  //   it("should update user within transaction", async () => {
  //     const txMock = {
  //       getById: jest.fn().mockResolvedValue(mockUser),
  //       getByEmail: jest.fn().mockResolvedValue(null),
  //       update: jest
  //         .fn()
  //         .mockResolvedValue({ ...mockUser, ...updateUserDto.data }),
  //     };

  //     (mockUserRepository.transaction as jest.Mock).mockImplementation(
  //       async (fn) => fn(txMock)
  //     );

  //     const result = await userService.updateUser(updateUserDto);

  //     expect(txMock.update).toHaveBeenCalledWith(updateUserDto);

  //     expect(result).toEqual({ ...mockUser, ...updateUserDto.data });
  //   });

  //   it("should return found user without update if dto is empty", async () => {
  //     const txMock = {
  //       getById: jest.fn().mockResolvedValue(mockUser),
  //       getByEmail: jest.fn().mockResolvedValue(null),
  //       update: jest.fn().mockResolvedValue(mockUser),
  //     };

  //     (mockUserRepository.transaction as jest.Mock).mockImplementation(
  //       async (fn) => fn(txMock)
  //     );

  //     const result = await userService.updateUser({ id: mockUserId, data: {} });

  //     expect(result).toEqual(mockUser);

  //     expect(txMock.update).not.toHaveBeenCalled();
  //   });

  //   it("should throw ConflictError for duplicate email in transaction", async () => {
  //     const txMock = {
  //       getById: jest.fn().mockResolvedValue(mockUser),
  //       getByEmail: jest.fn().mockResolvedValue(mockUser),
  //       update: jest.fn().mockRejectedValue(
  //         new (class implements Error {
  //           name = "PrismaClientKnownRequestError";
  //           message = "Unique constraint failed";
  //           code = "P2002";
  //         })()
  //       ),
  //     };

  //     (mockUserRepository.transaction as jest.Mock).mockImplementation(
  //       async (fn) => fn(txMock)
  //     );

  //     await expect(userService.updateUser(updateUserDto)).rejects.toThrow(
  //       new ConflictError(ERROR_MESSAGES.ALREADY_EXISTS)
  //     );
  //   });

  //   it("should allow email update to current email", async () => {
  //     const txMock = {
  //       getById: jest.fn().mockResolvedValue(mockUser),
  //       getByEmail: jest.fn().mockResolvedValue(null),
  //       update: jest.fn().mockResolvedValue(mockUser),
  //     };

  //     (mockUserRepository.transaction as jest.Mock).mockImplementation(
  //       async (fn) => fn(txMock)
  //     );

  //     const result = await userService.updateUser({
  //       id: mockUserId,
  //       data: {
  //         email: mockUserEmail,
  //       },
  //     });

  //     expect(txMock.update).toHaveBeenCalled();
  //     expect(result).toEqual(mockUser);
  //   });

  //   it("should propagate error if tx.update rejects", async () => {
  //     const txMock = {
  //       getById: jest.fn().mockResolvedValue(mockUser),
  //       getByEmail: jest.fn().mockResolvedValue(null),
  //       update: jest.fn().mockRejectedValue(new Error("Update failed")),
  //     };

  //     (mockUserRepository.transaction as jest.Mock).mockImplementation(
  //       async (fn) => fn(txMock)
  //     );

  //     await expect(userService.updateUser(updateUserDto)).rejects.toThrow(
  //       "Update failed"
  //     );
  //   });
  // });

  // describe("UserService - updateUserPassword", () => {
  //   const updatePassDto: IUpdatePasswordDto = {
  //     id: mockUserId,
  //     currentPassword: "oldPass123!",
  //     newPassword: "newPass123!",
  //   };

  //   it("should update password within transaction", async () => {
  //     const txMock = {
  //       getById: jest.fn().mockResolvedValue(mockUser),
  //       updatePassword: jest.fn().mockResolvedValue({
  //         ...mockUser,
  //         password: "newHashed",
  //       }),
  //     };

  //     (mockUserRepository.transaction as jest.Mock).mockImplementation(
  //       async (fn) => fn(txMock)
  //     );

  //     (mockCryptoService.comparePasswords as jest.Mock).mockResolvedValue(true);
  //     (mockCryptoService.hashPassword as jest.Mock).mockResolvedValue(
  //       "newHashed"
  //     );

  //     const result = await userService.updateUserPassword(updatePassDto);
  //     expect(result.password).toBe("newHashed");
  //   });

  //   it("should throw BadRequestError if current password is invalid", async () => {
  //     const txMock = {
  //       getById: jest.fn().mockResolvedValue(mockUser),
  //     };

  //     (mockUserRepository.transaction as jest.Mock).mockImplementation(
  //       async (fn) => fn(txMock)
  //     );

  //     (mockCryptoService.comparePasswords as jest.Mock).mockResolvedValue(
  //       false
  //     );

  //     await expect(
  //       userService.updateUserPassword(updatePassDto)
  //     ).rejects.toThrow(
  //       new BadRequestError(ERROR_MESSAGES.INVALID_CREDENTIALS)
  //     );
  //   });

  //   it("should throw BadRequestError if new password matches current", async () => {
  //     const txMock = {
  //       getById: jest.fn().mockResolvedValue(mockUser),
  //     };

  //     (mockUserRepository.transaction as jest.Mock).mockImplementation(
  //       async (fn) => fn(txMock)
  //     );

  //     (mockCryptoService.comparePasswords as jest.Mock).mockResolvedValue(true);

  //     await expect(
  //       userService.updateUserPassword({
  //         id: mockUserId,
  //         currentPassword: "pass",
  //         newPassword: "pass",
  //       })
  //     ).rejects.toThrow(
  //       new BadRequestError(ERROR_MESSAGES.PASSWORD_SAME_AS_CURRENT)
  //     );
  //   });

  //   it("should propagate error if crypto.comparePasswords rejects", async () => {
  //     const txMock = {
  //       getById: jest.fn().mockResolvedValue(mockUser),
  //     };

  //     (mockUserRepository.transaction as jest.Mock).mockImplementation(
  //       async (fn) => fn(txMock)
  //     );

  //     (mockCryptoService.comparePasswords as jest.Mock).mockRejectedValue(
  //       new Error("Compare error")
  //     );

  //     await expect(
  //       userService.updateUserPassword(updatePassDto)
  //     ).rejects.toThrow("Compare error");
  //   });

  //   it("should propagate error if crypto.hashPassword rejects during updatePassword", async () => {
  //     const txMock = {
  //       getById: jest.fn().mockResolvedValue(mockUser),
  //       updatePassword: jest.fn(),
  //     };

  //     (mockUserRepository.transaction as jest.Mock).mockImplementation(
  //       async (fn) => fn(txMock)
  //     );

  //     (mockCryptoService.comparePasswords as jest.Mock).mockResolvedValue(true);
  //     (mockCryptoService.hashPassword as jest.Mock).mockRejectedValue(
  //       new Error("Hash error")
  //     );

  //     await expect(
  //       userService.updateUserPassword(updatePassDto)
  //     ).rejects.toThrow("Hash error");
  //   });

  //   it("should propagate error if tx.updatePassword rejects", async () => {
  //     const txMock = {
  //       getById: jest.fn().mockResolvedValue(mockUser),
  //       updatePassword: jest
  //         .fn()
  //         .mockRejectedValue(new Error("UpdatePassword failed")),
  //     };

  //     (mockUserRepository.transaction as jest.Mock).mockImplementation(
  //       async (fn) => fn(txMock)
  //     );

  //     (mockCryptoService.comparePasswords as jest.Mock).mockResolvedValue(true);
  //     (mockCryptoService.hashPassword as jest.Mock).mockResolvedValue(
  //       "newHashed"
  //     );

  //     await expect(
  //       userService.updateUserPassword(updatePassDto)
  //     ).rejects.toThrow("UpdatePassword failed");
  //   });
  // });

  // describe("UserService - resetUserPassword", () => {
  //   const resetPasswordDto: IResetPasswordDto = {
  //     id: mockUserId,
  //     newPassword: "newPassword",
  //   };

  //   it("should reset password within transaction", async () => {
  //     const txMock = {
  //       getById: jest.fn().mockResolvedValue(mockUser),
  //       updatePassword: jest.fn().mockResolvedValue({
  //         ...mockUser,
  //         password: "newHashed",
  //       }),
  //     };

  //     (mockUserRepository.transaction as jest.Mock).mockImplementation(
  //       async (fn) => fn(txMock)
  //     );

  //     (mockCryptoService.hashPassword as jest.Mock).mockResolvedValue(
  //       "newHashed"
  //     );

  //     const result = await userService.resetUserPassword(resetPasswordDto);

  //     expect(result.password).toBe("newHashed");
  //   });

  //   it("should throw NotFoundError if user does not exist during resetPassword", async () => {
  //     const txMock = {
  //       getById: jest.fn().mockResolvedValue(null),
  //     };

  //     (mockUserRepository.transaction as jest.Mock).mockImplementation(
  //       async (fn) => fn(txMock)
  //     );

  //     await expect(
  //       userService.resetUserPassword({
  //         id: "invalid_id",
  //         newPassword: "newPassword",
  //       })
  //     ).rejects.toThrow(new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND));
  //   });

  //   it("should propagate error if crypto.hashPassword rejects during resetPassword", async () => {
  //     const txMock = {
  //       getById: jest.fn().mockResolvedValue(mockUser),
  //       updatePassword: jest.fn(),
  //     };

  //     (mockUserRepository.transaction as jest.Mock).mockImplementation(
  //       async (fn) => fn(txMock)
  //     );

  //     (mockCryptoService.hashPassword as jest.Mock).mockRejectedValue(
  //       new Error("Hash reset error")
  //     );

  //     await expect(
  //       userService.resetUserPassword(resetPasswordDto)
  //     ).rejects.toThrow("Hash reset error");
  //   });

  //   it("should propagate error if tx.updatePassword rejects during resetPassword", async () => {
  //     const txMock = {
  //       getById: jest.fn().mockResolvedValue(mockUser),
  //       updatePassword: jest
  //         .fn()
  //         .mockRejectedValue(new Error("Tx update failed")),
  //     };

  //     (mockUserRepository.transaction as jest.Mock).mockImplementation(
  //       async (fn) => fn(txMock)
  //     );

  //     (mockCryptoService.hashPassword as jest.Mock).mockResolvedValue(
  //       "newHashed"
  //     );

  //     await expect(
  //       userService.resetUserPassword(resetPasswordDto)
  //     ).rejects.toThrow("Tx update failed");
  //   });
  // });

  // describe("UserService - verifyUserEmail", () => {
  //   it("should verify user email within transaction", async () => {
  //     const txMock = {
  //       getById: jest.fn().mockResolvedValue(mockUser),
  //       verifyEmail: jest.fn().mockResolvedValue({
  //         ...mockUser,
  //         isEmailVerified: true,
  //       }),
  //     };

  //     (mockUserRepository.transaction as jest.Mock).mockImplementation(
  //       async (fn) => fn(txMock)
  //     );

  //     const result = await userService.verifyUserEmail(mockUserId);

  //     expect(result.isEmailVerified).toBe(true);
  //   });

  //   it("should throw NotFoundError if user does not exist during verifyUserEmail", async () => {
  //     const txMock = {
  //       getById: jest.fn().mockResolvedValue(null),
  //     };

  //     (mockUserRepository.transaction as jest.Mock).mockImplementation(
  //       async (fn) => fn(txMock)
  //     );

  //     await expect(userService.verifyUserEmail("invalid")).rejects.toThrow(
  //       new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND)
  //     );
  //   });

  //   it("should throw BadRequestError if email is already verified", async () => {
  //     const txMock = {
  //       getById: jest.fn().mockResolvedValue({
  //         ...mockUser,
  //         isEmailVerified: true,
  //       }),
  //     };

  //     (mockUserRepository.transaction as jest.Mock).mockImplementation(
  //       async (fn) => fn(txMock)
  //     );

  //     await expect(userService.verifyUserEmail(mockUserId)).rejects.toThrow(
  //       new BadRequestError(ERROR_MESSAGES.ALREADY_VERIFIED)
  //     );
  //   });

  //   it("should propagate error if tx.verifyUserEmail rejects", async () => {
  //     const txMock = {
  //       getById: jest.fn().mockResolvedValue(mockUser),
  //       verifyEmail: jest.fn().mockRejectedValue(new Error("Verify error")),
  //     };

  //     (mockUserRepository.transaction as jest.Mock).mockImplementation(
  //       async (fn) => fn(txMock)
  //     );

  //     await expect(userService.verifyUserEmail(mockUserId)).rejects.toThrow(
  //       "Verify error"
  //     );
  //   });
  // });

  // describe("UserService - Edge Cases", () => {
  //   it("should handle concurrent getOrCreateUser transactions", async () => {
  //     let callCount = 0;
  //     (mockUserRepository.transaction as jest.Mock).mockImplementation(
  //       async (fn) => {
  //         callCount++;
  //         const txMock = {
  //           getByEmail:
  //             callCount === 1
  //               ? jest.fn().mockResolvedValue(null)
  //               : jest.fn().mockResolvedValue(mockUser),
  //           create: jest.fn().mockResolvedValue(mockUser),
  //         };
  //         return fn(txMock);
  //       }
  //     );

  //     const [result1, result2] = await Promise.all([
  //       userService.getOrCreateUser({ data: mockUser }),
  //       userService.getOrCreateUser({ data: mockUser }),
  //     ]);

  //     expect(result1).toEqual(mockUser);
  //     expect(result2).toEqual(mockUser);
  //     expect(mockUserRepository.transaction).toHaveBeenCalledTimes(2);
  //   });
  // });
});
