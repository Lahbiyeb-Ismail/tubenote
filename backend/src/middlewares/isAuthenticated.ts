import type { NextFunction, Request, Response } from 'express';

import httpStatus from 'http-status';
import jwt, { type JwtPayload } from 'jsonwebtoken';

const { verify } = jwt;
const jwtSecret = process.env['JWT_SECRET'] as string;

interface CustomRequest extends Request {
  payload?: JwtPayload;
}

async function isAuthenticated(
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers?.authorization;

  if (!authHeader || !authHeader?.startsWith('Bearer '))
    return res.status(httpStatus.UNAUTHORIZED).json({
      message: 'You need to be authenticated to access this route.',
    });

  const token: string | undefined = authHeader.split('Bearer ')[1];

  if (!token)
    return res.status(httpStatus.UNAUTHORIZED).json({
      message: 'You need to be authenticated to access this route.',
    });

  try {
    const payload = verify(token, jwtSecret);

    req.payload = payload as JwtPayload;

    next();
  } catch (error) {
    return res.status(httpStatus.FORBIDDEN).json({
      message: 'Invalid token. Please log in again.',
    });
  }
}

export default isAuthenticated;
