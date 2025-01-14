import { ERROR_MESSAGES } from "../../src/constants/errorMessages";
import { NotFoundError } from "../../src/errors";

import type { User } from "../../src/modules/user/user.model";
import { UserService } from "../../src/modules/user/user.service";

import type { IPasswordService } from "../../src/modules/password/password.types";
import type { UpdateUserDto } from "../../src/modules/user/dtos/update-user.dto";
import type {
  IUserRepository,
  IUserService,
} from "../../src/modules/user/user.types";

describe("UserService methods test", () => {
  let userService: IUserService;
  let mockUserRepository: IUserRepository;
  let mockPasswordService: IPasswordService;

  beforeEach(() => {
    mockUserRepository = {
      findByEmail: jest.fn(),
      create: jest.fn(),
      findById: jest.fn(),
      updateUser: jest.fn(),
      updatePassword: jest.fn(),
    };

    mockPasswordService = {
      hashPassword: jest.fn(),
      comparePasswords: jest.fn(),
      updatePassword: jest.fn(),
      resetPassword: jest.fn(),
    };

    userService = new UserService(mockUserRepository, mockPasswordService);
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

  describe("UserService - getUserByEmail", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should return the user when it exists", async () => {
      (mockUserRepository.findByEmail as jest.Mock).mockResolvedValue(mockUser);

      const result = await userService.getUserByEmail(mockUserEmail);

      expect(result).toEqual(mockUser);

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
        mockUserEmail
      );
      expect(mockUserRepository.findByEmail).toHaveBeenCalledTimes(1);
    });

    it("should return null if the user doesn't exist", async () => {
      (mockUserRepository.findByEmail as jest.Mock).mockResolvedValue(null);

      const result = await userService.getUserByEmail(
        "nonexistent@example.com"
      );

      expect(result).toBeNull();

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
        "nonexistent@example.com"
      );
      expect(mockUserRepository.findByEmail).toHaveBeenCalledTimes(1);
    });

    it("should handle special characters in email addresses", async () => {
      const specialEmail = "user+test@example.com";
      (mockUserRepository.findByEmail as jest.Mock).mockResolvedValue({
        ...mockUser,
        email: specialEmail,
      });

      const result = await userService.getUserByEmail(specialEmail);

      expect(result).not.toBeNull();
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(specialEmail);
    });
  });

  describe("UserService - getUserById", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    const nonExistentUserId = "non_existent_user_id";

    it("should return the user when it exists", async () => {
      (mockUserRepository.findById as jest.Mock).mockResolvedValue(mockUser);

      const result = await userService.getUserById(mockUserId);

      expect(result).toEqual(mockUser);

      expect(mockUserRepository.findById).toHaveBeenCalledWith(mockUserId);
      expect(mockUserRepository.findById).toHaveBeenCalledTimes(1);
    });

    it("should throw a NotFoundError when the user doesn't exist", async () => {
      (mockUserRepository.findById as jest.Mock).mockResolvedValue(null);

      await expect(userService.getUserById(nonExistentUserId)).rejects.toThrow(
        new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND)
      );

      expect(mockUserRepository.findById).toHaveBeenCalledWith(
        nonExistentUserId
      );
      expect(mockUserRepository.findById).toHaveBeenCalledTimes(1);
    });

    it("should handle different types of valid userId formats", async () => {
      const uuidUserId = "550e8400-e29b-41d4-a716-446655440000";
      (mockUserRepository.findById as jest.Mock).mockResolvedValue({
        ...mockUser,
        id: uuidUserId,
      });

      const result = await userService.getUserById(uuidUserId);

      expect(result.id).toBe(uuidUserId);
      expect(mockUserRepository.findById).toHaveBeenCalledWith(uuidUserId);
    });

    it("should return the complete user object", async () => {
      (mockUserRepository.findById as jest.Mock).mockResolvedValue(mockUser);

      const result = await userService.getUserById(mockUserId);

      expect(result).toEqual(mockUser);
    });
  });

  describe("UserService - updateUser", () => {
    const updateUserDto: UpdateUserDto = {
      username: "newusername",
      email: "newemail@example.com",
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should successfully update a user", async () => {
      jest.spyOn(userService, "getUserById").mockResolvedValue(mockUser);
      jest.spyOn(userService, "getUserByEmail").mockResolvedValue(null);

      (mockUserRepository.updateUser as jest.Mock).mockResolvedValue(undefined);

      await userService.updateUser(mockUserId, updateUserDto);

      expect(userService.getUserById).toHaveBeenCalledWith(mockUserId);
      expect(userService.getUserByEmail).toHaveBeenCalledWith(
        updateUserDto.email
      );
      expect(mockUserRepository.updateUser).toHaveBeenCalledWith(
        mockUserId,
        updateUserDto
      );
    });

    // it("should throw a BadRequestError if the email already exists", async () => {
    // });

    it("should throw a NotFoundError if the user doesn't exist", async () => {
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

    // it("should not throw error if email exists but belongs to the same user", async () => {
    // });

    it("should handle the case when only the email is updated", async () => {
      jest.spyOn(userService, "getUserById").mockResolvedValue(mockUser);
      jest.spyOn(userService, "getUserByEmail").mockResolvedValue(null);
      (mockUserRepository.updateUser as jest.Mock).mockResolvedValue({
        ...mockUser,
        email: updateUserDto.email,
      });

      await userService.updateUser(mockUserId, {
        username: mockUser.username,
        email: updateUserDto.email,
      });

      expect(userService.getUserById).toHaveBeenCalledWith(mockUser.id);
      expect(userService.getUserByEmail).toHaveBeenCalledWith(
        updateUserDto.email
      );
      expect(mockUserRepository.updateUser).toHaveBeenCalled();
    });
  });
});
