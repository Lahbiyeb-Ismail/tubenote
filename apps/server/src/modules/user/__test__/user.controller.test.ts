import type { Response } from "express";
import httpStatus from "http-status";

import type { IUpdateBodyDto } from "@/modules/shared/dtos";
import type { TypedRequest } from "@/modules/shared/types";

import { UserController } from "../user.controller";

import type {
  IUpdatePasswordBodyDto,
  IUpdatePasswordDto,
  IUpdateUserDto,
} from "../dtos";
import type { User } from "../user.model";
import type { IUserController, IUserService } from "../user.types";

describe("UserController tests", () => {
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

  describe("UserController - getCurrentUser", () => {
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

  describe("UserController - updateCurrentUser", () => {
    let mockUpdateUserReq: Partial<TypedRequest<IUpdateBodyDto<User>>>;

    const updateUserDto: IUpdateUserDto = {
      id: mockUserId,
      data: {
        username: "test_user_updated",
        email: "testuser@example.com",
      },
    };

    beforeEach(() => {
      mockUpdateUserReq = {
        body: updateUserDto.data,
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
        mockUpdateUserReq as TypedRequest<IUpdateBodyDto<User>>,
        mockResponse as Response
      );

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

      await userController.updateCurrentUser(
        mockUpdateUserReq as TypedRequest<IUpdateBodyDto<User>>,
        mockResponse as Response
      );

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
          mockResponse as Response
        )
      ).rejects.toThrow(errorMessage);
    });
  });

  describe("UserController - updateUserPassword", () => {
    let mockUpdatePasswordReq: Partial<TypedRequest<IUpdatePasswordBodyDto>>;

    const updatePasswordBodyDto: IUpdatePasswordBodyDto = {
      currentPassword: "current_user_password",
      newPassword: "new_user_password",
    };

    const updatePasswordDto: IUpdatePasswordDto = {
      id: mockUserId,
      ...updatePasswordBodyDto,
    };

    beforeEach(() => {
      mockUpdatePasswordReq = {
        body: updatePasswordBodyDto,
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
        mockUpdatePasswordReq as TypedRequest<IUpdatePasswordBodyDto>,
        mockResponse as Response
      );

      expect(mockUserService.updatePassword).toHaveBeenCalledWith(
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
      (mockUserService.updatePassword as jest.Mock).mockRejectedValue(
        new Error(errorMessage)
      );

      await expect(
        userController.updatePassword(
          mockUpdatePasswordReq as TypedRequest<IUpdatePasswordBodyDto>,
          mockResponse as Response
        )
      ).rejects.toThrow(errorMessage);
    });
  });
});
