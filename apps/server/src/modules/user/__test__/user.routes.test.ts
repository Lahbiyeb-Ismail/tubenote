import httpStatus from "http-status";
import request from "supertest";

import app from "@/app";

import { type User, userController } from "@modules/user";

const mockUser: Omit<User, "password"> = {
  id: "user_id_001",
  username: "testuser",
  email: "test@example.com",
  profilePicture: "https://example.com/profile.jpg",
  isEmailVerified: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

// ---
// Mock the user controller functions so we can check if they were called.
jest.mock("@modules/user", () => {
  // Require the original module so we can still use its schemas.
  const originalModule = jest.requireActual("@modules/user");
  return {
    ...originalModule,
    userController: {
      getCurrentUser: jest.fn((_req, res) => {
        return res
          .status(httpStatus.OK)
          .json({ message: "User retrieved successfully.", user: mockUser });
      }),
      updateCurrentUser: jest.fn((req, res) => {
        return res.status(httpStatus.OK).json({
          message: "User updated successfully.",
          user: { ...mockUser, ...req.body },
        });
      }),
      updatePassword: jest.fn((_req, res) => {
        return res
          .status(httpStatus.OK)
          .json({ message: "User password updated successfully." });
      }),
    },
  };
});

// ---
// Mock the JWT verify function so we can simulate valid and invalid tokens.
jest.mock("jsonwebtoken", () => {
  // Get the actual module to spread the rest of its exports.
  const actualJwt = jest.requireActual("jsonwebtoken");
  return {
    ...actualJwt,
    verify: jest.fn(
      (
        token: string,
        _secret: string,
        callback: (err: Error | null, payload?: any) => void
      ) => {
        if (token === "valid-token") {
          // Simulate a successful verification with a payload.
          callback(null, { userId: "12345" });
        } else {
          // Simulate an error during verification.
          callback(new Error("Invalid token"), null);
        }
      }
    ),
  };
});

describe("User Routes", () => {
  // Clear mocks between tests
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ---
  // 1. Authentication middleware tests
  describe("Authentication Middleware", () => {
    it("should return 401 if Authorization header is missing", async () => {
      const res = await request(app).get("/api/v1/users/me");
      expect(res.statusCode).toBe(httpStatus.UNAUTHORIZED);
      expect(res.body.error.message).toMatch(/authenticated/);
    });

    it("should return 401 if Authorization header is malformed", async () => {
      const res = await request(app)
        .get("/api/v1/users/me")
        .set("Authorization", "Token sometoken");
      expect(res.statusCode).toBe(httpStatus.UNAUTHORIZED);
      expect(res.body.error.message).toMatch(/authenticated/);
    });

    it("should return 401 if token is empty", async () => {
      const res = await request(app)
        .get("/api/v1/users/me")
        .set("Authorization", "Bearer ");
      expect(res.statusCode).toBe(httpStatus.UNAUTHORIZED);
      expect(res.body.error.message).toMatch(/authenticated/);
    });

    it("should return 401 if token verification fails", async () => {
      const res = await request(app)
        .get("/api/v1/users/me")
        .set("Authorization", "Bearer invalid-token");
      expect(res.statusCode).toBe(httpStatus.UNAUTHORIZED);
      expect(res.body.error.message).toMatch(/Unauthorized access/);
    });

    it("should pass authentication with a valid token", async () => {
      const res = await request(app)
        .get("/api/v1/users/me")
        .set("Authorization", "Bearer valid-token");
      // The controller returns a 200 response if the token is valid.
      expect(res.statusCode).toBe(httpStatus.OK);

      expect(res.body).toHaveProperty(
        "message",
        "User retrieved successfully."
      );
      expect(res.body).toHaveProperty("user");
    });
  });

  // ---
  // 2. GET /me endpoint tests
  describe("GET /api/v1/users/me", () => {
    it("should return 401 when unauthenticated", async () => {
      const res = await request(app).get("/api/v1/users/me");
      expect(res.statusCode).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should return current user data when authenticated", async () => {
      const res = await request(app)
        .get("/api/v1/users/me")
        .set("Authorization", "Bearer valid-token");

      expect(res.statusCode).toBe(httpStatus.OK);

      expect(res.body).toHaveProperty("user");

      expect(res.body.user).not.toHaveProperty("password");

      expect(userController.getCurrentUser).toHaveBeenCalled();
    });

    it("should propagate errors from the controller", async () => {
      // Simulate an error in the controller.
      (userController.getCurrentUser as jest.Mock).mockImplementation(() => {
        throw new Error("User retrieval error");
      });

      const res = await request(app)
        .get("/api/v1/users/me")
        .set("Authorization", "Bearer valid-token");

      expect(res.statusCode).toBe(httpStatus.INTERNAL_SERVER_ERROR);

      expect(userController.getCurrentUser).toHaveBeenCalled();
    });
  });

  // ---
  // 3. PATCH /api/v1/users/me endpoint tests (update current user information)
  describe("PATCH /api/v1/users/me", () => {
    it("should return 401 when unauthenticated", async () => {
      const res = await request(app)
        .patch("/api/v1/users/me")
        .send({ username: "newname" });

      expect(res.statusCode).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should update user with partial valid data", async () => {
      const payload = { username: "newusername" };

      const res = await request(app)
        .patch("/api/v1/users/me")
        .set("Authorization", "Bearer valid-token")
        .send(payload);

      expect(res.statusCode).toBe(httpStatus.OK);

      expect(res.body).toHaveProperty("user");

      expect(userController.updateCurrentUser).toHaveBeenCalled();
    });

    it("should update user with all optional fields", async () => {
      const payload = {
        username: "newusername",
        email: "new@example.com",
        profilePicture: "http://example.com/pic.jpg",
        isEmailVerified: true,
      };
      const res = await request(app)
        .patch("/api/v1/users/me")
        .set("Authorization", "Bearer valid-token")
        .send(payload);

      expect(res.statusCode).toBe(httpStatus.OK);

      expect(res.body).toHaveProperty("user");

      expect(userController.updateCurrentUser).toHaveBeenCalled();
    });

    it("should allow an empty payload (all fields are optional)", async () => {
      const res = await request(app)
        .patch("/api/v1/users/me")
        .set("Authorization", "Bearer valid-token")
        .send({});

      expect(res.statusCode).toBe(httpStatus.OK);

      expect(userController.updateCurrentUser).toHaveBeenCalled();
    });

    it("should return 400 for payload with extra unexpected fields", async () => {
      const payload = { username: "newusername", extraField: "unexpected" };

      const res = await request(app)
        .patch("/api/v1/users/me")
        .set("Authorization", "Bearer valid-token")
        .send(payload);

      expect(res.statusCode).toBe(httpStatus.BAD_REQUEST);

      expect(res.body.error.message).toMatch(/Unrecognized key/);
    });

    it("should return 400 for invalid data types", async () => {
      const payload = { username: 123, email: 456 };
      const res = await request(app)
        .patch("/api/v1/users/me")
        .set("Authorization", "Bearer valid-token")
        .send(payload);

      expect(res.statusCode).toBe(httpStatus.BAD_REQUEST);

      expect(res.body.error.message).toMatch(/Expected string/);
    });

    it("should propagate errors from the controller", async () => {
      // Simulate an error in the controller.
      (userController.updateCurrentUser as jest.Mock).mockImplementation(() => {
        throw new Error("User update error");
      });

      const res = await request(app)
        .patch("/api/v1/users/me")
        .set("Authorization", "Bearer valid-token")
        .send({ username: "newname" });

      expect(res.statusCode).toBe(httpStatus.INTERNAL_SERVER_ERROR);

      expect(userController.updateCurrentUser).toHaveBeenCalled();
    });
  });

  // ---
  // 4. PATCH /api/v1/users/update-password endpoint tests (update password)
  describe("PATCH /api/v1/users/update-password", () => {
    it("should update password with valid data", async () => {
      const payload = {
        currentPassword: "Oldpassword123!",
        newPassword: "Newpassword123!",
      };
      const res = await request(app)
        .patch("/api/v1/users/update-password")
        .set("Authorization", "Bearer valid-token")
        .send(payload);

      expect(res.statusCode).toBe(httpStatus.OK);

      expect(res.body).toHaveProperty(
        "message",
        "User password updated successfully."
      );

      expect(userController.updatePassword).toHaveBeenCalled();
    });

    it("should return 401 when unauthenticated", async () => {
      const payload = {
        currentPassword: "Oldpassword123!",
        newPassword: "Newpassword123!",
      };

      const res = await request(app)
        .patch("/api/v1/users/update-password")
        .send(payload);

      expect(res.statusCode).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should return 400 when currentPassword is missing", async () => {
      const payload = {
        newPassword: "Newpassword123!",
      };

      const res = await request(app)
        .patch("/api/v1/users/update-password")
        .set("Authorization", "Bearer valid-token")
        .send(payload);

      expect(res.statusCode).toBe(httpStatus.BAD_REQUEST);

      expect(res.body.error.message).toMatch(/currentPassword/);
    });

    it("should return 400 when newPassword is missing", async () => {
      const payload = {
        currentPassword: "Currentpassword123!",
      };

      const res = await request(app)
        .patch("/api/v1/users/update-password")
        .set("Authorization", "Bearer valid-token")
        .send(payload);

      expect(res.statusCode).toBe(httpStatus.BAD_REQUEST);

      expect(res.body.error.message).toMatch(/newPassword/);
    });

    it("should return 400 when newPassword is same as currentPassword", async () => {
      const payload = {
        currentPassword: "Password123!",
        newPassword: "Password123!",
      };

      const res = await request(app)
        .patch("/api/v1/users/update-password")
        .set("Authorization", "Bearer valid-token")
        .send(payload);

      expect(res.statusCode).toBe(httpStatus.BAD_REQUEST);

      expect(res.body.error.message).toMatch(/New password must be different/);
    });

    it("should return 400 when newPassword not meet the security requirement", async () => {
      const payload = {
        currentPassword: "Password123!",
        newPassword: "weak",
      };

      const res = await request(app)
        .patch("/api/v1/users/update-password")
        .set("Authorization", "Bearer valid-token")
        .send(payload);

      expect(res.statusCode).toBe(httpStatus.BAD_REQUEST);

      expect(res.body.error.message).toMatch(/Validation error/);
    });

    it("should return 400 for payload with extra unexpected fields", async () => {
      const payload = {
        currentPassword: "Oldpassword123!",
        newPassword: "Newpassword123!",
        extraField: "unexpected",
      };

      const res = await request(app)
        .patch("/api/v1/users/update-password")
        .set("Authorization", "Bearer valid-token")
        .send(payload);

      expect(res.statusCode).toBe(httpStatus.BAD_REQUEST);

      expect(res.body.error.message).toMatch(/Unrecognized key/);
    });

    it("should return 400 for invalid data types", async () => {
      const payload = {
        currentPassword: 123456,
        newPassword: true,
      };

      const res = await request(app)
        .patch("/api/v1/users/update-password")
        .set("Authorization", "Bearer valid-token")
        .send(payload);

      expect(res.statusCode).toBe(httpStatus.BAD_REQUEST);

      // Expect messages related to type validation.
      expect(res.body.error.message).toMatch(/Expected string/);
    });

    it("should propagate errors from the controller", async () => {
      // Simulate an error in the controller.
      (userController.updatePassword as jest.Mock).mockImplementation(() => {
        throw new Error("Password update error");
      });

      const payload = {
        currentPassword: "Oldpassword123!",
        newPassword: "Newpassword123!",
      };

      const res = await request(app)
        .patch("/api/v1/users/update-password")
        .set("Authorization", "Bearer valid-token")
        .send(payload);

      expect(res.statusCode).toBe(httpStatus.INTERNAL_SERVER_ERROR);

      expect(userController.updatePassword).toHaveBeenCalled();
    });
  });
});
