import { ERROR_MESSAGES } from "@/constants/error-messages.contants";
import { BadRequestError, ConflictError, NotFoundError } from "@/errors";

import type { User } from "@/modules/user/user.model";
import { UserService } from "@/modules/user/user.service";

import type { ICryptoService } from "@/modules/utils/crypto";
import type { CreateUserDto, UpdatePasswordDto, UpdateUserDto } from "../dtos";
import type { IUserRepository, IUserService } from "../user.types";

describe("UserService", () => {
  let userService: IUserService;
  let mockUserRepository: IUserRepository;
  let mockCryptoService: ICryptoService;

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

  beforeEach(() => {
    mockUserRepository = {
      transaction: jest.fn(),
      getUserByEmail: jest.fn(),
      getUserById: jest.fn(),
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
    jest.clearAllMocks();
  });

  describe("UserService - createUser", () => {
    const createUserDto: CreateUserDto = {
      email: "new@example.com",
      password: "ValidPass123!",
      username: "newuser",
    };

    it("should create user with hashed password within transaction", async () => {
      // Mock transaction flow
      const txMock = {
        getUserByEmail: jest.fn().mockResolvedValue(null),
        createUser: jest.fn().mockResolvedValue({
          ...createUserDto,
          password: "hashed123",
        }),
      };
      (mockUserRepository.transaction as jest.Mock).mockImplementation(
        async (fn) => fn(txMock)
      );
      (mockCryptoService.hashPassword as jest.Mock).mockResolvedValue(
        "hashed123"
      );

      const result = await userService.createUser(createUserDto);

      expect(txMock.getUserByEmail).toHaveBeenCalledWith(createUserDto.email);
      expect(txMock.createUser).toHaveBeenCalledWith({
        ...createUserDto,
        password: "hashed123",
      });
      expect(result.password).toBe("hashed123");
    });

    it("should throw ConflictError for duplicate email within transaction", async () => {
      const txMock = {
        getUserByEmail: jest.fn().mockResolvedValue(mockUser),
      };
      (mockUserRepository.transaction as jest.Mock).mockImplementation(
        async (fn) => fn(txMock)
      );

      await expect(userService.createUser(createUserDto)).rejects.toThrow(
        new ConflictError(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS)
      );
    });

    it("should propagate errors if createUser in transaction fails", async () => {
      const txMock = {
        getUserByEmail: jest.fn().mockResolvedValue(null),
        createUser: jest.fn().mockRejectedValue(new Error("DB Error")),
      };

      (mockUserRepository.transaction as jest.Mock).mockImplementation(
        async (fn) => fn(txMock)
      );

      (mockCryptoService.hashPassword as jest.Mock).mockResolvedValue(
        "hashed123"
      );

      await expect(userService.createUser(createUserDto)).rejects.toThrow(
        "DB Error"
      );
    });

    it("should propagate errors if crypto.hashPassword rejects", async () => {
      const txMock = {
        getUserByEmail: jest.fn().mockResolvedValue(null),
        createUser: jest.fn(),
      };
      (mockUserRepository.transaction as jest.Mock).mockImplementation(
        async (fn) => fn(txMock)
      );
      (mockCryptoService.hashPassword as jest.Mock).mockRejectedValue(
        new Error("Hashing error")
      );

      await expect(userService.createUser(createUserDto)).rejects.toThrow(
        "Hashing error"
      );
    });
  });

  describe("UserService - getOrCreateUser", () => {
    const createUserDto: CreateUserDto = { ...mockUser, password: "password" };

    it("should return existing user without creating", async () => {
      const txMock = {
        getUserByEmail: jest.fn().mockResolvedValue(mockUser),
        createUser: jest.fn(),
      };
      (mockUserRepository.transaction as jest.Mock).mockImplementation(
        async (fn) => fn(txMock)
      );

      const result = await userService.getOrCreateUser(createUserDto);
      expect(result).toEqual(mockUser);
      expect(txMock.createUser).not.toHaveBeenCalled();
    });

    it("should create new user within transaction when not exists", async () => {
      const txMock = {
        getUserByEmail: jest.fn().mockResolvedValue(null),
        createUser: jest.fn().mockResolvedValue(mockUser),
      };
      (mockUserRepository.transaction as jest.Mock).mockImplementation(
        async (fn) => fn(txMock)
      );
      (mockCryptoService.hashPassword as jest.Mock).mockResolvedValue(
        "hashed123"
      );

      const result = await userService.getOrCreateUser(createUserDto);
      expect(txMock.createUser).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it("should propagate error if user creation fails", async () => {
      const txMock = {
        getUserByEmail: jest.fn().mockResolvedValue(null),
        createUser: jest.fn().mockRejectedValue(new Error("Creation failed")),
      };

      (mockUserRepository.transaction as jest.Mock).mockImplementation(
        async (fn) => fn(txMock)
      );

      await expect(userService.getOrCreateUser(createUserDto)).rejects.toThrow(
        "Creation failed"
      );
    });

    it("should propagate error if crypto.hashPassword rejects in getOrCreateUser", async () => {
      const txMock = {
        getUserByEmail: jest.fn().mockResolvedValue(null),
        createUser: jest.fn(),
      };
      (mockUserRepository.transaction as jest.Mock).mockImplementation(
        async (fn) => fn(txMock)
      );
      (mockCryptoService.hashPassword as jest.Mock).mockRejectedValue(
        new Error("Hash error")
      );

      await expect(userService.getOrCreateUser(createUserDto)).rejects.toThrow(
        "Hash error"
      );
    });
  });

  describe("UserService - getUser", () => {
    it("should return user by ID", async () => {
      (mockUserRepository.getUser as jest.Mock).mockResolvedValue(mockUser);
      const result = await userService.getUser({ id: mockUserId });
      expect(result).toEqual(mockUser);
    });

    it("should return user by email", async () => {
      (mockUserRepository.getUser as jest.Mock).mockResolvedValue(mockUser);
      const result = await userService.getUser({ email: mockUserEmail });
      expect(result).toEqual(mockUser);
    });

    it("should throw NotFoundError when user not found", async () => {
      (mockUserRepository.getUser as jest.Mock).mockResolvedValue(null);
      await expect(userService.getUser({ id: "invalid" })).rejects.toThrow(
        new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND)
      );
    });

    it("should propagate errors if repository.getUser rejects", async () => {
      (mockUserRepository.getUser as jest.Mock).mockRejectedValue(
        new Error("Repo error")
      );
      await expect(
        userService.getUser({ email: "error@example.com" })
      ).rejects.toThrow("Repo error");
    });
  });

  describe("UserService - updateUser", () => {
    const updateUserDto: UpdateUserDto = {
      username: "newuser",
      email: "new@example.com",
    };

    it("should update user within transaction", async () => {
      const txMock = {
        getUserById: jest.fn().mockResolvedValue(mockUser),
        getUserByEmail: jest.fn().mockResolvedValue(null),
        updateUser: jest
          .fn()
          .mockResolvedValue({ ...mockUser, ...updateUserDto }),
      };
      (mockUserRepository.transaction as jest.Mock).mockImplementation(
        async (fn) => fn(txMock)
      );

      const result = await userService.updateUser(mockUserId, updateUserDto);

      expect(txMock.updateUser).toHaveBeenCalledWith(mockUserId, updateUserDto);
      expect(result).toEqual({ ...mockUser, ...updateUserDto });
    });

    it("should return found user without update if dto is empty", async () => {
      const txMock = {
        getUserById: jest.fn().mockResolvedValue(mockUser),
        getUserByEmail: jest.fn().mockResolvedValue(null),
        updateUser: jest.fn().mockResolvedValue(mockUser),
      };
      (mockUserRepository.transaction as jest.Mock).mockImplementation(
        async (fn) => fn(txMock)
      );

      const result = await userService.updateUser(mockUserId, {});

      expect(result).toEqual(mockUser);

      expect(txMock.updateUser).not.toHaveBeenCalled();
    });

    it("should throw ConflictError for duplicate email in transaction", async () => {
      const txMock = {
        getUserById: jest.fn().mockResolvedValue(mockUser),
        getUserByEmail: jest.fn().mockResolvedValue(mockUser),
        updateUser: jest.fn().mockRejectedValue(
          new (class implements Error {
            name = "PrismaClientKnownRequestError";
            message = "Unique constraint failed";
            code = "P2002";
          })()
        ),
      };
      (mockUserRepository.transaction as jest.Mock).mockImplementation(
        async (fn) => fn(txMock)
      );

      await expect(
        userService.updateUser(mockUserId, updateUserDto)
      ).rejects.toThrow(new ConflictError(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS));
    });

    it("should allow email update to current email", async () => {
      const txMock = {
        getUserById: jest.fn().mockResolvedValue(mockUser),
        getUserByEmail: jest.fn().mockResolvedValue(null),
        updateUser: jest.fn().mockResolvedValue(mockUser),
      };
      (mockUserRepository.transaction as jest.Mock).mockImplementation(
        async (fn) => fn(txMock)
      );

      const result = await userService.updateUser(mockUserId, {
        email: mockUserEmail,
      });
      expect(txMock.updateUser).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it("should propagate error if tx.updateUser rejects", async () => {
      const txMock = {
        getUserById: jest.fn().mockResolvedValue(mockUser),
        getUserByEmail: jest.fn().mockResolvedValue(null),
        updateUser: jest.fn().mockRejectedValue(new Error("Update failed")),
      };
      (mockUserRepository.transaction as jest.Mock).mockImplementation(
        async (fn) => fn(txMock)
      );

      await expect(
        userService.updateUser(mockUserId, updateUserDto)
      ).rejects.toThrow("Update failed");
    });
  });

  describe("UserService - updatePassword", () => {
    const updatePassDto: UpdatePasswordDto = {
      currentPassword: "oldPass123!",
      newPassword: "newPass123!",
    };

    it("should update password within transaction", async () => {
      const txMock = {
        getUserById: jest.fn().mockResolvedValue(mockUser),
        updatePassword: jest.fn().mockResolvedValue({
          ...mockUser,
          password: "newHashed",
        }),
      };
      (mockUserRepository.transaction as jest.Mock).mockImplementation(
        async (fn) => fn(txMock)
      );
      (mockCryptoService.comparePasswords as jest.Mock).mockResolvedValue(true);
      (mockCryptoService.hashPassword as jest.Mock).mockResolvedValue(
        "newHashed"
      );

      const result = await userService.updatePassword(
        mockUserId,
        updatePassDto
      );
      expect(result.password).toBe("newHashed");
    });

    it("should throw BadRequestError if current password is invalid", async () => {
      const txMock = {
        getUserById: jest.fn().mockResolvedValue(mockUser),
      };
      (mockUserRepository.transaction as jest.Mock).mockImplementation(
        async (fn) => fn(txMock)
      );
      (mockCryptoService.comparePasswords as jest.Mock).mockResolvedValue(
        false
      );

      await expect(
        userService.updatePassword(mockUserId, updatePassDto)
      ).rejects.toThrow(
        new BadRequestError(ERROR_MESSAGES.INVALID_CREDENTIALS)
      );
    });

    it("should throw BadRequestError if new password matches current", async () => {
      const txMock = {
        getUserById: jest.fn().mockResolvedValue(mockUser),
      };
      (mockUserRepository.transaction as jest.Mock).mockImplementation(
        async (fn) => fn(txMock)
      );
      (mockCryptoService.comparePasswords as jest.Mock).mockResolvedValue(true);

      await expect(
        userService.updatePassword(mockUserId, {
          currentPassword: "pass",
          newPassword: "pass",
        })
      ).rejects.toThrow(
        new BadRequestError(ERROR_MESSAGES.PASSWORD_SAME_AS_CURRENT)
      );
    });

    it("should propagate error if crypto.comparePasswords rejects", async () => {
      const txMock = {
        getUserById: jest.fn().mockResolvedValue(mockUser),
      };
      (mockUserRepository.transaction as jest.Mock).mockImplementation(
        async (fn) => fn(txMock)
      );
      (mockCryptoService.comparePasswords as jest.Mock).mockRejectedValue(
        new Error("Compare error")
      );

      await expect(
        userService.updatePassword(mockUserId, updatePassDto)
      ).rejects.toThrow("Compare error");
    });

    it("should propagate error if crypto.hashPassword rejects during updatePassword", async () => {
      const txMock = {
        getUserById: jest.fn().mockResolvedValue(mockUser),
        updatePassword: jest.fn(),
      };
      (mockUserRepository.transaction as jest.Mock).mockImplementation(
        async (fn) => fn(txMock)
      );
      (mockCryptoService.comparePasswords as jest.Mock).mockResolvedValue(true);
      (mockCryptoService.hashPassword as jest.Mock).mockRejectedValue(
        new Error("Hash error")
      );

      await expect(
        userService.updatePassword(mockUserId, updatePassDto)
      ).rejects.toThrow("Hash error");
    });

    it("should propagate error if tx.updatePassword rejects", async () => {
      const txMock = {
        getUserById: jest.fn().mockResolvedValue(mockUser),
        updatePassword: jest
          .fn()
          .mockRejectedValue(new Error("UpdatePassword failed")),
      };
      (mockUserRepository.transaction as jest.Mock).mockImplementation(
        async (fn) => fn(txMock)
      );
      (mockCryptoService.comparePasswords as jest.Mock).mockResolvedValue(true);
      (mockCryptoService.hashPassword as jest.Mock).mockResolvedValue(
        "newHashed"
      );

      await expect(
        userService.updatePassword(mockUserId, updatePassDto)
      ).rejects.toThrow("UpdatePassword failed");
    });
  });

  describe("UserService - resetPassword", () => {
    it("should reset password within transaction", async () => {
      const txMock = {
        getUserById: jest.fn().mockResolvedValue(mockUser),
        updatePassword: jest.fn().mockResolvedValue({
          ...mockUser,
          password: "newHashed",
        }),
      };
      (mockUserRepository.transaction as jest.Mock).mockImplementation(
        async (fn) => fn(txMock)
      );
      (mockCryptoService.hashPassword as jest.Mock).mockResolvedValue(
        "newHashed"
      );

      const result = await userService.resetPassword(mockUserId, "newPassword");
      expect(result.password).toBe("newHashed");
    });

    it("should throw NotFoundError if user does not exist during resetPassword", async () => {
      const txMock = {
        getUserById: jest.fn().mockResolvedValue(null),
      };
      (mockUserRepository.transaction as jest.Mock).mockImplementation(
        async (fn) => fn(txMock)
      );

      await expect(
        userService.resetPassword("invalid", "newPass")
      ).rejects.toThrow(new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND));
    });

    it("should propagate error if crypto.hashPassword rejects during resetPassword", async () => {
      const txMock = {
        getUserById: jest.fn().mockResolvedValue(mockUser),
        updatePassword: jest.fn(),
      };
      (mockUserRepository.transaction as jest.Mock).mockImplementation(
        async (fn) => fn(txMock)
      );
      (mockCryptoService.hashPassword as jest.Mock).mockRejectedValue(
        new Error("Hash reset error")
      );

      await expect(
        userService.resetPassword(mockUserId, "newPassword")
      ).rejects.toThrow("Hash reset error");
    });

    it("should propagate error if tx.updatePassword rejects during resetPassword", async () => {
      const txMock = {
        getUserById: jest.fn().mockResolvedValue(mockUser),
        updatePassword: jest
          .fn()
          .mockRejectedValue(new Error("Tx update failed")),
      };
      (mockUserRepository.transaction as jest.Mock).mockImplementation(
        async (fn) => fn(txMock)
      );
      (mockCryptoService.hashPassword as jest.Mock).mockResolvedValue(
        "newHashed"
      );

      await expect(
        userService.resetPassword(mockUserId, "newPassword")
      ).rejects.toThrow("Tx update failed");
    });
  });

  describe("UserService - Edge Cases", () => {
    it("should handle concurrent getOrCreateUser transactions", async () => {
      let callCount = 0;
      (mockUserRepository.transaction as jest.Mock).mockImplementation(
        async (fn) => {
          callCount++;
          const txMock = {
            getUserByEmail:
              callCount === 1
                ? jest.fn().mockResolvedValue(null)
                : jest.fn().mockResolvedValue(mockUser),
            createUser: jest.fn().mockResolvedValue(mockUser),
          };
          return fn(txMock);
        }
      );

      const [result1, result2] = await Promise.all([
        userService.getOrCreateUser(mockUser),
        userService.getOrCreateUser(mockUser),
      ]);

      expect(result1).toEqual(mockUser);
      expect(result2).toEqual(mockUser);
      expect(mockUserRepository.transaction).toHaveBeenCalledTimes(2);
    });
  });
});
