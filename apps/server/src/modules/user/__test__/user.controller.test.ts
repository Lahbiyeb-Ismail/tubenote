import type { Response } from "express";
import httpStatus from "http-status";

import { mock, mockReset } from "jest-mock-extended";

import type { IUpdateBodyDto } from "@/modules/shared/dtos";
import type { TypedRequest } from "@/modules/shared/types";

import { UserController } from "../user.controller";

import { BadRequestError, NotFoundError } from "@/modules/shared/api-errors";
import type {
  ILoggerService,
  IRateLimitService,
  IResponseFormatter,
} from "@/modules/shared/services";
import type { IUpdatePasswordDto, IUpdateUserDto } from "../dtos";
import type { User } from "../user.model";
import type { IUserControllerOptions, IUserService } from "../user.types";

describe("UserController tests", () => {
  let userController: UserController;

  const userService = mock<IUserService>();
  const responseFormatter = mock<IResponseFormatter>();
  const rateLimitService = mock<IRateLimitService>();
  const loggerService = mock<ILoggerService>();

  const controllerOptions: IUserControllerOptions = {
    userService,
    responseFormatter,
    rateLimitService,
    loggerService,
  };

  const req = mock<TypedRequest>();
  const res = mock<Response>();
  const updateUserReq = mock<TypedRequest<IUpdateUserDto>>();
  const updatePasswordReq = mock<TypedRequest<IUpdatePasswordDto>>();

  const mockUserId = "user_id_001";

  const updateUserDto: IUpdateUserDto = {
    username: "test_user_updated",
    email: "testuser@example.com",
  };

  const updatePasswordDto: IUpdatePasswordDto = {
    currentPassword: "current_user_password",
    newPassword: "new_user_password",
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
    mockReset(responseFormatter);
    mockReset(rateLimitService);
    mockReset(loggerService);

    // Reset all mocks before each test
    jest.resetAllMocks();

    res.status.mockReturnThis();
    res.json.mockReturnThis();

    req.userId = mockUserId;

    updateUserReq.body = updateUserDto;
    updateUserReq.userId = mockUserId;

    updatePasswordReq.body = updatePasswordDto;
    updatePasswordReq.userId = mockUserId;
    updatePasswordReq.rateLimitKey = `${mockUserId}:password-update`;

    // Reset singleton instance before each test to ensure a clean state.
    // @ts-ignore: resetting the private _instance for testing purposes
    UserController._instance = undefined;

    userController = UserController.getInstance(controllerOptions);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Singleton Behavior", () => {
    it("should create a new instance when none exists", () => {
      const instance1 = UserController.getInstance(controllerOptions);
      expect(instance1).toBeInstanceOf(UserController);
    });

    it("should return the existing instance when called multiple times", () => {
      const instance1 = UserController.getInstance(controllerOptions);
      const instance2 = UserController.getInstance(controllerOptions);
      expect(instance1).toBe(instance2);
    });
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
      (userService.getUserById as jest.Mock).mockResolvedValue(mockUser);

      (responseFormatter.formatResponse as jest.Mock).mockReturnValue(
        getUserFormattedRes
      );

      await userController.getCurrentUser(req, res);

      expect(userService.getUserById).toHaveBeenCalledWith(mockUserId);

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
      (userService.getUserById as jest.Mock).mockRejectedValue(
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
      data: { ...mockUser, ...updateUserDto },
      message: "User updated successfully.",
    };

    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should update the current user's information", async () => {
      (userService.updateUser as jest.Mock).mockResolvedValue({
        ...mockUser,
        ...updateUserDto,
      });

      (responseFormatter.formatResponse as jest.Mock).mockReturnValue(
        updateUserFormattedRes
      );

      await userController.updateCurrentUser(updateUserReq, res);

      expect(userService.updateUser).toHaveBeenCalledWith(
        mockUserId,
        updateUserReq.body
      );

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

      expect(userService.updateUser).toHaveBeenCalledWith(mockUserId, {});

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

    it("should update password successfully", async () => {
      // Arrange
      userService.updateUserPassword.mockResolvedValue(mockUser);
      responseFormatter.formatResponse.mockReturnValue(
        updatePasswordFormattedRes
      );

      // Act
      await userController.updatePassword(updatePasswordReq, res);

      // Assert
      expect(userService.updateUserPassword).toHaveBeenCalledWith(
        mockUserId,
        updatePasswordReq.body
      );

      expect(responseFormatter.formatResponse).toHaveBeenCalledWith({
        responseOptions: {
          data: mockUser,
          status: httpStatus.OK,
          message: "User password updated successfully.",
        },
      });
      expect(rateLimitService.reset).toHaveBeenCalledWith(
        `${updatePasswordReq.userId}:password-update`
      );
      expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
      expect(res.json).toHaveBeenCalledWith(updatePasswordFormattedRes);
    });

    it("should handle invalid current password", async () => {
      // Arrange
      updatePasswordReq.body = {
        currentPassword: "wrongPassword",
        newPassword: "newPassword456",
      };

      const invalidPasswordError = new BadRequestError("Invalid credentials");

      userService.updateUserPassword.mockRejectedValue(invalidPasswordError);

      // Act & Assert
      await expect(
        userController.updatePassword(updatePasswordReq, res)
      ).rejects.toThrow(invalidPasswordError);

      expect(userService.updateUserPassword).toHaveBeenCalledWith(
        mockUserId,
        updatePasswordReq.body
      );

      expect(rateLimitService.increment).toHaveBeenCalled();
      expect(loggerService.error).toHaveBeenCalledWith(
        "Error updating password",
        invalidPasswordError
      );
      expect(rateLimitService.reset).not.toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it("should handle same password error", async () => {
      // Arrange
      updatePasswordReq.body = {
        currentPassword: "samePassword123",
        newPassword: "samePassword123",
      };

      const samePasswordError = new BadRequestError(
        "New password must be different from current password"
      );

      userService.updateUserPassword.mockRejectedValue(samePasswordError);

      // Act & Assert
      await expect(
        userController.updatePassword(updatePasswordReq, res)
      ).rejects.toThrow(samePasswordError);

      expect(userService.updateUserPassword).toHaveBeenCalledWith(
        mockUserId,
        updatePasswordReq.body
      );

      expect(rateLimitService.increment).toHaveBeenCalled();
      expect(loggerService.error).toHaveBeenCalledWith(
        "Error updating password",
        samePasswordError
      );
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it("should handle user not found error during password update", async () => {
      // Arrange
      updatePasswordReq.userId = "nonexistent-user";
      updatePasswordReq.rateLimitKey = "nonexistent-user:password-update";

      const notFoundError = new NotFoundError("User not found");

      userService.updateUserPassword.mockRejectedValue(notFoundError);

      // Act & Assert
      await expect(
        userController.updatePassword(updatePasswordReq, res)
      ).rejects.toThrow(notFoundError);

      expect(userService.updateUserPassword).toHaveBeenCalledWith(
        updatePasswordReq.userId,
        updatePasswordReq.body
      );

      expect(rateLimitService.increment).toHaveBeenCalled();
      expect(loggerService.error).toHaveBeenCalledWith(
        "Error updating password",
        notFoundError
      );
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it("should handle unexpected errors during password update", async () => {
      // Arrange
      const unexpectedError = new Error("Database connection error");

      userService.updateUserPassword.mockRejectedValue(unexpectedError);

      // Act & Assert
      await expect(
        userController.updatePassword(updatePasswordReq, res)
      ).rejects.toThrow(unexpectedError);

      expect(userService.updateUserPassword).toHaveBeenCalledWith(
        mockUserId,
        updatePasswordReq.body
      );

      expect(rateLimitService.increment).toHaveBeenCalled();
      expect(loggerService.error).toHaveBeenCalledWith(
        "Error updating password",
        unexpectedError
      );
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });
});
