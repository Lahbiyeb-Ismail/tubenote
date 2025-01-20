import type { Response } from "express";
import httpStatus from "http-status";

import { clearRefreshTokenCookieConfig } from "../../src/config/cookie.config";

import { REFRESH_TOKEN_NAME } from "../../src/constants/auth.contants";

import { AuthController } from "../../src/modules/auth/auth.controller";
import type {
  IAuthController,
  IAuthService,
} from "../../src/modules/auth/auth.types";

import type { TypedRequest } from "../../src/types";

describe("AuthController integration tests", () => {
  let authController: IAuthController;
  let mockAuthService: IAuthService;

  beforeEach(() => {
    mockAuthService = {
      logoutUser: jest.fn(),
    };

    authController = new AuthController(mockAuthService);
  });

  beforeAll(() => {
    jest.clearAllMocks();
  });

  // describe("AuthController - register", () => {
  //   let mockRequest: Partial<TypedRequest<RegisterUserDto>>;
  //   let mockResponse: Partial<Response>;
  //   let mockJson: jest.Mock;
  //   let mockStatus: jest.Mock;

  //   const mockUser: User = {
  //     id: "user_id_001",
  //     username: "testuser",
  //     email: "testuser@example.com",
  //     password: "password123",
  //     isEmailVerified: false,
  //     createdAt: new Date(),
  //     updatedAt: new Date(),
  //   };

  //   const mockRegisterCredentials: RegisterUserDto = {
  //     username: "testuser",
  //     email: "testuser@example.com",
  //     password: "password123",
  //   };

  //   beforeEach(() => {
  //     mockJson = jest.fn();
  //     mockStatus = jest.fn().mockReturnValue({ json: mockJson });
  //     mockResponse = {
  //       status: mockStatus,
  //       json: mockJson,
  //     };
  //     mockRequest = {
  //       body: mockRegisterCredentials,
  //     };
  //     jest.clearAllMocks();
  //   });

  //   it("should successfully register a new user", async () => {
  //     (mockAuthService.registerUser as jest.Mock).mockResolvedValue(mockUser);

  //     await authController.register(
  //       mockRequest as TypedRequest<RegisterUserDto>,
  //       mockResponse as Response
  //     );

  //     expect(mockAuthService.registerUser).toHaveBeenCalledWith(
  //       mockRegisterCredentials
  //     );

  //     expect(mockResponse.status).toHaveBeenCalledWith(httpStatus.CREATED);
  //     expect(mockResponse.json).toHaveBeenCalledWith({
  //       message: "A verification email has been sent to your email.",
  //       email: mockUser.email,
  //     });
  //   });

  //   it("should handle mockAuthService errors", async () => {
  //     const errorMessage = "Registration failed";

  //     (mockAuthService.registerUser as jest.Mock).mockRejectedValue(
  //       new Error(errorMessage)
  //     );

  //     await expect(
  //       authController.register(
  //         mockRequest as TypedRequest<RegisterUserDto>,
  //         mockResponse as Response
  //       )
  //     ).rejects.toThrow(errorMessage);
  //   });
  // });

  // describe("AuthController - login", () => {
  //   let mockRequest: Partial<TypedRequest<LoginUserDto>>;
  //   let mockResponse: Partial<Response>;
  //   let mockJson: jest.Mock;
  //   let mockStatus: jest.Mock;
  //   let mockCookie: jest.Mock;

  //   const mockLoginCredentials: LoginUserDto = {
  //     email: "testuser@example.com",
  //     password: "password123",
  //   };

  //   beforeEach(() => {
  //     mockJson = jest.fn();
  //     mockStatus = jest.fn().mockReturnValue({ json: mockJson });
  //     mockCookie = jest.fn();
  //     mockResponse = {
  //       status: mockStatus,
  //       cookie: mockCookie,
  //       json: mockJson,
  //     };
  //     mockRequest = {
  //       body: mockLoginCredentials,
  //     };
  //   });

  //   afterEach(() => {
  //     jest.clearAllMocks();
  //   });

  //   it("should successfully log in a user", async () => {
  //     const mockTokens = {
  //       accessToken: "mock-access-token",
  //       refreshToken: "mock-refresh-token",
  //     };

  //     (mockAuthService.loginUser as jest.Mock).mockResolvedValue(mockTokens);

  //     await authController.login(
  //       mockRequest as TypedRequest<LoginUserDto>,
  //       mockResponse as Response
  //     );

  //     expect(mockAuthService.loginUser).toHaveBeenCalledWith(
  //       mockLoginCredentials
  //     );

  //     expect(mockResponse.cookie).toHaveBeenCalledWith(
  //       REFRESH_TOKEN_NAME,
  //       "mock-refresh-token",
  //       refreshTokenCookieConfig
  //     );

  //     expect(mockResponse.status).toHaveBeenCalledWith(httpStatus.OK);
  //     expect(mockResponse.json).toHaveBeenCalledWith({
  //       message: "Login successful",
  //       accessToken: "mock-access-token",
  //     });
  //   });

  //   it("should handle mockAuthService errors", async () => {
  //     const errorMessage = "Invalid credentials";
  //     (mockAuthService.loginUser as jest.Mock).mockRejectedValue(
  //       new Error(errorMessage)
  //     );

  //     await expect(
  //       authController.login(
  //         mockRequest as TypedRequest<LoginUserDto>,
  //         mockResponse as Response
  //       )
  //     ).rejects.toThrow(errorMessage);
  //   });
  // });

  describe("AuthController - logout", () => {
    let mockRequest: Partial<TypedRequest>;
    let mockResponse: Partial<Response>;
    let mockClearCookie: jest.Mock;
    let mockSendStatus: jest.Mock;

    beforeEach(() => {
      mockClearCookie = jest.fn();
      mockSendStatus = jest.fn();
      mockResponse = {
        clearCookie: mockClearCookie,
        sendStatus: mockSendStatus,
      };
      mockRequest = {
        cookies: {
          [REFRESH_TOKEN_NAME]: "mock-refresh-token",
        },
        userId: "mock-user-id",
      };
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should successfully log out a user", async () => {
      (mockAuthService.logoutUser as jest.Mock).mockResolvedValue(undefined);

      await authController.logout(
        mockRequest as TypedRequest,
        mockResponse as Response
      );

      expect(mockAuthService.logoutUser).toHaveBeenCalledWith({
        refreshToken: "mock-refresh-token",
        userId: "mock-user-id",
      });
      expect(mockResponse.clearCookie).toHaveBeenCalledWith(
        REFRESH_TOKEN_NAME,
        clearRefreshTokenCookieConfig
      );
      expect(mockResponse.sendStatus).toHaveBeenCalledWith(
        httpStatus.NO_CONTENT
      );
    });

    it("should handle missing refresh token", async () => {
      mockRequest.cookies = {};

      await authController.logout(
        mockRequest as TypedRequest,
        mockResponse as Response
      );

      expect(mockAuthService.logoutUser).toHaveBeenCalledWith({
        refreshToken: undefined,
        userId: "mock-user-id",
      });
      expect(mockResponse.clearCookie).toHaveBeenCalledWith(
        REFRESH_TOKEN_NAME,
        clearRefreshTokenCookieConfig
      );
      expect(mockResponse.sendStatus).toHaveBeenCalledWith(
        httpStatus.NO_CONTENT
      );
    });

    it("should handle mockAuthService errors", async () => {
      const errorMessage = "Logout failed";
      (mockAuthService.logoutUser as jest.Mock).mockRejectedValue(
        new Error(errorMessage)
      );

      await expect(
        authController.logout(
          mockRequest as TypedRequest,
          mockResponse as Response
        )
      ).rejects.toThrow(errorMessage);
    });
  });

  // describe("AuthController - refresh", () => {
  //   let mockRequest: Partial<TypedRequest>;
  //   let mockResponse: Partial<Response>;
  //   let mockClearCookie: jest.Mock;
  //   let mockCookie: jest.Mock;
  //   let mockJson: jest.Mock;
  //   let mockStatus: jest.Mock;

  //   const mockTokens = {
  //     accessToken: "mock-access-token",
  //     refreshToken: "mock-refresh-token",
  //   };

  //   beforeEach(() => {
  //     mockClearCookie = jest.fn();
  //     mockCookie = jest.fn();
  //     mockJson = jest.fn();
  //     mockStatus = jest.fn().mockReturnValue({ json: mockJson });
  //     mockResponse = {
  //       clearCookie: mockClearCookie,
  //       cookie: mockCookie,
  //       status: mockStatus,
  //       json: mockJson,
  //     };
  //     mockRequest = {
  //       cookies: {
  //         [REFRESH_TOKEN_NAME]: "mock-refresh-token",
  //       },
  //       userId: "mock-user-id",
  //     };
  //   });

  //   afterEach(() => {
  //     jest.clearAllMocks();
  //   });

  //   it("should successfully refresh the access token", async () => {
  //     (mockAuthService.refreshToken as jest.Mock).mockResolvedValue(mockTokens);

  //     await authController.refresh(
  //       mockRequest as TypedRequest,
  //       mockResponse as Response
  //     );

  //     expect(mockAuthService.refreshToken).toHaveBeenCalledWith({
  //       token: "mock-refresh-token",
  //       userId: "mock-user-id",
  //     });

  //     expect(mockResponse.clearCookie).toHaveBeenCalledWith(
  //       REFRESH_TOKEN_NAME,
  //       clearRefreshTokenCookieConfig
  //     );

  //     expect(mockResponse.cookie).toHaveBeenCalledWith(
  //       REFRESH_TOKEN_NAME,
  //       "mock-refresh-token",
  //       refreshTokenCookieConfig
  //     );

  //     expect(mockResponse.status).toHaveBeenCalledWith(httpStatus.OK);
  //     expect(mockResponse.json).toHaveBeenCalledWith({
  //       accessToken: "mock-access-token",
  //     });
  //   });

  //   it("should handle missing refresh token", async () => {
  //     mockRequest.cookies = {};

  //     await expect(
  //       authController.refresh(
  //         mockRequest as TypedRequest,
  //         mockResponse as Response
  //       )
  //     ).rejects.toThrow(new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED));

  //     expect(mockResponse.clearCookie).not.toHaveBeenCalled();
  //     expect(mockResponse.cookie).not.toHaveBeenCalled();
  //     expect(mockResponse.status).not.toHaveBeenCalled();
  //     expect(mockResponse.json).not.toHaveBeenCalled();
  //   });

  //   it("should handle mockAuthService errors", async () => {
  //     const errorMessage = "Refresh token failed";
  //     (mockAuthService.refreshToken as jest.Mock).mockRejectedValue(
  //       new Error(errorMessage)
  //     );

  //     await expect(
  //       authController.refresh(
  //         mockRequest as TypedRequest,
  //         mockResponse as Response
  //       )
  //     ).rejects.toThrow(errorMessage);

  //     expect(mockResponse.clearCookie).toHaveBeenCalledWith(
  //       REFRESH_TOKEN_NAME,
  //       clearRefreshTokenCookieConfig
  //     );
  //   });
  // });

  // describe("AuthController - loginWithGoogle", () => {
  //   let mockRequest: Partial<TypedRequest>;
  //   let mockResponse: Partial<Response>;
  //   let mockCookie: jest.Mock;
  //   let mockRedirect: jest.Mock;

  //   const mockTokens = {
  //     accessToken: "mock-access-token",
  //     refreshToken: "mock-refresh-token",
  //   };

  //   const mockUser: User = {
  //     id: "user_id_001",
  //     email: "testuser@example.com",
  //     username: "Test User",
  //     password: "",
  //     profilePicture: "http://example.com/picture.jpg",
  //     isEmailVerified: true,
  //     createdAt: new Date(),
  //     updatedAt: new Date(),
  //   };

  //   beforeEach(() => {
  //     mockCookie = jest.fn();
  //     mockRedirect = jest.fn();
  //     mockResponse = {
  //       cookie: mockCookie,
  //       redirect: mockRedirect,
  //     };
  //     mockRequest = {
  //       user: mockUser as User,
  //     };
  //     jest.clearAllMocks();
  //   });

  //   it("should successfully log in a user with Google", async () => {
  //     (mockAuthService.googleLogin as jest.Mock).mockResolvedValue(mockTokens);

  //     await authController.loginWithGoogle(
  //       mockRequest as TypedRequest,
  //       mockResponse as Response
  //     );

  //     expect(mockAuthService.googleLogin).toHaveBeenCalledWith(mockUser);

  //     expect(mockCookie).toHaveBeenCalledWith(
  //       REFRESH_TOKEN_NAME,
  //       "mock-refresh-token",
  //       refreshTokenCookieConfig
  //     );

  //     expect(mockRedirect).toHaveBeenCalledWith(
  //       `${envConfig.client.url}/auth/callback?access_token=${encodeURIComponent(
  //         JSON.stringify(mockTokens.accessToken)
  //       )}`
  //     );
  //   });

  //   it("should handle mockAuthService errors", async () => {
  //     const errorMessage = "Google login failed";
  //     (mockAuthService.googleLogin as jest.Mock).mockRejectedValue(
  //       new Error(errorMessage)
  //     );

  //     await expect(
  //       authController.loginWithGoogle(
  //         mockRequest as TypedRequest,
  //         mockResponse as Response
  //       )
  //     ).rejects.toThrow(errorMessage);

  //     expect(mockCookie).not.toHaveBeenCalled();
  //     expect(mockRedirect).not.toHaveBeenCalled();
  //   });
  // });
});
