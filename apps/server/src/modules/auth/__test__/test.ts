import { Response } from "express";

import type { TypedRequest } from "@/modules/shared/types";

import { REFRESH_TOKEN_NAME } from "@/modules/auth";

import { AuthController, IAuthService } from "@/modules/auth";
import { UnauthorizedError } from "@/modules/shared/api-errors";
import { mock, mockReset } from "jest-mock-extended";

describe("AuthController", () => {
  const mockAuthService = mock<IAuthService>();

  const authController = AuthController.getInstance({
    authService: mockAuthService,
  });

  const req = mock<TypedRequest>();

  const res = mock<Response>();

  const MOCK_USER_ID = "user-id-123";
  const MOCK_REFRESH_TOKEN_VALUE = "refresh-token-123";

  beforeEach(() => {
    mockReset(mockAuthService);

    req.cookies = {
      [REFRESH_TOKEN_NAME]: MOCK_REFRESH_TOKEN_VALUE,
    };

    req.userId = MOCK_USER_ID;

    res.status.mockReturnThis();
    res.json.mockReturnThis();
    res.cookie.mockReturnThis();
    res.clearCookie.mockReturnThis();
    res.sendStatus.mockReturnThis();

    jest.clearAllMocks();
  });

  describe("AuthController - logout", () => {
    it("should throw an UnauthorizedError if the refreshToken is missing", async () => {
      req.cookies = {};

      await expect(authController.logout(req, res)).rejects.toThrow(
        UnauthorizedError
      );

      expect(mockAuthService.logoutUser).not.toHaveBeenCalled();

      expect(res.clearCookie).not.toHaveBeenCalled();
    });
  });
});
