import type { IClientContext } from "@/modules/auth";
import type { Request } from "express";

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
 * Extends the Express Request interface to include the user ID.
 */
declare global {
  namespace Express {
    interface Request {
      userId: string;
      rateLimitKey: string;
      clientContext: IClientContext;
    }
  }
}

export type EmptyRecord = Record<string, unknown>;

export type TypedRequest<
  B = EmptyRecord,
  P = EmptyRecord,
  Q = EmptyRecord,
> = Request<P, EmptyRecord, B, Q>;
