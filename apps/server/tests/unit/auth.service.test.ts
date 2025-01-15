import { REFRESH_TOKEN_SECRET } from "../../src/constants/auth.contants";
import { ERROR_MESSAGES } from "../../src/constants/error-messages.contants";
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "../../src/errors";

import { AuthService } from "../../src/modules/auth/auth.service";

import type { IAuthService } from "../../src/modules/auth/auth.types";
import type { RegisterUserDto } from "../../src/modules/auth/dtos/register-user.dto";
import type { IJwtService } from "../../src/modules/jwt/jwt.types";
import type { IMailSenderService } from "../../src/modules/mailSender/mail-sender.types";
import type { IPasswordService } from "../../src/modules/password/password.types";
import type { IRefreshTokenService } from "../../src/modules/refreshToken/refresh-token.types";
import type { IUserService } from "../../src/modules/user/user.types";

import type { RefreshToken } from "../../src/modules/refreshToken/refresh-token.model";
import type { User } from "../../src/modules/user/user.model";

import type { GoogleLoginDto } from "../../src/modules/auth/dtos/google-login.dto";
import type { LoginResponseDto } from "../../src/modules/auth/dtos/login-response.dto";
import type { LoginUserDto } from "../../src/modules/auth/dtos/login-user.dto";
import type { LogoutUserDto } from "../../src/modules/auth/dtos/logout-user.dto";
import type { RefreshDto } from "../../src/modules/auth/dtos/refresh.dto";

import type { JwtPayload } from "../../src/types";

