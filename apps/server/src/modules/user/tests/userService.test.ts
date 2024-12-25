import { ERROR_MESSAGES } from "../../../constants/errorMessages";
import { NotFoundError } from "../../../errors";
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
});
