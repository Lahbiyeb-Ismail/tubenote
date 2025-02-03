import httpStatus from "http-status";
import request from "supertest";

import app from "@/app";

import isAuthenticated from "@middlewares/auth.middleware";

import {
  type UpdatePasswordDto,
  type UpdateUserDto,
  User,
  userController,
} from "@modules/user";

jest.mock("@modules/user", () => ({
  userController: {
    getCurrentUser: jest.fn(),
    updateCurrentUser: jest.fn(),
    updatePassword: jest.fn(),
  },
}));

jest.mock("@middlewares/auth.middleware", () => jest.fn());

describe("User Routes", () => {
  const mockUserId = "user_id_001";
  const mockUserEmail = "test@example.com";

  const mockUser: Omit<User, "password"> = {
    id: mockUserId,
    username: "testuser",
    email: mockUserEmail,
    profilePicture: "https://example.com/profile.jpg",
    isEmailVerified: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeAll(() => {
    (isAuthenticated as jest.Mock).mockImplementation((req, _res, next) => {
      req.userId = mockUserId;
      next();
    });

    jest.clearAllMocks();
  });

  describe("GET /api/v1/users/me", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should successfully get the current user's information", async () => {
      // Arrange
      (userController.getCurrentUser as jest.Mock).mockImplementation(
        (_req, res) => {
          res
            .status(httpStatus.OK)
            .json({ message: "User retrieved successfully.", user: mockUser });
        }
      );

      // Act & Assert
      const response = await request(app).get("/api/v1/users/me");

      expect(response.statusCode).toBe(httpStatus.OK);

      expect(response.body.message).toBe("User retrieved successfully.");

      expect(response.body.user).toEqual(
        expect.objectContaining({ id: mockUser.id })
      );

      expect(response.body.user).not.toHaveProperty("password");

      expect(userController.getCurrentUser).toHaveBeenCalled();
    });

    it("should propagate errors from the controller", async () => {
      (userController.getCurrentUser as jest.Mock).mockImplementation(() => {
        throw new Error("User retrieval error");
      });

      await request(app)
        .get("/api/v1/users/me")
        .expect(httpStatus.INTERNAL_SERVER_ERROR);

      expect(userController.getCurrentUser).toHaveBeenCalled();
    });
  });

  describe("PATCH /api/v1/users/me", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    const validUpdate: UpdateUserDto = {
      username: "updatedUser",
      email: "updated@example.com",
    };

    it("should successfully update the current user's information", async () => {
      (userController.updateCurrentUser as jest.Mock).mockImplementation(
        (_req, res) => {
          res.status(httpStatus.OK).json({
            message: "User updated successfully.",
            user: { ...mockUser, ...validUpdate },
          });
        }
      );

      const response = await request(app)
        .patch("/api/v1/users/me")
        .send(validUpdate);

      expect(response.statusCode).toBe(httpStatus.OK);
      expect(response.body.message).toBe("User updated successfully.");

      expect(response.body.user).toEqual(expect.objectContaining(validUpdate));

      expect(response.body.user).not.toHaveProperty("password");

      expect(userController.updateCurrentUser).toHaveBeenCalled();
    });

    it("should update nothing if the request body is empty and return the user", async () => {
      const invalidUpdate = {};

      (userController.updateCurrentUser as jest.Mock).mockImplementation(
        (_req, res) => {
          res.status(httpStatus.OK).json({
            message: "User updated successfully.",
            user: mockUser,
          });
        }
      );

      const response = await request(app)
        .patch("/api/v1/users/me")
        .send(invalidUpdate);

      expect(response.statusCode).toBe(httpStatus.OK);

      expect(response.body.user).not.toHaveProperty("password");
    });

    it("should propagate errors from the updateCurrentUser controller", async () => {
      (userController.updateCurrentUser as jest.Mock).mockImplementation(() => {
        throw new Error("Update failed");
      });

      await request(app)
        .patch("/api/v1/users/me")
        .send(validUpdate)
        .expect(httpStatus.INTERNAL_SERVER_ERROR);
    });
  });

  describe("PATCH /api/v1/users/update-password", () => {
    const validPasswordUpdate: UpdatePasswordDto = {
      currentPassword: "oldPass123!",
      newPassword: "newPass123!",
    };

    it("should successfully update the current user's password", async () => {
      (userController.updatePassword as jest.Mock).mockImplementation(
        (_req, res) => {
          res.status(httpStatus.OK).json({
            message: "User password updated successfully.",
            user: mockUser,
          });
        }
      );

      const response = await request(app)
        .patch("/api/v1/users/update-password")
        .send(validPasswordUpdate);

      expect(response.statusCode).toBe(httpStatus.OK);
      expect(response.body.message).toBe("User password updated successfully.");
      expect(response.body.user).toEqual(
        expect.objectContaining({
          id: mockUser.id,
          email: mockUser.email,
        })
      );
      expect(response.body.user).not.toHaveProperty("password");
      expect(userController.updatePassword).toHaveBeenCalled();
    });

    it("should propagate errors from the updatePassword controller", async () => {
      (userController.updatePassword as jest.Mock).mockImplementation(() => {
        throw new Error("Password update failed");
      });

      await request(app)
        .patch("/api/v1/users/update-password")
        .send(validPasswordUpdate)
        .expect(httpStatus.INTERNAL_SERVER_ERROR);
    });
  });
});
