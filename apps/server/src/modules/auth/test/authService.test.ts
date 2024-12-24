import bcrypt from "bcryptjs";

import { ERROR_MESSAGES } from "../../../constants/errorMessages";
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "../../../errors";
import RefreshTokenService from "../../refreshToken/refreshTokenService";
import UserDB from "../../user/userDB";
import EmailVerificationService from "../../verifyEmailToken/verifyEmailService";
import AuthService from "../authService";

jest.mock("bcryptjs");
jest.mock("../../user/userDB");
jest.mock("../../verifyEmailToken/verifyEmailService");
jest.mock("../../refreshToken/refreshTokenService");

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

  describe("Login service tests", () => {
    const mockUser = {
      id: "1",
      email: "test@example.com",
      password: "hashedPassword",
      isEmailVerified: true,
    };

    const mockLoginParams = {
      email: "test@example.com",
      password: "password123",
    };

    const mockTokens = {
      accessToken: "mockAccessToken",
      refreshToken: "mockRefreshToken",
    };

    beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(AuthService, "comparePasswords").mockResolvedValue(true);
      jest.spyOn(AuthService, "createJwtTokens").mockReturnValue(mockTokens);
    });

    it("should successfully login a user", async () => {
      (UserDB.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      (RefreshTokenService.createToken as jest.Mock).mockResolvedValue(
        undefined
      );

      const result = await AuthService.loginUser(mockLoginParams);

      expect(result).toEqual(mockTokens);
      expect(UserDB.findByEmail).toHaveBeenCalledWith(mockLoginParams.email);
      expect(AuthService.comparePasswords).toHaveBeenCalledWith({
        rawPassword: mockLoginParams.password,
        hashedPassword: mockUser.password,
      });
      expect(AuthService.createJwtTokens).toHaveBeenCalledWith(mockUser.id);
      expect(RefreshTokenService.createToken).toHaveBeenCalledWith(
        mockUser.id,
        mockTokens.refreshToken
      );
    });

    it("should throw a NotFoundError if the user doesn't exist", async () => {
      (UserDB.findByEmail as jest.Mock).mockResolvedValue(null);

      await expect(AuthService.loginUser(mockLoginParams)).rejects.toThrow(
        new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND)
      );

      expect(UserDB.findByEmail).toHaveBeenCalledWith(mockLoginParams.email);
      expect(AuthService.comparePasswords).not.toHaveBeenCalled();
      expect(AuthService.createJwtTokens).not.toHaveBeenCalled();
      expect(RefreshTokenService.createToken).not.toHaveBeenCalled();
    });

    it("should throw a UnauthorizedError if the email is not verified", async () => {
      const unverifiedUser = { ...mockUser, isEmailVerified: false };
      (UserDB.findByEmail as jest.Mock).mockResolvedValue(unverifiedUser);

      await expect(AuthService.loginUser(mockLoginParams)).rejects.toThrow(
        new UnauthorizedError(ERROR_MESSAGES.EMAIL_NOT_VERIFIED)
      );

      expect(UserDB.findByEmail).toHaveBeenCalledWith(mockLoginParams.email);
      expect(AuthService.comparePasswords).not.toHaveBeenCalled();
      expect(AuthService.createJwtTokens).not.toHaveBeenCalled();
      expect(RefreshTokenService.createToken).not.toHaveBeenCalled();
    });

    it("should throw a ForbiddenError if the password is incorrect", async () => {
      (UserDB.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      jest.spyOn(AuthService, "comparePasswords").mockResolvedValue(false);

      await expect(AuthService.loginUser(mockLoginParams)).rejects.toThrow(
        new ForbiddenError(ERROR_MESSAGES.INVALID_CREDENTIALS)
      );

      expect(UserDB.findByEmail).toHaveBeenCalledWith(mockLoginParams.email);

      expect(AuthService.comparePasswords).toHaveBeenCalledWith({
        rawPassword: mockLoginParams.password,
        hashedPassword: mockUser.password,
      });

      expect(AuthService.createJwtTokens).not.toHaveBeenCalled();
      expect(RefreshTokenService.createToken).not.toHaveBeenCalled();
    });
  });
});
