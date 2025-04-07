import express, { NextFunction, Request, Response, Express } from "express";
import request from "supertest";

import { TooManyRequestsError } from "@/modules/shared/api-errors";
import { ERROR_MESSAGES } from "@/modules/shared/constants";
import { loggerService, rateLimitService } from "@/modules/shared/services";
import { type IRateLimitConfig, createRateLimitMiddleware } from "./index";

// Mock dependencies
jest.mock("@/modules/shared/services", () => ({
  loggerService: {
    warn: jest.fn(),
  },
  rateLimitService: {
    check: jest.fn(),
  },
}));

describe("Rate Limit Middleware", () => {
  // Common test variables
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;
  let defaultConfig: IRateLimitConfig;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Setup request, response and next function
    req = {
      ip: "127.0.0.1",
      path: "/test",
      method: "GET",
    };

    res = {
      set: jest.fn(),
    };

    next = jest.fn();

    // Default rate limit config
    defaultConfig = {
      maxAttempts: 10,
      windowMs: 60000, // 1 minute
      blockDurationMs: 300000, // 5 minutes
    };

    // Default mock implementation for rateLimitService.check
    (rateLimitService.check as jest.Mock).mockResolvedValue({
      blocked: false,
      remaining: 9,
      resetAt: new Date(Date.now() + 60000),
    });
  });

  describe("Basic Rate Limiting", () => {
    it("should allow requests when under the rate limit", async () => {
      // Arrange
      const middleware = createRateLimitMiddleware({
        keyGenerator: (req: Request) => req.ip!,
        rateLimitConfig: defaultConfig,
      });

      // Act
      await middleware(req as Request, res as Response, next);

      // Assert
      expect(next).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalledWith(expect.any(Error));
      expect(res.set).toHaveBeenCalledWith("X-RateLimit-Limit", "10");
      expect(res.set).toHaveBeenCalledWith("X-RateLimit-Remaining", "9");
    });

    it("should block requests when rate limit is exceeded", async () => {
      // Arrange
      const resetAt = new Date(Date.now() + 300000);
      (rateLimitService.check as jest.Mock).mockResolvedValue({
        blocked: true,
        remaining: 0,
        resetAt,
      });

      const middleware = createRateLimitMiddleware({
        keyGenerator: (req: Request) => req.ip!,
        rateLimitConfig: defaultConfig,
      });

      // Act & Assert
      await expect(
        middleware(req as Request, res as Response, next)
      ).rejects.toThrow(TooManyRequestsError);
      expect(next).not.toHaveBeenCalled();
      expect(res.set).toHaveBeenCalledWith("X-RateLimit-Limit", "10");
      expect(res.set).toHaveBeenCalledWith("X-RateLimit-Remaining", "0");
      expect(res.set).toHaveBeenCalledWith("Retry-After", expect.any(String));
    });

    it("should set the correct headers when rate limited", async () => {
      // Arrange
      const resetAt = new Date(Date.now() + 300000);
      (rateLimitService.check as jest.Mock).mockResolvedValue({
        blocked: true,
        remaining: 0,
        resetAt,
      });

      const middleware = createRateLimitMiddleware({
        keyGenerator: (req: Request) => req.ip!,
        rateLimitConfig: defaultConfig,
      });

      // Act
      try {
        await middleware(req as Request, res as Response, next);
      } catch (_error: any) {
        // Expected error
      }

      // Assert
      const resetTime = Math.ceil(resetAt.getTime() / 1000);
      expect(res.set).toHaveBeenCalledWith(
        "X-RateLimit-Reset",
        resetTime.toString()
      );
      expect(res.set).toHaveBeenCalledWith("Retry-After", expect.any(String));
    });
  });

  describe("Keying Strategies", () => {
    it("should use IP address as the key when configured", async () => {
      // Arrange
      const middleware = createRateLimitMiddleware({
        keyGenerator: (req: Request) => req.ip!,
        rateLimitConfig: defaultConfig,
      });

      // Act
      await middleware(req as Request, res as Response, next);

      // Assert
      expect(rateLimitService.check).toHaveBeenCalledWith(
        expect.objectContaining({
          key: "127.0.0.1",
        })
      );
    });

    it("should use user ID as the key when configured", async () => {
      // Arrange
      req.userId = "user123";

      const middleware = createRateLimitMiddleware({
        keyGenerator: (req: Request) => req.userId || "anonymous",
        rateLimitConfig: defaultConfig,
      });

      // Act
      await middleware(req as Request, res as Response, next);

      // Assert
      expect(rateLimitService.check).toHaveBeenCalledWith(
        expect.objectContaining({
          key: "user123",
        })
      );
    });

    it("should use API key as the key when configured", async () => {
      // Arrange
      req.headers = { "x-api-key": "api-key-123" };

      const middleware = createRateLimitMiddleware({
        keyGenerator: (req: Request) =>
          (req.headers?.["x-api-key"] as string) || "no-key",
        rateLimitConfig: defaultConfig,
      });

      // Act
      await middleware(req as Request, res as Response, next);

      // Assert
      expect(rateLimitService.check).toHaveBeenCalledWith(
        expect.objectContaining({
          key: "api-key-123",
        })
      );
    });

    it("should use combined keys when configured", async () => {
      // Arrange
      req = { ip: "127.0.0.1", path: "/api/users" };
      // req.path = "/api/users"

      const middleware = createRateLimitMiddleware({
        keyGenerator: (req: Request) => `${req.ip}:${req.path}`,
        rateLimitConfig: defaultConfig,
      });

      // Act
      await middleware(req as Request, res as Response, next);

      // Assert
      expect(rateLimitService.check).toHaveBeenCalledWith(
        expect.objectContaining({
          key: "127.0.0.1:/api/users",
        })
      );
    });
  });

  describe("Time Windows", () => {
    it("should use the configured time window", async () => {
      // Arrange
      const customConfig = {
        ...defaultConfig,
        windowMs: 3600000, // 1 hour
      };

      const middleware = createRateLimitMiddleware({
        keyGenerator: (req: Request) => req.ip!,
        rateLimitConfig: customConfig,
      });

      // Act
      await middleware(req as Request, res as Response, next);

      // Assert
      expect(rateLimitService.check).toHaveBeenCalledWith(
        expect.objectContaining({
          windowMs: 3600000,
        })
      );
    });

    it("should reset correctly at the end of a time window", async () => {
      // Arrange
      const resetAt = new Date(Date.now() + 60000);
      (rateLimitService.check as jest.Mock).mockResolvedValue({
        blocked: false,
        remaining: 5,
        resetAt,
      });

      const middleware = createRateLimitMiddleware({
        keyGenerator: (req: Request) => req.ip!,
        rateLimitConfig: defaultConfig,
      });

      // Act
      await middleware(req as Request, res as Response, next);

      // Assert
      const resetTime = Math.ceil(resetAt.getTime() / 1000);
      expect(res.set).toHaveBeenCalledWith(
        "X-RateLimit-Reset",
        resetTime.toString()
      );
    });
  });

  describe("Error Handling", () => {
    it("should pass non-rate-limit errors to next", async () => {
      // Arrange
      const testError = new Error("Test error");
      (rateLimitService.check as jest.Mock).mockRejectedValue(testError);

      const middleware = createRateLimitMiddleware({
        keyGenerator: (req: Request) => req.ip!,
        rateLimitConfig: defaultConfig,
      });

      // Act
      await middleware(req as Request, res as Response, next);

      // Assert
      expect(next).toHaveBeenCalledWith(testError);
    });

    it("should throw TooManyRequestsError when blocked", async () => {
      // Arrange
      (rateLimitService.check as jest.Mock).mockResolvedValue({
        blocked: true,
        remaining: 0,
        resetAt: new Date(Date.now() + 300000),
      });

      const middleware = createRateLimitMiddleware({
        keyGenerator: (req: Request) => req.ip!,
        rateLimitConfig: defaultConfig,
      });

      // Act & Assert
      await expect(
        middleware(req as Request, res as Response, next)
      ).rejects.toThrow(TooManyRequestsError);
      expect(loggerService.warn).toHaveBeenCalled();
    });

    it("should include correct error data in TooManyRequestsError", async () => {
      // Arrange
      const resetAt = new Date(Date.now() + 300000);
      (rateLimitService.check as jest.Mock).mockResolvedValue({
        blocked: true,
        remaining: 0,
        resetAt,
      });

      const middleware = createRateLimitMiddleware({
        keyGenerator: (req: Request) => req.ip!,
        rateLimitConfig: defaultConfig,
      });

      // Act
      try {
        const fail = () => {
          throw new Error("Expected middleware to throw");
        };
        await middleware(req as Request, res as Response, next);
        fail();
      } catch (error: any) {
        // Assert
        expect(error).toBeInstanceOf(TooManyRequestsError);
        expect(error.message).toBe(ERROR_MESSAGES.TOO_MANY_ATTEMPTS);
      }
    });
  });

  describe("Customization", () => {
    it("should use custom rate limit configuration", async () => {
      // Arrange
      const customConfig = {
        maxAttempts: 5,
        windowMs: 30000, // 30 seconds
        blockDurationMs: 60000, // 1 minute
      };

      const middleware = createRateLimitMiddleware({
        keyGenerator: (req: Request) => req.ip!,
        rateLimitConfig: customConfig,
      });

      // Act
      await middleware(req as Request, res as Response, next);

      // Assert
      expect(rateLimitService.check).toHaveBeenCalledWith(
        expect.objectContaining({
          maxAttempts: 5,
          windowMs: 30000,
          blockDurationMs: 60000,
        })
      );
    });
  });

  describe("Edge Cases", () => {
    it("should handle requests with missing keys", async () => {
      // Arrange
      req = { ip: undefined };

      const middleware = createRateLimitMiddleware({
        keyGenerator: (req) => req.ip || "unknown",
        rateLimitConfig: defaultConfig,
      });

      // Act
      await middleware(req as Request, res as Response, next);

      // Assert
      expect(rateLimitService.check).toHaveBeenCalledWith(
        expect.objectContaining({
          key: "unknown",
        })
      );
    });

    it("should handle requests at the exact moment the rate limit resets", async () => {
      // Arrange
      const now = Date.now();
      const _resetAt = new Date(now); // Reset time is now
      (rateLimitService.check as jest.Mock).mockResolvedValue({
        blocked: false,
        remaining: 10, // Full limit available after reset
        resetAt: new Date(now + 60000), // Next reset in 1 minute
      });

      const middleware = createRateLimitMiddleware({
        keyGenerator: (req: Request) => req.ip!,
        rateLimitConfig: defaultConfig,
      });

      // Act
      await middleware(req as Request, res as Response, next);

      // Assert
      expect(next).toHaveBeenCalled();
      expect(res.set).toHaveBeenCalledWith("X-RateLimit-Remaining", "10");
    });

    it("should handle missing resetAt value", async () => {
      // Arrange
      (rateLimitService.check as jest.Mock).mockResolvedValue({
        blocked: true,
        remaining: 0,
        resetAt: undefined, // No reset time provided
      });

      const middleware = createRateLimitMiddleware({
        keyGenerator: (req: Request) => req.ip!,
        rateLimitConfig: defaultConfig,
      });

      // Act
      try {
        await middleware(req as Request, res as Response, next);
        fail("Expected middleware to throw");
      } catch (error) {
        // Assert
        expect(error).toBeInstanceOf(TooManyRequestsError);
        expect(res.set).not.toHaveBeenCalledWith(
          "X-RateLimit-Reset",
          expect.any(String)
        );
        expect(res.set).toHaveBeenCalledWith("Retry-After", expect.any(String));
      }
    });
  });
});

