import { describe, expect, it } from "@jest/globals";
import request from "supertest";

import app from "../../../app";

describe("Auth Route Tests", () => {
  describe("Tests for the Register route", () => {
    it("Should resturn Password field is required", async () => {
      const payload = { username: "test", email: "test@gmail.com" };

      const response = await request(app)
        .post("/api/v1/auth/register")
        .send(payload)
        .set("Content-Type", "application/json")
        .set("Accept", "application/json");

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: {
          name: "BAD_REQUEST",
          statusCode: 400,
          message: "Validation error in password field: Required",
        },
      });
    });

    it("Should return username field is required", async () => {
      const payload = { email: "test@gmail.com", password: "12345678" };

      const response = await request(app)
        .post("/api/v1/auth/register")
        .send(payload)
        .set("Content-Type", "application/json")
        .set("Accept", "application/json");

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: {
          name: "BAD_REQUEST",
          statusCode: 400,
          message: "Validation error in username field: Required",
        },
      });
    });

    it("should return email field is required", async () => {
      const payload = { username: "test", password: "12345678" };

      const response = await request(app)
        .post("/api/v1/auth/register")
        .send(payload)
        .set("Content-Type", "application/json")
        .set("Accept", "application/json");

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: {
          name: "BAD_REQUEST",
          statusCode: 400,
          message: "Validation error in email field: Required",
        },
      });
    });

    it("Should return email field is invalid", async () => {
      const payload = { username: "test", email: "test", password: "12345678" };

      const response = await request(app)
        .post("/api/v1/auth/register")
        .send(payload)
        .set("Content-Type", "application/json")
        .set("Accept", "application/json");

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: {
          name: "BAD_REQUEST",
          statusCode: 400,
          message: "Validation error in email field: Invalid email address.",
        },
      });
    });

    it("Should return password field must be at least 8 characters long", async () => {
      const payload = {
        username: "test",
        email: "test@gmail.com",
        password: "1234",
      };

      const response = await request(app)
        .post("/api/v1/auth/register")
        .send(payload)
        .set("Content-Type", "application/json")
        .set("Accept", "application/json");

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: {
          name: "BAD_REQUEST",
          statusCode: 400,
          message:
            "Validation error in password field: Password must be at least 8 characters long.",
        },
      });
    });

    it("Should return username field must be at least 3 characters long", async () => {
      const payload = {
        username: "te",
        email: "test@gmail.com",
        password: "123456789",
      };

      const response = await request(app)
        .post("/api/v1/auth/register")
        .send(payload)
        .set("Content-Type", "application/json")
        .set("Accept", "application/json");

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: {
          name: "BAD_REQUEST",
          statusCode: 400,
          message:
            "Validation error in username field: Username must be at least 3 characters long.",
        },
      });
    });

    it("Should return password field must be a string", async () => {
      const payload = {
        username: "test",
        email: "test@gmail.com",
        password: 12345678,
      };

      const response = await request(app)
        .post("/api/v1/auth/register")
        .send(payload)
        .set("Content-Type", "application/json")
        .set("Accept", "application/json");

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: {
          name: "BAD_REQUEST",
          statusCode: 400,
          message:
            "Validation error in password field: Expected string, received number",
        },
      });
    });

    it("Should return username field must be a string", async () => {
      const payload = {
        username: 123456,
        email: "test@gmail.com",
        password: "12345678",
      };

      const response = await request(app)
        .post("/api/v1/auth/register")
        .send(payload)
        .set("Content-Type", "application/json")
        .set("Accept", "application/json");

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: {
          name: "BAD_REQUEST",
          statusCode: 400,
          message:
            "Validation error in username field: Expected string, received number",
        },
      });
    });
  });

  describe("Tests for the Login route", () => {
    it("Should resturn Password field is required", async () => {
      const payload = { email: "test@gmail.com" };

      const response = await request(app)
        .post("/api/v1/auth/login")
        .send(payload)
        .set("Content-Type", "application/json")
        .set("Accept", "application/json");

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: {
          name: "BAD_REQUEST",
          statusCode: 400,
          message: "Validation error in password field: Required",
        },
      });
    });

    it("Should return email field is required", async () => {
      const payload = { password: "12345678" };

      const response = await request(app)
        .post("/api/v1/auth/login")
        .send(payload)
        .set("Content-Type", "application/json")
        .set("Accept", "application/json");

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: {
          name: "BAD_REQUEST",
          statusCode: 400,
          message: "Validation error in email field: Required",
        },
      });
    });

    it("Should return email field is invalid", async () => {
      const payload = {
        email: "test",
        password: "12345678",
      };

      const response = await request(app)
        .post("/api/v1/auth/login")
        .send(payload)
        .set("Content-Type", "application/json")
        .set("Accept", "application/json");

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: {
          name: "BAD_REQUEST",
          statusCode: 400,
          message: "Validation error in email field: Invalid email address.",
        },
      });
    });

    it("Should return password field must be at least 8 characters long", async () => {
      const payload = {
        email: "test@gmail.com",
        password: "1234",
      };

      const response = await request(app)
        .post("/api/v1/auth/login")
        .send(payload)
        .set("Content-Type", "application/json")
        .set("Accept", "application/json");

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: {
          name: "BAD_REQUEST",
          statusCode: 400,
          message:
            "Validation error in password field: Password must be at least 8 characters long.",
        },
      });
    });

    it("Should return password field must be a string", async () => {
      const payload = {
        email: "test@gmail.com",
        password: 12345678,
      };

      const response = await request(app)
        .post("/api/v1/auth/login")
        .send(payload)
        .set("Content-Type", "application/json")
        .set("Accept", "application/json");

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: {
          name: "BAD_REQUEST",
          statusCode: 400,
          message:
            "Validation error in password field: Expected string, received number",
        },
      });
    });
  });

  describe("Tests for the Logout route", () => {
    it("Should return Unauthorized error, if someone try to access this route without begin authenticated", async () => {
      const response = await request(app)
        .post("/api/v1/auth/logout")
        .set("Content-Type", "application/json")
        .set("Accept", "application/json");

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        error: {
          name: "UNAUTHORIZED",
          statusCode: 401,
          message: "You need to be authenticated to access this route.",
        },
      });
    });

    it("Should return Unauthorized error, if the refresh token is not provided", async () => {
      const response = await request(app)
        .post("/api/v1/auth/logout")
        .set("Authorization", "Bearer")
        .set("Content-Type", "application/json")
        .set("Accept", "application/json");

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        error: {
          name: "UNAUTHORIZED",
          statusCode: 401,
          message: "You need to be authenticated to access this route.",
        },
      });
    });

    it("Should return Unauthorized error, if the refresh token is not valid", async () => {
      const response = await request(app)
        .post("/api/v1/auth/logout")
        .set("Authorization", "Bearer invalid-token")
        .set("Content-Type", "application/json")
        .set("Accept", "application/json");

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        error: {
          name: "UNAUTHORIZED",
          statusCode: 401,
          message: "Unauthorized access. Please try again.",
        },
      });
    });
  });
});