describe("AuthService methods tests", () => {
  const mockUserId = "user_id_001";

  const mockUser: User = {
    id: mockUserId,
    username: "testuser",
    email: "test@example.com",
    password: "hashedPassword",
    isEmailVerified: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const loginResponseDto: LoginResponseDto = {
    accessToken: "mock_access_token",
    refreshToken: "mock_refresh_oken",
  };

  let authService: IAuthService;
  let mockJwtService: IJwtService;
  let mockUserService: IUserService;
  let mockPasswordService: IPasswordService;
  let mockRefreshTokenService: IRefreshTokenService;
  let mockMailSenderService: IMailSenderService;

  beforeEach(() => {
    mockJwtService = {
      verify: jest.fn(),
      sign: jest.fn(),
      generateAuthTokens: jest.fn(),
    };

    mockUserService = {
      createUser: jest.fn(),
      findOrCreateUser: jest.fn(),
      getUserById: jest.fn(),
      verifyUserEmail: jest.fn(),
      getUserByEmail: jest.fn(),
      updateUser: jest.fn(),
    };

    mockPasswordService = {
      hashPassword: jest.fn(),
      comparePasswords: jest.fn(),
      updatePassword: jest.fn(),
      resetPassword: jest.fn(),
    };

    mockRefreshTokenService = {
      createToken: jest.fn(),
      deleteToken: jest.fn(),
      deleteAllTokens: jest.fn(),
      findToken: jest.fn(),
    };

    mockMailSenderService = {
      sendVerificationEmail: jest.fn(),
      sendResetPasswordEmail: jest.fn(),
      sendMail: jest.fn(),
    };

    authService = new AuthService(
      mockJwtService,
      mockUserService,
      mockPasswordService,
      mockRefreshTokenService,
      mockMailSenderService
    );
  });

  beforeAll(() => {
    jest.clearAllMocks();
  });

  describe("AuthService - registerUser service", () => {
    const registerUserDto: RegisterUserDto = {
      username: "testuser",
      email: "test@example.com",
      password: "password123",
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should successfully register a new user", async () => {
      (mockUserService.createUser as jest.Mock).mockResolvedValue(mockUser);

      (
        mockMailSenderService.sendVerificationEmail as jest.Mock
      ).mockResolvedValue(undefined);

      const result = await authService.registerUser(registerUserDto);

      expect(mockUserService.createUser).toHaveBeenCalledWith(registerUserDto);

      expect(mockMailSenderService.sendVerificationEmail).toHaveBeenCalledWith(
        registerUserDto.email
      );

      expect(result).toEqual(mockUser);
    });

    it("should throw a ConflictError if the email is already exists", async () => {
      (mockUserService.createUser as jest.Mock).mockRejectedValue(
        new ConflictError(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS)
      );

      await expect(authService.registerUser(registerUserDto)).rejects.toThrow(
        new ConflictError(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS)
      );

      expect(mockUserService.createUser).toHaveBeenCalledWith(registerUserDto);

      expect(
        mockMailSenderService.sendVerificationEmail
      ).not.toHaveBeenCalled();
    });
  });

  describe("AuthService - loginUser service", () => {
    const loginUserDto: LoginUserDto = {
      email: "test@example.com",
      password: "password123",
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should successfully login a user", async () => {
      (mockUserService.getUserByEmail as jest.Mock).mockResolvedValue({
        ...mockUser,
        isEmailVerified: true,
      });

      (mockPasswordService.comparePasswords as jest.Mock).mockResolvedValue(
        true
      );

      (mockJwtService.generateAuthTokens as jest.Mock).mockReturnValue(
        loginResponseDto
      );

      (mockRefreshTokenService.createToken as jest.Mock).mockResolvedValue(
        undefined
      );

      const result = await authService.loginUser(loginUserDto);

      expect(result).toEqual(loginResponseDto);

      expect(mockUserService.getUserByEmail).toHaveBeenCalledWith(
        loginUserDto.email
      );

      expect(mockPasswordService.comparePasswords).toHaveBeenCalledWith({
        password: loginUserDto.password,
        hashedPassword: mockUser.password,
      });

      expect(mockJwtService.generateAuthTokens).toHaveBeenCalledWith(
        mockUser.id
      );

      expect(mockRefreshTokenService.createToken).toHaveBeenCalledWith({
        userId: mockUser.id,
        token: loginResponseDto.refreshToken,
      });
    });

    it("should throw a NotFoundError if the user doesn't exist", async () => {
      (mockUserService.getUserByEmail as jest.Mock).mockResolvedValue(null);

      await expect(authService.loginUser(loginUserDto)).rejects.toThrow(
        new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND)
      );

      expect(mockUserService.getUserByEmail).toHaveBeenCalledWith(
        loginUserDto.email
      );

      expect(mockPasswordService.comparePasswords).not.toHaveBeenCalled();

      expect(mockJwtService.generateAuthTokens).not.toHaveBeenCalled();

      expect(mockRefreshTokenService.createToken).not.toHaveBeenCalled();
    });

    it("should throw a UnauthorizedError if the email is not verified", async () => {
      (mockUserService.getUserByEmail as jest.Mock).mockResolvedValue(mockUser);

      await expect(authService.loginUser(loginUserDto)).rejects.toThrow(
        new UnauthorizedError(ERROR_MESSAGES.EMAIL_NOT_VERIFIED)
      );

      expect(mockUserService.getUserByEmail).toHaveBeenCalledWith(
        loginUserDto.email
      );

      expect(mockPasswordService.comparePasswords).not.toHaveBeenCalled();

      expect(mockJwtService.generateAuthTokens).not.toHaveBeenCalled();

      expect(mockRefreshTokenService.createToken).not.toHaveBeenCalled();
    });

    it("should throw a ForbiddenError if the password is incorrect", async () => {
      (mockUserService.getUserByEmail as jest.Mock).mockResolvedValue({
        ...mockUser,
        isEmailVerified: true,
      });

      (mockPasswordService.comparePasswords as jest.Mock).mockResolvedValue(
        false
      );

      await expect(authService.loginUser(loginUserDto)).rejects.toThrow(
        new ForbiddenError(ERROR_MESSAGES.INVALID_CREDENTIALS)
      );

      expect(mockUserService.getUserByEmail).toHaveBeenCalledWith(
        loginUserDto.email
      );

      expect(mockPasswordService.comparePasswords).toHaveBeenCalledWith({
        password: loginUserDto.password,
        hashedPassword: mockUser.password,
      });

      expect(mockJwtService.generateAuthTokens).not.toHaveBeenCalled();

      expect(mockRefreshTokenService.createToken).not.toHaveBeenCalled();
    });
  });

  describe("AuthService - logoutUser service", () => {
    const logoutUserDto: LogoutUserDto = {
      userId: "user_id_001",
      refreshToken: "mock_refresh_token",
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should successfully logout a user", async () => {
      (mockRefreshTokenService.deleteAllTokens as jest.Mock).mockResolvedValue(
        undefined
      );

      await expect(
        authService.logoutUser(logoutUserDto)
      ).resolves.toBeUndefined();

      expect(mockRefreshTokenService.deleteAllTokens).toHaveBeenCalledWith(
        logoutUserDto.userId
      );
    });

    it("should throw a UnauthorizedError when the refreshToken is null or undefined", async () => {
      await expect(
        authService.logoutUser({ ...logoutUserDto, refreshToken: "" })
      ).rejects.toThrow(new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED));

      expect(mockRefreshTokenService.deleteAllTokens).not.toHaveBeenCalled();
    });

    it("should throw a UnauthorizedError when the userId is not exists", async () => {
      await expect(
        authService.logoutUser({ ...logoutUserDto, userId: "" })
      ).rejects.toThrow(new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED));

      expect(mockRefreshTokenService.deleteAllTokens).not.toHaveBeenCalled();
    });
  });

  describe("AuthService - refreshToken service", () => {
    const mockJwtPayload: JwtPayload = {
      userId: "user_id_001",
      exp: Date.now() + 1000_000,
      iat: Date.now(),
    };

    const refreshDto: RefreshDto = {
      token: "mockToken",
      userId: "user_id_001",
    };

    const mockRefreshToken: RefreshToken = {
      id: "token_id_001",
      userId: "user_id_001",
      token: "mockToken",
      createdAt: new Date(),
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should successfully refresh the token", async () => {
      (mockJwtService.verify as jest.Mock).mockResolvedValue(mockJwtPayload);

      (mockRefreshTokenService.findToken as jest.Mock).mockResolvedValue(
        mockRefreshToken
      );

      (mockRefreshTokenService.deleteToken as jest.Mock).mockResolvedValue(
        undefined
      );

      (mockJwtService.generateAuthTokens as jest.Mock).mockReturnValue(
        loginResponseDto
      );

      const result = await authService.refreshToken(refreshDto);

      expect(result).toEqual(loginResponseDto);

      expect(mockJwtService.verify).toHaveBeenCalledWith({
        token: refreshDto.token,
        secret: REFRESH_TOKEN_SECRET,
      });

      expect(mockRefreshTokenService.findToken).toHaveBeenCalledWith(
        refreshDto.token
      );

      expect(mockRefreshTokenService.deleteToken).toHaveBeenCalledWith(
        refreshDto.token
      );

      expect(mockJwtService.generateAuthTokens).toHaveBeenCalledWith(
        refreshDto.userId
      );
    });

    it("should throw a ForbiddenError if the token is invalid or expired", async () => {
      (mockJwtService.verify as jest.Mock).mockResolvedValue(null);

      await expect(authService.refreshToken(refreshDto)).rejects.toThrow(
        new ForbiddenError(ERROR_MESSAGES.FORBIDDEN)
      );

      expect(mockJwtService.verify).toHaveBeenCalledWith({
        token: refreshDto.token,
        secret: REFRESH_TOKEN_SECRET,
      });

      expect(mockRefreshTokenService.deleteAllTokens).toHaveBeenCalledWith(
        refreshDto.userId
      );

      expect(mockRefreshTokenService.findToken).not.toHaveBeenCalled();
      expect(mockRefreshTokenService.deleteToken).not.toHaveBeenCalled();
    });

    it("should throw a UnauthorizedError if the userId in the token is not the same as the userId in the request", async () => {
      (mockJwtService.verify as jest.Mock).mockResolvedValue({
        ...mockJwtPayload,
        userId: "user_id_002",
      });

      await expect(authService.refreshToken(refreshDto)).rejects.toThrow(
        new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED)
      );

      expect(mockJwtService.verify).toHaveBeenCalledWith({
        token: refreshDto.token,
        secret: REFRESH_TOKEN_SECRET,
      });

      expect(mockRefreshTokenService.deleteAllTokens).not.toHaveBeenCalled();
      expect(mockRefreshTokenService.findToken).not.toHaveBeenCalled();
      expect(mockRefreshTokenService.deleteToken).not.toHaveBeenCalled();
    });

    it("should throw a ForbiddenError if the token is not found in the database (token reuses)", async () => {
      (mockJwtService.verify as jest.Mock).mockResolvedValue(mockJwtPayload);

      (mockRefreshTokenService.findToken as jest.Mock).mockResolvedValue(null);

      await expect(authService.refreshToken(refreshDto)).rejects.toThrow(
        new ForbiddenError(ERROR_MESSAGES.FORBIDDEN)
      );

      expect(mockJwtService.verify).toHaveBeenCalledWith({
        token: refreshDto.token,
        secret: REFRESH_TOKEN_SECRET,
      });

      expect(mockRefreshTokenService.findToken).toHaveBeenCalledWith(
        refreshDto.token
      );

      expect(mockRefreshTokenService.deleteAllTokens).toHaveBeenCalledWith(
        refreshDto.userId
      );

      expect(mockRefreshTokenService.deleteToken).not.toHaveBeenCalled();
    });
  });

  describe("AuthService - googleLogin service", () => {
    const googleLoginDto: GoogleLoginDto = {
      sub: "google_id_001",
      email: "",
      email_verified: true,
      name: "testuser",
      picture: "testuser.jpg",
      given_name: "test",
      family_name: "user",
    };

    const mockCreatedUser: User = {
      id: "user_id_001",
      email: googleLoginDto.email,
      username: googleLoginDto.name,
      password: googleLoginDto.sub,
      isEmailVerified: googleLoginDto.email_verified,
      googleId: googleLoginDto.sub,
      profilePicture: googleLoginDto.picture,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should successfully login a user with google", async () => {
      (mockJwtService.generateAuthTokens as jest.Mock).mockReturnValue(
        loginResponseDto
      );

      const result = await authService.googleLogin(mockCreatedUser);

      expect(result).toEqual(loginResponseDto);

      expect(mockJwtService.generateAuthTokens).toHaveBeenCalledWith(
        mockCreatedUser.id
      );

      expect(mockRefreshTokenService.createToken).toHaveBeenCalledWith({
        userId: mockCreatedUser.id,
        token: loginResponseDto.refreshToken,
      });
    });

    // it("should successfully login a user with google and update the googleId", async () => {
    //   (mockUserService.getUserByEmail as jest.Mock).mockResolvedValue({
    //     ...mockCreatedUser,
    //     googleId: "",
    //   });

    //   (mockUserService.updateUser as jest.Mock).mockResolvedValue(
    //     mockCreatedUser
    //   );

    //   const result = await authService.googleLogin(googleLoginDto);

    //   expect(result).toEqual(loginResponseDto);

    //   expect(mockUserService.getUserByEmail).toHaveBeenCalledWith(
    //     googleLoginDto.email
    //   );

    //   expect(mockUserService.updateUser).toHaveBeenCalledWith(
    //     mockCreatedUser.id,
    //     {
    //       googleId: googleLoginDto.sub,
    //     }
    //   );
    //   expect(mockJwtService.generateAuthTokens).toHaveBeenCalledWith(
    //     mockCreatedUser.id
    //   );
    //   expect(mockRefreshTokenService.createToken).toHaveBeenCalledWith(
    //     mockCreatedUser.id,
    //     loginResponseDto.refreshToken
    //   );
    // });

    // it("should throw a UnauthorizedError if the email is not verified", async () => {
    //   const unverifiedGoogleUser: GoogleLoginDto = {
    //     ...googleLoginDto,
    //     email_verified: false,
    //   };

    //   await expect(
    //     authService.googleLogin(unverifiedGoogleUser)
    //   ).rejects.toThrow(
    //     new UnauthorizedError(ERROR_MESSAGES.EMAIL_NOT_VERIFIED)
    //   );

    //   expect(mockUserService.getUserByEmail).not.toHaveBeenCalled();
    //   expect(mockUserService.createUser).not.toHaveBeenCalled();
    //   expect(mockUserService.updateUser).not.toHaveBeenCalled();
    //   expect(mockRefreshTokenService.createToken).not.toHaveBeenCalled();
    // });
  });

  describe("AuthService - verifyEmail service", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should successfully verify the email", async () => {
      (mockUserService.getUserById as jest.Mock).mockResolvedValue(mockUser);

      await expect(
        authService.verifyEmail(mockUserId)
      ).resolves.toBeUndefined();

      expect(mockUserService.verifyUserEmail).toHaveBeenCalledWith(mockUserId);
    });

    it("should throw a ForbiddenError if the email is already verified", async () => {
      (mockUserService.getUserById as jest.Mock).mockResolvedValue({
        ...mockUser,
        isEmailVerified: true,
      });

      await expect(authService.verifyEmail(mockUserId)).rejects.toThrow(
        new ForbiddenError(ERROR_MESSAGES.EMAIL_ALREADY_VERIFIED)
      );

      expect(mockUserService.verifyUserEmail).not.toHaveBeenCalled();
    });
  });
});
