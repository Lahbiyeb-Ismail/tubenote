import { REFRESH_TOKEN_SECRET } from "../../src/constants/auth";
import { ERROR_MESSAGES } from "../../src/constants/errorMessages";
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "../../src/errors";
import { AuthService, IAuthService } from "../../src/modules/auth/auth.service";
import type { GoogleUser } from "../../src/modules/auth/auth.type";
import type { LoginResponseDto } from "../../src/modules/auth/dtos/login-response.dto";
import type { LoginUserDto } from "../../src/modules/auth/dtos/login-user.dto";
import type { RegisterUserDto } from "../../src/modules/auth/dtos/register-user.dto";
import { IPasswordService } from "../../src/modules/password/password.service";
import type { IRefreshTokenService } from "../../src/modules/refreshToken/refresh-token.service";

import { IUserDatabase } from "../../src/modules/user/user.db";
import { IUserService } from "../../src/modules/user/user.service";
import type { UserEntry } from "../../src/modules/user/user.type";
import type { IEmailService } from "../../src/services/emailService";

import type { JwtPayload } from "../../src/types";

describe("Test AuthService methods", () => {
  let authService: IAuthService;
  let mockUserDB: IUserDatabase;
  let mockUserService: IUserService;
  let mockPasswordService: IPasswordService;
  let mockRefreshTokenService: IRefreshTokenService;
  let mockEmailService: IEmailService;

  beforeEach(() => {
    mockUserDB = {
      findByEmail: jest.fn(),
      create: jest.fn(),
      findById: jest.fn(),
      updateUser: jest.fn(),
      updatePassword: jest.fn(),
    };
    mockUserService = {
      getUserById: jest.fn(),
      verifyUserEmail: jest.fn(),
      getUserByEmail: jest.fn(),
      updateUser: jest.fn(),
      updatePassword: jest.fn(),
    };
    mockPasswordService = {
      hashPassword: jest.fn(),
      comparePasswords: jest.fn(),
    };

    mockRefreshTokenService = {
      createToken: jest.fn(),
      deleteToken: jest.fn(),
      deleteAllTokens: jest.fn(),
      findToken: jest.fn(),
    };

    mockEmailService = {
      sendVerificationEmail: jest.fn(),
      createEmailVerififcationToken: jest.fn(),
      sendResetPasswordEmail: jest.fn(),
      sendEmail: jest.fn(),
    };

    authService = new AuthService(
      mockUserDB,
      mockUserService,
      mockPasswordService,
      mockRefreshTokenService,
      mockEmailService
    );
  });

  const mockUser: UserEntry = {
    id: "1",
    email: "test@example.com",
    username: "password123",
    password: "hashedPassword",
    isEmailVerified: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    videoIds: [],
  };

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
      (mockUserDB.findByEmail as jest.Mock).mockResolvedValue(null);

      (mockPasswordService.hashPassword as jest.Mock).mockResolvedValue(
        "hashedPassword"
      );

      (mockUserDB.create as jest.Mock).mockResolvedValue(mockUser);

      (mockEmailService.sendVerificationEmail as jest.Mock).mockResolvedValue(
        undefined
      );

      const result = await authService.registerUser(registerUserDto);

      expect(mockUserDB.findByEmail).toHaveBeenCalledWith(
        registerUserDto.email
      );
      expect(mockPasswordService.hashPassword).toHaveBeenCalledWith(
        registerUserDto.password
      );

      expect(mockUserDB.create).toHaveBeenCalledWith({
        username: registerUserDto.username,
        email: registerUserDto.email,
        password: "hashedPassword",
      });

      expect(mockEmailService.sendVerificationEmail).toHaveBeenCalledWith(
        registerUserDto.email
      );

      expect(result).toEqual(mockUser);
    });

    it("should throw a ConflictError if the email is already exists", async () => {
      (mockUserDB.findByEmail as jest.Mock).mockResolvedValue(mockUser);

      await expect(
        authService.registerUser({
          username: "testuser",
          email: "test@example.com",
          password: "password123",
        })
      ).rejects.toThrow(new ConflictError(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS));

      expect(mockUserDB.findByEmail).toHaveBeenCalledWith("test@example.com");

      expect(mockPasswordService.hashPassword).not.toHaveBeenCalled();

      expect(mockUserDB.create).not.toHaveBeenCalled();

      expect(mockEmailService.sendVerificationEmail).not.toHaveBeenCalled();
    });
  });

  describe("AuthService - loginUser service", () => {
    const loginUserDto: LoginUserDto = {
      email: "test@example.com",
      password: "password123",
    };

    const loginResponseDto: LoginResponseDto = {
      accessToken: "mockAccessToken",
      refreshToken: "mockRefreshToken",
    };

    beforeEach(() => {
      jest.clearAllMocks();
      jest
        .spyOn(authService, "createJwtTokens")
        .mockReturnValue(loginResponseDto);
    });

    it("should successfully login a user", async () => {
      (mockUserDB.findByEmail as jest.Mock).mockResolvedValue({
        ...mockUser,
        isEmailVerified: true,
      });

      (mockPasswordService.comparePasswords as jest.Mock).mockResolvedValue(
        true
      );

      (mockRefreshTokenService.createToken as jest.Mock).mockResolvedValue(
        undefined
      );

      const result = await authService.loginUser(loginUserDto);

      expect(result).toEqual(loginResponseDto);

      expect(mockUserDB.findByEmail).toHaveBeenCalledWith(loginUserDto.email);

      expect(mockPasswordService.comparePasswords).toHaveBeenCalledWith({
        password: loginUserDto.password,
        hashedPassword: mockUser.password,
      });

      expect(authService.createJwtTokens).toHaveBeenCalledWith(mockUser.id);

      expect(mockRefreshTokenService.createToken).toHaveBeenCalledWith(
        mockUser.id,
        loginResponseDto.refreshToken
      );
    });

    it("should throw a NotFoundError if the user doesn't exist", async () => {
      (mockUserDB.findByEmail as jest.Mock).mockResolvedValue(null);

      await expect(authService.loginUser(loginUserDto)).rejects.toThrow(
        new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND)
      );

      expect(mockUserDB.findByEmail).toHaveBeenCalledWith(loginUserDto.email);

      expect(mockPasswordService.comparePasswords).not.toHaveBeenCalled();

      expect(authService.createJwtTokens).not.toHaveBeenCalled();

      expect(mockRefreshTokenService.createToken).not.toHaveBeenCalled();
    });

    it("should throw a UnauthorizedError if the email is not verified", async () => {
      (mockUserDB.findByEmail as jest.Mock).mockResolvedValue(mockUser);

      await expect(authService.loginUser(loginUserDto)).rejects.toThrow(
        new UnauthorizedError(ERROR_MESSAGES.EMAIL_NOT_VERIFIED)
      );

      expect(mockUserDB.findByEmail).toHaveBeenCalledWith(loginUserDto.email);

      expect(mockPasswordService.comparePasswords).not.toHaveBeenCalled();

      expect(authService.createJwtTokens).not.toHaveBeenCalled();

      expect(mockRefreshTokenService.createToken).not.toHaveBeenCalled();
    });

    it("should throw a ForbiddenError if the password is incorrect", async () => {
      (mockUserDB.findByEmail as jest.Mock).mockResolvedValue({
        ...mockUser,
        isEmailVerified: true,
      });

      (mockPasswordService.comparePasswords as jest.Mock).mockResolvedValue(
        false
      );

      await expect(authService.loginUser(loginUserDto)).rejects.toThrow(
        new ForbiddenError(ERROR_MESSAGES.INVALID_CREDENTIALS)
      );

      expect(mockUserDB.findByEmail).toHaveBeenCalledWith(loginUserDto.email);

      expect(mockPasswordService.comparePasswords).toHaveBeenCalledWith({
        password: loginUserDto.password,
        hashedPassword: mockUser.password,
      });

      expect(authService.createJwtTokens).not.toHaveBeenCalled();

      expect(mockRefreshTokenService.createToken).not.toHaveBeenCalled();
    });
  });

  // describe("Logout method test", () => {
  //   beforeEach(() => {
  //     jest.clearAllMocks();
  //   });

  //   it("should successfully logout a user", async () => {
  //     const userId = "1";
  //     const refreshToken = "mockRefreshToken";

  //     (RefreshTokenService.deleteAllTokens as jest.Mock).mockResolvedValue(
  //       undefined
  //     );

  //     await expect(
  //       AuthService.logoutUser({ refreshToken, userId })
  //     ).resolves.toBeUndefined();

  //     expect(RefreshTokenService.deleteAllTokens).toHaveBeenCalledWith(userId);
  //   });

  //   it("should throw a UnauthorizedError when the refreshToken is null or undefined", async () => {
  //     const userId = "1";
  //     const refreshToken = "";

  //     await expect(
  //       AuthService.logoutUser({ refreshToken, userId })
  //     ).rejects.toThrow(new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED));

  //     expect(RefreshTokenService.deleteAllTokens).not.toHaveBeenCalled();
  //   });

  //   it("should throw a UnauthorizedError when the userId is not exists", async () => {
  //     const userId = "";
  //     const refreshToken = "mockRefreshToken";

  //     await expect(
  //       AuthService.logoutUser({ refreshToken, userId })
  //     ).rejects.toThrow(new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED));

  //     expect(RefreshTokenService.deleteAllTokens).not.toHaveBeenCalled();
  //   });
  // });

  // describe("RefreshToken method test", () => {
  //   const mockPayload: JwtPayload = {
  //     userId: "1",
  //     exp: Date.now() + 1000,
  //     iat: Date.now(),
  //   };

  //   const mockToken = "mockToken";
  //   const mockUserId = "1";

  //   const mockRefreshTokenFromDB: RefreshTokenEntry = {
  //     id: "12",
  //     userId: "1",
  //     token: "mockToken",
  //     createdAt: new Date(),
  //   };

  //   const mockReturnedTokens = {
  //     accessToken: "mockAccessToken",
  //     refreshToken: "mockRefreshToken",
  //   };

  //   beforeEach(() => {
  //     jest.clearAllMocks();
  //   });

  //   it("should successfully refresh the token", async () => {
  //     jest.spyOn(AuthService, "verifyToken").mockResolvedValue(mockPayload);

  //     (RefreshTokenService.findToken as jest.Mock).mockResolvedValue(
  //       mockRefreshTokenFromDB
  //     );

  //     (RefreshTokenService.deleteToken as jest.Mock).mockResolvedValue(
  //       undefined
  //     );

  //     jest
  //       .spyOn(AuthService, "createJwtTokens")
  //       .mockReturnValue(mockReturnedTokens);

  //     const result = await AuthService.refreshToken({
  //       token: mockToken,
  //       userId: mockUserId,
  //     });

  //     expect(result).toEqual(mockReturnedTokens);

  //     expect(AuthService.verifyToken).toHaveBeenCalledWith({
  //       token: mockToken,
  //       secret: REFRESH_TOKEN_SECRET,
  //     });

  //     expect(RefreshTokenService.findToken).toHaveBeenCalledWith(mockToken);

  //     expect(RefreshTokenService.deleteToken).toHaveBeenCalledWith(mockToken);

  //     expect(AuthService.createJwtTokens).toHaveBeenCalledWith(
  //       mockPayload.userId
  //     );
  //   });

  //   it("should throw a ForbiddenError if the token is invalid or expired", async () => {
  //     jest.spyOn(AuthService, "verifyToken").mockResolvedValue(null);

  //     await expect(
  //       AuthService.refreshToken({ token: mockToken, userId: mockUserId })
  //     ).rejects.toThrow(new ForbiddenError(ERROR_MESSAGES.FORBIDDEN));

  //     expect(AuthService.verifyToken).toHaveBeenCalledWith({
  //       token: mockToken,
  //       secret: REFRESH_TOKEN_SECRET,
  //     });

  //     expect(RefreshTokenService.deleteAllTokens).toHaveBeenCalledWith(
  //       mockUserId
  //     );

  //     expect(RefreshTokenService.findToken).not.toHaveBeenCalled();
  //     expect(RefreshTokenService.deleteToken).not.toHaveBeenCalled();
  //     expect(AuthService.createJwtTokens).not.toHaveBeenCalled();
  //   });

  //   it("should throw a UnauthorizedError if the userId in the token is not the same as the userId in the request", async () => {
  //     jest.spyOn(AuthService, "verifyToken").mockResolvedValue({
  //       ...mockPayload,
  //       userId: "2",
  //     });

  //     await expect(
  //       AuthService.refreshToken({ token: mockToken, userId: mockUserId })
  //     ).rejects.toThrow(new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED));

  //     expect(AuthService.verifyToken).toHaveBeenCalledWith({
  //       token: mockToken,
  //       secret: REFRESH_TOKEN_SECRET,
  //     });

  //     expect(RefreshTokenService.deleteAllTokens).not.toHaveBeenCalled();
  //     expect(RefreshTokenService.findToken).not.toHaveBeenCalled();
  //     expect(RefreshTokenService.deleteToken).not.toHaveBeenCalled();
  //     expect(AuthService.createJwtTokens).not.toHaveBeenCalled();
  //   });

  //   it("should throw a ForbiddenError if the token is not found in the database (token reuses)", async () => {
  //     jest.spyOn(AuthService, "verifyToken").mockResolvedValue(mockPayload);

  //     (RefreshTokenService.findToken as jest.Mock).mockResolvedValue(null);

  //     await expect(
  //       AuthService.refreshToken({ token: mockToken, userId: mockUserId })
  //     ).rejects.toThrow(new ForbiddenError(ERROR_MESSAGES.FORBIDDEN));

  //     expect(AuthService.verifyToken).toHaveBeenCalledWith({
  //       token: mockToken,
  //       secret: REFRESH_TOKEN_SECRET,
  //     });

  //     expect(RefreshTokenService.findToken).toHaveBeenCalledWith(mockToken);

  //     expect(RefreshTokenService.deleteAllTokens).toHaveBeenCalledWith(
  //       mockUserId
  //     );

  //     expect(RefreshTokenService.deleteToken).not.toHaveBeenCalled();
  //     expect(AuthService.createJwtTokens).not.toHaveBeenCalled();
  //   });
  // });

  // describe("GoogleLogin method tests", () => {
  //   const mockGoogleUser: GoogleUser = {
  //     sub: "1",
  //     email: "",
  //     email_verified: true,
  //     name: "testuser",
  //     picture: "testuser.jpg",
  //     given_name: "test",
  //     family_name: "user",
  //   };

  //   const mockCreatedUser: UserEntry = {
  //     id: "1",
  //     email: mockGoogleUser.email,
  //     username: mockGoogleUser.name,
  //     password: mockGoogleUser.sub,
  //     isEmailVerified: mockGoogleUser.email_verified,
  //     googleId: mockGoogleUser.sub,
  //     profilePicture: mockGoogleUser.picture,
  //     createdAt: new Date(),
  //     updatedAt: new Date(),
  //     videoIds: [],
  //   };

  //   const mockTokens = {
  //     accessToken: "mockAccessToken",
  //     refreshToken: "mockRefreshToken",
  //   };

  //   beforeEach(() => {
  //     jest.clearAllMocks();
  //   });

  //   it("should successfully login a user with google", async () => {
  //     (mockUserDB.findByEmail as jest.Mock).mockResolvedValue(null);
  //     (mockUserDB.create as jest.Mock).mockResolvedValue(mockCreatedUser);

  //     jest.spyOn(AuthService, "createJwtTokens").mockReturnValue(mockTokens);

  //     const result = await AuthService.googleLogin(mockGoogleUser);

  //     expect(result).toEqual(mockTokens);

  //     expect(mockUserDB.findByEmail).toHaveBeenCalledWith(mockGoogleUser.email);
  //     expect(mockUserDB.create).toHaveBeenCalledWith({
  //       email: mockGoogleUser.email,
  //       username: mockGoogleUser.name,
  //       password: mockGoogleUser.sub,
  //       isEmailVerified: mockGoogleUser.email_verified,
  //       googleId: mockGoogleUser.sub,
  //       profilePicture: mockGoogleUser.picture,
  //     });
  //     expect(AuthService.createJwtTokens).toHaveBeenCalledWith(
  //       mockCreatedUser.id
  //     );
  //     expect(RefreshTokenService.createToken).toHaveBeenCalledWith(
  //       mockCreatedUser.id,
  //       mockTokens.refreshToken
  //     );
  //   });

  //   it("should successfully login a user with google and update the googleId", async () => {
  //     (mockUserDB.findByEmail as jest.Mock).mockResolvedValue({
  //       ...mockCreatedUser,
  //       googleId: "",
  //     });

  //     (mockUserDB.updateUser as jest.Mock).mockResolvedValue(mockCreatedUser);

  //     jest.spyOn(AuthService, "createJwtTokens").mockReturnValue(mockTokens);

  //     const result = await AuthService.googleLogin(mockGoogleUser);

  //     expect(result).toEqual(mockTokens);

  //     expect(mockUserDB.findByEmail).toHaveBeenCalledWith(mockGoogleUser.email);
  //     expect(mockUserDB.updateUser).toHaveBeenCalledWith(mockCreatedUser.id, {
  //       googleId: mockGoogleUser.sub,
  //     });
  //     expect(AuthService.createJwtTokens).toHaveBeenCalledWith(
  //       mockCreatedUser.id
  //     );
  //     expect(RefreshTokenService.createToken).toHaveBeenCalledWith(
  //       mockCreatedUser.id,
  //       mockTokens.refreshToken
  //     );
  //   });

  //   it("should throw a UnauthorizedError if the email is not verified", async () => {
  //     const unverifiedGoogleUser = {
  //       ...mockGoogleUser,
  //       email_verified: false,
  //     };

  //     await expect(
  //       AuthService.googleLogin(unverifiedGoogleUser)
  //     ).rejects.toThrow(
  //       new UnauthorizedError(ERROR_MESSAGES.EMAIL_NOT_VERIFIED)
  //     );

  //     expect(mockUserDB.findByEmail).not.toHaveBeenCalled();
  //     expect(mockUserDB.create).not.toHaveBeenCalled();
  //     expect(mockUserDB.updateUser).not.toHaveBeenCalled();
  //     expect(AuthService.createJwtTokens).not.toHaveBeenCalled();
  //     expect(RefreshTokenService.createToken).not.toHaveBeenCalled();
  //   });
  // });

  // describe("VerifyEmail method tests", () => {
  //   beforeEach(() => {
  //     jest.clearAllMocks();
  //   });

  //   const mockUserId = "1";

  //   const mockUser = {
  //     id: "1",
  //     email: "test@example.com",
  //     password: "hashedPassword",
  //     isEmailVerified: false,
  //   };

  //   it("should successfully verify the email", async () => {
  //     (UserService.getUserById as jest.Mock).mockResolvedValue(mockUser);

  //     await expect(
  //       AuthService.verifyEmail(mockUserId)
  //     ).resolves.toBeUndefined();

  //     expect(UserService.verifyUserEmail).toHaveBeenCalledWith(mockUserId);
  //   });

  //   it("should throw a ForbiddenError if the email is already verified", async () => {
  //     (UserService.getUserById as jest.Mock).mockResolvedValue({
  //       ...mockUser,
  //       isEmailVerified: true,
  //     });

  //     await expect(AuthService.verifyEmail(mockUserId)).rejects.toThrow(
  //       new ForbiddenError(ERROR_MESSAGES.EMAIL_ALREADY_VERIFIED)
  //     );

  //     expect(UserService.verifyUserEmail).not.toHaveBeenCalled();
  //   });
  // });
});
