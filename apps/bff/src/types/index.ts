import type { Request } from "express";

/**
 * Represents session data containing authentication tokens and session identifier.
 * This interface is typically used to store and manage user session information
 * including access tokens for API authentication and refresh tokens for token renewal.
 */
export interface ISessionData {
  /** Unique identifier for the user session */
  sessionId: string;
  /** JWT or bearer token used for authenticating API requests */
  accessToken: string;
  /** Token used to obtain new access tokens when they expire */
  refreshToken: string;
}

export type EmptyRecord = Record<string, unknown>;

/**
 * A typed request interface that extends Express.js Request with generic type parameters.
 *
 * @template B - The type for the request body. Defaults to EmptyRecord.
 * @template P - The type for route parameters. Defaults to EmptyRecord.
 * @template Q - The type for query parameters. Defaults to EmptyRecord.
 *
 * @example
 * ```typescript
 * interface LoginBody {
 *   username: string;
 *   password: string;
 * }
 *
 * interface UserParams {
 *   id: string;
 * }
 *
 * interface SearchQuery {
 *   limit?: number;
 *   offset?: number;
 * }
 *
 * // Usage examples:
 * type LoginRequest = TypedRequest<LoginBody>;
 * type UserRequest = TypedRequest<EmptyRecord, UserParams>;
 * type SearchRequest = TypedRequest<EmptyRecord, EmptyRecord, SearchQuery>;
 * ```
 */
export type TypedRequest<
  B = EmptyRecord,
  P = EmptyRecord,
  Q = EmptyRecord,
> = Request<P, EmptyRecord, B, Q>;
