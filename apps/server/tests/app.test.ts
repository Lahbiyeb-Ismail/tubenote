import { describe, expect, it } from "@jest/globals";
import request from "supertest";

import app from "../src/app";

describe("Server", () => {
  it("should return a welcome message", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Hello from the server!" });
  });

  it("should return a not found message", async () => {
    const response = await request(app).get("/random-route");
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: `404 - Route Not Found - /random-route`,
      name: "NOT_FOUND",
    });
  });
});
