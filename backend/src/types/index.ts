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