describe("Rate Limit Middleware Integration Tests", () => {
  let app: Express;

  beforeEach(() => {
    jest.clearAllMocks();

    // Create a new Express app for each test
    app = express();

    // Add error handling middleware
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      res.status(err.statusCode || 500).json({
        error: {
          message: err.message,
          data: err.data,
        },
      });
    });
  });

  it("should allow requests when under the rate limit", async () => {
    // Arrange
    (rateLimitService.check as jest.Mock).mockResolvedValue({
      blocked: false,
      remaining: 9,
      resetAt: new Date(Date.now() + 60000),
    });

    const rateLimitMiddleware = createRateLimitMiddleware({
      keyGenerator: (req) => req.ip!,
      rateLimitConfig: {
        maxAttempts: 10,
        windowMs: 60000,
        blockDurationMs: 300000,
      },
    });

    app.use(rateLimitMiddleware);

    // Add error handling middleware to catch TooManyRequestsError
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      res.status(err.statusCode || 500).json({
        error: {
          message: err.message,
          data: err.data,
        },
      });
    });
    app.get("/test", (_req, res) => {
      res.status(200).json({ success: true });
    });

    // Act
    const response = await request(app).get("/test");

    // Assert
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ success: true });
    expect(response.headers["x-ratelimit-limit"]).toBe("10");
    expect(response.headers["x-ratelimit-remaining"]).toBe("9");
    expect(response.headers["x-ratelimit-reset"]).toBeDefined();
  });

  // it("should block requests when rate limit is exceeded", async () => {
  //   // Arrange
  //   const resetAt = new Date(Date.now() + 300000);
  //   (rateLimitService.check as jest.Mock).mockResolvedValue({
  //     blocked: true,
  //     remaining: 0,
  //     resetAt,
  //   });

  //   const rateLimitMiddleware = createRateLimitMiddleware({
  //     keyGenerator: (req) => req.ip!,
  //     rateLimitConfig: {
  //       maxAttempts: 10,
  //       windowMs: 60000,
  //       blockDurationMs: 300000,
  //     },
  //   });

  //   app.use(rateLimitMiddleware);
  //   app.get("/test", (_req, res) => {
  //     res.status(200).json({ success: true });
  //   });

  //   // Act
  //   const response = await request(app).get("/test");

  //   // Assert
  //   expect(response.status).toBe(429);
  //   expect(response.body.error).toBeDefined();
  //   expect(response.headers["retry-after"]).toBeDefined();
  // });

  it("should apply rate limits to specific routes only", async () => {
    // Arrange
    (rateLimitService.check as jest.Mock).mockResolvedValue({
      blocked: false,
      remaining: 9,
      resetAt: new Date(Date.now() + 60000),
    });

    const rateLimitMiddleware = createRateLimitMiddleware({
      keyGenerator: (req) => req.ip!,
      rateLimitConfig: {
        maxAttempts: 10,
        windowMs: 60000,
        blockDurationMs: 300000,
      },
    });

    // Only apply rate limiting to the /protected route
    app.get("/protected", rateLimitMiddleware, (_req, res) => {
      res.status(200).json({ success: true });
    });

    app.get("/public", (_req, res) => {
      res.status(200).json({ success: true });
    });

    // Act & Assert
    const protectedResponse = await request(app).get("/protected");
    expect(protectedResponse.status).toBe(200);
    expect(protectedResponse.headers["x-ratelimit-limit"]).toBe("10");

    const publicResponse = await request(app).get("/public");
    expect(publicResponse.status).toBe(200);
    expect(publicResponse.headers["x-ratelimit-limit"]).toBeUndefined();

    // Verify rate limit service was only called once (for the protected route)
    expect(rateLimitService.check).toHaveBeenCalledTimes(1);
  });

  it("should apply different rate limits to different routes", async () => {
    // Arrange
    (rateLimitService.check as jest.Mock).mockImplementation(
      ({ maxAttempts }) => ({
        blocked: false,
        remaining: maxAttempts - 1,
        resetAt: new Date(Date.now() + 60000),
      })
    );

    const strictLimitMiddleware = createRateLimitMiddleware({
      keyGenerator: (req) => req.ip!,
      rateLimitConfig: {
        maxAttempts: 5,
        windowMs: 60000,
        blockDurationMs: 300000,
      },
    });

    const relaxedLimitMiddleware = createRateLimitMiddleware({
      keyGenerator: (req) => req.ip!,
      rateLimitConfig: {
        maxAttempts: 20,
        windowMs: 60000,
        blockDurationMs: 300000,
      },
    });

    app.get("/api/login", strictLimitMiddleware, (_req, res) => {
      res.status(200).json({ success: true });
    });

    app.get("/api/products", relaxedLimitMiddleware, (_req, res) => {
      res.status(200).json({ success: true });
    });

    // Act & Assert
    const loginResponse = await request(app).get("/api/login");
    expect(loginResponse.status).toBe(200);
    expect(loginResponse.headers["x-ratelimit-limit"]).toBe("5");
    expect(loginResponse.headers["x-ratelimit-remaining"]).toBe("4");

    const productsResponse = await request(app).get("/api/products");
    expect(productsResponse.status).toBe(200);
    expect(productsResponse.headers["x-ratelimit-limit"]).toBe("20");
    expect(productsResponse.headers["x-ratelimit-remaining"]).toBe("19");
  });

  it("should store rate limit key in request for later use", async () => {
    // Arrange
    (rateLimitService.check as jest.Mock).mockResolvedValue({
      blocked: false,
      remaining: 9,
      resetAt: new Date(Date.now() + 60000),
    });

    const rateLimitMiddleware = createRateLimitMiddleware({
      keyGenerator: (_req) => "test-key",
      rateLimitConfig: {
        maxAttempts: 10,
        windowMs: 60000,
        blockDurationMs: 300000,
      },
    });

    let capturedKey: string | undefined;

    app.use(rateLimitMiddleware);
    app.get("/test", (req: any, res: Response) => {
      capturedKey = req.rateLimitKey;
      res.status(200).json({ success: true });
    });

    // Act
    await request(app).get("/test");

    // Assert
    expect(capturedKey).toBe("test-key");
  });
});

