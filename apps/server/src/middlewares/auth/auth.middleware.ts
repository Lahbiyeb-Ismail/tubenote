import type { NextFunction, Request, Response } from "express";

import {
  ACCESS_TOKEN_NAME,
  ACCESS_TOKEN_SECRET,
  jwtService,
  refreshTokenController,
} from "@/modules/auth";

export async function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const accessToken = req.cookies[ACCESS_TOKEN_NAME];

  try {
    // Verify the token and extract payload
    const { jwtPayload, isError } = jwtService.verify({
      token: accessToken,
      secret: ACCESS_TOKEN_SECRET,
    });

    if (jwtPayload && !isError) {
      // Attach user ID to request object
      req.userId = jwtPayload.userId;
    } else {
      await refreshTokenController.refreshAuthTokens(req, res);
    }

    next();
  } catch (error) {
    next(error);
  }
}
