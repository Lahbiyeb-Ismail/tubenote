import type { Request } from 'express';
import type { DeepPartial } from 'utility-types';

export type Payload = {
  userID: string;
  iat: number;
  exp: number;
};
export interface PayloadRequest extends Request {
  payload?: Payload;
}

import type { ResetPasswordToken } from '@prisma/client';

/**
 * Extends the Express Request interface to include a `resetToken` property.
 *
 * @property {ResetPasswordToken} resetToken - The token used for resetting the password.
 */
declare global {
  namespace Express {
    interface Request {
      resetToken: ResetPasswordToken;
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
