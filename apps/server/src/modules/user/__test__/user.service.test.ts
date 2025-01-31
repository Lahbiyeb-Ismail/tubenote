import { ERROR_MESSAGES } from "@/constants/error-messages.contants";
import { BadRequestError, ConflictError, NotFoundError } from "@/errors";

import type { User } from "@/modules/user/user.model";
import { UserService } from "@/modules/user/user.service";

import type { ICryptoService } from "@/modules/utils/crypto";
import type { IUserRepository, IUserService } from "../user.types";

import type { CreateUserDto, UpdatePasswordDto, UpdateUserDto } from "../dtos";

describe("UserService methods test", () => {
  let userService: IUserService;
  let mockUserRepository: IUserRepository;
  let mockCryptoService: ICryptoService;

  beforeEach(() => {
    mockUserRepository = {
      transaction: jest.fn(),
      getUser: jest.fn(),
      createUser: jest.fn(),
      updateUser: jest.fn(),
      updatePassword: jest.fn(),
    };

    mockCryptoService = {
      hashPassword: jest.fn(),
      comparePasswords: jest.fn(),
      generateRandomSecureToken: jest.fn(),
      hashToken: jest.fn(),
    };

    userService = new UserService(mockUserRepository, mockCryptoService);
  });

  const mockUserId = "user_id_001";
  const mockUserEmail = "test@example.com";

  const mockUser: User = {
    id: mockUserId,
    username: "testuser",
    email: mockUserEmail,
    password: "hashedPassword",
    isEmailVerified: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeAll(() => {
    jest.clearAllMocks();
  });

  describe("UserService - createUser", () => {
    const createDto: CreateUserDto = {
      email: "new@example.com",
      password: "ValidPass123!",
      username: "newuser",
    };

    it("should create a user with hashed password", async () => {
      // Mock repository responses
      (mockUserRepository.getUser as jest.Mock).mockResolvedValue(null);
      (mockUserRepository.createUser as jest.Mock).mockResolvedValue({
        ...createDto,
        password: "hashed123",
      });
      (mockCryptoService.hashPassword as jest.Mock).mockResolvedValue(
        "hashed123"
      );

      const result = await userService.createUser(createDto);

      expect(mockCryptoService.hashPassword).toHaveBeenCalledWith(
        createDto.password
      );
      expect(result.password).toBe("hashed123");
    });

    it("should throw ConflictError for duplicate email", async () => {
      // Simulate existing user
      (mockUserRepository.getUser as jest.Mock).mockResolvedValue(mockUser);

      await expect(userService.createUser(createDto)).rejects.toThrow(
        new ConflictError(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS)
      );
    });

    it("should handle database errors during creation", async () => {
      (mockUserRepository.getUser as jest.Mock).mockResolvedValue(null);
      (mockUserRepository.createUser as jest.Mock).mockRejectedValue(
        new Error("DB Error")
      );

      await expect(userService.createUser(createDto)).rejects.toThrow(
        "DB Error"
      );
    });
  });

  describe("UserService - getOrCreateUser", () => {
    it("should return existing user without creating", async () => {
      (mockUserRepository.transaction as jest.Mock).mockImplementation(
        async (fn) => {
          const txMock = {
            ...mockUserRepository,
            getUser: jest.fn().mockResolvedValue(mockUser),
          };
          return fn(txMock);
        }
      );

      const result = await userService.getOrCreateUser(mockUser);
      expect(result).toEqual(mockUser);
      expect(mockUserRepository.createUser).not.toHaveBeenCalled();
    });

    it("should create new user if not exists (transaction success)", async () => {
      (mockUserRepository.transaction as jest.Mock).mockImplementation(
        async (fn) => {
          const txMock = {
            ...mockUserRepository,
            getUser: jest.fn().mockResolvedValue(null),
            createUser: jest.fn().mockResolvedValue(mockUser),
          };
          return fn(txMock);
        }
      );

      const result = await userService.getOrCreateUser(mockUser);
      expect(result).toEqual(mockUser);
    });

    // it("should rollback transaction on failure", async () => {
    //   (mockUserRepository.transaction as jest.Mock).mockImplementation(
    //     async (fn) => {
    //       const txMock = {
    //         ...mockUserRepository,
    //         getUser: jest.fn().mockResolvedValue(null),
    //         createUser: jest
    //           .fn()
    //           .mockRejectedValue(new Error("Creation failed")),
    //       };
    //       try {
    //         await fn(txMock);
    //       } catch (error: any) {
    //         expect(error.message).toBe("Creation failed");
    //       }
    //     }
    //   );

    //   await expect(userService.getOrCreateUser(mockUser)).rejects.toThrow();
    // });
  });

  describe("UserService - getUserByEmail", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should return the user when it exists", async () => {
      (mockUserRepository.getUser as jest.Mock).mockResolvedValue(mockUser);

      const result = await userService.getUserByEmail(mockUserEmail);

      expect(result).toEqual(mockUser);

      expect(mockUserRepository.getUser).toHaveBeenCalledWith({
        email: mockUserEmail,
      });
      expect(mockUserRepository.getUser).toHaveBeenCalledTimes(1);
    });

    it("should return null if the user doesn't exist", async () => {
      (mockUserRepository.getUser as jest.Mock).mockResolvedValue(null);

      const result = await userService.getUserByEmail(
        "nonexistent@example.com"
      );

      expect(result).toBeNull();

      expect(mockUserRepository.getUser).toHaveBeenCalledWith({
        email: "nonexistent@example.com",
      });
      expect(mockUserRepository.getUser).toHaveBeenCalledTimes(1);
    });

    it("should handle special characters in email addresses", async () => {
      const specialEmail = "user+test@example.com";
      (mockUserRepository.getUser as jest.Mock).mockResolvedValue({
        ...mockUser,
        email: specialEmail,
      });

      const result = await userService.getUserByEmail(specialEmail);

      expect(result).not.toBeNull();
      expect(mockUserRepository.getUser).toHaveBeenCalledWith({
        email: specialEmail,
      });
    });
  });

  describe("UserService - getUserById", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    const nonExistentUserId = "non_existent_user_id";

    it("should return the user when it exists", async () => {
      (mockUserRepository.getUser as jest.Mock).mockResolvedValue(mockUser);

      const result = await userService.getUserById(mockUserId);

      expect(result).toEqual(mockUser);

      expect(mockUserRepository.getUser).toHaveBeenCalledWith({
        id: mockUserId,
      });
      expect(mockUserRepository.getUser).toHaveBeenCalledTimes(1);
    });

    it("should throw a NotFoundError when the user doesn't exist", async () => {
      (mockUserRepository.getUser as jest.Mock).mockResolvedValue(null);

      await expect(userService.getUserById(nonExistentUserId)).rejects.toThrow(
        new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND)
      );

      expect(mockUserRepository.getUser).toHaveBeenCalledWith({
        id: nonExistentUserId,
      });
      expect(mockUserRepository.getUser).toHaveBeenCalledTimes(1);
    });

    it("should handle different types of valid userId formats", async () => {
      const uuidUserId = "550e8400-e29b-41d4-a716-446655440000";
      (mockUserRepository.getUser as jest.Mock).mockResolvedValue({
        ...mockUser,
        id: uuidUserId,
      });

      const result = await userService.getUserById(uuidUserId);

      expect(result.id).toBe(uuidUserId);
      expect(mockUserRepository.getUser).toHaveBeenCalledWith({
        id: uuidUserId,
      });
    });

    it("should return the complete user object", async () => {
      (mockUserRepository.getUser as jest.Mock).mockResolvedValue(mockUser);

      const result = await userService.getUserById(mockUserId);

      expect(result).toEqual(mockUser);
    });
  });

  describe("UserService - updateUser", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    // it("should update username without changing email", async () => {
    //   const updateDto: UpdateUserDto = { username: "newusername" };

    //   (mockUserRepository.updateUser as jest.Mock).mockResolvedValue({
    //     ...mockUser,
    //     username: "newusername",
    //   });

    //   const result = await userService.updateUser(mockUserId, updateDto);

    //   expect(result.username).toBe("newusername");
    // });

    // it("should throw ConflictError when updating to existing email", async () => {
    //   const updateDto: UpdateUserDto = { email: "existing@example.com" };
    //   jest.spyOn(userService, "getUserByEmail").mockResolvedValue({
    //     ...mockUser,
    //     id: "different_id",
    //   });

    //   await expect(
    //     userService.updateUser(mockUserId, updateDto)
    //   ).rejects.toThrow(new ConflictError(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS));
    // });

    // it("should allow email update to same email", async () => {
    //   const updateDto: UpdateUserDto = { email: mockUserEmail };
    //   await userService.updateUser(mockUserId, updateDto);
    //   expect(mockUserRepository.updateUser).toHaveBeenCalled();
    // });

    it("should throw a NotFoundError if the user doesn't exist", async () => {
      const updateUserDto: UpdateUserDto = {
        username: "newusername",
        email: "newemail@example.com",
      };

      jest
        .spyOn(userService, "getUserById")
        .mockRejectedValue(
          new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND)
        );

      await expect(
        userService.updateUser(mockUserId, updateUserDto)
      ).rejects.toThrow(new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND));

      expect(userService.getUserById).toHaveBeenCalledWith(mockUserId);
    });
  });

  describe("UserService - updatePassword", () => {
    const updateDto: UpdatePasswordDto = {
      currentPassword: "oldPass123!",
      newPassword: "newPass123!",
    };

    it("should update password when valid", async () => {
      jest.spyOn(userService, "getUserById").mockResolvedValue(mockUser);

      (mockCryptoService.comparePasswords as jest.Mock).mockResolvedValue(true);

      (mockCryptoService.hashPassword as jest.Mock).mockResolvedValue(
        "newHashed"
      );

      (mockUserRepository.updatePassword as jest.Mock).mockResolvedValue({
        ...mockUser,
        password: "newHashed",
      });

      const response = await userService.updatePassword(mockUserId, updateDto);

      expect(response.id).toBe(mockUserId);

      expect(response.password).toBe("newHashed");

      expect(mockCryptoService.hashPassword).toHaveBeenCalledWith(
        "newPass123!"
      );
      expect(mockUserRepository.updatePassword).toHaveBeenCalledWith(
        mockUserId,
        "newHashed"
      );
    });

    it("should throw for invalid current password", async () => {
      jest.spyOn(userService, "getUserById").mockResolvedValue(mockUser);

      (mockCryptoService.comparePasswords as jest.Mock).mockResolvedValue(
        false
      );

      await expect(
        userService.updatePassword(mockUserId, updateDto)
      ).rejects.toThrow(
        new BadRequestError(ERROR_MESSAGES.INVALID_CREDENTIALS)
      );

      expect(mockCryptoService.hashPassword).not.toHaveBeenCalled();

      expect(mockUserRepository.updatePassword).not.toHaveBeenCalled();
    });

    it("should throw when new password matches current", async () => {
      const badDto = { ...updateDto, newPassword: updateDto.currentPassword };

      jest.spyOn(userService, "getUserById").mockResolvedValue(mockUser);

      (mockCryptoService.comparePasswords as jest.Mock).mockResolvedValue(true);

      await expect(
        userService.updatePassword(mockUserId, badDto)
      ).rejects.toThrow(
        new BadRequestError(ERROR_MESSAGES.PASSWORD_SAME_AS_CURRENT)
      );
    });
  });

  describe("UserService - resetPassword", () => {
    it("should reset password successfully when the userId is valid", async () => {
      jest.spyOn(userService, "getUserById").mockResolvedValue(mockUser);

      (mockCryptoService.hashPassword as jest.Mock).mockResolvedValue(
        "newHashed"
      );

      (mockUserRepository.updatePassword as jest.Mock).mockResolvedValue({
        ...mockUser,
        password: "newHashed",
      });

      const response = await userService.resetPassword(
        mockUserId,
        "newPassword"
      );

      expect(response.password).toBe("newHashed");
      expect(response.id).toBe(mockUserId);

      expect(mockCryptoService.hashPassword).toHaveBeenCalledWith(
        "newPassword"
      );

      expect(mockUserRepository.updatePassword).toHaveBeenCalledWith(
        mockUserId,
        "newHashed"
      );
    });

    it("should throw NotFoundError for non-existent user", async () => {
      jest
        .spyOn(userService, "getUserById")
        .mockRejectedValue(
          new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND)
        );

      await expect(
        userService.resetPassword("invalid_id", "newPass")
      ).rejects.toThrow(NotFoundError);

      expect(userService.getUserById).toHaveBeenCalledWith("invalid_id");

      expect(mockCryptoService.hashPassword).not.toHaveBeenCalled();

      expect(mockUserRepository.updatePassword).not.toHaveBeenCalled();
    });
  });
});
