import type { NextFunction, Request, Response } from "express";

import { ERROR_MESSAGES, UnauthorizedError } from "@tubenote/api-errors";

import type { JwtPayload } from "@/modules/shared/types";

import {
  ACCESS_TOKEN_SECRET,
  jwtService,
} from "@/modules/auth";

export async function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;

  const accessToken = authHeader?.split(" ")[1];

  if (!accessToken) {
    return next(new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED));
  }

  try {
    // Verify the token and extract payload
    const decodedPayload = jwtService.verify({
      token: accessToken,
      secret: ACCESS_TOKEN_SECRET,
    }) as JwtPayload;

    // Attach user information to the request object
    req.userId = decodedPayload.userId;

    next();
  }
  catch (error) {
    if (error instanceof Error && error.message.includes("TokenExpiredError")) {
      return next(new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED));
    }

    next(error);
  }
}
