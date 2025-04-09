import type { Prisma } from "@prisma/client";
import { mock, mockReset } from "jest-mock-extended";

import type {
  ICreateUserDto,
  IUpdatePasswordDto,
  IUpdateUserDto,
} from "@tubenote/dtos";
import type { User } from "@tubenote/types";

import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from "@/modules/shared/api-errors";
import { ERROR_MESSAGES } from "@/modules/shared/constants";

import type { ICryptoService, IPrismaService } from "@/modules/shared/services";

import { UserService } from "../user.service";

import type { IAccountService } from "../features/account/account.types";
import type { ICreateAccountDto } from "../features/account/dtos";
import type { IUserRepository, IUserServiceOptions } from "../user.types";

describe("UserService", () => {
  let userService: UserService;
  let mockTx: Prisma.TransactionClient;

  const userRepository = mock<IUserRepository>();
  const accountService = mock<IAccountService>();
  const cryptoService = mock<ICryptoService>();
  const prismaService = mock<IPrismaService>();

  const serviceOptions: IUserServiceOptions = {
    userRepository,
    accountService,
    prismaService,
    cryptoService,
  };

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
    mockReset(userRepository);
    mockReset(accountService);
    mockReset(cryptoService);
    mockReset(prismaService);

    // Reset all mocks before each test
    jest.resetAllMocks();

    prismaService.transaction.mockImplementation(
      async (fn: (tx: Prisma.TransactionClient) => Promise<any>) => {
        const tx = {};
        return fn(tx as Prisma.TransactionClient);
      }
    );

    mockTx = {} as Prisma.TransactionClient;

    // Reset singleton instance before each test to ensure a clean state.
    // @ts-ignore: resetting the private _instance for testing purposes
    UserService._instance = undefined;

    // Create a new instance for each test
    userService = UserService.getInstance(serviceOptions);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Singleton behavior", () => {
    it("should create a new instance when none exists", () => {
      const instance1 = UserService.getInstance(serviceOptions);
      expect(instance1).toBeInstanceOf(UserService);
    });

    it("should return the existing instance when called multiple times", () => {
      const instance1 = UserService.getInstance(serviceOptions);
      const instance2 = UserService.getInstance(serviceOptions);
      expect(instance1).toBe(instance2);
    });
  });

  describe("UserService - getUserById", () => {
    afterEach(() => jest.clearAllMocks());

    it("should return user when found by id", async () => {
      userRepository.getById.mockResolvedValue(mockUser);

      const result = await userService.getUserById(mockUserId);

      expect(userRepository.getById).toHaveBeenCalledWith(
        mockUserId,
        undefined
      );
      expect(result).toEqual(mockUser);
    });

    it("should return null if user does not exist", async () => {
      userRepository.getById.mockResolvedValue(null);

      const result = await userService.getUserById(mockUserId);

      expect(result).toBeNull();
    });

    it("should propagate errors if repository.getById rejects", async () => {
      const error = new Error("Database error");

      userRepository.getById.mockRejectedValue(error);

      await expect(userService.getUserById(mockUserId)).rejects.toThrow(error);
    });
  });

  describe("UserService - getUserByEmail", () => {
    afterEach(() => jest.clearAllMocks());

    it("should return user when found by email", async () => {
      userRepository.getByEmail.mockResolvedValue(mockUser);

      const result = await userService.getUserByEmail(mockUserEmail);

      expect(userRepository.getByEmail).toHaveBeenCalledWith(
        mockUserEmail,
        undefined
      );
      expect(result).toEqual(mockUser);
    });

    it("should return null if user does not exist", async () => {
      userRepository.getByEmail.mockResolvedValue(null);

      const result = await userService.getUserByEmail(mockUserEmail);

      expect(result).toBeNull();
    });

    it("should propagate errors if repository.getByEmail rejects", async () => {
      const error = new Error("Database error");

      userRepository.getByEmail.mockRejectedValue(error);

      await expect(userService.getUserByEmail(mockUserEmail)).rejects.toThrow(
        error
      );
    });
  });

  describe("UserService - createUserWithAccount", () => {
    const createUserDto: ICreateUserDto = {
      email: "new@example.com",
      password: "ValidPass123!",
      username: "newuser",
    };

    const createAccountDto: ICreateAccountDto = {
      provider: "google",
      providerAccountId: "12345",
      type: "oauth",
    };

    it("should create user and account within transaction", async () => {
      // const txMock = jest.fn();

      // prismaService.transaction.mockImplementation(async (fn) => fn(txMock()));
      userRepository.create.mockResolvedValue(mockUser);
      cryptoService.hashPassword.mockResolvedValue("hashed123");

      const result = await userService.createUserWithAccount(
        mockTx,
        createUserDto,
        createAccountDto
      );

      expect(userRepository.create).toHaveBeenCalledWith(
        mockTx,
        expect.objectContaining({
          ...createUserDto,
          password: "hashed123",
        })
      );
      expect(accountService.createAccount).toHaveBeenCalledWith(
        mockTx,
        mockUser.id,
        createAccountDto
      );
      expect(result).toEqual(mockUser);
    });

    it("should rollback transaction on account creation failure", async () => {
      prismaService.transaction.mockImplementation(async (fn) => fn(mockTx));
      userRepository.create.mockResolvedValue(mockUser);
      cryptoService.hashPassword.mockResolvedValue("hashed123");

      accountService.createAccount.mockRejectedValue(
        new Error("Account creation failed")
      );

      await expect(
        userService.createUserWithAccount(
          mockTx,
          createUserDto,
          createAccountDto
        )
      ).rejects.toThrow("Account creation failed");

      // Verify transaction was attempted
      expect(userRepository.create).toHaveBeenCalled();
      expect(accountService.createAccount).toHaveBeenCalled();
    });
  });

  describe("UserService - updateUser", () => {
    const updateUserDto: IUpdateUserDto = {
      username: "newuser",
      email: "new@example.com",
    };

    it("should update user successfully", async () => {
      // Arrange
      const updatedUser = { ...mockUser, ...updateUserDto };

      userRepository.getById.mockResolvedValue(mockUser);
      userRepository.getByEmail.mockResolvedValue(null); // No user with the new email
      userRepository.update.mockResolvedValue(updatedUser);

      // Act
      const result = await userService.updateUser(mockUserId, updateUserDto);

      // Assert
      expect(prismaService.transaction).toHaveBeenCalled();
      expect(userRepository.getById).toHaveBeenCalledWith(mockUserId, mockTx);
      expect(userRepository.getByEmail).toHaveBeenCalledWith(
        "new@example.com",
        mockTx
      );
      expect(userRepository.update).toHaveBeenCalledWith(
        mockTx,
        mockUserId,
        updateUserDto
      );
      expect(result).toEqual(updatedUser);
    });

    it("should return existing user when no data to update", async () => {
      // Arrange
      const existingUser = mockUser;

      userRepository.getById.mockResolvedValue(existingUser);

      // Act
      const result = await userService.updateUser(mockUserId, {});

      // Assert
      expect(prismaService.transaction).toHaveBeenCalled();
      expect(userRepository.getById).toHaveBeenCalledWith(mockUserId, mockTx);
      expect(userRepository.update).not.toHaveBeenCalled();
      expect(result).toEqual(existingUser);
    });

    it("should throw NotFoundError when user does not exist", async () => {
      // Arrange
      userRepository.getById.mockResolvedValue(null);

      // Act & Assert
      await expect(
        userService.updateUser(mockUserId, updateUserDto)
      ).rejects.toThrow(new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND));

      expect(prismaService.transaction).toHaveBeenCalled();
    });

    it("should throw ConflictError when new email already exists", async () => {
      // Arrange
      const existingUser = mockUser;
      const conflictUser = { ...mockUser, id: "2", email: "new@example.com" };

      userRepository.getById.mockResolvedValue(existingUser);
      userRepository.getByEmail.mockResolvedValue(conflictUser);

      // Act & Assert
      await expect(
        userService.updateUser(mockUserId, updateUserDto)
      ).rejects.toThrow(new ConflictError(ERROR_MESSAGES.ALREADY_EXISTS));

      expect(prismaService.transaction).toHaveBeenCalled();
      expect(userRepository.getById).toHaveBeenCalledWith(mockUserId, mockTx);
      expect(userRepository.getByEmail).toHaveBeenCalledWith(
        "new@example.com",
        mockTx
      );
    });

    it("should handle transaction rollback on error", async () => {
      // Arrange
      userRepository.getById.mockResolvedValue(mockUser);
      userRepository.getByEmail.mockResolvedValue(null);
      userRepository.update.mockRejectedValue(new Error("Update failed"));

      // Mock transaction to properly simulate rollback
      prismaService.transaction.mockImplementation(async (callback) => {
        try {
          return await callback(mockTx);
        } catch (error) {
          // Simulate transaction rollback
          // biome-ignore lint/complexity/noUselessCatch: <explanation>
          throw error;
        }
      });

      // Act & Assert
      await expect(
        userService.updateUser(mockUserId, updateUserDto)
      ).rejects.toThrow("Update failed");

      expect(prismaService.transaction).toHaveBeenCalled();
    });
  });

  describe("UserService - updateUserPassword", () => {
    const existingUser = mockUser;

    const updatePasswordDto: IUpdatePasswordDto = {
      currentPassword: "old_password",
      newPassword: "new_password",
    };

    it("should update password successfully when current password is valid", async () => {
      // Arrange
      const updatedUser = {
        ...mockUser,
        password: "hashed_new_password",
      };

      userRepository.getById.mockResolvedValue(existingUser);
      cryptoService.comparePasswords.mockResolvedValue(true);
      cryptoService.hashPassword.mockResolvedValue("hashed_new_password");
      userRepository.updatePassword.mockResolvedValue(updatedUser);

      // Act
      const result = await userService.updateUserPassword(
        mockUserId,
        updatePasswordDto
      );

      // Assert
      expect(prismaService.transaction).toHaveBeenCalled();
      expect(userRepository.getById).toHaveBeenCalledWith(mockUserId, mockTx);
      expect(cryptoService.comparePasswords).toHaveBeenCalledWith({
        plainText: "old_password",
        hash: "hashedPassword",
      });
      expect(cryptoService.hashPassword).toHaveBeenCalledWith("new_password");
      expect(userRepository.updatePassword).toHaveBeenCalledWith(
        mockTx,
        mockUserId,
        "hashed_new_password"
      );
      expect(result).toEqual(updatedUser);
    });

    it("should throw BadRequestError when current password is invalid", async () => {
      // Arrange
      userRepository.getById.mockResolvedValue(existingUser);
      cryptoService.comparePasswords.mockResolvedValue(false);

      const updatePasswordDto: IUpdatePasswordDto = {
        currentPassword: "wrong_password",
        newPassword: "new_password",
      };

      // Act & Assert
      await expect(
        userService.updateUserPassword(mockUserId, updatePasswordDto)
      ).rejects.toThrow(
        new BadRequestError(ERROR_MESSAGES.INVALID_CREDENTIALS)
      );

      expect(prismaService.transaction).toHaveBeenCalled();
      expect(userRepository.getById).toHaveBeenCalledWith(mockUserId, mockTx);
      expect(cryptoService.comparePasswords).toHaveBeenCalled();
      expect(cryptoService.hashPassword).not.toHaveBeenCalled();
      expect(userRepository.updatePassword).not.toHaveBeenCalled();
    });

    it("should throw BadRequestError when new password is same as current", async () => {
      const updatePasswordDto: IUpdatePasswordDto = {
        currentPassword: "same_password",
        newPassword: "same_password",
      };

      // Arrange
      userRepository.getById.mockResolvedValue(existingUser);
      cryptoService.comparePasswords.mockResolvedValue(true);

      // Act & Assert
      await expect(
        userService.updateUserPassword(mockUserId, updatePasswordDto)
      ).rejects.toThrow(
        new BadRequestError(ERROR_MESSAGES.PASSWORD_SAME_AS_CURRENT)
      );

      expect(prismaService.transaction).toHaveBeenCalled();
      expect(userRepository.getById).toHaveBeenCalledWith(mockUserId, mockTx);
      expect(cryptoService.comparePasswords).toHaveBeenCalled();
      expect(cryptoService.hashPassword).not.toHaveBeenCalled();
      expect(userRepository.updatePassword).not.toHaveBeenCalled();
    });

    it("should throw NotFoundError when user does not exist", async () => {
      // Arrange
      userRepository.getById.mockResolvedValue(null);

      const updatePasswordDto: IUpdatePasswordDto = {
        currentPassword: "old_password",
        newPassword: "new_password",
      };

      // Act & Assert
      await expect(
        userService.updateUserPassword("999", updatePasswordDto)
      ).rejects.toThrow(new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND));

      expect(prismaService.transaction).toHaveBeenCalled();
      expect(userRepository.getById).toHaveBeenCalledWith("999", mockTx);
    });
  });

  describe("UserService - resetUserPassword", () => {
    const existingUser = mockUser;
    it("should reset password successfully", async () => {
      // Arrange
      const updatedUser = {
        ...existingUser,
        password: "hashed_new_password",
      };

      userRepository.getById.mockResolvedValue(existingUser);
      cryptoService.hashPassword.mockResolvedValue("hashed_new_password");
      userRepository.updatePassword.mockResolvedValue(updatedUser);

      // Act
      const result = await userService.resetUserPassword(
        mockUserId,
        "new_password"
      );

      // Assert
      expect(prismaService.transaction).toHaveBeenCalled();
      expect(userRepository.getById).toHaveBeenCalledWith(mockUserId, mockTx);
      expect(cryptoService.hashPassword).toHaveBeenCalledWith("new_password");
      expect(userRepository.updatePassword).toHaveBeenCalledWith(
        mockTx,
        mockUserId,
        "hashed_new_password"
      );
      expect(result).toEqual(updatedUser);
    });

    it("should throw NotFoundError when user does not exist", async () => {
      // Arrange
      userRepository.getById.mockResolvedValue(null);

      // Act & Assert
      await expect(
        userService.resetUserPassword("999", "new_password")
      ).rejects.toThrow(new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND));

      expect(prismaService.transaction).toHaveBeenCalled();
      expect(userRepository.getById).toHaveBeenCalledWith("999", mockTx);
    });
  });

  describe("UserService - verifyUserEmail", () => {
    it("should verify email successfully", async () => {
      // Arrange
      const existingUser = {
        ...mockUser,
        isEmailVerified: false,
      };
      const verifiedUser = {
        ...mockUser,
        isEmailVerified: true,
      };

      userRepository.getById.mockResolvedValue(existingUser);
      userRepository.verifyEmail.mockResolvedValue(verifiedUser);

      // Act
      const result = await userService.verifyUserEmail(mockUserId);

      // Assert
      expect(userRepository.getById).toHaveBeenCalledWith(
        mockUserId,
        undefined
      );
      expect(userRepository.verifyEmail).toHaveBeenCalledWith(
        mockUserId,
        undefined
      );
      expect(result).toEqual(verifiedUser);
    });

    it("should throw NotFoundError when user does not exist", async () => {
      // Arrange
      userRepository.getById.mockResolvedValue(null);

      // Act & Assert
      await expect(userService.verifyUserEmail("999")).rejects.toThrow(
        new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND)
      );
    });

    it("should throw BadRequestError when email is already verified", async () => {
      // Arrange
      const existingUser = {
        ...mockUser,
        isEmailVerified: true,
      };

      userRepository.getById.mockResolvedValue(existingUser);

      // Act & Assert
      await expect(userService.verifyUserEmail(mockUserId)).rejects.toThrow(
        new BadRequestError(ERROR_MESSAGES.ALREADY_VERIFIED)
      );
    });

    it("should pass transaction to repository when provided", async () => {
      // Arrange
      const existingUser = {
        ...mockUser,
        isEmailVerified: false,
      };

      const verifiedUser = {
        ...mockUser,
        isEmailVerified: true,
      };

      userRepository.getById.mockResolvedValue(existingUser);
      userRepository.verifyEmail.mockResolvedValue(verifiedUser);

      // Act
      await userService.verifyUserEmail(mockUserId, mockTx);

      // Assert
      expect(userRepository.getById).toHaveBeenCalledWith(mockUserId, mockTx);
      expect(userRepository.verifyEmail).toHaveBeenCalledWith(
        mockUserId,
        mockTx
      );
    });

    // it("should use withTransaction when no transaction is provided", async () => {
    //   // Arrange
    //   const existingUser = {
    //     id: mockUserId,
    //     email: "test@example.com",
    //     isEmailVerified: false,
    //   };
    //   const verifiedUser = {
    //     id: mockUserId,
    //     email: "test@example.com",
    //     isEmailVerified: true,
    //   };

    //   userRepository.getById.mockResolvedValue(existingUser);
    //   userRepository.verifyEmail.mockResolvedValue(verifiedUser);

    //   // Mock withTransaction to simulate transaction behavior
    //   prismaService.withTransaction.mockImplementation(async (callback) => {
    //     return await callback(mockTx);
    //   });

    //   // Act
    //   await userService.verifyUserEmail(mockUserId);

    //   // Assert
    //   // In a real implementation, we would expect withTransaction to be called
    //   // but since our current UserService doesn't use it, we're just checking the repository calls
    //   expect(userRepository.getById).toHaveBeenCalledWith(mockUserId, undefined);
    //   expect(userRepository.verifyEmail).toHaveBeenCalledWith(
    //     mockUserId,
    //     undefined
    //   );
    // });
  });
});
