import type { Request } from "express";

export interface ISessionData {
  sessionId: string;
  accessToken: string;
  refreshToken: string;
}

export type EmptyRecord = Record<string, unknown>;

export type TypedRequest<
  B = EmptyRecord,
  P = EmptyRecord,
  Q = EmptyRecord,
> = Request<P, EmptyRecord, B, Q>;
