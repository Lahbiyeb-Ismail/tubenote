import type { Request } from "express";

import type { ResetPasswordToken } from "@modules/auth/features/reset-password/reset-password.model";

/**
 * Represents the payload of a JSON Web Token (JWT).
 *
 * @property {string} userId - The unique identifier of the user.
 * @property {number} iat - The issued at timestamp, indicating when the token was created.
 * @property {number} exp - The expiration timestamp, indicating when the token will expire.
 */
export type JwtPayload = {
  userId: string;
  iat: number;
  exp: number;
};

/**
 * Extends the Express Request interface to include a `resetToken` property.
 *
 * @property {ResetPasswordToken} resetToken - The token used for resetting the password.
 */
declare global {
  namespace Express {
    interface Request {
      resetToken: ResetPasswordToken;
      userId: string;
    }
  }
}

export type EmptyRecord = Record<string, unknown>;

export type TypedRequest<
  B = EmptyRecord,
  P = EmptyRecord,
  Q = EmptyRecord,
> = Request<P, EmptyRecord, B, Q>;
