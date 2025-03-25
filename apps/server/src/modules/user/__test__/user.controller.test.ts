import type { Response } from "express";
import httpStatus from "http-status";

import { mock, mockReset } from "jest-mock-extended";

import type { IUpdateBodyDto } from "@/modules/shared/dtos";
import type { TypedRequest } from "@/modules/shared/types";

import { UserController } from "../user.controller";

import type {
  IUpdatePasswordBodyDto,
  IUpdatePasswordDto,
  IUpdateUserDto,
} from "../dtos";
import type { User } from "../user.model";
import type { IUserService } from "../user.types";

describe("UserController tests", () => {
  const mockUserService = mock<IUserService>();

  const userController = UserController.getInstance({
    userService: mockUserService,
  });

  const mockRequest = mock<TypedRequest>();
  const mockResponse = mock<Response>();
  const mockUpdateUserReq = mock<TypedRequest<IUpdateBodyDto<User>>>();
  const mockUpdatePasswordReq = mock<TypedRequest<IUpdatePasswordBodyDto>>();

  const mockUserId = "user_id_001";

  const updateUserDto: IUpdateUserDto = {
    id: mockUserId,
    data: {
      username: "test_user_updated",
      email: "testuser@example.com",
    },
  };

  const updatePasswordBodyDto: IUpdatePasswordBodyDto = {
    currentPassword: "current_user_password",
    newPassword: "new_user_password",
  };

  const updatePasswordDto: IUpdatePasswordDto = {
    id: mockUserId,
    ...updatePasswordBodyDto,
  };

  const mockUser: User = {
    id: mockUserId,
    username: "test_user",
    email: "testuser@example.com",
    profilePicture: null,
    isEmailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    password: "hashedPassword",
    videoIds: [],
  };

  beforeEach(() => {
    mockReset(mockUserService);

    mockResponse.status.mockReturnThis();
    mockResponse.json.mockReturnThis();

    mockRequest.userId = mockUserId;

    mockUpdateUserReq.body = updateUserDto.data;
    mockUpdateUserReq.userId = updateUserDto.id;

    mockUpdatePasswordReq.body = updatePasswordBodyDto;
    mockUpdatePasswordReq.userId = updatePasswordDto.id;
  });

  describe("UserController - getCurrentUser", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should send the current user's information and remove sensitive data", async () => {
      (mockUserService.getUserByIdOrEmail as jest.Mock).mockResolvedValue(
        mockUser
      );

      await userController.getCurrentUser(mockRequest, mockResponse);

      expect(mockUserService.getUserByIdOrEmail).toHaveBeenCalledWith({
        id: mockUserId,
      });

      expect(mockResponse.status).toHaveBeenCalledWith(httpStatus.OK);

      // Expect the response user object not to include password
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "User retrieved successfully.",
        user: expect.not.objectContaining({ password: expect.any(String) }),
      });
    });

    it("should propagate user service errors", async () => {
      const errorMessage = "Error fetching user data";
      (mockUserService.getUserByIdOrEmail as jest.Mock).mockRejectedValue(
        new Error(errorMessage)
      );

      await expect(
        userController.getCurrentUser(mockRequest, mockResponse)
      ).rejects.toThrow(errorMessage);
    });
  });

  describe("UserController - updateCurrentUser", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should update the current user's information", async () => {
      (mockUserService.updateUser as jest.Mock).mockResolvedValue({
        ...mockUser,
        ...updateUserDto,
      });

      await userController.updateCurrentUser(mockUpdateUserReq, mockResponse);

      expect(mockUserService.updateUser).toHaveBeenCalledWith({
        id: mockUserId,
        data: mockUpdateUserReq.body,
      });

      expect(mockResponse.status).toHaveBeenCalledWith(httpStatus.OK);

      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "User updated successfully.",
        user: expect.not.objectContaining({ password: expect.any(String) }),
      });
    });

    it("should update user with an empty update object (edge case)", async () => {
      mockUpdateUserReq.body = {};
      (mockUserService.updateUser as jest.Mock).mockResolvedValue(mockUser);

      await userController.updateCurrentUser(mockUpdateUserReq, mockResponse);

      expect(mockUserService.updateUser).toHaveBeenCalledWith({
        id: mockUserId,
        data: {},
      });

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
          mockUpdateUserReq as TypedRequest<IUpdateBodyDto<User>>,
          mockResponse
        )
      ).rejects.toThrow(errorMessage);
    });
  });

  describe("UserController - updateUserPassword", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should update the current user's password", async () => {
      (mockUserService.updateUserPassword as jest.Mock).mockResolvedValue({
        ...mockUser,
        password: "new_hashed_password",
      });

      await userController.updatePassword(mockUpdatePasswordReq, mockResponse);

      expect(mockUserService.updateUserPassword).toHaveBeenCalledWith(
        updatePasswordDto
      );

      expect(mockResponse.status).toHaveBeenCalledWith(httpStatus.OK);

      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "User password updated successfully.",
        user: expect.not.objectContaining({ password: expect.any(String) }),
      });
    });

    it("should propagate Userservice errors", async () => {
      const errorMessage = "Error updating user data";
      (mockUserService.updateUserPassword as jest.Mock).mockRejectedValue(
        new Error(errorMessage)
      );

      await expect(
        userController.updatePassword(mockUpdatePasswordReq, mockResponse)
      ).rejects.toThrow(errorMessage);
    });
  });
});
