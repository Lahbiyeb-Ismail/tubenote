import type { Request } from 'express';


export type Payload = {
  userID: string;
  iat: number;
  exp: number;
}
export interface PayloadRequest extends Request {
  payload?: Payload
}
