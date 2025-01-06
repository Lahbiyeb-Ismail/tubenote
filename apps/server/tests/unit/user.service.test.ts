import { ERROR_MESSAGES } from "../../src/constants/errorMessages";
import { BadRequestError, NotFoundError } from "../../src/errors";
import AuthService from "../../src/modules/auth/auth.service";
import type { UpdatePasswordDto } from "../../src/modules/user/dtos/update-password.dto";
import type { UpdateUserDto } from "../../src/modules/user/dtos/update-user.dto";
import UserDB from "../../src/modules/user/user.db";
import UserService from "../../src/modules/user/user.service";
import type { UserEntry } from "../../src/modules/user/user.type";

jest.mock("../../src/modules/user/user.db");
jest.mock("../../src/modules/auth/auth.service");

describe("UserService methods test", () => {
  const mockUser: UserEntry = {
    id: "1",
    email: "test@example.com",
    username: "testuser",
    password: "hashedpassword",
    isEmailVerified: true,
    googleId: "",
    profilePicture: "",
    createdAt: new Date(),
    updatedAt: new Date(),
    videoIds: [],
  };

  beforeAll(() => {
    jest.clearAllMocks();
  });

  describe("UserService - getUserByEmail", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    const mockEmail = "test@example.com";

    it("should return the user when it exists", async () => {
      (UserDB.findByEmail as jest.Mock).mockResolvedValue(mockUser);

      const result = await UserService.getUserByEmail(mockEmail);

      expect(result).toEqual(mockUser);

      expect(UserDB.findByEmail).toHaveBeenCalledWith(mockEmail);
      expect(UserDB.findByEmail).toHaveBeenCalledTimes(1);
    });

    it("should return null if the user doesn't exist", async () => {
      (UserDB.findByEmail as jest.Mock).mockResolvedValue(null);

      const result = await UserService.getUserByEmail(
        "nonexistent@example.com"
      );

      expect(result).toBeNull();

      expect(UserDB.findByEmail).toHaveBeenCalledWith(
        "nonexistent@example.com"
      );
      expect(UserDB.findByEmail).toHaveBeenCalledTimes(1);
    });

    it("should handle special characters in email addresses", async () => {
      const specialEmail = "user+test@example.com";
      (UserDB.findByEmail as jest.Mock).mockResolvedValue({
        ...mockUser,
        email: specialEmail,
      });

      const result = await UserService.getUserByEmail(specialEmail);

      expect(result).not.toBeNull();
      expect(UserDB.findByEmail).toHaveBeenCalledWith(specialEmail);
    });
  });

  describe("UserService - getUserById", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    const mockUserId = "1";
    const inValidUserId = "2";

    it("should return the user when it exists", async () => {
      (UserDB.findById as jest.Mock).mockResolvedValue(mockUser);

      const result = await UserService.getUserById(mockUserId);

      expect(result).toEqual(mockUser);

      expect(UserDB.findById).toHaveBeenCalledWith(mockUserId);
      expect(UserDB.findById).toHaveBeenCalledTimes(1);
    });

    it("should throw a NotFoundError when the user doesn't exist", async () => {
      (UserDB.findById as jest.Mock).mockResolvedValue(null);

      await expect(UserService.getUserById(inValidUserId)).rejects.toThrow(
        new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND)
      );

      expect(UserDB.findById).toHaveBeenCalledWith(inValidUserId);
      expect(UserDB.findById).toHaveBeenCalledTimes(1);
    });

    it("should handle different types of valid userId formats", async () => {
      const uuidUserId = "550e8400-e29b-41d4-a716-446655440000";
      (UserDB.findById as jest.Mock).mockResolvedValue({
        ...mockUser,
        id: uuidUserId,
      });

      const result = await UserService.getUserById(uuidUserId);

      expect(result.id).toBe(uuidUserId);
      expect(UserDB.findById).toHaveBeenCalledWith(uuidUserId);
    });

    it("should return the complete user object", async () => {
      (UserDB.findById as jest.Mock).mockResolvedValue(mockUser);

      const result = await UserService.getUserById(mockUserId);

      expect(result).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          email: expect.any(String),
          username: expect.any(String),
          password: expect.any(String),
          isEmailVerified: expect.any(Boolean),
          googleId: expect.any(String),
          profilePicture: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          videoIds: expect.any(Array),
        })
      );
    });
  });

  describe("UserService - updateUser", () => {
    const mockUserId = "1";
    // const newEmail = "newemail@example.com";

    const updateUserDto: UpdateUserDto = {
      username: "newusername",
      email: "newemail@example.com",
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should successfully update a user", async () => {
      jest.spyOn(UserService, "getUserById").mockResolvedValue(mockUser);
      jest.spyOn(UserService, "getUserByEmail").mockResolvedValue(null);

      (UserDB.updateUser as jest.Mock).mockResolvedValue(undefined);

      await UserService.updateUser(mockUserId, updateUserDto);

      expect(UserService.getUserById).toHaveBeenCalledWith(mockUserId);
      expect(UserService.getUserByEmail).toHaveBeenCalledWith(
        updateUserDto.email
      );
      expect(UserDB.updateUser).toHaveBeenCalledWith(mockUserId, updateUserDto);
    });

    // it("should throw a BadRequestError if the email already exists", async () => {
    //   jest
    //     .spyOn(UserService, "getUserById")
    //     .mockResolvedValue({ ...mockUser, email: newEmail });
    //   jest
    //     .spyOn(UserService, "getUserByEmail")
    //     .mockResolvedValue({ ...mockUser, email: newEmail });

    //   expect(
    //     await UserService.updateUser(mockUserId, updateUserDto)
    //   ).rejects.toThrow(
    //     new BadRequestError(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS)
    //   );

    //   expect(UserService.getUserById).toHaveBeenCalledWith(mockUserId);
    //   expect(UserService.getUserByEmail).toHaveBeenCalledWith(
    //     updateUserDto.email
    //   );
    // });

    it("should throw a NotFoundError if the user doesn't exist", async () => {
      jest
        .spyOn(UserService, "getUserById")
        .mockRejectedValue(
          new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND)
        );

      await expect(
        UserService.updateUser(mockUserId, updateUserDto)
      ).rejects.toThrow(new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND));

      expect(UserService.getUserById).toHaveBeenCalledWith(mockUserId);
    });

    // it("should not throw error if email exists but belongs to the same user", async () => {
    //   jest.spyOn(UserService, "getUserById").mockResolvedValue(mockUser);
    //   jest.spyOn(UserService, "getUserByEmail").mockResolvedValue(mockUser);
    //   (UserDB.updateUser as jest.Mock).mockResolvedValue(mockUser);

    //   await UserService.updateUser(mockUserId, {
    //     email: mockUser.email,
    //     username: mockUser.username,
    //   });

    //   expect(UserService.getUserById).toHaveBeenCalledWith(mockUserId);
    //   expect(UserService.getUserByEmail).toHaveBeenCalledWith(mockUser.email);
    //   expect(UserDB.updateUser).toHaveBeenCalled();
    // });

    // it("should handle the case when only the username is updated", async () => {
    //   jest.spyOn(UserService, "getUserById").mockResolvedValue(mockUser);
    //   jest.spyOn(UserService, "getUserByEmail").mockResolvedValue(null);
    //   (UserDB.updateUser as jest.Mock).mockResolvedValue({
    //     ...mockUser,
    //     username: updateUserDto.username,
    //   });

    //   await UserService.updateUser(mockUserId, {
    //     username: updateUserDto.username,
    //     email: mockUser.email,
    //   });

    //   expect(UserService.getUserById).toHaveBeenCalledWith(mockUser.id);
    //   expect(UserService.getUserByEmail).toHaveBeenCalledWith(mockUser.email);
    //   expect(UserDB.updateUser).toHaveBeenCalled();
    // });

    it("should handle the case when only the email is updated", async () => {
      jest.spyOn(UserService, "getUserById").mockResolvedValue(mockUser);
      jest.spyOn(UserService, "getUserByEmail").mockResolvedValue(null);
      (UserDB.updateUser as jest.Mock).mockResolvedValue({
        ...mockUser,
        email: updateUserDto.email,
      });

      await UserService.updateUser(mockUserId, {
        username: mockUser.username,
        email: updateUserDto.email,
      });

      expect(UserService.getUserById).toHaveBeenCalledWith(mockUser.id);
      expect(UserService.getUserByEmail).toHaveBeenCalledWith(
        updateUserDto.email
      );
      expect(UserDB.updateUser).toHaveBeenCalled();
    });
  });

  // describe("UserService - updatePassword", () => {
  //   const updatePasswordDto: UpdatePasswordDto = {
  //     currentPassword: "oldpassword",
  //     newPassword: "newpassword",
  //   };

  //   const mockUserId = "1";

  //   beforeEach(() => {
  //     jest.clearAllMocks();
  //   });

  //   it("should successfully update the user's password", async () => {
  //     jest.spyOn(UserService, "getUserById").mockResolvedValue(mockUser);

  //     (AuthService.comparePasswords as jest.Mock).mockResolvedValue(true);

  //     (AuthService.hashPassword as jest.Mock).mockResolvedValue(
  //       "newhashedpassword"
  //     );

  //     await UserService.updatePassword(mockUserId, updatePasswordDto);

  //     expect(UserService.getUserById).toHaveBeenCalledWith(mockUserId);

  //     expect(AuthService.comparePasswords).toHaveBeenCalledWith({
  //       password: updatePasswordDto.currentPassword,
  //       hashedPassword: mockUser.password,
  //     });

  //     expect(AuthService.hashPassword).toHaveBeenCalledWith(
  //       updatePasswordDto.newPassword
  //     );

  //     expect(UserDB.updatePassword).toHaveBeenCalledWith({
  //       userId: mockUserId,
  //       hashedPassword: "newhashedpassword",
  //     });
  //   });

  //   it("should throw a BadRequestError if the current password is invalid", async () => {
  //     jest.spyOn(UserService, "getUserById").mockResolvedValue(mockUser);

  //     (AuthService.comparePasswords as jest.Mock).mockResolvedValue(false);

  //     await expect(
  //       UserService.updatePassword(mockUserId, {
  //         ...updatePasswordDto,
  //         currentPassword: "invalidpassword",
  //       })
  //     ).rejects.toThrow(
  //       new BadRequestError(ERROR_MESSAGES.INVALID_CREDENTIALS)
  //     );

  //     expect(UserService.getUserById).toHaveBeenCalledWith(mockUserId);

  //     expect(AuthService.comparePasswords).toHaveBeenCalledWith({
  //       password: "invalidpassword",
  //       hashedPassword: mockUser.password,
  //     });
  //   });

  //   it("should throw a BadRequestError if the new password is the same as the current password", async () => {
  //     jest.spyOn(UserService, "getUserById").mockResolvedValue(mockUser);
  //     (AuthService.comparePasswords as jest.Mock).mockResolvedValue(true);

  //     await expect(
  //       UserService.updatePassword(mockUserId, {
  //         ...updatePasswordDto,
  //         newPassword: updatePasswordDto.currentPassword,
  //       })
  //     ).rejects.toThrow(
  //       new BadRequestError(ERROR_MESSAGES.PASSWORD_SAME_AS_CURRENT)
  //     );

  //     expect(UserService.getUserById).toHaveBeenCalledWith(mockUserId);

  //     expect(AuthService.comparePasswords).toHaveBeenCalledWith({
  //       password: updatePasswordDto.currentPassword,
  //       hashedPassword: mockUser.password,
  //     });
  //   });

  //   it("should throw a NotFoundError if the user doesn't exist", async () => {
  //     jest
  //       .spyOn(UserService, "getUserById")
  //       .mockRejectedValue(
  //         new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND)
  //       );

  //     await expect(
  //       UserService.updatePassword(mockUserId, updatePasswordDto)
  //     ).rejects.toThrow(new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND));

  //     expect(UserService.getUserById).toHaveBeenCalledWith(mockUserId);
  //   });
  // });
});
