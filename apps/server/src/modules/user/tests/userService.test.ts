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

  describe("GetUserByEmail method tests", () => {
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

    const mockEmail = "test@example.com";

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should return the user when it exists", async () => {
      (UserDB.findByEmail as jest.Mock).mockResolvedValue(mockUser);

      const result = await UserService.getUserByEmail(mockEmail);

      expect(result).toEqual(mockUser);

      expect(UserDB.findByEmail).toHaveBeenCalledWith(mockEmail);
      expect(UserDB.findByEmail).toHaveBeenCalledTimes(1);
    });

    it("should throw a NotFoundError when the user doesn't exist", async () => {
      (UserDB.findByEmail as jest.Mock).mockResolvedValue(null);

      await expect(
        UserService.getUserByEmail("nonexistent@example.com")
      ).rejects.toThrow(new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND));

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

      expect(result.email).toBe(specialEmail);
      expect(UserDB.findByEmail).toHaveBeenCalledWith(specialEmail);
    });
  });
});
