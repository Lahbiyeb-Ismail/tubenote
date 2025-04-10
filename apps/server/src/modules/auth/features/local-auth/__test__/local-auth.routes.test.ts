import httpStatus from "http-status";
import request from "supertest";

import app from "@/app";

import type { ICreateUserDto, ILoginDto } from "@tubenote/dtos";
import type { IApiResponse } from "@tubenote/types";

import { BadRequestError, ConflictError } from "@/modules/shared/api-errors";
import { ERROR_MESSAGES } from "@/modules/shared/constants";

import { localAuthController } from "../local-auth.module";

jest.mock("../local-auth.module", () => ({
  localAuthController: {
    register: jest.fn(),
    login: jest.fn(),
  },
}));

describe("Local Auth Routes", () => {
  const validRegisterPayload: ICreateUserDto = {
    email: "test@example.com",
    password: "Password123!",
    username: "testuser",
  };

  const validLoginPayload: ILoginDto = {
    email: "test@example.com",
    password: "Password123!",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST api/v1/auth/register", () => {
    const registerRes: IApiResponse<{ email: string }> = {
      success: true,
      status: httpStatus.CREATED,
      data: { email: validRegisterPayload.email },
      message: "A verification email has been sent to your email.",
    };

    it("should successfully register a new user with valid data", async () => {
      (localAuthController.register as jest.Mock).mockImplementation(
        (_req, res) => {
          res.status(httpStatus.CREATED).json(registerRes);
        }
      );

      const response = await request(app)
        .post("/api/v1/auth/register")
        .send(validRegisterPayload)
        .expect("Content-Type", /json/)
        .expect(httpStatus.CREATED);

      expect(response.body).toEqual(registerRes);
      expect(localAuthController.register).toHaveBeenCalled();
    });

    it("should return validation error for missing required fields", async () => {
      const invalidPayload = {
        email: "test@example.com",
        // missing password and other required fields
      };

      const response = await request(app)
        .post("/api/v1/auth/register")
        .send(invalidPayload)
        .expect("Content-Type", /json/)
        .expect(httpStatus.BAD_REQUEST);

      expect(response.body).toHaveProperty("error");
      expect(localAuthController.register).not.toHaveBeenCalled();
    });

    it("should return validation error for invalid email format", async () => {
      const invalidPayload = {
        ...validRegisterPayload,
        email: "invalid-email",
      };

      const response = await request(app)
        .post("/api/v1/auth/register")
        .send(invalidPayload)
        .expect("Content-Type", /json/)
        .expect(httpStatus.BAD_REQUEST);

      expect(response.body).toHaveProperty("error");
      expect(localAuthController.register).not.toHaveBeenCalled();
    });

    it("should return validation error for weak password", async () => {
      const invalidPayload = {
        ...validRegisterPayload,
        password: "123", // too short/weak
      };

      const response = await request(app)
        .post("/api/v1/auth/register")
        .send(invalidPayload)
        .expect("Content-Type", /json/)
        .expect(httpStatus.BAD_REQUEST);

      expect(response.body).toHaveProperty("error");
      expect(localAuthController.register).not.toHaveBeenCalled();
    });

    it("should handle empty request body", async () => {
      const response = await request(app)
        .post("/api/v1/auth/register")
        .send({})
        .expect("Content-Type", /json/)
        .expect(httpStatus.BAD_REQUEST);

      expect(response.body).toHaveProperty("error");
      expect(localAuthController.register).not.toHaveBeenCalled();
    });

    it("should handle concurrent registration requests and prevent duplicate accounts", async () => {
      (localAuthController.register as jest.Mock).mockImplementation(
        (req, res) => {
          if (req.body.email === validRegisterPayload.email) {
            throw new ConflictError(ERROR_MESSAGES.ALREADY_EXISTS);
          }
          res.status(httpStatus.CREATED).json(registerRes);
        }
      );

      const concurrentRequests = Array.from({ length: 5 }).map(() =>
        request(app).post("/api/v1/auth/register").send(validRegisterPayload)
      );

      const responses = await Promise.all(concurrentRequests);
      const successResponses = responses.filter(
        (res) => res.status === httpStatus.CREATED
      );
      const conflictResponses = responses.filter(
        (res) => res.status === httpStatus.CONFLICT
      );

      expect(successResponses.length).toBeLessThanOrEqual(1); // Only one should succeed
      expect(conflictResponses.length).toBeGreaterThanOrEqual(4); // The rest should fail
      expect(localAuthController.register).toHaveBeenCalledTimes(5);
    });

    it("should handle controller errors correctly", async () => {
      (localAuthController.register as jest.Mock).mockImplementation(() => {
        throw new BadRequestError("Email already exists");
      });

      const res = await request(app)
        .post("/api/v1/auth/register")
        .send(validRegisterPayload);

      expect(res.status).toBe(httpStatus.BAD_REQUEST);
      expect(res.body.error).toHaveProperty("message", "Email already exists");
    });

    it("should handle unexpected controller errors", async () => {
      (localAuthController.register as jest.Mock).mockImplementation(() => {
        throw new Error("Unexpected error");
      });

      const res = await request(app)
        .post("/api/v1/auth/register")
        .send(validRegisterPayload);

      expect(res.status).toBe(httpStatus.INTERNAL_SERVER_ERROR);
      expect(res.body.error).toHaveProperty("message", "Unexpected error");
    });

    it("should pass the correct rate limit key to the controller", async () => {
      await request(app)
        .post("/api/v1/auth/register")
        .send(validRegisterPayload);

      const registerCall = (localAuthController.register as jest.Mock).mock
        .calls[0];
      const req = registerCall[0];

      expect(req).toHaveProperty("rateLimitKey");
      expect(req.rateLimitKey).toContain(req.ip);
    });
  });

  describe("POST api/v1/auth/login", () => {
    it("should successfully login user with valid credentials", async () => {
      const loginRes: IApiResponse<Record<string, string>> = {
        success: true,
        status: httpStatus.OK,
        message: "Login successful",
        data: { accessToken: "mock-access-token" },
      };

      (localAuthController.login as jest.Mock).mockImplementation(
        (_req, res) => {
          res
            .status(httpStatus.OK)
            .cookie("refreshToken", "mock-refresh-token", {
              httpOnly: true,
              secure: true,
            })
            .json(loginRes);
        }
      );

      const response = await request(app)
        .post("/api/v1/auth/login")
        .send(validLoginPayload)
        .expect("Content-Type", /json/)
        .expect(httpStatus.OK);

      expect(response.body).toEqual(loginRes);
      expect(response.headers["set-cookie"]).toBeDefined();
      expect(localAuthController.login).toHaveBeenCalled();
    });

    it("should return validation error for missing credentials", async () => {
      const invalidPayload = {
        email: "test@example.com",
        // missing password
      };

      const response = await request(app)
        .post("/api/v1/auth/login")
        .send(invalidPayload)
        .expect("Content-Type", /json/)
        .expect(httpStatus.BAD_REQUEST);

      expect(response.body).toHaveProperty("error");
      expect(localAuthController.login).not.toHaveBeenCalled();
    });

    it("should return validation error for invalid email format", async () => {
      const invalidPayload = {
        ...validLoginPayload,
        email: "invalid-email",
      };

      const response = await request(app)
        .post("/api/v1/auth/login")
        .send(invalidPayload)
        .expect("Content-Type", /json/)
        .expect(httpStatus.BAD_REQUEST);

      expect(response.body).toHaveProperty("error");
      expect(localAuthController.login).not.toHaveBeenCalled();
    });

    it("should handle empty request body", async () => {
      const response = await request(app)
        .post("/api/v1/auth/login")
        .send({})
        .expect("Content-Type", /json/)
        .expect(httpStatus.BAD_REQUEST);

      expect(response.body).toHaveProperty("error");
      expect(localAuthController.login).not.toHaveBeenCalled();
    });

    it("should handle unexpected controller errors", async () => {
      (localAuthController.login as jest.Mock).mockImplementation(() => {
        throw new Error("Unexpected error");
      });

      const res = await request(app)
        .post("/api/v1/auth/login")
        .send(validLoginPayload);

      expect(res.status).toBe(httpStatus.INTERNAL_SERVER_ERROR);
      expect(res.body.error).toHaveProperty("message", "Unexpected error");
    });

    it("should pass the correct rate limit key to the controller", async () => {
      await request(app).post("/api/v1/auth/login").send(validLoginPayload);

      const loginCall = (localAuthController.login as jest.Mock).mock.calls[0];
      const req = loginCall[0];

      expect(req).toHaveProperty("rateLimitKey");
      expect(req.rateLimitKey).toContain(req.ip);
      expect(req.rateLimitKey).toContain(validLoginPayload.email);
    });
  });

  describe("Route Configuration", () => {
    it("should only allow POST method for /register", async () => {
      const getRes = await request(app).get("/api/v1/auth/register");
      expect(getRes.status).toBe(httpStatus.NOT_FOUND);

      const putRes = await request(app).put("/api/v1/auth/register");
      expect(putRes.status).toBe(httpStatus.NOT_FOUND);

      const deleteRes = await request(app).delete("/api/v1/auth/register");
      expect(deleteRes.status).toBe(httpStatus.NOT_FOUND);
    });

    it("should only allow POST method for /login", async () => {
      const getRes = await request(app).get("/api/v1/auth/login");
      expect(getRes.status).toBe(httpStatus.NOT_FOUND);

      const putRes = await request(app).put("/api/v1/auth/login");
      expect(putRes.status).toBe(httpStatus.NOT_FOUND);

      const deleteRes = await request(app).delete("/api/v1/auth/login");
      expect(deleteRes.status).toBe(httpStatus.NOT_FOUND);
    });

    it("should return 404 for non-existent routes", async () => {
      const res = await request(app).post("/api/v1/auth/non-existent-route");
      expect(res.status).toBe(httpStatus.NOT_FOUND);
    });
  });

  describe("Content Type Handling", () => {
    it("should reject non-JSON content types", async () => {
      const res = await request(app)
        .post("/api/v1/auth/login")
        .set("Content-Type", "text/plain")
        .send(JSON.stringify(validLoginPayload));

      expect(res.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should handle malformed JSON", async () => {
      const res = await request(app)
        .post("/api/v1/auth/login")
        .set("Content-Type", "application/json")
        .send("{malformed json");

      expect(res.status).toBe(httpStatus.INTERNAL_SERVER_ERROR);
    });
  });

  describe("Request Validation", () => {
    it("should validate maximum length of username in registration", async () => {
      const invalidPayload = {
        ...validRegisterPayload,
        username: "a".repeat(21), // Assuming max length is 20
      };

      const response = await request(app)
        .post("/api/v1/auth/register")
        .send(invalidPayload);

      expect(response.statusCode).toBe(httpStatus.BAD_REQUEST);
      expect(response.body.error.message).toBe(
        "Validation error in username field: Username must be at most 20 characters long."
      );
    });

    it("should enforce password complexity requirements", async () => {
      // Arrange
      const weakPasswords = [
        "short", // Too short
        "onlylowercase", // Missing uppercase
        "ONLYUPPERCASE", // Missing lowercase
        "NoNumbers", // Missing numbers
        "NoSpecial123", // Missing special characters
      ];

      // Act & Assert
      for (const weakPassword of weakPasswords) {
        const response = await request(app)
          .post("/api/v1/auth/register")
          .send({ ...validRegisterPayload, password: weakPassword });

        expect(response.status).toBe(httpStatus.BAD_REQUEST);
        expect(response.body.error.message).toContain("Password must");
        expect(localAuthController.register).not.toHaveBeenCalled();
      }

      // Reset the mock for the next test
      jest.clearAllMocks();
    });
  });

  describe("SQL Injection Prevention", () => {
    it("should handle SQL injection attempts in email field", async () => {
      // Arrange
      const sqlInjectionPayloads = [
        "' OR 1=1 --",
        "admin@example.com'; DROP TABLE users; --",
        "admin@example.com' UNION SELECT * FROM users --",
      ];

      // Act & Assert
      for (const payload of sqlInjectionPayloads) {
        const response = await request(app)
          .post("/api/v1/auth/register")
          .send({ ...validRegisterPayload, email: payload });

        expect(response.status).toBe(400);
        expect(response.body.error.message).toContain("Invalid email format");
        expect(localAuthController.register).not.toHaveBeenCalled();
      }
    });

    it("should handle SQL injection attempts in username field", async () => {
      // Arrange
      const sqlInjectionPayloads = [
        "' OR 1=1 --",
        "testname' OR '1'='1'; --",
        "testname' UNION SELECT * FROM users --",
      ];

      // Act & Assert
      for (const payload of sqlInjectionPayloads) {
        const response = await request(app)
          .post("/api/v1/auth/register")
          .send({ ...validRegisterPayload, username: payload });

        expect(response.status).toBe(400);
        expect(response.body.error.message).toContain(
          "Invalid username format."
        );
        expect(localAuthController.register).not.toHaveBeenCalled();
      }
    });

    it("should handle SQL injection attempts in password field", async () => {
      // Arrange
      const sqlInjectionPayloads = [
        "' OR 1=1 --",
        "Password123!' OR '1'='1'; --",
        "Password123!' UNION SELECT * FROM users --",
      ];

      // Act & Assert
      for (const payload of sqlInjectionPayloads) {
        const response = await request(app)
          .post("/api/v1/auth/register")
          .send({ ...validRegisterPayload, password: payload });

        expect(response.status).toBe(400);
        expect(response.body.error.message).toContain(
          "Validation error in password field"
        );
        expect(localAuthController.register).not.toHaveBeenCalled();
      }
    });
  });

  describe("NoSQL Injection Prevention", () => {
    it("should handle NoSQL injection attempts in email field", async () => {
      // Arrange
      const nosqlInjectionPayloads = [
        { email: { $ne: null } },
        { email: { $gt: "" } },
      ];

      // Act & Assert
      for (const payload of nosqlInjectionPayloads) {
        const response = await request(app)
          .post("/api/v1/auth/login")
          .send({ ...validLoginPayload, email: payload });

        expect(response.status).toBe(400);
        expect(response.body.error.message).toContain(
          "Validation error in email field"
        );
        expect(localAuthController.register).not.toHaveBeenCalled();
      }
    });

    it("should handle NoSQL injection attempts in password field", async () => {
      // Arrange
      const nosqlInjectionPayloads = [
        { password: { $gt: "" } },
        { password: { $ne: null } },
      ];

      // Act & Assert
      for (const payload of nosqlInjectionPayloads) {
        const response = await request(app)
          .post("/api/v1/auth/login")
          .send({ ...validLoginPayload, password: payload });

        expect(response.status).toBe(400);
        expect(response.body.error.message).toContain(
          "Validation error in password field"
        );
        expect(localAuthController.register).not.toHaveBeenCalled();
      }
    });

    it("should handle SQL injection attempts in username field", async () => {
      // Arrange
      const nosqlInjectionPayloads = [
        { username: { $gt: "" } },
        { username: { $ne: null } },
      ];

      // Act & Assert
      for (const payload of nosqlInjectionPayloads) {
        const response = await request(app)
          .post("/api/v1/auth/register")
          .send({ ...validRegisterPayload, username: payload });

        expect(response.status).toBe(400);
        expect(response.body.error.message).toContain(
          "Validation error in username field"
        );
        expect(localAuthController.register).not.toHaveBeenCalled();
      }
    });
  });

  describe("Security Tests", () => {
    it("should handle SQL injection attempts", async () => {
      const sqlInjectionPayload = {
        email: "' OR 1=1 --",
        password: "' OR 1=1 --",
      };

      const res = await request(app)
        .post("/api/v1/auth/login")
        .send(sqlInjectionPayload);

      expect(res.status).toBe(httpStatus.BAD_REQUEST);
      expect(localAuthController.login).not.toHaveBeenCalled();
    });

    it("should handle large payloads", async () => {
      const largePayload = {
        email: "test@example.com",
        password: "Password123!",
        username: "a".repeat(10000), // Very large username
      };

      const res = await request(app)
        .post("/api/v1/auth/register")
        .send(largePayload);

      expect(res.status).toBe(httpStatus.BAD_REQUEST);
      expect(res.body.error.message).toMatch(
        /must be at most 20 characters long/
      );
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty request body", async () => {
      const res = await request(app).post("/api/v1/auth/login").send({});

      // This should be caught by validation
      expect(res.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should handle null values in request body", async () => {
      const nullPayload = {
        email: null,
        password: null,
      };

      // Mock validation to fail for null values
      const res = await request(app)
        .post("/api/v1/auth/login")
        .send(nullPayload);

      // This should be caught by validation
      expect(res.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should handle requests with missing body", async () => {
      const res = await request(app).post("/api/v1/auth/login");

      // Express.json() middleware should set req.body to {}
      expect(res.status).toBe(httpStatus.BAD_REQUEST);
    });
  });
});
