import type { Response } from "express";
import httpStatus from "http-status";

import {
  IUserController,
  UserController,
} from "../../src/modules/user/user.controller";
import { IUserService } from "../../src/modules/user/user.service";

import type { TypedRequest } from "../../src/types";

import type { UpdateUserDto } from "../../src/modules/user/dtos/update-user.dto";
import type { UserDto } from "../../src/modules/user/dtos/user.dto";

describe("userController integration tests", () => {
  let userController: IUserController;
  let mockUserService: IUserService;

  beforeEach(() => {
    mockUserService = {
      createUser: jest.fn(),
      findOrCreateUser: jest.fn(),
      getUserById: jest.fn(),
      updateUser: jest.fn(),
      getUserByEmail: jest.fn(),
      verifyUserEmail: jest.fn(),
    };

    userController = new UserController(mockUserService);
  });

  beforeAll(() => {
    jest.clearAllMocks();
  });

  describe("AuthController - getCurrentUser", () => {
    let mockRequest: Partial<TypedRequest>;
    let mockResponse: Partial<Response>;
    let mockStatus: jest.Mock;
    let mockJson: jest.Mock;

    const mockUserId = "user_id_001";

    const mockUser: UserDto = {
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
      (mockUserService.getUserById as jest.Mock).mockResolvedValue(mockUser);

      await userController.getCurrentUser(
        mockRequest as TypedRequest,
        mockResponse as Response
      );

      expect(mockUserService.getUserById).toHaveBeenCalledWith(mockUserId);

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
      (mockUserService.getUserById as jest.Mock).mockRejectedValue(
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
    let mockResponse: Partial<Response>;
    let mockStatus: jest.Mock;
    let mockJson: jest.Mock;

    const mockUserId = "user_id_001";

    const updateUserDto: UpdateUserDto = {
      username: "test_user_updated",
      email: "testuser@example.com",
    };

    beforeEach(() => {
      mockJson = jest.fn();
      mockStatus = jest.fn().mockReturnValue({ json: mockJson });
      mockResponse = {
        status: mockStatus,
        json: mockJson,
      };
      mockRequest = {
        body: updateUserDto,
        userId: mockUserId,
      };
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should update the current user's information", async () => {
      (mockUserService.updateUser as jest.Mock).mockResolvedValue(undefined);

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
      });
    });

    it("should handle Userservice errors", async () => {
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

  // describe("AuthController - updateUserPassword", () => {
  //   let mockRequest: Partial<TypedRequest<UpdatePasswordDto>>;
  //   let mockResponse: Partial<Response>;
  //   let mockStatus: jest.Mock;
  //   let mockJson: jest.Mock;

  //   const mockUserId = "user_id_001";

  //   const updatePasswordDto: UpdatePasswordDto = {
  //     currentPassword: "current_user_password",
  //     newPassword: "new_user_password",
  //   };

  //   beforeEach(() => {
  //     mockJson = jest.fn();
  //     mockStatus = jest.fn().mockReturnValue({ json: mockJson });
  //     mockResponse = {
  //       status: mockStatus,
  //       json: mockJson,
  //     };
  //     mockRequest = {
  //       body: updatePasswordDto,
  //       userId: mockUserId,
  //     };
  //   });

  //   afterEach(() => {
  //     jest.clearAllMocks();
  //   });

  //   it("should update the current user's password", async () => {
  //     (mockUserService.updatePassword as jest.Mock).mockResolvedValue(
  //       undefined
  //     );

  //     await userController.updateUserPassword(
  //       mockRequest as TypedRequest<UpdatePasswordDto>,
  //       mockResponse as Response
  //     );

  //     expect(mockUserService.updatePassword).toHaveBeenCalledWith(
  //       mockUserId,
  //       mockRequest.body
  //     );

  //     expect(mockResponse.status).toHaveBeenCalledWith(httpStatus.OK);

  //     expect(mockResponse.json).toHaveBeenCalledWith({
  //       message: "Password updated successfully.",
  //     });
  //   });

  //   it("should handle Userservice errors", async () => {
  //     const errorMessage = "Error updating user data";
  //     (mockUserService.updatePassword as jest.Mock).mockRejectedValue(
  //       new Error(errorMessage)
  //     );

  //     await expect(
  //       userController.updateUserPassword(
  //         mockRequest as TypedRequest<UpdatePasswordDto>,
  //         mockResponse as Response
  //       )
  //     ).rejects.toThrow(errorMessage);
  //   });
  // });
});
