import bcrypt from "bcryptjs";

import { ERROR_MESSAGES } from "../../../constants/errorMessages";
import { ConflictError } from "../../../errors";
import UserDB from "../../user/userDB";
import EmailVerificationService from "../../verifyEmailToken/verifyEmailService";
import AuthService from "../authService";

jest.mock("bcryptjs");
jest.mock("../../user/userDB");
jest.mock("../../verifyEmailToken/verifyEmailService");

describe("Test AuthService methods", () => {
  describe("Register service tests", () => {
    const mockUser = {
      id: "1",
      username: "testuser",
      email: "test@example.com",
      password: "hashedpassword",
    };

    beforeAll(() => {
      jest.clearAllMocks();
    });

    it("should successfully register a new user", async () => {
      // Mock the UserDB.findByEmail to return null (user doesn't exist)
      (UserDB.findByEmail as jest.Mock).mockResolvedValue(null);

      // Mock the UserDB.create to return a new user
      (UserDB.create as jest.Mock).mockResolvedValue(mockUser);

      // Mock the EmailVerificationService.generateAndSendToken
      (
        EmailVerificationService.generateAndSendToken as jest.Mock
      ).mockResolvedValue(undefined);

      // Mock the AuthService.hashPassword method
      jest
        .spyOn(AuthService, "hashPassword")
        .mockResolvedValue("hashedpassword");

      const result = await AuthService.registerUser({
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      });

      expect(result).toEqual(mockUser);
      expect(UserDB.findByEmail).toHaveBeenCalledWith("test@example.com");
      expect(UserDB.create).toHaveBeenCalledWith({
        data: {
          username: "testuser",
          email: "test@example.com",
          password: "hashedpassword",
        },
      });
      expect(
        EmailVerificationService.generateAndSendToken
      ).toHaveBeenCalledWith("test@example.com");
    });

    it("should throw a ConflictError if the email is already exists", async () => {
      // Mock the UserDB.findByEmail to return an existing user
      (UserDB.findByEmail as jest.Mock).mockResolvedValue(mockUser);

      expect(UserDB.findByEmail).toHaveBeenCalledWith("test@example.com");

      await expect(
        AuthService.registerUser({
          username: "testuser",
          email: "test@example.com",
          password: "password123",
        })
      ).rejects.toThrow(new ConflictError(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS));
    });
  });
});
