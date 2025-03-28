import type { Response } from "express";
import httpStatus from "http-status";

import { mock, mockReset } from "jest-mock-extended";

import type { IUpdateBodyDto } from "@/modules/shared/dtos";
import type { TypedRequest } from "@/modules/shared/types";

import { UserController } from "../user.controller";

import type { IResponseFormatter } from "@/modules/shared/services";
import type {
  IUpdatePasswordBodyDto,
  IUpdatePasswordDto,
  IUpdateUserDto,
} from "../dtos";
import type { User } from "../user.model";
import type { IUserService } from "../user.types";

describe("UserController tests", () => {
  const userService = mock<IUserService>();
  const responseFormatter = mock<IResponseFormatter>();

  const userController = UserController.getInstance({
    userService,
    responseFormatter,
  });

  const req = mock<TypedRequest>();
  const res = mock<Response>();
  const updateUserReq = mock<TypedRequest<IUpdateBodyDto<User>>>();
  const updatePasswordReq = mock<TypedRequest<IUpdatePasswordBodyDto>>();

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
    mockReset(userService);

    res.status.mockReturnThis();
    res.json.mockReturnThis();

    req.userId = mockUserId;

    updateUserReq.body = updateUserDto.data;
    updateUserReq.userId = updateUserDto.id;

    updatePasswordReq.body = updatePasswordBodyDto;
    updatePasswordReq.userId = updatePasswordDto.id;
  });

  describe("UserController - getCurrentUser", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    const getUserFormattedRes = {
      success: true,
      status: httpStatus.OK,
      data: mockUser,
      message: "User retrieved successfully.",
    };

    it("should send the current user's information and remove sensitive data", async () => {
      (userService.getUserByIdOrEmail as jest.Mock).mockResolvedValue(mockUser);

      (responseFormatter.formatResponse as jest.Mock).mockReturnValue(
        getUserFormattedRes
      );

      await userController.getCurrentUser(req, res);

      expect(userService.getUserByIdOrEmail).toHaveBeenCalledWith({
        id: mockUserId,
      });

      expect(responseFormatter.formatResponse).toHaveBeenCalledWith({
        responseOptions: {
          data: getUserFormattedRes.data,
          message: getUserFormattedRes.message,
          status: getUserFormattedRes.status,
        },
      });

      expect(res.status).toHaveBeenCalledWith(httpStatus.OK);

      // Expect the response user object not to include password
      expect(res.json).toHaveBeenCalledWith(getUserFormattedRes);
    });

    it("should propagate user service errors", async () => {
      const errorMessage = "Error fetching user data";
      (userService.getUserByIdOrEmail as jest.Mock).mockRejectedValue(
        new Error(errorMessage)
      );

      await expect(userController.getCurrentUser(req, res)).rejects.toThrow(
        errorMessage
      );
    });
  });

  describe("UserController - updateCurrentUser", () => {
    const updateUserFormattedRes = {
      success: true,
      status: httpStatus.OK,
      data: { ...mockUser, ...updateUserDto.data },
      message: "User updated successfully.",
    };

    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should update the current user's information", async () => {
      (userService.updateUser as jest.Mock).mockResolvedValue({
        ...mockUser,
        ...updateUserDto.data,
      });

      (responseFormatter.formatResponse as jest.Mock).mockReturnValue(
        updateUserFormattedRes
      );

      await userController.updateCurrentUser(updateUserReq, res);

      expect(userService.updateUser).toHaveBeenCalledWith({
        id: mockUserId,
        data: updateUserReq.body,
      });

      expect(responseFormatter.formatResponse).toHaveBeenCalledWith({
        responseOptions: {
          data: updateUserFormattedRes.data,
          message: updateUserFormattedRes.message,
          status: updateUserFormattedRes.status,
        },
      });

      expect(res.status).toHaveBeenCalledWith(httpStatus.OK);

      expect(res.json).toHaveBeenCalledWith(updateUserFormattedRes);
    });

    it("should update user with an empty update object (edge case)", async () => {
      updateUserReq.body = {};
      (userService.updateUser as jest.Mock).mockResolvedValue(mockUser);

      (responseFormatter.formatResponse as jest.Mock).mockReturnValue({
        ...updateUserFormattedRes,
        data: mockUser,
      });

      await userController.updateCurrentUser(updateUserReq, res);

      expect(userService.updateUser).toHaveBeenCalledWith({
        id: mockUserId,
        data: {},
      });

      expect(responseFormatter.formatResponse).toHaveBeenCalledWith({
        responseOptions: {
          data: mockUser,
          message: updateUserFormattedRes.message,
          status: updateUserFormattedRes.status,
        },
      });

      expect(res.status).toHaveBeenCalledWith(httpStatus.OK);

      expect(res.json).toHaveBeenCalledWith({
        ...updateUserFormattedRes,
        data: mockUser,
      });
    });

    it("should propagate Userservice errors", async () => {
      const errorMessage = "Error updating user data";
      (userService.updateUser as jest.Mock).mockRejectedValue(
        new Error(errorMessage)
      );

      await expect(
        userController.updateCurrentUser(
          updateUserReq as TypedRequest<IUpdateBodyDto<User>>,
          res
        )
      ).rejects.toThrow(errorMessage);
    });
  });

  describe("UserController - updateUserPassword", () => {
    const updatePasswordFormattedRes = {
      success: true,
      status: httpStatus.OK,
      data: { ...mockUser, password: "new_hashed_password" },
      message: "User password updated successfully.",
    };

    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should update the current user's password", async () => {
      (userService.updateUserPassword as jest.Mock).mockResolvedValue({
        ...mockUser,
        password: "new_hashed_password",
      });

      (responseFormatter.formatResponse as jest.Mock).mockReturnValue(
        updatePasswordFormattedRes
      );

      await userController.updatePassword(updatePasswordReq, res);

      expect(userService.updateUserPassword).toHaveBeenCalledWith(
        updatePasswordDto
      );

      expect(responseFormatter.formatResponse).toHaveBeenCalledWith({
        responseOptions: {
          data: updatePasswordFormattedRes.data,
          message: updatePasswordFormattedRes.message,
          status: updatePasswordFormattedRes.status,
        },
      });

      expect(res.status).toHaveBeenCalledWith(httpStatus.OK);

      expect(res.json).toHaveBeenCalledWith(updatePasswordFormattedRes);
    });

    it("should propagate Userservice errors", async () => {
      const errorMessage = "Error updating user data";
      (userService.updateUserPassword as jest.Mock).mockRejectedValue(
        new Error(errorMessage)
      );

      await expect(
        userController.updatePassword(updatePasswordReq, res)
      ).rejects.toThrow(errorMessage);
    });
  });
});
