import type { Request } from "express";
import type { z } from "zod";

import type { ResetPasswordToken } from "@prisma/client";
import type { paginationQuerySchema } from "../schemas";

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

/**
 * A type representing a typed request with body, params, and query types inferred from Zod schemas.
 *
 * @template B - The Zod schema type for the request body. Defaults to `z.ZodTypeAny`.
 * @template P - The Zod schema type for the request params. Defaults to `z.ZodTypeAny`.
 * @template Q - The Zod schema type for the request query. Defaults to `z.ZodTypeAny`.
 */
export type TypedRequest<
  B = EmptyRecord,
  P = EmptyRecord,
  Q = EmptyRecord,
> = Request<P, EmptyRecord, B, Q>;

export type PaginationQuery = typeof paginationQuerySchema;

export type EmptyRecord = Record<string, unknown>;
