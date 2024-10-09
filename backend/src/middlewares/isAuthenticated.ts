import type { NextFunction, Response } from 'express';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';

import envConfig from '../config/envConfig';
import type { PayloadRequest, Payload } from '../types';

const { verify } = jwt;
const JWT_SECRET = envConfig.jwt.access_token.secret;

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
  req: PayloadRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers?.authorization;

  if (!authHeader || !authHeader?.startsWith('Bearer ')) {
    res.status(httpStatus.UNAUTHORIZED).json({
      message: 'You need to be authenticated to access this route.',
    });

    return;
  }

  const token: string | undefined = authHeader.split('Bearer ')[1];

  if (!token) {
    res.status(httpStatus.UNAUTHORIZED).json({
      message: 'You need to be authenticated to access this route.',
    });
    return;
  }

  try {
    const payload = verify(token, JWT_SECRET);

    req.payload = payload as Payload;

    next();
  } catch (error) {
    res.status(httpStatus.FORBIDDEN).json({
      message: 'Invalid token. Please log in again.',
    });
  }
}

export default isAuthenticated;
