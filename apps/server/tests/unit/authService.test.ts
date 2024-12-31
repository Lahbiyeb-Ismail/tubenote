import { REFRESH_TOKEN_SECRET } from "../../src/constants/auth";
import { ERROR_MESSAGES } from "../../src/constants/errorMessages";
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "../../src/errors";
import type { GoogleUser } from "../../src/modules/auth/auth.type";
import AuthService from "../../src/modules/auth/authService";
import type { RefreshTokenEntry } from "../../src/modules/refreshToken/refreshToken.type";
import RefreshTokenService from "../../src/modules/refreshToken/refreshTokenService";
import type { UserEntry } from "../../src/modules/user/user.type";
import UserDB from "../../src/modules/user/userDB";
import UserService from "../../src/modules/user/userService";
import EmailVerificationService from "../../src/modules/verifyEmailToken/verifyEmailService";
import type { JwtPayload } from "../../src/types";

jest.mock("../../src/modules/user/userDB");
jest.mock("../../src/modules/verifyEmailToken/verifyEmailService");
jest.mock("../../src/modules/refreshToken/refreshTokenService");
jest.mock("../../src/modules/user/userService");

describe("Test AuthService methods", () => {
  beforeAll(() => {
    jest.clearAllMocks();
  });

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
        EmailVerificationService.sendVerificationToken as jest.Mock
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
        EmailVerificationService.sendVerificationToken
      ).toHaveBeenCalledWith("test@example.com");
    });

    it("should throw a ConflictError if the email is already exists", async () => {
      // Mock the UserDB.findByEmail to return an existing user
      (UserDB.findByEmail as jest.Mock).mockResolvedValue(mockUser);

      await expect(
        AuthService.registerUser({
          username: "testuser",
          email: "test@example.com",
          password: "password123",
        })
      ).rejects.toThrow(new ConflictError(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS));

      expect(UserDB.findByEmail).toHaveBeenCalledWith("test@example.com");
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

  describe("Logout method test", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should successfully logout a user", async () => {
      const userId = "1";
      const refreshToken = "mockRefreshToken";

      (RefreshTokenService.deleteAllTokens as jest.Mock).mockResolvedValue(
        undefined
      );

      await expect(
        AuthService.logoutUser({ refreshToken, userId })
      ).resolves.toBeUndefined();

      expect(RefreshTokenService.deleteAllTokens).toHaveBeenCalledWith(userId);
    });

    it("should throw a UnauthorizedError when the refreshToken is null or undefined", async () => {
      const userId = "1";
      const refreshToken = "";

      await expect(
        AuthService.logoutUser({ refreshToken, userId })
      ).rejects.toThrow(new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED));

      expect(RefreshTokenService.deleteAllTokens).not.toHaveBeenCalled();
    });

    it("should throw a UnauthorizedError when the userId is not exists", async () => {
      const userId = "";
      const refreshToken = "mockRefreshToken";

      await expect(
        AuthService.logoutUser({ refreshToken, userId })
      ).rejects.toThrow(new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED));

      expect(RefreshTokenService.deleteAllTokens).not.toHaveBeenCalled();
    });
  });

  describe("RefreshToken method test", () => {
    const mockPayload: JwtPayload = {
      userId: "1",
      exp: Date.now() + 1000,
      iat: Date.now(),
    };

    const mockToken = "mockToken";
    const mockUserId = "1";

    const mockRefreshTokenFromDB: RefreshTokenEntry = {
      id: "12",
      userId: "1",
      token: "mockToken",
      createdAt: new Date(),
    };

    const mockReturnedTokens = {
      accessToken: "mockAccessToken",
      refreshToken: "mockRefreshToken",
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should successfully refresh the token", async () => {
      jest.spyOn(AuthService, "verifyToken").mockResolvedValue(mockPayload);

      (RefreshTokenService.findToken as jest.Mock).mockResolvedValue(
        mockRefreshTokenFromDB
      );

      (RefreshTokenService.deleteToken as jest.Mock).mockResolvedValue(
        undefined
      );

      jest
        .spyOn(AuthService, "createJwtTokens")
        .mockReturnValue(mockReturnedTokens);

      const result = await AuthService.refreshToken({
        token: mockToken,
        userId: mockUserId,
      });

      expect(result).toEqual(mockReturnedTokens);

      expect(AuthService.verifyToken).toHaveBeenCalledWith(
        mockToken,
        REFRESH_TOKEN_SECRET
      );

      expect(RefreshTokenService.findToken).toHaveBeenCalledWith(mockToken);

      expect(RefreshTokenService.deleteToken).toHaveBeenCalledWith(mockToken);

      expect(AuthService.createJwtTokens).toHaveBeenCalledWith(
        mockPayload.userId
      );
    });

    it("should throw a ForbiddenError if the token is invalid or expired", async () => {
      jest.spyOn(AuthService, "verifyToken").mockResolvedValue(null);

      await expect(
        AuthService.refreshToken({ token: mockToken, userId: mockUserId })
      ).rejects.toThrow(new ForbiddenError(ERROR_MESSAGES.FORBIDDEN));

      expect(AuthService.verifyToken).toHaveBeenCalledWith(
        mockToken,
        REFRESH_TOKEN_SECRET
      );

      expect(RefreshTokenService.deleteAllTokens).toHaveBeenCalledWith(
        mockUserId
      );

      expect(RefreshTokenService.findToken).not.toHaveBeenCalled();
      expect(RefreshTokenService.deleteToken).not.toHaveBeenCalled();
      expect(AuthService.createJwtTokens).not.toHaveBeenCalled();
    });

    it("should throw a UnauthorizedError if the userId in the token is not the same as the userId in the request", async () => {
      jest.spyOn(AuthService, "verifyToken").mockResolvedValue({
        ...mockPayload,
        userId: "2",
      });

      await expect(
        AuthService.refreshToken({ token: mockToken, userId: mockUserId })
      ).rejects.toThrow(new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED));

      expect(AuthService.verifyToken).toHaveBeenCalledWith(
        mockToken,
        REFRESH_TOKEN_SECRET
      );

      expect(RefreshTokenService.deleteAllTokens).not.toHaveBeenCalled();
      expect(RefreshTokenService.findToken).not.toHaveBeenCalled();
      expect(RefreshTokenService.deleteToken).not.toHaveBeenCalled();
      expect(AuthService.createJwtTokens).not.toHaveBeenCalled();
    });

    it("should throw a ForbiddenError if the token is not found in the database (token reuses)", async () => {
      jest.spyOn(AuthService, "verifyToken").mockResolvedValue(mockPayload);

      (RefreshTokenService.findToken as jest.Mock).mockResolvedValue(null);

      await expect(
        AuthService.refreshToken({ token: mockToken, userId: mockUserId })
      ).rejects.toThrow(new ForbiddenError(ERROR_MESSAGES.FORBIDDEN));

      expect(AuthService.verifyToken).toHaveBeenCalledWith(
        mockToken,
        REFRESH_TOKEN_SECRET
      );

      expect(RefreshTokenService.findToken).toHaveBeenCalledWith(mockToken);

      expect(RefreshTokenService.deleteAllTokens).toHaveBeenCalledWith(
        mockUserId
      );

      expect(RefreshTokenService.deleteToken).not.toHaveBeenCalled();
      expect(AuthService.createJwtTokens).not.toHaveBeenCalled();
    });
  });

  describe("GoogleLogin method tests", () => {
    const mockGoogleUser: GoogleUser = {
      sub: "1",
      email: "",
      email_verified: true,
      name: "testuser",
      picture: "testuser.jpg",
      given_name: "test",
      family_name: "user",
    };

    const mockCreatedUser: UserEntry = {
      id: "1",
      email: mockGoogleUser.email,
      username: mockGoogleUser.name,
      password: mockGoogleUser.sub,
      isEmailVerified: mockGoogleUser.email_verified,
      googleId: mockGoogleUser.sub,
      profilePicture: mockGoogleUser.picture,
      createdAt: new Date(),
      updatedAt: new Date(),
      videoIds: [],
    };

    const mockTokens = {
      accessToken: "mockAccessToken",
      refreshToken: "mockRefreshToken",
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should successfully login a user with google", async () => {
      (UserDB.findByEmail as jest.Mock).mockResolvedValue(null);
      (UserDB.create as jest.Mock).mockResolvedValue(mockCreatedUser);

      jest.spyOn(AuthService, "createJwtTokens").mockReturnValue(mockTokens);

      const result = await AuthService.googleLogin(mockGoogleUser);

      expect(result).toEqual(mockTokens);

      expect(UserDB.findByEmail).toHaveBeenCalledWith(mockGoogleUser.email);
      expect(UserDB.create).toHaveBeenCalledWith({
        data: {
          email: mockGoogleUser.email,
          username: mockGoogleUser.name,
          password: mockGoogleUser.sub,
          isEmailVerified: mockGoogleUser.email_verified,
          googleId: mockGoogleUser.sub,
          profilePicture: mockGoogleUser.picture,
        },
      });
      expect(AuthService.createJwtTokens).toHaveBeenCalledWith(
        mockCreatedUser.id
      );
      expect(RefreshTokenService.createToken).toHaveBeenCalledWith(
        mockCreatedUser.id,
        mockTokens.refreshToken
      );
    });

    it("should successfully login a user with google and update the googleId", async () => {
      (UserDB.findByEmail as jest.Mock).mockResolvedValue({
        ...mockCreatedUser,
        googleId: null,
      });

      (UserDB.update as jest.Mock).mockResolvedValue(mockCreatedUser);

      jest.spyOn(AuthService, "createJwtTokens").mockReturnValue(mockTokens);

      const result = await AuthService.googleLogin(mockGoogleUser);

      expect(result).toEqual(mockTokens);

      expect(UserDB.findByEmail).toHaveBeenCalledWith(mockGoogleUser.email);
      expect(UserDB.update).toHaveBeenCalledWith({
        userId: mockCreatedUser.id,
        data: { googleId: mockGoogleUser.sub },
      });
      expect(AuthService.createJwtTokens).toHaveBeenCalledWith(
        mockCreatedUser.id
      );
      expect(RefreshTokenService.createToken).toHaveBeenCalledWith(
        mockCreatedUser.id,
        mockTokens.refreshToken
      );
    });

    it("should throw a UnauthorizedError if the email is not verified", async () => {
      const unverifiedGoogleUser = { ...mockGoogleUser, email_verified: false };

      await expect(
        AuthService.googleLogin(unverifiedGoogleUser)
      ).rejects.toThrow(
        new UnauthorizedError(ERROR_MESSAGES.EMAIL_NOT_VERIFIED)
      );

      expect(UserDB.findByEmail).not.toHaveBeenCalled();
      expect(UserDB.create).not.toHaveBeenCalled();
      expect(UserDB.update).not.toHaveBeenCalled();
      expect(AuthService.createJwtTokens).not.toHaveBeenCalled();
      expect(RefreshTokenService.createToken).not.toHaveBeenCalled();
    });
  });

  describe("VerifyEmail method tests", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    const mockUserId = "1";

    const mockUser = {
      id: "1",
      email: "test@example.com",
      password: "hashedPassword",
      isEmailVerified: false,
    };

    it("should successfully verify the email", async () => {
      (UserService.getUserById as jest.Mock).mockResolvedValue(mockUser);

      await expect(
        AuthService.verifyEmail(mockUserId)
      ).resolves.toBeUndefined();

      expect(UserService.verifyUserEmail).toHaveBeenCalledWith(mockUserId);
    });

    it("should throw a ForbiddenError if the email is already verified", async () => {
      (UserService.getUserById as jest.Mock).mockResolvedValue({
        ...mockUser,
        isEmailVerified: true,
      });

      await expect(AuthService.verifyEmail(mockUserId)).rejects.toThrow(
        new ForbiddenError(ERROR_MESSAGES.EMAIL_ALREADY_VERIFIED)
      );

      expect(UserService.verifyUserEmail).not.toHaveBeenCalled();
    });
  });
});
