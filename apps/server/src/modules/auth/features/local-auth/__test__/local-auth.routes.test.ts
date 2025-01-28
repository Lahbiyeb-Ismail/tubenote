import httpStatus from "http-status";
import request from "supertest";

import { localAuthController } from "../local-auth.module";

import app from "@/app";

import type { LoginDto, RegisterDto } from "@/modules/auth/dtos";

jest.mock("../local-auth.module", () => ({
  localAuthController: {
    register: jest.fn(),
    login: jest.fn(),
  },
}));

describe("Local Auth Routes", () => {
  const validRegisterPayload: RegisterDto = {
    email: "test@example.com",
    password: "Password123!",
    username: "testuser",
  };

  const validLoginPayload: LoginDto = {
    email: "test@example.com",
    password: "Password123!",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST api/v1/auth/register", () => {
    it("should successfully register a new user with valid data", async () => {
      const mockResponse = {
        email: validRegisterPayload.email,
        message: "A verification email has been sent to your email.",
      };

      (localAuthController.register as jest.Mock).mockImplementation(
        (_req, res) => {
          res.status(httpStatus.CREATED).json(mockResponse);
        }
      );

      const response = await request(app)
        .post("/api/v1/auth/register")
        .send(validRegisterPayload)
        .expect("Content-Type", /json/)
        .expect(httpStatus.CREATED);

      expect(response.body).toEqual(mockResponse);
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
  });

  describe("POST api/v1/auth/login", () => {
    it("should successfully login user with valid credentials", async () => {
      const mockResponse = {
        message: "Login successful",
        accessToken: "mock-access-token",
      };

      (localAuthController.login as jest.Mock).mockImplementation(
        (_req, res) => {
          res
            .status(httpStatus.OK)
            .cookie("refreshToken", "mock-refresh-token", {
              httpOnly: true,
              secure: true,
            })
            .json(mockResponse);
        }
      );

      const response = await request(app)
        .post("/api/v1/auth/login")
        .send(validLoginPayload)
        .expect("Content-Type", /json/)
        .expect(httpStatus.OK);

      expect(response.body).toEqual(mockResponse);
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
  });

  describe("Route Not Found", () => {
    it("should return 404 for non-existent route", async () => {
      await request(app)
        .post("/auth/non-existent-route")
        .send({})
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe("Content Type Handling", () => {
    it("should reject requests with invalid content type", async () => {
      await request(app)
        .post("/api/v1/auth/login")
        .set("Content-Type", "text/plain")
        .send("invalid data")
        .expect(httpStatus.BAD_REQUEST);
    });

    it("should handle missing content type header", async () => {
      await request(app)
        .post("/api/v1/auth/login")
        .send("invalid data")
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe("Error Handling", () => {
    it("should handle internal server error in register route", async () => {
      (localAuthController.register as jest.Mock).mockImplementation(() => {
        throw new Error("Internal server error");
      });

      await request(app)
        .post("/api/v1/auth/register")
        .send(validRegisterPayload)
        .expect(httpStatus.INTERNAL_SERVER_ERROR);
    });

    it("should handle internal server error in login route", async () => {
      (localAuthController.login as jest.Mock).mockImplementation(() => {
        throw new Error("Internal server error");
      });

      await request(app)
        .post("/api/v1/auth/login")
        .send(validLoginPayload)
        .expect(httpStatus.INTERNAL_SERVER_ERROR);
    });
  });
});
