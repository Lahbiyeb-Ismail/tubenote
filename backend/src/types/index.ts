import type { Request } from 'express';
import type { DeepPartial } from 'utility-types';

import type { ResetPasswordToken } from '@prisma/client';

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

// More strictly typed Express.Request type
// https://stackoverflow.com/questions/34508081/how-to-add-typescript-definitions-to-express-req-res
export type TypedRequest<
  ReqBody = Record<string, unknown>,
  QueryString = Record<string, unknown>,
> = Request<
  Record<string, unknown>,
  Record<string, unknown>,
  DeepPartial<ReqBody>,
  DeepPartial<QueryString>
>;
