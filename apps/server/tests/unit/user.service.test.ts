import { ERROR_MESSAGES } from "../../src/constants/errorMessages";
import { BadRequestError, NotFoundError } from "../../src/errors";

import { IPasswordService } from "../../src/modules/password/password.service";
import { IUserDatabase } from "../../src/modules/user/user.db";
import { IUserService, UserService } from "../../src/modules/user/user.service";

import type { UpdatePasswordDto } from "../../src/modules/user/dtos/update-password.dto";
import type { UpdateUserDto } from "../../src/modules/user/dtos/update-user.dto";
import type { UserDto } from "../../src/modules/user/dtos/user.dto";

describe("UserService methods test", () => {
  let userService: IUserService;
  let mockUserDB: IUserDatabase;
  let mockPasswordService: IPasswordService;

  beforeEach(() => {
    mockUserDB = {
      findByEmail: jest.fn(),
      create: jest.fn(),
      findById: jest.fn(),
      updateUser: jest.fn(),
      updatePassword: jest.fn(),
    };

    mockPasswordService = {
      hashPassword: jest.fn(),
      comparePasswords: jest.fn(),
    };

    userService = new UserService(mockUserDB, mockPasswordService);
  });

  const mockUserId = "user_id_001";
  const mockUserEmail = "test@example.com";

  const mockUser: UserDto = {
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
      (mockUserDB.findByEmail as jest.Mock).mockResolvedValue(mockUser);

      const result = await userService.getUserByEmail(mockUserEmail);

      expect(result).toEqual(mockUser);

      expect(mockUserDB.findByEmail).toHaveBeenCalledWith(mockUserEmail);
      expect(mockUserDB.findByEmail).toHaveBeenCalledTimes(1);
    });

    it("should return null if the user doesn't exist", async () => {
      (mockUserDB.findByEmail as jest.Mock).mockResolvedValue(null);

      const result = await userService.getUserByEmail(
        "nonexistent@example.com"
      );

      expect(result).toBeNull();

      expect(mockUserDB.findByEmail).toHaveBeenCalledWith(
        "nonexistent@example.com"
      );
      expect(mockUserDB.findByEmail).toHaveBeenCalledTimes(1);
    });

    it("should handle special characters in email addresses", async () => {
      const specialEmail = "user+test@example.com";
      (mockUserDB.findByEmail as jest.Mock).mockResolvedValue({
        ...mockUser,
        email: specialEmail,
      });

      const result = await userService.getUserByEmail(specialEmail);

      expect(result).not.toBeNull();
      expect(mockUserDB.findByEmail).toHaveBeenCalledWith(specialEmail);
    });
  });

  describe("UserService - getUserById", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    const nonExistentUserId = "non_existent_user_id";

    it("should return the user when it exists", async () => {
      (mockUserDB.findById as jest.Mock).mockResolvedValue(mockUser);

      const result = await userService.getUserById(mockUserId);

      expect(result).toEqual(mockUser);

      expect(mockUserDB.findById).toHaveBeenCalledWith(mockUserId);
      expect(mockUserDB.findById).toHaveBeenCalledTimes(1);
    });

    it("should throw a NotFoundError when the user doesn't exist", async () => {
      (mockUserDB.findById as jest.Mock).mockResolvedValue(null);

      await expect(userService.getUserById(nonExistentUserId)).rejects.toThrow(
        new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND)
      );

      expect(mockUserDB.findById).toHaveBeenCalledWith(nonExistentUserId);
      expect(mockUserDB.findById).toHaveBeenCalledTimes(1);
    });

    it("should handle different types of valid userId formats", async () => {
      const uuidUserId = "550e8400-e29b-41d4-a716-446655440000";
      (mockUserDB.findById as jest.Mock).mockResolvedValue({
        ...mockUser,
        id: uuidUserId,
      });

      const result = await userService.getUserById(uuidUserId);

      expect(result.id).toBe(uuidUserId);
      expect(mockUserDB.findById).toHaveBeenCalledWith(uuidUserId);
    });

    it("should return the complete user object", async () => {
      (mockUserDB.findById as jest.Mock).mockResolvedValue(mockUser);

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

      (mockUserDB.updateUser as jest.Mock).mockResolvedValue(undefined);

      await userService.updateUser(mockUserId, updateUserDto);

      expect(userService.getUserById).toHaveBeenCalledWith(mockUserId);
      expect(userService.getUserByEmail).toHaveBeenCalledWith(
        updateUserDto.email
      );
      expect(mockUserDB.updateUser).toHaveBeenCalledWith(
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
      (mockUserDB.updateUser as jest.Mock).mockResolvedValue({
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
      expect(mockUserDB.updateUser).toHaveBeenCalled();
    });
  });

  describe("UserService - updatePassword", () => {
    const updatePasswordDto: UpdatePasswordDto = {
      currentPassword: "oldpassword",
      newPassword: "newpassword",
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should successfully update the user's password", async () => {
      jest.spyOn(userService, "getUserById").mockResolvedValue(mockUser);

      (mockPasswordService.comparePasswords as jest.Mock).mockResolvedValue(
        true
      );

      (mockPasswordService.hashPassword as jest.Mock).mockResolvedValue(
        "newhashedpassword"
      );

      await userService.updatePassword(mockUserId, updatePasswordDto);

      expect(userService.getUserById).toHaveBeenCalledWith(mockUserId);

      expect(mockPasswordService.comparePasswords).toHaveBeenCalledWith({
        password: updatePasswordDto.currentPassword,
        hashedPassword: mockUser.password,
      });

      expect(mockPasswordService.hashPassword).toHaveBeenCalledWith(
        updatePasswordDto.newPassword
      );

      expect(mockUserDB.updatePassword).toHaveBeenCalledWith({
        id: mockUserId,
        password: "newhashedpassword",
      });
    });

    it("should throw a BadRequestError if the current password is invalid", async () => {
      jest.spyOn(userService, "getUserById").mockResolvedValue(mockUser);

      (mockPasswordService.comparePasswords as jest.Mock).mockResolvedValue(
        false
      );

      await expect(
        userService.updatePassword(mockUserId, {
          ...updatePasswordDto,
          currentPassword: "invalidpassword",
        })
      ).rejects.toThrow(
        new BadRequestError(ERROR_MESSAGES.INVALID_CREDENTIALS)
      );

      expect(userService.getUserById).toHaveBeenCalledWith(mockUserId);

      expect(mockPasswordService.comparePasswords).toHaveBeenCalledWith({
        password: "invalidpassword",
        hashedPassword: mockUser.password,
      });
    });

    it("should throw a BadRequestError if the new password is the same as the current password", async () => {
      jest.spyOn(userService, "getUserById").mockResolvedValue(mockUser);
      (mockPasswordService.comparePasswords as jest.Mock).mockResolvedValue(
        true
      );

      await expect(
        userService.updatePassword(mockUserId, {
          ...updatePasswordDto,
          newPassword: updatePasswordDto.currentPassword,
        })
      ).rejects.toThrow(
        new BadRequestError(ERROR_MESSAGES.PASSWORD_SAME_AS_CURRENT)
      );

      expect(userService.getUserById).toHaveBeenCalledWith(mockUserId);

      expect(mockPasswordService.comparePasswords).toHaveBeenCalledWith({
        password: updatePasswordDto.currentPassword,
        hashedPassword: mockUser.password,
      });
    });

    it("should throw a NotFoundError if the user doesn't exist", async () => {
      jest
        .spyOn(userService, "getUserById")
        .mockRejectedValue(
          new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND)
        );

      await expect(
        userService.updatePassword(mockUserId, updatePasswordDto)
      ).rejects.toThrow(new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND));

      expect(userService.getUserById).toHaveBeenCalledWith(mockUserId);
    });
  });
});
