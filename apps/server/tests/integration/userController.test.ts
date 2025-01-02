import type { Response } from "express";
import type { UserEntry } from "../../src/modules/user/user.type";
import type { TypedRequest } from "../../src/types";

import UserService from "../../src/modules/user/userService";

import httpStatus from "http-status";
import UserController from "../../src/modules/user/userController";

jest.mock("../../src/modules/user/userService");

describe("UserController integration tests", () => {
  beforeAll(() => {
    jest.clearAllMocks();
  });

  describe("AuthController - getCurrentUser", () => {
    let mockRequest: Partial<TypedRequest>;
    let mockResponse: Partial<Response>;
    let mockStatus: jest.Mock;
    let mockJson: jest.Mock;

    const mockUserId = "user_id_001";

    const mockUser: UserEntry = {
      id: mockUserId,
      username: "test_user",
      email: "testuser@example.com",
      profilePicture: "",
      isEmailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      password: "hashedPassword",
      videoIds: [],
    };

    beforeEach(() => {
      mockJson = jest.fn();
      mockStatus = jest.fn().mockReturnValue({ json: mockJson });
      mockResponse = {
        status: mockStatus,
        json: mockJson,
      };
      mockRequest = {
        userId: mockUserId,
      };
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should send the current user's information", async () => {
      (UserService.getUserById as jest.Mock).mockResolvedValue(mockUser);

      await UserController.getCurrentUser(
        mockRequest as TypedRequest,
        mockResponse as Response
      );

      expect(UserService.getUserById).toHaveBeenCalledWith(mockUserId);

      expect(mockResponse.status).toHaveBeenCalledWith(httpStatus.OK);

      expect(mockResponse.json).toHaveBeenCalledWith({
        user: {
          id: mockUser.id,
          username: mockUser.username,
          email: mockUser.email,
          profilePicture: mockUser.profilePicture,
          isEmailVerified: mockUser.isEmailVerified,
          createdAt: mockUser.createdAt,
          updatedAt: mockUser.updatedAt,
        },
      });
    });

    it("should handle Userservice errors", async () => {
      const errorMessage = "Error fetching user data";
      (UserService.getUserById as jest.Mock).mockRejectedValue(
        new Error(errorMessage)
      );

      await expect(
        UserController.getCurrentUser(
          mockRequest as TypedRequest,
          mockResponse as Response
        )
      ).rejects.toThrow(errorMessage);
    });
  });
});
