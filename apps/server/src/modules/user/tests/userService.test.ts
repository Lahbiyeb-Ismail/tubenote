import { mock } from "node:test";
import { ERROR_MESSAGES } from "../../../constants/errorMessages";
import { BadRequestError, NotFoundError } from "../../../errors";
import type { UserEntry } from "../user.type";
import UserDB from "../userDB";
import UserService from "../userService";

jest.mock("../userDB");

describe("UserService methods test", () => {
  beforeAll(() => {
    jest.clearAllMocks();
  });

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

  describe("GetUserByEmail method tests", () => {
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

  describe("getUserById method tests", () => {
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

  describe("updateUser method tests", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    const updateParams = {
      userId: "user123",
      username: "newusername",
      email: "newemail@example.com",
    };

    it("should successfully update a user", async () => {
      jest.spyOn(UserService, "getUserById").mockResolvedValue(mockUser);
      jest.spyOn(UserService, "getUserByEmail").mockResolvedValue(null);

      (UserDB.update as jest.Mock).mockResolvedValue(undefined);

      await UserService.updateUser(updateParams);

      expect(UserService.getUserById).toHaveBeenCalledWith(updateParams.userId);
      expect(UserService.getUserByEmail).toHaveBeenCalledWith(
        updateParams.email
      );
      expect(UserDB.update).toHaveBeenCalledWith({
        userId: updateParams.userId,
        data: { email: updateParams.email, username: updateParams.username },
      });
    });

    it("should throw a BadRequestError if the email already exists", async () => {
      jest.spyOn(UserService, "getUserById").mockResolvedValue(mockUser);
      jest.spyOn(UserService, "getUserByEmail").mockResolvedValue(mockUser);

      await expect(UserService.updateUser(updateParams)).rejects.toThrow(
        new BadRequestError(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS)
      );

      expect(UserService.getUserById).toHaveBeenCalledWith(updateParams.userId);
      expect(UserService.getUserByEmail).toHaveBeenCalledWith(
        updateParams.email
      );
    });

    it("should throw a NotFoundError if the user doesn't exist", async () => {
      jest
        .spyOn(UserService, "getUserById")
        .mockRejectedValue(
          new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND)
        );

      await expect(UserService.updateUser(updateParams)).rejects.toThrow(
        new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND)
      );

      expect(UserService.getUserById).toHaveBeenCalledWith(updateParams.userId);
    });

    it("should not throw error if email exists but belongs to the same user", async () => {
      jest.spyOn(UserService, "getUserById").mockResolvedValue(mockUser);
      jest.spyOn(UserService, "getUserByEmail").mockResolvedValue(mockUser);
      (UserDB.update as jest.Mock).mockResolvedValue(mockUser);

      await UserService.updateUser({
        ...updateParams,
        userId: mockUser.id,
        email: mockUser.email,
        username: mockUser.username,
      });

      expect(UserService.getUserById).toHaveBeenCalledWith(mockUser.id);
      expect(UserService.getUserByEmail).toHaveBeenCalledWith(mockUser.email);
      expect(UserDB.update).toHaveBeenCalled();
    });

    it("should handle the case when only the username is updated", async () => {
      jest.spyOn(UserService, "getUserById").mockResolvedValue(mockUser);
      jest.spyOn(UserService, "getUserByEmail").mockResolvedValue(null);
      (UserDB.update as jest.Mock).mockResolvedValue({
        ...mockUser,
        username: updateParams.username,
      });

      await UserService.updateUser({
        userId: mockUser.id,
        username: updateParams.username,
        email: mockUser.email,
      });

      expect(UserService.getUserById).toHaveBeenCalledWith(mockUser.id);
      expect(UserService.getUserByEmail).toHaveBeenCalledWith(mockUser.email);
      expect(UserDB.update).toHaveBeenCalled();
    });

    it("should handle the case when only the email is updated", async () => {
      jest.spyOn(UserService, "getUserById").mockResolvedValue(mockUser);
      jest.spyOn(UserService, "getUserByEmail").mockResolvedValue(null);
      (UserDB.update as jest.Mock).mockResolvedValue({
        ...mockUser,
        email: updateParams.email,
      });

      await UserService.updateUser({
        userId: mockUser.id,
        username: mockUser.username,
        email: updateParams.email,
      });

      expect(UserService.getUserById).toHaveBeenCalledWith(mockUser.id);
      expect(UserService.getUserByEmail).toHaveBeenCalledWith(
        updateParams.email
      );
      expect(UserDB.update).toHaveBeenCalled();
    });
  });
});
