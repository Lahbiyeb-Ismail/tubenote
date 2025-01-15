import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { ACCESS_TOKEN_SECRET } from "../constants/auth.contants";
import { UnauthorizedError } from "../errors";

import type { JwtPayload } from "../types";
import logger from "../utils/logger";

const { verify } = jwt;

/**
 * Middleware to check if the request is authenticated.
 *
 * This middleware checks for the presence of a Bearer token in the
 * Authorization header of the request. If the token is present and valid,
 * it attaches the payload to the request object and calls the next middleware.
 * If the token is missing or invalid, it responds with an appropriate
 * HTTP status and error message.
 *
 * @param req - The request object, extended with a potential payload.
 * @param res - The response object.
 * @param next - The next middleware function in the stack.
 *
 * @returns void
 *
 * @throws {Error} If the token is invalid or missing.
 */
async function isAuthenticated(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const authHeader = req.headers?.authorization;

  if (!authHeader || !authHeader?.startsWith("Bearer ")) {
    logger.error("Authorization header is missing or invalid.");

    throw new UnauthorizedError(
      "You need to be authenticated to access this route."
    );
  }

  const token: string | undefined = authHeader.split("Bearer ")[1];

  if (!token) {
    throw new UnauthorizedError(
      "You need to be authenticated to access this route."
    );
  }

  verify(token, ACCESS_TOKEN_SECRET, (err, payload) => {
    if (err) {
      logger.error(`Error verifying token: ${err.message}`);

      throw new UnauthorizedError("Unauthorized access. Please try again.");
    }

    const userId = (payload as JwtPayload).userId;

    req.userId = userId;

    next();
  });
}

export default isAuthenticated;
