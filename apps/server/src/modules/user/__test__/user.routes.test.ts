import httpStatus from "http-status";
import request from "supertest";

import app from "@/app";

import { BadRequestError } from "@/modules/shared/api-errors";
import { ERROR_MESSAGES } from "@/modules/shared/constants";
import type { TypedRequest } from "@/modules/shared/types";
import type { IUpdatePasswordDto } from "../dtos";
import type { User } from "../user.model";
import { userController } from "../user.module";

const MOCK_USER_ID = "user_id_001";

// **********************************************
// MOCK THE JSONWEBTOKEN MODULE TO SIMULATE TOKEN VERIFICATION
// **********************************************
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
          callback(null, { userId: MOCK_USER_ID });
        } else if (token === "expired-token") {
          // Simulate an expired token
          callback(new Error("Expired token"), null);
        } else if (token === "malformed-token") {
          // Simulate a malformed token
          callback(new Error("Malformed token"), null);
        } else {
          // Simulate an error during verification.
          callback(new Error("Invalid token"), null);
        }
      }
    ),
  };
});

describe("User Routes", () => {
  const MOCK_USER: Omit<User, "password"> = {
    id: "user_id_001",
    username: "testuser",
    email: "test@example.com",
    profilePicture: "https://example.com/profile.jpg",
    isEmailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeAll(() => {
    jest.clearAllMocks();

    // Mock the getCurrentUser function to return a mock user.
    (userController.getCurrentUser as jest.Mock) = jest.fn();

    (userController.getCurrentUser as jest.Mock).mockImplementation(
      (_req, res) => {
        return res
          .status(httpStatus.OK)
          .json({ message: "User retrieved successfully.", user: MOCK_USER });
      }
    );

    // Mock the updateCurrentUser function to return a mock user with updated data.
    (userController.updateCurrentUser as jest.Mock) = jest.fn();
    (userController.updateCurrentUser as jest.Mock).mockImplementation(
      (req, res) => {
        return res.status(httpStatus.OK).json({
          message: "User updated successfully.",
          user: { ...MOCK_USER, ...req.body },
        });
      }
    );

    // Mock the updatePassword function to return a success message.
    (userController.updatePassword as jest.Mock) = jest.fn();

    (userController.updatePassword as jest.Mock).mockImplementation(
      (req: TypedRequest<IUpdatePasswordDto>, res) => {
        if (req.body.currentPassword !== "Oldpassword123!") {
          throw new BadRequestError(ERROR_MESSAGES.INVALID_CREDENTIALS);
        }

        if (req.body.newPassword === req.body.currentPassword) {
          throw new BadRequestError(ERROR_MESSAGES.PASSWORD_SAME_AS_CURRENT);
        }

        return res
          .status(httpStatus.OK)
          .json({ message: "User password updated successfully." });
      }
    );
  });

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

    it("should return 401 if token is expired", async () => {
      const res = await request(app)
        .get("/api/v1/users/me")
        .set("Authorization", "Bearer expired-token");
      expect(res.statusCode).toBe(httpStatus.UNAUTHORIZED);
      expect(res.body.error.message).toMatch(/Unauthorized access/i);
    });

    it("should return 401 if token is malformed", async () => {
      const res = await request(app)
        .get("/api/v1/users/me")
        .set("Authorization", "Bearer malformed-token");
      expect(res.statusCode).toBe(httpStatus.UNAUTHORIZED);
      expect(res.body.error.message).toMatch(/Unauthorized access/i);
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

    it("should validate email format", async () => {
      const payload = { email: "invalid-email" };

      const res = await request(app)
        .patch("/api/v1/users/me")
        .set("Authorization", "Bearer valid-token")
        .send(payload);

      expect(res.statusCode).toBe(httpStatus.BAD_REQUEST);
      expect(res.body.error.message).toMatch(/email/i);
    });

    it("should validate username length", async () => {
      const payload = { username: "a" }; // Too short

      const res = await request(app)
        .patch("/api/v1/users/me")
        .set("Authorization", "Bearer valid-token")
        .send(payload);

      expect(res.statusCode).toBe(httpStatus.BAD_REQUEST);
      expect(res.body.error.message).toMatch(/username/i);
    });

    it("should validate profilePicture URL format", async () => {
      const payload = { profilePicture: "not-a-url" };

      const res = await request(app)
        .patch("/api/v1/users/me")
        .set("Authorization", "Bearer valid-token")
        .send(payload);

      expect(res.statusCode).toBe(httpStatus.BAD_REQUEST);
      expect(res.body.error.message).toMatch(/profilePicture/i);
    });

    // it("should sanitize input to prevent XSS attacks", async () => {
    //   const payload = { username: "<script>alert('XSS')</script>" };

    //   const res = await request(app)
    //     .patch("/api/v1/users/me")
    //     .set("Authorization", "Bearer valid-token")
    //     .send(payload);

    //   expect(res.statusCode).toBe(httpStatus.OK);
    //   expect(res.body.user.username).toBe("alert('XSS')");
    // });

    // it("should handle conflict errors when email is already in use", async () => {
    //   const payload = { email: "existing@example.com" };

    //   // Mock controller to simulate conflict
    //   (userController.updateCurrentUser as jest.Mock).mockImplementation(() => {
    //     const error = new Error("Email already in use");
    //     error.name = "ConflictError";
    //     error.statusCode = httpStatus.CONFLICT;
    //     throw error;
    //   });

    //   const res = await request(app)
    //     .patch("/api/v1/users/me")
    //     .set("Authorization", "Bearer valid-token")
    //     .send(payload);

    //   expect(res.statusCode).toBe(httpStatus.CONFLICT);
    //   expect(res.body.error.message).toMatch(/Email already in use/);
    // });
  });

  // ---
  // 4. PATCH /api/v1/users/update-password endpoint tests (update password)
  describe("PATCH /api/v1/users/update-password", () => {
    beforeEach(() => jest.clearAllMocks());

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

    // it("should return 400 when currentPassword is incorrect", async () => {
    //   const payload = {
    //     currentPassword: "WrongPassword123!",
    //     newPassword: "Newpassword123!",
    //   };

    //   const res = await request(app)
    //     .patch("/api/v1/users/update-password")
    //     .set("Authorization", "Bearer valid-token")
    //     .send(payload);

    //   expect(res.statusCode).toBe(httpStatus.BAD_REQUEST);
    //   expect(res.body.error.message).toMatch(
    //     /password you entered is incorrect/
    //   );
    // });

    it("should enforce password complexity requirements", async () => {
      // Test various weak passwords
      const weakPasswords = [
        "short", // Too short
        "onlylowercase", // Missing uppercase
        "ONLYUPPERCASE", // Missing lowercase
        "NoNumbers", // Missing numbers
        "NoSpecial123", // Missing special characters
      ];

      for (const password of weakPasswords) {
        const payload = {
          currentPassword: "ValidPassword123!",
          newPassword: password,
        };

        const res = await request(app)
          .patch("/api/v1/users/update-password")
          .set("Authorization", "Bearer valid-token")
          .send(payload);

        expect(res.statusCode).toBe(httpStatus.BAD_REQUEST);
        expect(res.body.error.message).toContain("Validation error");
      }
    });

    // it("should handle rate limiting for password update attempts", async () => {
    //   const payload = {
    //     currentPassword: "Oldpassword123!",
    //     newPassword: "Newpassword123!",
    //   };

    //   const res = await request(app)
    //     .patch("/api/v1/users/update-password")
    //     .set("Authorization", "Bearer valid-token")
    //     .set("X-RateLimit-Remaining", "0") // Trigger rate limit in our mock
    //     .send(payload);

    //   expect(res.statusCode).toBe(httpStatus.TOO_MANY_REQUESTS);
    //   expect(res.body.error.message).toMatch(/Too many requests/);
    //   expect(userController.updatePassword).not.toHaveBeenCalled();
    // });

    // it("should handle concurrent password update requests", async () => {
    //   const payload = {
    //     currentPassword: "Oldpassword123!",
    //     newPassword: "Newpassword123!",
    //   };

    //   // Make two concurrent requests
    //   const [res1, res2] = await Promise.all([
    //     request(app)
    //       .patch("/api/v1/users/update-password")
    //       .set("Authorization", "Bearer valid-token")
    //       .send(payload),
    //     request(app)
    //       .patch("/api/v1/users/update-password")
    //       .set("Authorization", "Bearer valid-token")
    //       .send(payload),
    //   ]);

    //   expect(res1.statusCode).toBe(httpStatus.OK);
    //   expect(res2.statusCode).toBe(httpStatus.OK);
    //   expect(userController.updatePassword).toHaveBeenCalledTimes(2);
    // });
  });

  // ---
  // 5. Additional security and edge case tests
  describe("Security and Edge Cases", () => {
    it("should handle malformed JSON in request body", async () => {
      const res = await request(app)
        .patch("/api/v1/users/me")
        .set("Authorization", "Bearer valid-token")
        .set("Content-Type", "application/json")
        .send("{malformed json");

      expect(res.statusCode).toBe(httpStatus.INTERNAL_SERVER_ERROR);
    });

    it("should handle very large request bodies", async () => {
      // Create a large payload
      const largePayload = {
        username: "a".repeat(10000),
      };

      const res = await request(app)
        .patch("/api/v1/users/me")
        .set("Authorization", "Bearer valid-token")
        .send(largePayload);

      expect(res.statusCode).toBe(httpStatus.BAD_REQUEST);
      expect(res.body.error.message).toMatch(/most 20 characters long./i);
    });

    it("should handle unsupported HTTP methods", async () => {
      const res = await request(app)
        .put("/api/v1/users/me")
        .set("Authorization", "Bearer valid-token")
        .send({ username: "newname" });

      expect(res.statusCode).toBe(httpStatus.NOT_FOUND);
    });

    it("should handle non-existent routes", async () => {
      const res = await request(app)
        .get("/api/v1/users/nonexistent")
        .set("Authorization", "Bearer valid-token");

      expect(res.statusCode).toBe(httpStatus.NOT_FOUND);
    });

    it("should set appropriate security headers", async () => {
      const res = await request(app)
        .get("/api/v1/users/me")
        .set("Authorization", "Bearer valid-token");

      // Check security headers
      expect(res.headers).toHaveProperty("content-security-policy");
      expect(res.headers).toHaveProperty("x-content-type-options");
      expect(res.headers).toHaveProperty("x-frame-options");
      expect(res.headers).toHaveProperty("x-xss-protection");
    });

    it("should handle database connection errors", async () => {
      // Mock controller to simulate database error
      (userController.getCurrentUser as jest.Mock).mockImplementation(() => {
        const error = new Error("Database connection error");
        error.name = "DatabaseError";
        throw error;
      });

      const res = await request(app)
        .get("/api/v1/users/me")
        .set("Authorization", "Bearer valid-token");

      expect(res.statusCode).toBe(httpStatus.INTERNAL_SERVER_ERROR);
      expect(res.body.error.message).toMatch(/Database|service unavailable/i);
    });
  });
});
