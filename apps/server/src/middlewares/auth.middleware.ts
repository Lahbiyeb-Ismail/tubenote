import type { NextFunction, Request, Response } from "express";

import {
  ACCESS_TOKEN_NAME,
  ACCESS_TOKEN_SECRET,
  clearAuthTokenCookieConfig,
  jwtService,
} from "@/modules/auth";

import { UnauthorizedError } from "@/modules/shared/api-errors";
import { loggerService } from "@/modules/shared/services";

/**
 * Middleware to check if the user is authenticated.
 *
 * This function verifies the presence and validity of an access token
 * in the request cookies. If the token is missing or invalid, it clears
 * the authentication cookie and throws an `UnauthorizedError`. If the
 * token is valid, it extracts the user ID from the token and attaches
 * it to the request object for further use in the request lifecycle.
 *
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 * @param next - The next middleware function in the stack.
 * @throws {UnauthorizedError} If the access token is missing or invalid.
 */
export async function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const accessToken = req.cookies[ACCESS_TOKEN_NAME];

  if (!accessToken || typeof accessToken !== "string") {
    loggerService.error("Access token is missing or invalid.");
    // Clear the cookies if the token is invalid
    res.clearCookie(ACCESS_TOKEN_NAME, clearAuthTokenCookieConfig);

    throw new UnauthorizedError(
      "You need to be authenticated to access this route."
    );
  }

  const { userId } = await jwtService.verify({
    token: accessToken,
    secret: ACCESS_TOKEN_SECRET,
  });

  req.userId = userId;

  next();
}
