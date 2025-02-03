import type { Response } from "express";
import httpStatus from "http-status";

import type { TypedRequest } from "@/types";

import {
  type IUserController,
  type IUserService,
  type UpdatePasswordDto,
  type UpdateUserDto,
  type User,
  UserController,
} from "@/modules/user";

describe("userController integration tests", () => {
  let userController: IUserController;
  let mockUserService: IUserService;

  let mockRequest: Partial<TypedRequest>;
  let mockResponse: Partial<Response>;
  let mockStatus: jest.Mock;
  let mockJson: jest.Mock;

  beforeEach(() => {
    mockUserService = {
      createUser: jest.fn(),
      getUser: jest.fn(),
      getOrCreateUser: jest.fn(),
      updateUser: jest.fn(),
      updatePassword: jest.fn(),
      resetPassword: jest.fn(),
      verifyUserEmail: jest.fn(),
    };

    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });

    mockResponse = {
      status: mockStatus,
      json: mockJson,
    };

    mockRequest = {
      userId: mockUserId,
    };

    userController = new UserController(mockUserService);
  });

  const mockUserId = "user_id_001";

  const mockUser: User = {
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

  beforeAll(() => {
    jest.clearAllMocks();
  });

  describe("AuthController - getCurrentUser", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should send the current user's information and remove sensitive data", async () => {
      (mockUserService.getUser as jest.Mock).mockResolvedValue(mockUser);

      await userController.getCurrentUser(
        mockRequest as TypedRequest,
        mockResponse as Response
      );

      expect(mockUserService.getUser).toHaveBeenCalledWith({ id: mockUserId });

      expect(mockResponse.status).toHaveBeenCalledWith(httpStatus.OK);

      // Expect the response user object not to include password
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "User retrieved successfully.",
        user: expect.not.objectContaining({ password: expect.any(String) }),
      });
    });

    it("should propagate user service errors", async () => {
      const errorMessage = "Error fetching user data";
      (mockUserService.getUser as jest.Mock).mockRejectedValue(
        new Error(errorMessage)
      );

      await expect(
        userController.getCurrentUser(
          mockRequest as TypedRequest,
          mockResponse as Response
        )
      ).rejects.toThrow(errorMessage);
    });
  });

  describe("AuthController - updateCurrentUser", () => {
    let mockRequest: Partial<TypedRequest<UpdateUserDto>>;

    const updateUserDto: UpdateUserDto = {
      username: "test_user_updated",
      email: "testuser@example.com",
    };

    beforeEach(() => {
      mockRequest = {
        body: updateUserDto,
        userId: mockUserId,
      };
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should update the current user's information", async () => {
      (mockUserService.updateUser as jest.Mock).mockResolvedValue({
        ...mockUser,
        ...updateUserDto,
      });

      await userController.updateCurrentUser(
        mockRequest as TypedRequest<UpdateUserDto>,
        mockResponse as Response
      );

      expect(mockUserService.updateUser).toHaveBeenCalledWith(
        mockUserId,
        mockRequest.body
      );

      expect(mockResponse.status).toHaveBeenCalledWith(httpStatus.OK);

      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "User updated successfully.",
        user: expect.not.objectContaining({ password: expect.any(String) }),
      });
    });

    it("should update user with an empty update object (edge case)", async () => {
      mockRequest.body = {};
      (mockUserService.updateUser as jest.Mock).mockResolvedValue(mockUser);

      await userController.updateCurrentUser(
        mockRequest as TypedRequest<UpdateUserDto>,
        mockResponse as Response
      );

      expect(mockUserService.updateUser).toHaveBeenCalledWith(mockUserId, {});

      expect(mockResponse.status).toHaveBeenCalledWith(httpStatus.OK);

      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "User updated successfully.",
        user: expect.not.objectContaining({ password: expect.any(String) }),
      });
    });

    it("should propagate Userservice errors", async () => {
      const errorMessage = "Error updating user data";
      (mockUserService.updateUser as jest.Mock).mockRejectedValue(
        new Error(errorMessage)
      );

      await expect(
        userController.updateCurrentUser(
          mockRequest as TypedRequest<UpdateUserDto>,
          mockResponse as Response
        )
      ).rejects.toThrow(errorMessage);
    });
  });

  describe("AuthController - updateUserPassword", () => {
    let mockRequest: Partial<TypedRequest<UpdatePasswordDto>>;

    const updatePasswordDto: UpdatePasswordDto = {
      currentPassword: "current_user_password",
      newPassword: "new_user_password",
    };

    beforeEach(() => {
      mockRequest = {
        body: updatePasswordDto,
        userId: mockUserId,
      };
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should update the current user's password", async () => {
      (mockUserService.updatePassword as jest.Mock).mockResolvedValue({
        ...mockUser,
        password: "new_hashed_password",
      });

      await userController.updatePassword(
        mockRequest as TypedRequest<UpdatePasswordDto>,
        mockResponse as Response
      );

      expect(mockUserService.updatePassword).toHaveBeenCalledWith(
        mockUserId,
        mockRequest.body
      );

      expect(mockResponse.status).toHaveBeenCalledWith(httpStatus.OK);

      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "User password updated successfully.",
        user: expect.not.objectContaining({ password: expect.any(String) }),
      });
    });

    it("should propagate Userservice errors", async () => {
      const errorMessage = "Error updating user data";
      (mockUserService.updatePassword as jest.Mock).mockRejectedValue(
        new Error(errorMessage)
      );

      await expect(
        userController.updatePassword(
          mockRequest as TypedRequest<UpdatePasswordDto>,
          mockResponse as Response
        )
      ).rejects.toThrow(errorMessage);
    });
  });
});