describe("Rate Limit Middleware Concurrency Tests", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      ip: "127.0.0.1",
    };

    res = {
      set: jest.fn(),
    };

    next = jest.fn();
  });

  it("should handle concurrent requests correctly", async () => {
    // Arrange
    let attemptCount = 0;
    (rateLimitService.check as jest.Mock).mockImplementation(() => {
      attemptCount++;
      const remaining = 5 - attemptCount;
      const blocked = remaining < 0;

      return Promise.resolve({
        blocked,
        remaining: Math.max(0, remaining),
        resetAt: new Date(Date.now() + 60000),
      });
    });

    const middleware = createRateLimitMiddleware({
      keyGenerator: (req) => req.ip!,
      rateLimitConfig: {
        maxAttempts: 5,
        windowMs: 60000,
        blockDurationMs: 300000,
      },
    });

    // Act - simulate 10 concurrent requests
    const promises = Array(10)
      .fill(0)
      .map(async () => {
        const nextClone = jest.fn();

        return middleware(req as Request, res as Response, nextClone)
          .then(() => ({ success: true, next: nextClone }))
          .catch(() => ({ success: false, next: nextClone }));
      });

    const results = await Promise.all(promises);

    // Assert
    const successCount = results.filter((r) => r.success).length;
    const failureCount = results.filter((r) => !r.success).length;

    expect(successCount).toBe(5); // First 5 requests should succeed
    expect(failureCount).toBe(5); // Last 5 requests should fail

    // Check that next() was called only for successful requests
    results.forEach((result) => {
      if (result.success) {
        expect(result.next).toHaveBeenCalled();
      } else {
        expect(result.next).not.toHaveBeenCalled();
      }
    });
  });

  it("should maintain rate limit integrity under high concurrency", async () => {
    // Arrange
    const maxAttempts = 3;
    let attemptsMade = 0;
    let requestsBlocked = 0;
    (rateLimitService.check as jest.Mock).mockImplementation(async () => {
      // Simulate some processing time to increase chance of race conditions
      await new Promise((resolve) => setTimeout(resolve, 5));

      attemptsMade++;
      const remaining = maxAttempts - attemptsMade;
      const blocked = remaining < 0;

      if (blocked) {
        requestsBlocked++;
      }

      return {
        blocked,
        remaining: Math.max(0, remaining),
        resetAt: new Date(Date.now() + 60000),
      };
    });

    const middleware = createRateLimitMiddleware({
      keyGenerator: (req) => req.ip!,
      rateLimitConfig: {
        maxAttempts,
        windowMs: 60000,
        blockDurationMs: 300000,
      },
    });

    // Act - simulate 20 concurrent requests
    const concurrentRequests = 20;
    const promises = Array(concurrentRequests)
      .fill(0)
      .map(async () => {
        return middleware(req as Request, res as Response, next)
          .then(() => true)
          .catch(() => false);
      });

    const results = await Promise.all(promises);
    const successCount = results.filter(Boolean).length;

    // Assert
    expect(successCount).toBe(maxAttempts);
    expect(requestsBlocked).toBe(concurrentRequests - maxAttempts);
  });
});
