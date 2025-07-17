import type { CookieOptions } from "express";

import { envConfig } from "@/config";

export const sessionIdCookieConfig: CookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: envConfig.node_env === "production",
  path: "/",
  // Set the cookie to expire in 24 hours
  maxAge: 24 * 60 * 60 * 1000,
};

export const clearSessionIdCookieConfig: CookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: envConfig.node_env === "production",
  domain: new URL(envConfig.client.url).hostname,
};
