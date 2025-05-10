import { mock } from "jest-mock-extended";

import type { User } from "@tubenote/types";

import { REFRESH_TOKEN_EXPIRES_IN } from "@/modules/auth/constants";

import type { IJwtService } from "@/modules/auth/utils";
import { BadRequestError } from "@/modules/shared/api-errors";
import type {
  ICacheService,
  ICryptoService,
  ILoggerService,
  IPrismaService,
} from "@/modules/shared/services";
import { stringToDate } from "@/modules/shared/utils";

import type { IUserService } from "@/modules/user";
import type { Account } from "@/modules/user/features/account/account.model";
import type { IAccountService } from "@/modules/user/features/account/account.types";

import type { IRefreshTokenService, RefreshToken } from "../../refresh-token";
import type { IOauthLoginDto } from "../dtos";

import { OAuthService } from "../oauth.service";
import type { IOAuthServiceOptions } from "../oauth.types";

jest.mock("@/modules/shared/utils", () => ({
  ...jest.requireActual("@/modules/shared/utils"),
  stringToDate: jest.fn(),
}));

describe("OAuthService", () => {
  let oauthService: OAuthService;

  const prismaService = mock<IPrismaService>();
  const userService = mock<IUserService>();
  const accountService = mock<IAccountService>();
  const refreshTokenService = mock<IRefreshTokenService>();
  const jwtService = mock<IJwtService>();
  const cryptoService = mock<ICryptoService>();
  const cacheService = mock<ICacheService>();
  const loggerService = mock<ILoggerService>();

  const serviceOptions: IOAuthServiceOptions = {
    prismaService,
    userService,
    accountService,
    refreshTokenService,
    jwtService,
    cryptoService,
    cacheService,
    loggerService,
  };

  const mockExistingUserId = "existing_user_id";
  const mockToken = "test-refresh-token";
  const mockTokenId = "token-id-001";
  const expiresIn = stringToDate(REFRESH_TOKEN_EXPIRES_IN);

  const mockExistingUser: User = {
    id: mockExistingUserId,
    email: "test@example.com",
    username: "Test User",
    password: "hashed-password",
    isEmailVerified: true,
    profilePicture: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockNewUser: User = {
    id: "new_user_id",
    email: "newuser@example.com",
    username: "New User",
    password: "new-hashed-password",
    isEmailVerified: false,
    profilePicture: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockAccount: Account = {
    id: "account-id-001",
    userId: mockExistingUserId,
    provider: "google",
    providerAccountId: "provider-id-123",
    type: "oauth",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRefreshToken: RefreshToken = {
    id: mockTokenId,
    userId: mockExistingUserId,
    token: mockToken,
    createdAt: new Date(Date.now()),
    expiresAt: expiresIn,
  };

  beforeEach(() => {
    const tx = jest.fn(); // Corrected to jest.fn() for mock implementation.
    // Set up mocks for all dependencies.
    prismaService.transaction.mockImplementation(async (callback) => {
      // Provide a fake transaction object.
      return callback(tx as any);
    });

    userService.createUserWithAccount.mockResolvedValue(mockExistingUser);

    refreshTokenService.createToken.mockResolvedValue(mockRefreshToken);

    jwtService.generateAuthTokens.mockReturnValue({
      accessToken: "access-token",
      refreshToken: "refresh-token",
    });

    cryptoService.generateRandomSecureToken.mockReturnValue(
      "temporary-oauth-code"
    );

    cacheService.set.mockReturnValue(true);
    cacheService.del.mockReturnValue(1);

    // Reset singleton instance for isolation.
    // @ts-ignore: resetting private static property for testing purposes.
    OAuthService._instance = undefined;

    // Create an instance of OAuthService using the mocks.
    oauthService = OAuthService.getInstance(serviceOptions);
  });

  describe("Singleton Behavior", () => {
    it("should create a new instance if none exists", () => {
      const instance = OAuthService.getInstance({
        prismaService,
        userService,
        accountService,
        refreshTokenService,
        jwtService,
        cryptoService,
        cacheService,
        loggerService,
      });
      expect(instance).toBeInstanceOf(OAuthService);
    });

    it("should return the same instance on subsequent calls", () => {
      const instance1 = OAuthService.getInstance({
        prismaService,
        userService,
        accountService,
        refreshTokenService,
        jwtService,
        cryptoService,
        cacheService,
        loggerService,
      });
      const instance2 = OAuthService.getInstance({
        prismaService,
        userService,
        accountService,
        refreshTokenService,
        jwtService,
        cryptoService,
        cacheService,
        loggerService,
      });
      expect(instance1).toBe(instance2);
    });
  });

  describe("generateTemporaryOAuthCode", () => {
    it("should generate a temporary OAuth code, set it in cache, and log relevant info", async () => {
      const payload = {
        accessToken: "access-token",
        refreshToken: "refresh-token",
        userId: "user123",
      };

      const code = await oauthService.generateTemporaryOAuthCode(payload);

      expect(cryptoService.generateRandomSecureToken).toHaveBeenCalled();
      expect(cacheService.set).toHaveBeenCalledWith(
        "temporary-oauth-code",
        payload
      );
      expect(loggerService.info).toHaveBeenCalledWith(
        expect.stringContaining("Code temporary-oauth-code set in cache: true")
      );

      expect(code).toBe("temporary-oauth-code");
    });
  });

  describe("handleOAuthLogin", () => {
    const oauthLoginDtoExisting: IOauthLoginDto = {
      createAccountDto: {
        provider: "google",
        providerAccountId: "provider-id-123",
        type: "oauth",
      },
      createUserDto: {
        email: "existing@example.com",
        isEmailVerified: true,
        password: "userPassword12!",
        username: "test_name",
        profilePicture: "https://example.com/profile.jpg",
      },
    };

    const oauthLoginDtoNew: IOauthLoginDto = {
      createAccountDto: {
        provider: "google",
        providerAccountId: "provider-id-new",
        type: "oauth",
      },
      createUserDto: {
        email: "new@example.com",
        isEmailVerified: true,
        password: "newUserPassword12!",
        username: "new_user",
        profilePicture: "https://example.com/new_profile.jpg",
      },
    };

    it("should handle OAuth login for an existing account and return tokens and temporary code", async () => {
      // Arrange: simulate an existing account.
      accountService.findAccountByProvider.mockResolvedValue(mockAccount);

      // Act
      const result = await oauthService.handleOAuthLogin(
        oauthLoginDtoExisting.createUserDto,
        oauthLoginDtoExisting.createAccountDto
      );

      // Assert
      expect(accountService.findAccountByProvider).toHaveBeenCalledWith(
        "google",
        "provider-id-123"
      );
      expect(loggerService.info).toHaveBeenCalledWith(
        expect.stringContaining(
          `User with ID ${mockExistingUserId} logged in with google.`
        )
      );
      expect(jwtService.generateAuthTokens).toHaveBeenCalledWith(
        mockExistingUserId
      );
      expect(refreshTokenService.createToken).toHaveBeenCalledWith(
        mockExistingUserId,
        {
          token: "refresh-token",
          expiresAt: stringToDate(REFRESH_TOKEN_EXPIRES_IN),
        }
      );
      expect(result).toEqual("temporary-oauth-code");
    });

    it("should handle OAuth signup when no existing account is found and return tokens and temporary code", async () => {
      // Arrange: simulate no existing account.
      accountService.findAccountByProvider.mockResolvedValue(null);
      userService.createUserWithAccount.mockResolvedValue(mockNewUser);

      // Act
      const result = await oauthService.handleOAuthLogin(
        oauthLoginDtoNew.createUserDto,
        oauthLoginDtoNew.createAccountDto
      );

      // Assert
      expect(accountService.findAccountByProvider).toHaveBeenCalledWith(
        "google",
        "provider-id-new"
      );
      expect(userService.createUserWithAccount).toHaveBeenCalled();

      expect(jwtService.generateAuthTokens).toHaveBeenCalledWith(
        mockNewUser.id
      );

      expect(refreshTokenService.createToken).toHaveBeenCalledWith(
        mockNewUser.id,
        {
          token: "refresh-token",
          expiresAt: stringToDate(REFRESH_TOKEN_EXPIRES_IN),
        }
      );

      expect(result).toEqual("temporary-oauth-code");
    });

    it("should propagate errors thrown during the transaction", async () => {
      // Arrange: simulate an error in the transaction callback.
      prismaService.transaction.mockRejectedValueOnce(
        new Error("Transaction failed")
      );

      // Act & Assert
      await expect(
        oauthService.handleOAuthLogin(
          oauthLoginDtoExisting.createUserDto,
          oauthLoginDtoExisting.createAccountDto
        )
      ).rejects.toThrow("Transaction failed");
    });
  });

  describe("exchangeOauthCodeForTokens", () => {
    it("should exchange a valid OAuth code for tokens and delete the code from cache", async () => {
      // Arrange: simulate valid code data present in cache.
      const code = "valid-code";

      cacheService.get.mockReturnValue({
        accessToken: "access-token",
        refreshToken: "refresh-token",
        userId: mockExistingUserId,
      });

      // Act
      const result = await oauthService.exchangeOauthCodeForTokens(code);

      // Assert
      expect(cacheService.get).toHaveBeenCalledWith(code);
      expect(loggerService.info).toHaveBeenCalledWith(
        expect.stringContaining("Retrieved codeData:")
      );
      expect(cacheService.del).toHaveBeenCalledWith(code);
      expect(loggerService.warn).toHaveBeenCalledWith(
        expect.stringContaining("Deleted 1 items from cache")
      );
      expect(result).toEqual({
        accessToken: "access-token",
        refreshToken: "refresh-token",
      });
    });

    it("should throw a BadRequestError if the OAuth code is not found in cache", async () => {
      // Arrange: simulate missing code data.
      const code = "invalid-code";
      cacheService.get.mockReturnValue(null);

      // Act & Assert
      await expect(
        oauthService.exchangeOauthCodeForTokens(code)
      ).rejects.toThrow(BadRequestError);
      expect(loggerService.error).toHaveBeenCalledWith(
        expect.stringContaining(`Code ${code} not found in cache`)
      );
    });
  });
});
