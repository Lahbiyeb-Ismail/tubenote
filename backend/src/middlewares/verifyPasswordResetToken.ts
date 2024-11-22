import type { NextFunction, Response } from 'express';
import type { TypedRequest } from '../types';
import httpStatus from 'http-status';
import { findResetPasswordToken } from '../services/resetPassword.services';

/**
 * Middleware to verify the password reset token.
 *
 * This middleware checks if the token is present in the request parameters,
 * validates it, and attaches the reset token to the request object if valid.
 * If the token is missing, invalid, or expired, it responds with an appropriate
 * error message and status code.
 *
 * @param req - The request object, expected to have a `params` property with the token.
 * @param res - The response object used to send back the appropriate HTTP status and message.
 * @param next - The next middleware function in the stack.
 *
 * @returns void
 */
export async function verifyPasswordResetToken(
  req: TypedRequest,
  res: Response,
  next: NextFunction
) {
  const { token } = req.params;

  if (!token) {
    res.status(httpStatus.BAD_REQUEST).json({ message: 'Token is required.' });
    return;
  }

  const resetToken = await findResetPasswordToken({ token });

  if (!resetToken) {
    res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: 'Invalid or expired token.' });
    return;
  }

  req.resetToken = resetToken;

  next();
}
