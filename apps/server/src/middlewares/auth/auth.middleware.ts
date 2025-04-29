import type { NextFunction, Request, Response } from "express";

import {
  ACCESS_TOKEN_NAME,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_NAME,
  clearAuthTokenCookieConfig,
  jwtService,
  refreshTokenController,
} from "@/modules/auth";

import { UnauthorizedError } from "@/modules/shared/api-errors";
import { loggerService } from "@/modules/shared/services";

/**
 * Middleware to check if the user is authenticated.
 *
 * This function verifies the presence and validity of an access token
 * in the request cookies. It also checks if the token has at least 3 minutes
 * of remaining validity. If the token is missing, invalid, or expiring soon,
 * it handles the scenario appropriately. If the token is valid, it extracts
 * the user ID from the token and attaches it to the request object for further
 * use in the request lifecycle.
 *
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 * @param next - The next middleware function in the stack.
 * @throws {UnauthorizedError} If the access token is missing, invalid, or expiring soon.
 */
export async function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const accessToken = req.cookies[ACCESS_TOKEN_NAME];

  try {
    if (!accessToken || typeof accessToken !== "string") {
      loggerService.error("Access token is missing or invalid.");

      throw new UnauthorizedError(
        "You need to be authenticated to access this route."
      );
    }

    // Verify the token and extract payload
    const { userId, exp } = await jwtService.verify({
      token: accessToken,
      secret: ACCESS_TOKEN_SECRET,
    });

    // Attach user ID to request object
    req.userId = userId;

    const isTokenExpiringSoon = jwtService.isTokenExpiringSoon(exp);

    if (isTokenExpiringSoon) {
      await refreshTokenController.refreshToken(req, res);
    }

    next();
  } catch (error) {
    loggerService.error("Error verifying access token:", error);
    // Clear the cookies if the token verification fails
    res.clearCookie(ACCESS_TOKEN_NAME, clearAuthTokenCookieConfig);
    res.clearCookie(REFRESH_TOKEN_NAME, clearAuthTokenCookieConfig);

    next(error);
  }
}
